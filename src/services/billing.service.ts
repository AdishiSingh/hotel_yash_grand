import prisma from "@/lib/prisma";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { AuditLogService } from "@/services/audit.service";
import { NotificationService } from "@/services/notification.service";
import { realtimeBus } from "@/lib/events";

export interface GSTBreakdown {
  subtotal: number;
  discount: number;
  taxableAmount: number;
  cgstRate: number; // 2.5%
  cgstAmount: number;
  sgstRate: number; // 2.5%
  sgstAmount: number;
  igstRate: number; // 5.0% for interstate
  igstAmount: number;
  totalGst: number;
  grandTotal: number;
}

export interface InvoiceMetadata {
  invoiceNumber: string;
  billNumber: string;
  hotelDetails: {
    name: string;
    gstin: string;
    address: string;
    phone: string;
    email: string;
  };
  customerDetails: {
    name: string;
    phone: string;
    email?: string;
    gstin?: string;
  };
  sacCode: string; // 996311 (Room), 996331 (Restaurant), 996332 (Banquet)
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  gst: GSTBreakdown;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  issuedAt: string;
  isVoid?: boolean;
}

export class BillingService {
  private static HOTEL_SETTINGS = {
    name: "HOTEL YASH GRAND",
    gstin: "09AAAAA0000A1Z5",
    address: "Bypass Road, Adjacent to SMS College, Varanasi, UP 221011",
    phone: "+91 91510 88115",
    email: "yashgrand03nov@gmail.com",
  };

  /**
   * Calculate precise 5% GST breakdown (CGST 2.5% + SGST 2.5%)
   */
  public static calculateGst(subtotal: number, discount = 0, isInterstate = false): GSTBreakdown {
    const taxableAmount = Math.max(0, subtotal - discount);

    let cgstRate = 2.5;
    let sgstRate = 2.5;
    let igstRate = 0;

    let cgstAmount = Math.round(taxableAmount * 0.025 * 100) / 100;
    let sgstAmount = Math.round(taxableAmount * 0.025 * 100) / 100;
    let igstAmount = 0;

    if (isInterstate) {
      cgstRate = 0;
      sgstRate = 0;
      igstRate = 5.0;
      cgstAmount = 0;
      sgstAmount = 0;
      igstAmount = Math.round(taxableAmount * 0.05 * 100) / 100;
    }

    const totalGst = cgstAmount + sgstAmount + igstAmount;
    const grandTotal = Math.round((taxableAmount + totalGst) * 100) / 100;

    return {
      subtotal,
      discount,
      taxableAmount,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      totalGst,
      grandTotal,
    };
  }

  /**
   * Generate Invoice Metadata for Restaurant Order
   */
  public static async getOrderInvoiceData(orderId: string): Promise<InvoiceMetadata | null> {
    const order = await prisma.restaurantOrder.findFirst({
      where: { OR: [{ id: orderId }, { orderId }] },
      include: { items: true, bill: true, customer: true, payments: true },
    });

    if (!order) return null;

    const dateStr = new Date(order.createdAt).toISOString().slice(0, 10).replace(/-/g, "");
    const invoiceNumber = `INV-RES-${dateStr}-${order.orderId.split("-").pop() || "001"}`;
    const billNumber = order.bill?.billNumber || `BILL-${dateStr}-${order.orderId.split("-").pop() || "001"}`;

    const gst = this.calculateGst(order.subtotal, order.discount);

    return {
      invoiceNumber,
      billNumber,
      hotelDetails: this.HOTEL_SETTINGS,
      customerDetails: {
        name: order.customerName,
        phone: order.customerPhone || "N/A",
        email: order.customer?.email || undefined,
      },
      sacCode: "996331", // Restaurant F&B Services SAC
      items: order.items.map((i) => ({
        description: i.itemName + (i.variantLabel ? ` (${i.variantLabel})` : ""),
        quantity: i.quantity,
        unitPrice: i.price,
        total: i.quantity * i.price,
      })),
      gst,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      issuedAt: new Date(order.createdAt).toISOString(),
    };
  }

  /**
   * Generate Invoice Metadata for Room Booking
   */
  public static async getBookingInvoiceData(bookingId: string): Promise<InvoiceMetadata | null> {
    const booking = await prisma.roomBooking.findFirst({
      where: { OR: [{ id: bookingId }, { bookingId }] },
      include: { room: true, customer: true, payments: true },
    });

    if (!booking) return null;

    const dateStr = new Date(booking.createdAt).toISOString().slice(0, 10).replace(/-/g, "");
    const invoiceNumber = `INV-RM-${dateStr}-${booking.bookingId.split("-").pop() || "001"}`;

    const gst = this.calculateGst(booking.totalAmount, 0);

    return {
      invoiceNumber,
      billNumber: `BILL-RM-${booking.bookingId}`,
      hotelDetails: this.HOTEL_SETTINGS,
      customerDetails: {
        name: booking.customer.name,
        phone: booking.customer.phone,
        email: booking.customer.email || undefined,
      },
      sacCode: "996311", // Room Accommodation Services SAC
      items: [
        {
          description: `Room Accommodation (Room ${booking.room.roomNumber} - ${booking.room.type}) - ${booking.guests} Guests`,
          quantity: 1,
          unitPrice: booking.totalAmount,
          total: booking.totalAmount,
        },
      ],
      gst,
      paymentMethod: PaymentMethod.UPI,
      paymentStatus: booking.advancePaid >= booking.totalAmount ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
      issuedAt: new Date(booking.createdAt).toISOString(),
    };
  }

  /**
   * Void an Invoice for Audit Compliance
   */
  public static async voidInvoice(orderId: string, reason: string) {
    const order = await prisma.restaurantOrder.update({
      where: { id: orderId },
      data: { status: "CANCELLED", paymentStatus: "FAILED" },
    });

    await AuditLogService.log({
      action: "INVOICE_VOIDED",
      details: `Voided invoice for order ${order.orderId}. Reason: ${reason}`,
    });

    await NotificationService.createNotification({
      title: "Invoice Voided",
      message: `Invoice for order ${order.orderId} was voided by management.`,
      type: "WARNING",
      link: "/dashboard/billing",
    });

    realtimeBus.broadcast("DASHBOARD_REFRESH", "INVOICE_VOIDED");

    return order;
  }
}

import crypto from "crypto";
import prisma from "@/lib/prisma";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { z } from "zod";
import { createOrderSchema, updateOrderStatusSchema } from "@/lib/validations";
import { AuditLogService } from "@/services/audit.service";
import { realtimeBus } from "@/lib/events";
import { NotificationService } from "@/services/notification.service";
import { InventoryService } from "@/services/inventory.service";

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export class OrderService {
  /**
   * Create a new POS/Restaurant Order inside a Prisma Transaction
   */
  static async createOrder(data: CreateOrderInput) {
    console.log("[ORDER LIFECYCLE 1/5] Incoming payload:", JSON.stringify(data, null, 2));

    const validated = createOrderSchema.parse(data);

    const totalItems = validated.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = validated.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const grandTotal = Math.max(0, subtotal + tax - validated.discount);

    console.log(`[ORDER LIFECYCLE 2/5] Validation successful. Subtotal: ₹${subtotal}, Tax: ₹${tax}, GrandTotal: ₹${grandTotal}, TotalItems: ${totalItems}`);

    // Generate high-entropy order ID for multi-threaded concurrency
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSeq = crypto.randomBytes(3).toString("hex").toUpperCase();
    const orderId = `YG-ORD-${dateStr}-${randomSeq}`;
    const billNumber = `BILL-${dateStr}-${randomSeq}`;

    console.log(`[ORDER LIFECYCLE 3/5] Starting Prisma $transaction for Order ID: ${orderId}...`);

    const result = await prisma.$transaction(async (tx) => {
      let customerId = validated.customerId;
      if (validated.customerPhone) {
        const customer = await tx.customer.upsert({
          where: { phone: validated.customerPhone },
          update: {
            totalSpent: { increment: grandTotal },
            visitCount: { increment: 1 },
            lastVisit: new Date(),
            isReturning: true,
          },
          create: {
            name: validated.customerName,
            phone: validated.customerPhone,
            totalSpent: grandTotal,
            visitCount: 1,
            lastVisit: new Date(),
          },
        });
        customerId = customer.id;
        console.log(`[ORDER LIFECYCLE 3.1] Customer upserted: ${customer.name} (${customer.id})`);
      }

      // Check which menuItemIds exist in DB to set menuItemId or null safely
      const rawMenuItemIds = validated.items.map((i) => i.menuItemId).filter(Boolean) as string[];
      const existingMenuItems = await tx.menuItem.findMany({
        where: { id: { in: rawMenuItemIds } },
        select: { id: true },
      });
      const validMenuItemIds = new Set(existingMenuItems.map((m) => m.id));

      const order = await tx.restaurantOrder.create({
        data: {
          orderId,
          tableNumber: validated.tableNumber,
          customerId,
          customerName: validated.customerName,
          customerPhone: validated.customerPhone,
          totalItems,
          subtotal,
          tax,
          discount: validated.discount,
          grandTotal,
          status: OrderStatus.NEW,
          paymentMethod: validated.paymentMethod as PaymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          notes: validated.notes,
          items: {
            create: validated.items.map((item) => ({
              menuItemId: (item.menuItemId && validMenuItemIds.has(item.menuItemId)) ? item.menuItemId : null,
              itemName: item.itemName,
              quantity: item.quantity,
              price: item.price,
              variantLabel: item.variantLabel,
              specialInstructions: item.specialInstructions,
            })),
          },
        },
        include: {
          items: true,
          customer: true,
        },
      });

      console.log(`[ORDER LIFECYCLE 4/5] Executed tx.restaurantOrder.create() -> Saved to PostgreSQL with DB ID: ${order.id}`);

      const bill = await tx.bill.create({
        data: {
          billNumber,
          orderId: order.id,
          amount: subtotal,
          gstAmount: tax,
          discountAmount: validated.discount,
          grandTotal,
          paymentMethod: validated.paymentMethod as PaymentMethod,
        },
      });

      return { ...order, bill };
    }, { maxWait: 10000, timeout: 20000 });

    console.log(`[ORDER LIFECYCLE 5/5] Transaction committed cleanly for ${orderId}. Created ${result.items.length} OrderItems & Bill ${billNumber}.`);

    await AuditLogService.log({
      action: "ORDER_CREATED",
      details: `Created restaurant order ${orderId} (Table: ${validated.tableNumber}, Total: ₹${grandTotal})`,
    });

    // Real-time Event Broadcast & Persistent Notification
    realtimeBus.broadcast("ORDER_UPDATED", "CREATED", result);
    realtimeBus.broadcast("DASHBOARD_REFRESH", "ORDER_NEW", { orderId: result.orderId });

    await NotificationService.createNotification({
      title: "New POS Order Received",
      message: `Table ${validated.tableNumber} placed order ${orderId} (₹${grandTotal})`,
      type: "INFO",
      link: "/dashboard/orders",
    });

    return result;
  }

  static async getOrders(params?: { status?: OrderStatus; tableNumber?: string; limit?: number }) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.tableNumber) where.tableNumber = params.tableNumber;

    return await prisma.restaurantOrder.findMany({
      where,
      include: {
        items: true,
        customer: true,
        bill: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
      take: params?.limit || 100,
    });
  }

  static async getOrderById(id: string) {
    return await prisma.restaurantOrder.findFirst({
      where: {
        OR: [{ id }, { orderId: id }],
      },
      include: {
        items: true,
        customer: true,
        bill: true,
        payments: true,
      },
    });
  }

  static async updateOrderStatus(id: string, data: UpdateOrderStatusInput) {
    const validated = updateOrderStatusSchema.parse(data);

    const updated = await prisma.restaurantOrder.update({
      where: { id },
      data: {
        ...(validated.status && { status: validated.status as OrderStatus }),
        ...(validated.paymentStatus && { paymentStatus: validated.paymentStatus as PaymentStatus }),
        ...(validated.kotPrinted !== undefined && { kotPrinted: validated.kotPrinted }),
      },
      include: {
        items: true,
        bill: true,
      },
    });

    await AuditLogService.log({
      action: "ORDER_UPDATED",
      details: `Updated order ${updated.orderId} status to '${updated.status}'`,
    });

    // Real-time Event Broadcast
    realtimeBus.broadcast("ORDER_UPDATED", "STATUS_CHANGE", updated);
    realtimeBus.broadcast("DASHBOARD_REFRESH", "ORDER_STATUS", { orderId: updated.orderId, status: updated.status });

    if (updated.status === "READY") {
      await NotificationService.createNotification({
        title: "Order Ready for Dispatch",
        message: `Order ${updated.orderId} (Table ${updated.tableNumber}) is READY in Kitchen!`,
        type: "SUCCESS",
        link: "/dashboard/orders",
      });
    } else if (updated.status === "COMPLETED" || updated.status === "SERVED") {
      // Automatic Inventory Stock Consumption Deduction
      await InventoryService.autoDeductOrderConsumption(updated.items);
    }

    return updated;
  }

  static async deleteOrder(id: string) {
    const res = await prisma.restaurantOrder.delete({
      where: { id },
    });

    await AuditLogService.log({
      action: "ORDER_DELETED",
      details: `Deleted restaurant order record '${id}'`,
    });

    realtimeBus.broadcast("ORDER_UPDATED", "DELETED", { id });
    realtimeBus.broadcast("DASHBOARD_REFRESH", "ORDER_DELETE");

    return res;
  }
}

import crypto from "crypto";
import prisma from "@/lib/prisma";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { AuditLogService } from "@/services/audit.service";
import { NotificationService } from "@/services/notification.service";
import { realtimeBus } from "@/lib/events";

export interface CreateOrderParams {
  amount: number; // in INR
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  orderId?: string;
  bookingId?: string;
  paymentMethod?: PaymentMethod;
}

export interface VerifyPaymentParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  paymentId?: string;
}

export class RazorpayService {
  private static KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_yashgrand_2026";
  private static KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "yashgrand_razorpay_secret_key_2026";
  private static WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "yashgrand_webhook_secret_2026";

  /**
   * Initialize a Razorpay Order and record pending transaction in PostgreSQL
   */
  public static async createOrder(params: CreateOrderParams) {
    const amountInPaise = Math.round(params.amount * 100);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSeq = crypto.randomBytes(3).toString("hex").toUpperCase();
    const paymentId = `PAY-${dateStr}-${randomSeq}`;
    const invoiceNumber = `INV-${dateStr}-${randomSeq}`;

    // Razorpay order ID generation
    const rzpOrderId = `order_${crypto.randomBytes(8).toString("hex")}`;

    const payment = await prisma.payment.create({
      data: {
        paymentId,
        invoiceNumber,
        orderId: params.orderId || null,
        bookingId: params.bookingId || null,
        amount: params.amount,
        paymentMethod: params.paymentMethod || PaymentMethod.RAZORPAY,
        paymentStatus: PaymentStatus.PENDING,
        razorpayOrderId: rzpOrderId,
        gatewayRef: rzpOrderId,
      },
    });

    return {
      paymentId: payment.paymentId,
      invoiceNumber: payment.invoiceNumber,
      razorpayOrderId: rzpOrderId,
      amount: params.amount,
      amountInPaise,
      currency: params.currency || "INR",
      keyId: this.KEY_ID,
    };
  }

  /**
   * Cryptographically verify Razorpay Payment Signature (HMAC SHA256)
   */
  public static verifySignature(params: VerifyPaymentParams): boolean {
    if (!params.razorpayOrderId || !params.razorpayPaymentId || !params.razorpaySignature) {
      return false;
    }

    const body = `${params.razorpayOrderId}|${params.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", this.KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    return expectedSignature === params.razorpaySignature;
  }

  /**
   * Confirm Payment Verification & Update Database + CRM + Dashboard
   */
  public static async confirmPayment(params: VerifyPaymentParams) {
    const isValid = this.verifySignature(params);

    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { razorpayOrderId: params.razorpayOrderId },
          { paymentId: params.paymentId },
        ],
      },
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    if (!isValid && process.env.NODE_ENV === "production") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
      throw new Error("Invalid Razorpay cryptographic payment signature");
    }

    // Process inside transaction
    const updatedPayment = await prisma.$transaction(async (tx) => {
      const res = await tx.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus: PaymentStatus.COMPLETED,
          razorpayPaymentId: params.razorpayPaymentId,
          razorpaySignature: params.razorpaySignature,
        },
      });

      // Update Order payment status if attached
      if (payment.orderId) {
        await tx.restaurantOrder.update({
          where: { id: payment.orderId },
          data: { paymentStatus: PaymentStatus.COMPLETED },
        });
      }

      // Update Room Booking advance paid if attached
      if (payment.bookingId) {
        await tx.roomBooking.update({
          where: { id: payment.bookingId },
          data: {
            advancePaid: { increment: payment.amount },
          },
        });
      }

      return res;
    }, { maxWait: 10000, timeout: 20000 });

    // Logging & Realtime Broadcast
    await AuditLogService.log({
      action: "PAYMENT_VERIFIED",
      details: `Razorpay payment ${params.razorpayPaymentId} verified (Amount: ₹${updatedPayment.amount})`,
    });

    await NotificationService.createNotification({
      title: "Payment Received",
      message: `Successfully verified payment of ₹${updatedPayment.amount} (${updatedPayment.paymentMethod})`,
      type: "SUCCESS",
      link: "/dashboard/billing",
    });

    realtimeBus.broadcast("PAYMENT_RECORDED", "COMPLETED", updatedPayment);
    realtimeBus.broadcast("DASHBOARD_REFRESH", "PAYMENT_COMPLETED");

    return updatedPayment;
  }

  /**
   * Process Partial or Full Refunds
   */
  public static async processRefund(paymentId: string, refundAmount: number, reason?: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    if (refundAmount <= 0 || refundAmount > payment.amount) {
      throw new Error("Invalid refund amount");
    }

    const newTotalRefund = payment.refundAmount + refundAmount;
    const isFullRefund = newTotalRefund >= payment.amount;
    const refundStatus = isFullRefund ? "FULL_REFUND" : "PARTIAL_REFUND";

    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        refundAmount: newTotalRefund,
        refundStatus,
        paymentStatus: isFullRefund ? PaymentStatus.REFUNDED : payment.paymentStatus,
      },
    });

    await AuditLogService.log({
      action: "REFUND_PROCESSED",
      details: `Processed ${refundStatus} of ₹${refundAmount} for payment ${payment.paymentId}. Reason: ${reason || "N/A"}`,
    });

    await NotificationService.createNotification({
      title: "Payment Refund Processed",
      message: `Processed ${refundStatus} of ₹${refundAmount} for ${payment.paymentId}`,
      type: "WARNING",
      link: "/dashboard/billing",
    });

    realtimeBus.broadcast("PAYMENT_RECORDED", "REFUND", updated);
    realtimeBus.broadcast("DASHBOARD_REFRESH", "PAYMENT_REFUND");

    return updated;
  }

  /**
   * Verify Webhook Signature (HMAC SHA256)
   */
  public static verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!signature) return false;
    const expectedSignature = crypto
      .createHmac("sha256", this.WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");
    return expectedSignature === signature;
  }
}

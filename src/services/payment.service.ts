import prisma from "@/lib/prisma";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { z } from "zod";
import { createPaymentSchema } from "@/lib/validations";
import { AuditLogService } from "@/services/audit.service";

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export class PaymentService {
  /**
   * Process & Record Payment inside Prisma Transaction
   */
  static async recordPayment(data: CreatePaymentInput) {
    const validated = createPaymentSchema.parse(data);

    if (!validated.orderId && !validated.bookingId) {
      throw new Error("Payment must be attached to an Order ID or Booking ID");
    }

    const payment = await prisma.$transaction(async (tx) => {
      const res = await tx.payment.create({
        data: {
          orderId: validated.orderId,
          bookingId: validated.bookingId,
          amount: validated.amount,
          paymentMethod: validated.paymentMethod as PaymentMethod,
          paymentStatus: validated.paymentStatus as PaymentStatus,
          gatewayRef: validated.gatewayRef,
        },
      });

      if (validated.orderId) {
        await tx.restaurantOrder.update({
          where: { id: validated.orderId },
          data: {
            paymentMethod: validated.paymentMethod as PaymentMethod,
            paymentStatus: PaymentStatus.COMPLETED,
          },
        });
      }

      if (validated.bookingId) {
        await tx.roomBooking.update({
          where: { id: validated.bookingId },
          data: {
            advancePaid: { increment: validated.amount },
          },
        });
      }

      return res;
    }, { maxWait: 10000, timeout: 20000 });

    await AuditLogService.log({
      action: "PAYMENT_RECORDED",
      details: `Recorded payment of ₹${validated.amount} via ${validated.paymentMethod} (Ref: ${validated.gatewayRef || "N/A"})`,
    });

    return payment;
  }

  /**
   * Get all payments
   */
  static async getPayments() {
    return await prisma.payment.findMany({
      include: {
        order: true,
        booking: { include: { room: true, customer: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

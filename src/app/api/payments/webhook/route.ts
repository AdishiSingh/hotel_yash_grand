import { NextRequest, NextResponse } from "next/server";
import { RazorpayService } from "@/services/razorpay.service";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";
import { AuditLogService } from "@/services/audit.service";
import { realtimeBus } from "@/lib/events";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const isValid = RazorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid && process.env.NODE_ENV === "production") {
      return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const entity = payload.payload?.payment?.entity;

    if (event === "payment.captured" && entity) {
      const rzpOrderId = entity.order_id;
      const rzpPaymentId = entity.id;

      const payment = await prisma.payment.findFirst({
        where: { razorpayOrderId: rzpOrderId },
      });

      if (payment && payment.paymentStatus !== PaymentStatus.COMPLETED) {
        await RazorpayService.confirmPayment({
          razorpayOrderId: rzpOrderId,
          razorpayPaymentId: rzpPaymentId,
          razorpaySignature: signature || "webhook_verified",
        });
      }
    } else if (event === "payment.failed" && entity) {
      const rzpOrderId = entity.order_id;
      await prisma.payment.updateMany({
        where: { razorpayOrderId: rzpOrderId },
        data: { paymentStatus: PaymentStatus.FAILED },
      });

      await AuditLogService.log({
        action: "PAYMENT_FAILED_WEBHOOK",
        details: `Webhook notified failed payment for Razorpay Order ${rzpOrderId}`,
      });

      realtimeBus.broadcast("DASHBOARD_REFRESH", "PAYMENT_FAILED");
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Razorpay webhook error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

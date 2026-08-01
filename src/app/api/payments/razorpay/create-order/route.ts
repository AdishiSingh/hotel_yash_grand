import { NextRequest, NextResponse } from "next/server";
import { RazorpayService } from "@/services/razorpay.service";
import { PaymentMethod } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ success: false, error: "Valid payment amount required" }, { status: 400 });
    }

    const orderData = await RazorpayService.createOrder({
      amount: Number(body.amount),
      currency: body.currency || "INR",
      orderId: body.orderId,
      bookingId: body.bookingId,
      paymentMethod: body.paymentMethod || PaymentMethod.RAZORPAY,
    });

    return NextResponse.json({
      success: true,
      data: orderData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}

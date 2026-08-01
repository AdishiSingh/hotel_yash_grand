import { NextRequest, NextResponse } from "next/server";
import { RazorpayService } from "@/services/razorpay.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.razorpayOrderId || !body.razorpayPaymentId || !body.razorpaySignature) {
      return NextResponse.json(
        { success: false, error: "Missing required Razorpay verification parameters" },
        { status: 400 }
      );
    }

    const verifiedPayment = await RazorpayService.confirmPayment({
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpaySignature: body.razorpaySignature,
      paymentId: body.paymentId,
    });

    return NextResponse.json({
      success: true,
      data: verifiedPayment,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Payment verification failed" },
      { status: 400 }
    );
  }
}

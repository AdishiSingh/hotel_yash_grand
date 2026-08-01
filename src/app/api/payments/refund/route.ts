import { NextRequest, NextResponse } from "next/server";
import { RazorpayService } from "@/services/razorpay.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.paymentId || !body.amount) {
      return NextResponse.json({ success: false, error: "Missing paymentId or refund amount" }, { status: 400 });
    }

    const refunded = await RazorpayService.processRefund(
      body.paymentId,
      Number(body.amount),
      body.reason
    );

    return NextResponse.json({
      success: true,
      data: refunded,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process refund" },
      { status: 400 }
    );
  }
}

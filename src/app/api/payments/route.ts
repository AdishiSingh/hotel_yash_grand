import { NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";
import { ZodError } from "zod";

export async function GET() {
  try {
    const payments = await PaymentService.getPayments();
    return NextResponse.json({ success: true, count: payments.length, data: payments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payment = await PaymentService.recordPayment(body);

    return NextResponse.json({ success: true, message: "Payment recorded successfully", data: payment }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: (error as any).issues || (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

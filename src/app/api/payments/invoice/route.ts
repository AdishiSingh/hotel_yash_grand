import { NextRequest, NextResponse } from "next/server";
import { BillingService } from "@/services/billing.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const bookingId = searchParams.get("bookingId");

    if (orderId) {
      const invoice = await BillingService.getOrderInvoiceData(orderId);
      return NextResponse.json({ success: true, data: invoice });
    }

    if (bookingId) {
      const invoice = await BillingService.getBookingInvoiceData(bookingId);
      return NextResponse.json({ success: true, data: invoice });
    }

    return NextResponse.json({ success: false, error: "Missing orderId or bookingId parameter" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

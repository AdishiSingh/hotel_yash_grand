import { NextResponse } from "next/server";
import { BanquetService } from "@/services/banquet.service";
import { ZodError } from "zod";
import { BanquetStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as BanquetStatus | null;

    const banquets = await BanquetService.getBanquetBookings(status || undefined);
    return NextResponse.json({ success: true, count: banquets.length, data: banquets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const banquet = await BanquetService.createBanquetBooking(body);

    return NextResponse.json({ success: true, message: "Banquet event enquiry submitted", data: banquet }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: (error as any).issues || (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

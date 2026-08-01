import { NextResponse } from "next/server";
import { BookingService } from "@/services/booking.service";
import { ZodError } from "zod";
import { BookingStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as BookingStatus | null;
    const roomId = searchParams.get("roomId") || undefined;

    const bookings = await BookingService.getBookings({
      status: status || undefined,
      roomId,
    });

    return NextResponse.json({ success: true, count: bookings.length, data: bookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBooking = await BookingService.createBooking(body);

    return NextResponse.json({ success: true, message: "Room booking created successfully", data: newBooking }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: (error as any).issues || (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message || "Failed to create booking" }, { status: 500 });
  }
}

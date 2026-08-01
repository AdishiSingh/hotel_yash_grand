import { NextRequest, NextResponse } from "next/server";
import { BookingRequestService } from "@/services/booking-request.service";
import { getCustomerSessionFromRequest } from "@/lib/customer-auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;
    const search = searchParams.get("search") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const requests = await BookingRequestService.getRequests({
      status,
      type,
      search,
      startDate,
      endDate,
    });

    const conflicts = await BookingRequestService.checkRoomConflicts();

    return NextResponse.json({
      success: true,
      count: requests.length,
      requests,
      occupancyStats: conflicts,
    });
  } catch (error: any) {
    console.error("GET /api/booking-requests error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch booking requests." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCustomerSessionFromRequest(req).catch(() => null);
    const body = await req.json();

    if (!body.guestName) body.guestName = body.name || session?.customer?.name || "Valued Guest";
    if (!body.checkIn && body.checkInDate) body.checkIn = body.checkInDate;
    if (!body.checkOut && body.checkOutDate) body.checkOut = body.checkOutDate;

    if (session && session.customer) {
      if (!body.customerId) body.customerId = session.customer.id;
      if (!body.mobile) body.mobile = session.customer.phone;
      if (!body.email && session.customer.email) body.email = session.customer.email;
    }

    const result = await BookingRequestService.createRequest(body);

    return NextResponse.json(
      {
        success: true,
        message: "Booking request saved. Pending manager approval.",
        request: result.request,
        data: result.request,
        managerWhatsappUrl: result.managerWhatsappUrl,
        whatsappMessage: result.whatsappMessage,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/booking-requests error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit booking request." },
      { status: 400 }
    );
  }
}

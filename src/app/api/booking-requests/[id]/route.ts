import { NextRequest, NextResponse } from "next/server";
import { BookingRequestService } from "@/services/booking-request.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const details = await BookingRequestService.getRequestDetails(id);
    return NextResponse.json({ success: true, ...details });
  } catch (error: any) {
    console.error("GET /api/booking-requests/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch request details." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, ...payload } = body;

    if (action === "approve") {
      const result = await BookingRequestService.approveRequest({
        requestId: id,
        managerName: payload.managerName || "Duty Manager",
        assignedRoomId: payload.assignedRoomId,
        assignedRoomNumber: payload.assignedRoomNumber,
        advanceAmount: payload.advanceAmount,
        totalAmount: payload.totalAmount,
        managerRemarks: payload.managerRemarks,
        expectedCheckInTime: payload.expectedCheckInTime,
      });

      return NextResponse.json({
        success: true,
        message: "Booking request approved & confirmed.",
        bookingNumber: result.bookingNumber,
        customerWhatsappUrl: result.customerWhatsappUrl,
        customerMessage: result.customerMessage,
        guestPortalUrl: result.guestPortalUrl,
      });
    }

    if (action === "reject") {
      const result = await BookingRequestService.rejectRequest(
        id,
        payload.rejectionReason || "Selected dates or rooms are unavailable.",
        payload.managerRemarks
      );

      return NextResponse.json({
        success: true,
        message: "Booking request rejected.",
        request: result.request,
        customerWhatsappUrl: result.customerWhatsappUrl,
        rejectionMessage: result.rejectionMessage,
      });
    }

    if (action === "log-comm") {
      const log = await BookingRequestService.addCommunicationLog({
        requestId: id,
        managerName: payload.managerName || "Duty Manager",
        channel: payload.channel || "CALL",
        duration: payload.duration || 0,
        status: payload.status || "COMPLETED",
        notes: payload.notes,
      });

      return NextResponse.json({ success: true, log });
    }

    if (action === "add-note") {
      const note = await BookingRequestService.addManagerNote({
        requestId: id,
        author: payload.author || "Duty Manager",
        category: payload.category || "GENERAL",
        content: payload.content,
      });

      return NextResponse.json({ success: true, note });
    }

    if (action === "assign-manager") {
      const updated = await BookingRequestService.assignManager(
        id,
        payload.managerName,
        payload.managerRole
      );

      return NextResponse.json({ success: true, request: updated });
    }

    if (action === "update-status") {
      const updated = await BookingRequestService.updateStatus(
        id,
        payload.status || "CONTACTED",
        payload.managerRemarks
      );

      return NextResponse.json({ success: true, request: updated });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("PATCH /api/booking-requests/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process request action." },
      { status: 500 }
    );
  }
}

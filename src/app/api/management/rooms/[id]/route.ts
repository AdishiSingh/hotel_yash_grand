import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuditLogService } from "@/services/audit.service";
import { RoomStatus, BookingStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, status, bookingId, managerRemarks } = body;

    // 1. Update Room Status directly (AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED)
    if (action === "update-room-status") {
      const updatedRoom = await prisma.room.update({
        where: { id },
        data: { status: status as RoomStatus },
      });

      await AuditLogService.log({
        action: "ROOM_STATUS_UPDATED",
        details: `Room ${updatedRoom.roomNumber} status updated to '${status}'. Remarks: ${managerRemarks || "N/A"}`,
      });

      return NextResponse.json({ success: true, room: updatedRoom });
    }

    // 2. Check-in Guest (Updates RoomBooking to CHECKED_IN and Room to OCCUPIED)
    if (action === "check-in-guest") {
      const result = await prisma.$transaction(async (tx) => {
        const booking = await tx.roomBooking.update({
          where: { id: bookingId || id },
          data: { status: BookingStatus.CHECKED_IN },
          include: { room: true },
        });

        await tx.room.update({
          where: { id: booking.roomId },
          data: { status: RoomStatus.OCCUPIED },
        });

        return booking;
      });

      await AuditLogService.log({
        action: "GUEST_CHECKED_IN",
        details: `Checked in guest for booking ${result.bookingId} in Room ${result.room.roomNumber}`,
      });

      return NextResponse.json({ success: true, booking: result });
    }

    // 3. Check-out Guest (Updates RoomBooking to CHECKED_OUT and Room to AVAILABLE)
    if (action === "check-out-guest") {
      const result = await prisma.$transaction(async (tx) => {
        const booking = await tx.roomBooking.update({
          where: { id: bookingId || id },
          data: { status: BookingStatus.CHECKED_OUT },
          include: { room: true },
        });

        await tx.room.update({
          where: { id: booking.roomId },
          data: { status: RoomStatus.AVAILABLE },
        });

        return booking;
      });

      await AuditLogService.log({
        action: "GUEST_CHECKED_OUT",
        details: `Checked out guest for booking ${result.bookingId} from Room ${result.room.roomNumber}. Room is now AVAILABLE.`,
      });

      return NextResponse.json({ success: true, booking: result });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("PATCH /api/management/rooms/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process room action." },
      { status: 500 }
    );
  }
}

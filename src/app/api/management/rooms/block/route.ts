import { NextRequest, NextResponse } from "next/server";
import { RoomAvailabilityService } from "@/services/room-availability.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, roomId, reason } = body;

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: "Room ID is required." },
        { status: 400 }
      );
    }

    if (action === "block") {
      const room = await RoomAvailabilityService.blockRoom(roomId, reason || "Administrative / Maintenance Block");
      return NextResponse.json({
        success: true,
        message: `Room ${room.roomNumber} status set to BLOCKED.`,
        room,
      });
    }

    if (action === "unblock") {
      const room = await RoomAvailabilityService.unblockRoom(roomId);
      return NextResponse.json({
        success: true,
        message: `Room ${room.roomNumber} status restored to AVAILABLE.`,
        room,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action specified. Must be 'block' or 'unblock'." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("POST /api/management/rooms/block error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update room block status." },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { RoomAvailabilityService } from "@/services/room-availability.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate") || undefined;
    const daysCount = Number(searchParams.get("days")) || 14;

    const result = await RoomAvailabilityService.getRealTimeAvailabilityMatrix(startDate, daysCount);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("GET /api/management/rooms/availability error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch room availability matrix." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const roomType = searchParams.get("roomType") || undefined;
    const search = searchParams.get("search") || undefined;
    const date = searchParams.get("date") || undefined;

    const todayStart = date ? new Date(date) : new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = date ? new Date(date) : new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. Fetch Rooms from PostgreSQL with active booking relation
    const roomWhere: any = {};
    if (status && status !== "ALL") {
      roomWhere.status = status;
    }
    if (roomType && roomType !== "ALL") {
      roomWhere.type = { contains: roomType, mode: "insensitive" };
    }

    const rooms = await prisma.room.findMany({
      where: roomWhere,
      include: {
        bookings: {
          where: {
            status: { in: ["CONFIRMED", "CHECKED_IN"] },
          },
          include: {
            customer: true,
          },
          orderBy: { checkIn: "asc" },
        },
      },
      orderBy: { roomNumber: "asc" },
    });

    // 2. Fetch Room Booking Requests (Pending / Processed)
    const requestWhere: any = { type: "ROOM" };
    if (search) {
      const q = search.trim();
      requestWhere.OR = [
        { requestId: { contains: q, mode: "insensitive" } },
        { guestName: { contains: q, mode: "insensitive" } },
        { mobile: { contains: q, mode: "insensitive" } },
      ];
    }

    const bookingRequests = await prisma.bookingRequest.findMany({
      where: requestWhere,
      include: {
        customer: true,
        managerNotes: { orderBy: { createdAt: "desc" } },
        communicationLogs: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { requestedAt: "desc" },
    });

    // 3. Fetch Confirmed Bookings & Current Checked-In Guests
    const confirmedBookings = await prisma.roomBooking.findMany({
      where: { status: "CONFIRMED" },
      include: {
        room: true,
        customer: true,
      },
      orderBy: { checkIn: "asc" },
    });

    const currentGuests = await prisma.roomBooking.findMany({
      where: { status: "CHECKED_IN" },
      include: {
        room: true,
        customer: true,
      },
      orderBy: { checkIn: "desc" },
    });

    const futureReservations = await prisma.roomBooking.findMany({
      where: {
        checkIn: { gt: new Date() },
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      include: {
        room: true,
        customer: true,
      },
      orderBy: { checkIn: "asc" },
    });

    // 4. Compute Live Statistics
    const totalRooms = await prisma.room.count();
    const availableRooms = await prisma.room.count({ where: { status: "AVAILABLE" } });
    const occupiedRooms = await prisma.room.count({ where: { status: "OCCUPIED" } });
    const reservedRooms = await prisma.room.count({ where: { status: "RESERVED" } });
    const maintenanceRooms = await prisma.room.count({ where: { status: "MAINTENANCE" } });

    const todayCheckIns = await prisma.roomBooking.count({
      where: { checkIn: { gte: todayStart, lte: todayEnd } },
    });

    const todayCheckOuts = await prisma.roomBooking.count({
      where: { checkOut: { gte: todayStart, lte: todayEnd } },
    });

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return NextResponse.json({
      success: true,
      rooms,
      bookingRequests,
      confirmedBookings,
      currentGuests,
      futureReservations,
      statistics: {
        totalRooms,
        availableRooms,
        occupiedRooms,
        reservedRooms,
        maintenanceRooms,
        occupancyRate,
        todayCheckIns,
        todayCheckOuts,
      },
    });
  } catch (error: any) {
    console.error("GET /api/management/rooms error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch room management data." },
      { status: 500 }
    );
  }
}

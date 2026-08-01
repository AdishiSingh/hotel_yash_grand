import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. Revenue breakdown calculations
    const todayPayments = await prisma.payment.aggregate({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        paymentStatus: "COMPLETED",
      },
      _sum: { amount: true },
    });

    const roomBookingRevenue = await prisma.roomBooking.aggregate({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
      },
      _sum: { totalAmount: true },
    });

    const todayOrdersSum = await prisma.restaurantOrder.aggregate({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        status: { in: ["PAID", "SERVED", "COMPLETED"] },
      },
      _sum: { grandTotal: true },
    });

    const banquetRevenueSum = await prisma.banquetBooking.aggregate({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        status: { in: ["BOOKED", "COMPLETED"] },
      },
      _sum: { budget: true },
    });

    const roomRevenue = roomBookingRevenue._sum?.totalAmount || 0;
    const restaurantRevenue = todayOrdersSum._sum?.grandTotal || 0;
    const banquetRevenue = banquetRevenueSum._sum?.budget || 0;
    const todayRevenue = (todayPayments._sum?.amount || 0) + roomRevenue + restaurantRevenue + banquetRevenue;

    // 2. Room Status Grid & Live Occupancy
    const allRooms = await prisma.room.findMany({
      orderBy: [{ floor: "asc" }, { roomNumber: "asc" }],
      include: {
        bookings: {
          where: {
            checkIn: { lte: todayEnd },
            checkOut: { gte: todayStart },
            status: { in: ["CONFIRMED", "CHECKED_IN"] },
          },
          include: { customer: true },
        },
      },
    });

    const totalRoomsCount = allRooms.length || 1;
    const occupiedRoomsCount = allRooms.filter((r) => r.status === "OCCUPIED" || r.bookings.length > 0).length;
    const availableRoomsCount = allRooms.filter((r) => r.status === "AVAILABLE" && r.bookings.length === 0).length;
    const maintenanceRoomsCount = allRooms.filter((r) => r.status === "MAINTENANCE" || r.status === "CLEANING" || r.status === "BLOCKED").length;
    const occupancyRatePercent = Math.min(100, Math.round((occupiedRoomsCount / totalRoomsCount) * 100));

    // 3. Today's Check-ins & Check-outs Lists
    const todayCheckIns = await prisma.roomBooking.findMany({
      where: {
        checkIn: { gte: todayStart, lte: todayEnd },
        status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
      },
      include: {
        room: true,
        customer: true,
      },
      orderBy: { checkIn: "asc" },
    });

    const todayCheckOuts = await prisma.roomBooking.findMany({
      where: {
        checkOut: { gte: todayStart, lte: todayEnd },
        status: { in: ["CHECKED_IN", "CHECKED_OUT"] },
      },
      include: {
        room: true,
        customer: true,
      },
      orderBy: { checkOut: "asc" },
    });

    // 4. Pending Booking Requests (Room, Banquet, Restaurant)
    const pendingBookingRequests = await prisma.bookingRequest.findMany({
      where: {
        status: { in: ["PENDING", "IN_PROGRESS", "CONTACTED", "PAYMENT_PENDING"] },
      },
      include: {
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 5. Recent Customers / Guest History
    const recentGuests = await prisma.customer.findMany({
      take: 10,
      orderBy: { lastVisit: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        visitCount: true,
        totalSpent: true,
        favouriteRoom: true,
        specialRequests: true,
        idProofNumber: true,
        createdAt: true,
      },
    });

    // 6. Communication & Audit Notifications Feed
    const recentNotifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // 7. Recent POS Restaurant Orders
    const recentOrders = await prisma.restaurantOrder.findMany({
      include: {
        items: true,
        table: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // 8. Hourly Revenue Trend Data
    const hourlyRevenueData = [
      { hour: "08 AM", value: Math.round(todayRevenue * 0.08) },
      { hour: "10 AM", value: Math.round(todayRevenue * 0.14) },
      { hour: "12 PM", value: Math.round(todayRevenue * 0.25) },
      { hour: "02 PM", value: Math.round(todayRevenue * 0.18) },
      { hour: "04 PM", value: Math.round(todayRevenue * 0.10) },
      { hour: "06 PM", value: Math.round(todayRevenue * 0.13) },
      { hour: "08 PM", value: Math.round(todayRevenue * 0.12) },
    ];

    const metrics = {
      todayRevenue,
      roomRevenue,
      restaurantRevenue,
      banquetRevenue,
      totalRoomsCount,
      occupiedRoomsCount,
      availableRoomsCount,
      maintenanceRoomsCount,
      occupancyRatePercent,
      todayCheckInsCount: todayCheckIns.length,
      todayCheckOutsCount: todayCheckOuts.length,
      pendingRequestsCount: pendingBookingRequests.length,
      pendingBanquetRequestsCount: pendingBookingRequests.filter((r) => r.type === "BANQUET").length,
      pendingRoomRequestsCount: pendingBookingRequests.filter((r) => r.type === "ROOM").length,
      restaurantOrdersCount: recentOrders.length,
    };

    return NextResponse.json({
      success: true,
      metrics,
      allRooms,
      todayCheckIns,
      todayCheckOuts,
      pendingBookingRequests,
      recentGuests,
      recentNotifications,
      recentOrders,
      hourlyRevenueData,
    });
  } catch (error: any) {
    console.error("GET /api/management/dashboard error:", error);
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 }
    );
  }
}

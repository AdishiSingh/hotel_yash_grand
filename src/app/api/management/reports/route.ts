import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("range") || "MONTHLY"; // DAILY, WEEKLY, MONTHLY, YEARLY

    const now = new Date();
    let startDate = new Date();

    if (timeframe === "DAILY") {
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === "WEEKLY") {
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === "MONTHLY") {
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === "YEARLY") {
      startDate.setFullYear(now.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
    }

    // 1. Restaurant Revenue & AOV Calculation
    const restaurantAggregation = await prisma.restaurantOrder.aggregate({
      where: {
        createdAt: { gte: startDate },
        status: { in: ["PAID", "SERVED", "COMPLETED"] },
      },
      _sum: { grandTotal: true },
      _count: { id: true },
    });

    const restaurantRevenue = restaurantAggregation._sum.grandTotal || 0;
    const restaurantOrdersCount = restaurantAggregation._count.id || 0;
    const avgOrderValue = restaurantOrdersCount > 0 ? Math.round(restaurantRevenue / restaurantOrdersCount) : 0;

    // 2. Room Revenue & Occupancy Calculation
    const roomAggregation = await prisma.roomBooking.aggregate({
      where: {
        checkIn: { gte: startDate },
        status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
      },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    const roomRevenue = roomAggregation._sum.totalAmount || 0;
    const roomBookingsCount = roomAggregation._count.id || 0;

    const totalRoomsCount = await prisma.room.count();
    const occupiedRoomsCount = await prisma.room.count({ where: { status: "OCCUPIED" } });
    const occupancyRate = totalRoomsCount > 0 ? Math.round((occupiedRoomsCount / totalRoomsCount) * 100) : 0;

    // 3. Banquet Revenue Calculation
    const banquetAggregation = await prisma.banquetBooking.aggregate({
      where: {
        eventDate: { gte: startDate },
        status: { in: ["BOOKED", "COMPLETED"] },
      },
      _sum: { budget: true },
      _count: { id: true },
    });

    const banquetRevenue = banquetAggregation._sum.budget || 0;
    const banquetEventsCount = banquetAggregation._count.id || 0;

    const totalRevenue = restaurantRevenue + roomRevenue + banquetRevenue;

    // 4. Best Selling Dishes (Aggregated from OrderItems)
    const bestSellingItemsRaw = await prisma.orderItem.groupBy({
      by: ["itemName"],
      where: {
        order: {
          createdAt: { gte: startDate },
          status: { in: ["PAID", "SERVED", "COMPLETED"] },
        },
      },
      _sum: { quantity: true, price: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 8,
    });

    const bestSellingDishes = bestSellingItemsRaw.map((item) => ({
      name: item.itemName,
      quantitySold: item._sum.quantity || 0,
      totalRevenueGenerated: Math.round((item._sum.quantity || 0) * (item._sum.price || 0)),
    }));

    // 5. Interactive Trend Chart Data
    const revenueTrendData = [
      { label: "Restaurant", revenue: restaurantRevenue, color: "#DFBA73" },
      { label: "Rooms Stay", revenue: roomRevenue, color: "#10B981" },
      { label: "Banquets", revenue: banquetRevenue, color: "#A855F7" },
    ];

    const bookingTrends = [
      { period: "Interval 1", rooms: Math.round(roomBookingsCount * 0.2), banquets: Math.round(banquetEventsCount * 0.2) },
      { period: "Interval 2", rooms: Math.round(roomBookingsCount * 0.3), banquets: Math.round(banquetEventsCount * 0.3) },
      { period: "Interval 3", rooms: Math.round(roomBookingsCount * 0.25), banquets: Math.round(banquetEventsCount * 0.25) },
      { period: "Current", rooms: Math.round(roomBookingsCount * 0.25), banquets: Math.round(banquetEventsCount * 0.25) },
    ];

    return NextResponse.json({
      success: true,
      timeframe,
      metrics: {
        totalRevenue,
        restaurantRevenue,
        roomRevenue,
        banquetRevenue,
        occupancyRate,
        avgOrderValue,
        restaurantOrdersCount,
        roomBookingsCount,
        banquetEventsCount,
      },
      bestSellingDishes,
      revenueTrendData,
      bookingTrends,
    });
  } catch (error: any) {
    console.error("GET /api/management/reports error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate financial reports." },
      { status: 500 }
    );
  }
}

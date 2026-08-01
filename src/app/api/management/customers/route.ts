import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const filter = searchParams.get("filter") || undefined; // VIP, RETURNING, NEW

    const where: any = {};

    if (search) {
      const q = search.trim();

      // Search by Booking ID or Order ID across related tables first
      const matchingOrder = await prisma.restaurantOrder.findFirst({
        where: { OR: [{ id: q }, { orderId: { contains: q, mode: "insensitive" } }] },
        select: { customerId: true, customerPhone: true },
      });

      const matchingRoomBk = await prisma.roomBooking.findFirst({
        where: { OR: [{ id: q }, { bookingId: { contains: q, mode: "insensitive" } }] },
        select: { customerId: true },
      });

      const matchingRequest = await prisma.bookingRequest.findFirst({
        where: { OR: [{ id: q }, { requestId: { contains: q, mode: "insensitive" } }] },
        select: { customerId: true, mobile: true },
      });

      const matchedCustomerIds = [
        matchingOrder?.customerId,
        matchingRoomBk?.customerId,
        matchingRequest?.customerId,
      ].filter(Boolean) as string[];

      const matchedPhones = [
        matchingOrder?.customerPhone,
        matchingRequest?.mobile,
      ].filter(Boolean) as string[];

      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        ...(matchedCustomerIds.length > 0 ? [{ id: { in: matchedCustomerIds } }] : []),
        ...(matchedPhones.length > 0 ? [{ phone: { in: matchedPhones } }] : []),
      ];
    }

    if (filter === "VIP") {
      where.OR = [
        { visitCount: { gte: 3 } },
        { totalSpent: { gte: 20000 } },
      ];
    } else if (filter === "RETURNING") {
      where.isReturning = true;
    } else if (filter === "NEW") {
      where.visitCount = 1;
    }

    // 1. Fetch Customers from PostgreSQL with complete history
    const customers = await prisma.customer.findMany({
      where,
      include: {
        orders: {
          include: { items: true },
          orderBy: { createdAt: "desc" },
        },
        roomBookings: {
          include: { room: true },
          orderBy: { checkIn: "desc" },
        },
        banquetBookings: {
          orderBy: { eventDate: "desc" },
        },
        bookingRequests: {
          include: {
            communicationLogs: { orderBy: { createdAt: "desc" } },
            managerNotes: { orderBy: { createdAt: "desc" } },
          },
          orderBy: { requestedAt: "desc" },
        },
      },
      orderBy: { totalSpent: "desc" },
    });

    // 2. Compute Live CRM Statistics
    const totalCustomers = await prisma.customer.count();
    const vipCustomersCount = await prisma.customer.count({
      where: {
        OR: [
          { visitCount: { gte: 3 } },
          { totalSpent: { gte: 20000 } },
        ],
      },
    });

    const totalLtvSum = await prisma.customer.aggregate({
      _sum: { totalSpent: true },
    });

    const totalLtv = totalLtvSum._sum.totalSpent || 0;
    const avgLtv = totalCustomers > 0 ? Math.round(totalLtv / totalCustomers) : 0;

    return NextResponse.json({
      success: true,
      count: customers.length,
      customers,
      statistics: {
        totalCustomers,
        vipCustomersCount,
        totalLtv,
        avgLtv,
      },
    });
  } catch (error: any) {
    console.error("GET /api/management/customers error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch customer CRM data." },
      { status: 500 }
    );
  }
}

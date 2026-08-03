import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BanquetService } from "@/services/banquet.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    // 1. Fetch Banquet Booking Requests
    const reqWhere: any = { type: "BANQUET" };
    if (status && status !== "ALL") {
      reqWhere.status = status;
    }
    if (search) {
      const q = search.trim();
      reqWhere.OR = [
        { requestId: { contains: q, mode: "insensitive" } },
        { guestName: { contains: q, mode: "insensitive" } },
        { mobile: { contains: q, mode: "insensitive" } },
        { eventType: { contains: q, mode: "insensitive" } },
      ];
    }

    const requests = await prisma.bookingRequest.findMany({
      where: reqWhere,
      include: {
        customer: true,
        managerNotes: { orderBy: { createdAt: "desc" } },
        communicationLogs: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { requestedAt: "desc" },
    });

    // 2. Fetch Confirmed Banquet Bookings
    const confirmedEvents = await prisma.banquetBooking.findMany({
      where: { status: { in: ["BOOKED", "SITE_VISIT", "NEW"] } },
      orderBy: { eventDate: "asc" },
    });

    // 3. Fetch Upcoming Events
    const upcomingEvents = await prisma.banquetBooking.findMany({
      where: {
        eventDate: { gte: new Date() },
        status: { in: ["BOOKED", "SITE_VISIT"] },
      },
      orderBy: { eventDate: "asc" },
    });

    // 4. Fetch Completed Events
    const completedEvents = await prisma.banquetBooking.findMany({
      where: { status: "COMPLETED" },
      orderBy: { eventDate: "desc" },
    });

    // 5. Compute Statistics
    const totalRequests = await prisma.bookingRequest.count({ where: { type: "BANQUET" } });
    const pendingRequestsCount = await prisma.bookingRequest.count({
      where: { type: "BANQUET", status: "PENDING" },
    });
    const confirmedCount = await prisma.banquetBooking.count({ where: { status: "BOOKED" } });
    const completedCount = await prisma.banquetBooking.count({ where: { status: "COMPLETED" } });

    const totalRevenueSum = await prisma.banquetBooking.aggregate({
      where: { status: { in: ["BOOKED", "COMPLETED"] } },
      _sum: { budget: true },
    });

    return NextResponse.json({
      success: true,
      requests,
      confirmedEvents,
      upcomingEvents,
      completedEvents,
      statistics: {
        totalRequests,
        pendingRequestsCount,
        confirmedCount,
        completedCount,
        totalRevenue: totalRevenueSum._sum.budget || 0,
      },
    });
  } catch (error: any) {
    console.error("GET /api/management/banquets error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch banquet management data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const banquet = await BanquetService.createBanquetBooking(body);

    return NextResponse.json(
      {
        success: true,
        message: "Banquet enquiry successfully saved to database.",
        banquet,
        data: banquet,
        referenceNumber: banquet.referenceNumber,
        whatsappUrl: banquet.whatsappUrl,
        whatsappMessage: banquet.whatsappMessage,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/management/banquets error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unable to submit enquiry. Please try again." },
      { status: 400 }
    );
  }
}

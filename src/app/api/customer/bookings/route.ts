import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCustomerSessionFromRequest } from "@/lib/customer-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getCustomerSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const customerId = session.customer.id;
    const phone = session.customer.phone;
    const email = session.customer.email;

    // Fetch Room Bookings with Room details & Payments
    const roomBookings = await prisma.roomBooking.findMany({
      where: { customerId },
      include: {
        room: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch Booking Requests with communication logs & manager notes
    const bookingRequests = await prisma.bookingRequest.findMany({
      where: {
        OR: [
          { customerId },
          { mobile: phone },
          ...(email ? [{ email }] : []),
        ],
      },
      include: {
        communicationLogs: {
          orderBy: { createdAt: "asc" },
        },
        managerNotes: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch Banquet Bookings
    const banquetBookings = await prisma.banquetBooking.findMany({
      where: {
        OR: [
          { customerId },
          { customerPhone: phone },
          ...(email ? [{ customerEmail: email }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch Restaurant Orders
    const restaurantOrders = await prisma.restaurantOrder.findMany({
      where: {
        OR: [
          { customerId },
          { customerPhone: phone },
        ],
      },
      include: { items: true, payments: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        customer: session.customer,
        roomBookings,
        bookingRequests,
        banquetBookings,
        restaurantOrders,
      },
    });
  } catch (error: any) {
    console.error("GET /api/customer/bookings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch customer bookings." },
      { status: 500 }
    );
  }
}

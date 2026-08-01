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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Fetch Complete Customer Profile
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        avatar: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        idProofType: true,
        idProofNumber: true,
        favouriteRoom: true,
        specialRequests: true,
        preferredFloor: true,
        preferredCheckInTime: true,
        favouriteDishes: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        totalSpent: true,
        visitCount: true,
        lastVisit: true,
        isReturning: true,
        createdAt: true,
      },
    });

    // 2. Room Bookings (Upcoming, Past, Cancelled)
    const allRoomBookings = await prisma.roomBooking.findMany({
      where: { customerId },
      include: {
        room: true,
        payments: true,
      },
      orderBy: { checkIn: "asc" },
    });

    const upcomingStays = allRoomBookings.filter(
      (b) => new Date(b.checkOut) >= today && b.status !== "CANCELLED"
    );

    const pastBookings = allRoomBookings.filter(
      (b) => (new Date(b.checkOut) < today || b.status === "CHECKED_OUT") && b.status !== "CANCELLED"
    );

    const cancelledRoomBookings = allRoomBookings.filter(
      (b) => b.status === "CANCELLED"
    );

    // 3. Booking Requests (Pending, Confirmed, Cancelled/Rejected)
    const bookingRequests = await prisma.bookingRequest.findMany({
      where: {
        OR: [
          { customerId },
          { mobile: phone },
          ...(email ? [{ email }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    const pendingRequests = bookingRequests.filter(
      (r) => r.status === "PENDING" || r.status === "IN_PROGRESS" || r.status === "CONTACTED" || r.status === "PAYMENT_PENDING"
    );

    const confirmedRequests = bookingRequests.filter(
      (r) => r.status === "CONFIRMED" || r.status === "APPROVED" || r.status === "PAYMENT_VERIFIED"
    );

    const cancelledRequests = bookingRequests.filter(
      (r) => r.status === "CANCELLED" || r.status === "REJECTED"
    );

    // Combine Cancelled Stays & Requests
    const cancelledBookings = [
      ...cancelledRoomBookings.map((b) => ({
        id: b.id,
        bookingId: b.bookingId,
        type: "ROOM",
        roomType: b.room?.type || "Deluxe Stay",
        date: b.checkIn,
        amount: b.totalAmount,
        reason: "Customer requested cancellation",
        status: b.status,
      })),
      ...cancelledRequests.map((r) => ({
        id: r.id,
        bookingId: r.requestId,
        type: r.type,
        roomType: r.roomType || r.eventType || "Standard Request",
        date: r.eventDate || r.checkIn || r.createdAt,
        amount: 0,
        reason: r.managerRemarks || "Cancelled / Declined by Desk",
        status: r.status,
      })),
    ];

    // 4. Banquet Bookings
    const banquetRequests = await prisma.banquetBooking.findMany({
      where: {
        OR: [
          { customerId },
          { customerPhone: phone },
          ...(email ? [{ customerEmail: email }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    // 5. Restaurant Orders
    const restaurantOrders = await prisma.restaurantOrder.findMany({
      where: {
        OR: [
          { customerId },
          { customerPhone: phone },
        ],
      },
      include: {
        items: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 6. Customer Notifications
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { customerId },
          { customerId: null },
        ],
      },
      take: 20,
      orderBy: { createdAt: "desc" },
    });

    const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

    // 7. Calculate Loyalty Points & Rewards Tier
    const totalSpentAmount = customer?.totalSpent || 0;
    const visits = customer?.visitCount || 1;
    const loyaltyPoints = Math.floor(totalSpentAmount / 100) + (visits * 500);

    let loyaltyTier = "VALUED GUEST";
    let nextTier = "GOLD PATRON";
    let targetPoints = 3000;
    let tierMultiplier = "1.0x";

    if (loyaltyPoints >= 10000 || visits >= 5) {
      loyaltyTier = "ROYAL PLATINUM VIP";
      nextTier = "MAX TIER REVENUE PRIVILEGE";
      targetPoints = 10000;
      tierMultiplier = "1.5x";
    } else if (loyaltyPoints >= 3000 || visits >= 2) {
      loyaltyTier = "GOLD PATRON";
      nextTier = "ROYAL PLATINUM VIP";
      targetPoints = 10000;
      tierMultiplier = "1.2x";
    }

    const tierProgressPercent = Math.min(100, Math.round((loyaltyPoints / targetPoints) * 100));

    // 8. Calculate Profile Completion Score & Missing Checklist
    const profileChecklist = [
      { key: "name", label: "Full Name", weight: 15, completed: Boolean(customer?.name) },
      { key: "phone", label: "Mobile Number", weight: 15, completed: Boolean(customer?.phone) },
      { key: "email", label: "Email Address", weight: 15, completed: Boolean(customer?.email) },
      { key: "address", label: "Postal Address & City", weight: 15, completed: Boolean(customer?.address && customer?.city) },
      { key: "idProof", label: "ID Verification Number", weight: 20, completed: Boolean(customer?.idProofNumber) },
      { key: "preferences", label: "Saved Room & Stay Preferences", weight: 10, completed: Boolean(customer?.favouriteRoom || customer?.specialRequests) },
      { key: "dishes", label: "Dietary & Dining Preferences", weight: 10, completed: Boolean(customer?.favouriteDishes && customer.favouriteDishes.length > 0) },
    ];

    const profileCompletionPercent = profileChecklist.reduce(
      (acc, item) => (item.completed ? acc + item.weight : acc),
      0
    );

    const missingItems = profileChecklist.filter((item) => !item.completed);

    const stats = {
      totalBookingsCount: allRoomBookings.length + banquetRequests.length + bookingRequests.length,
      upcomingStaysCount: upcomingStays.length,
      pastStaysCount: pastBookings.length,
      cancelledStaysCount: cancelledBookings.length,
      pendingRequestsCount: pendingRequests.length,
      banquetsCount: banquetRequests.length,
      diningOrdersCount: restaurantOrders.length,
      totalSpentAmount,
      loyaltyPoints,
      loyaltyTier,
      nextTier,
      targetPoints,
      tierMultiplier,
      tierProgressPercent,
      profileCompletionPercent,
      unreadNotificationsCount,
    };

    return NextResponse.json({
      success: true,
      data: {
        customer,
        stats,
        upcomingStays,
        pastBookings,
        cancelledBookings,
        pendingRequests,
        confirmedRequests,
        banquetRequests,
        restaurantOrders,
        notifications,
        profileChecklist,
        missingItems,
      },
    });
  } catch (error: any) {
    console.error("GET /api/customer/dashboard error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load customer dashboard." },
      { status: 500 }
    );
  }
}

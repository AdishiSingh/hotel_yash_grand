import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

describe("Integration: Management Executive Command Center & Operational Metrics", () => {
  let createdCustomerId = "";
  let createdBookingId = "";
  let createdRequestId = "";

  beforeAll(async () => {
    // 1. Create a test customer in PostgreSQL
    const customer = await prisma.customer.create({
      data: {
        name: "Manager Control Test Guest",
        phone: `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`,
        email: `managercontrol_${Date.now()}@yashgrand.com`,
      },
    });
    createdCustomerId = customer.id;

    // 2. Create a test room booking checking in today
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const room = await prisma.room.findFirst();

    const booking = await prisma.roomBooking.create({
      data: {
        bookingId: `MGR-${Math.floor(100000 + Math.random() * 900000)}`,
        customerId: customer.id,
        roomId: room?.id || "room-101",
        checkIn: today,
        checkOut: tomorrow,
        totalAmount: 5500,
        status: "CONFIRMED",
      },
    });
    createdBookingId = booking.id;

    // 3. Create a pending booking request
    const request = await prisma.bookingRequest.create({
      data: {
        requestId: `REQ-${Math.floor(100000 + Math.random() * 900000)}`,
        type: "ROOM",
        guestName: "Manager Control Test Guest",
        mobile: customer.phone,
        roomType: "Single Deluxe Room",
        status: "PENDING",
        customerId: customer.id,
      },
    });
    createdRequestId = request.id;
  });

  afterAll(async () => {
    try {
      if (createdRequestId) await prisma.bookingRequest.deleteMany({ where: { id: createdRequestId } });
      if (createdBookingId) await prisma.roomBooking.deleteMany({ where: { id: createdBookingId } });
      if (createdCustomerId) await prisma.customer.deleteMany({ where: { id: createdCustomerId } });
    } catch (e) {
      console.warn("Management test cleanup warning:", e);
    }
  });

  it("1. should fetch live operational command center metrics via GET /api/management/dashboard", async () => {
    const res = await fetch(`${BASE_URL}/api/management/dashboard`);
    const json = await res.json();
    if (res.status !== 200) {
      console.error("Dashboard API Error:", json);
    }
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);

    // Verify metrics structure
    const m = json.metrics;
    expect(m).toBeDefined();
    expect(m.todayRevenue).toBeGreaterThanOrEqual(0);
    expect(m.occupancyRatePercent).toBeGreaterThanOrEqual(0);
    expect(m.todayCheckInsCount).toBeGreaterThanOrEqual(1);

    // Verify data structures
    expect(json.allRooms).toBeDefined();
    expect(Array.isArray(json.allRooms)).toBe(true);
    expect(json.todayCheckIns).toBeDefined();
    expect(json.todayCheckOuts).toBeDefined();
    expect(json.pendingBookingRequests).toBeDefined();
    expect(json.recentGuests).toBeDefined();
    expect(json.hourlyRevenueData).toBeDefined();
  });

  it("2. should process manager approval on pending booking request via PATCH /api/booking-requests/[id]", async () => {
    const res = await fetch(`${BASE_URL}/api/booking-requests/${createdRequestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "approve",
        managerName: "Duty Manager",
        managerRemarks: "Approved by Duty Manager with Single Deluxe Room tariff ₹2,500/night.",
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    // Verify DB update
    const dbReq = await prisma.bookingRequest.findUnique({
      where: { id: createdRequestId },
    });
    expect(dbReq?.status).toBe("APPROVED");
  });
});

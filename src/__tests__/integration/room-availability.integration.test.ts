import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { RoomAvailabilityService } from "@/services/room-availability.service";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

describe("Integration: Real-Time Room Availability & Overbooking Prevention Engine", () => {
  let createdRoomId = "";
  let createdCustomerId = "";
  let createdBookingId = "";

  beforeAll(async () => {
    // 1. Create test room
    const roomNumber = `TEST-${Math.floor(100 + Math.random() * 900)}`;
    const room = await prisma.room.create({
      data: {
        roomNumber,
        type: "Executive Suite",
        pricePerNight: 4500,
        capacity: 3,
        status: "AVAILABLE",
      },
    });
    createdRoomId = room.id;

    // 2. Create test customer
    const customer = await prisma.customer.create({
      data: {
        name: "Availability Test Guest",
        phone: `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`,
        email: `availtest_${Date.now()}@yashgrand.com`,
      },
    });
    createdCustomerId = customer.id;

    // 3. Create active booking for stay dates Sept 10 - Sept 15, 2026
    const booking = await prisma.roomBooking.create({
      data: {
        bookingId: `BK-AVAIL-${Math.floor(100000 + Math.random() * 900000)}`,
        roomId: room.id,
        customerId: customer.id,
        checkIn: new Date("2026-09-10T12:00:00.000Z"),
        checkOut: new Date("2026-09-15T11:00:00.000Z"),
        totalAmount: 22500,
        status: "CONFIRMED",
      },
    });
    createdBookingId = booking.id;
  });

  afterAll(async () => {
    try {
      if (createdBookingId) await prisma.roomBooking.deleteMany({ where: { id: createdBookingId } });
      if (createdRoomId) await prisma.room.deleteMany({ where: { id: createdRoomId } });
      if (createdCustomerId) await prisma.customer.deleteMany({ where: { id: createdCustomerId } });
    } catch (e) {
      console.warn("Room availability test cleanup warning:", e);
    }
  });

  it("1. should detect date collision and PREVENT overbooking for overlapping stay dates", async () => {
    // Attempting to book overlapping stay Sept 12 - Sept 14 (inside Sept 10 - Sept 15)
    const { isOverbooked, conflictingBookings } = await RoomAvailabilityService.checkOverbooking(
      createdRoomId,
      new Date("2026-09-12T12:00:00.000Z"),
      new Date("2026-09-14T11:00:00.000Z")
    );

    expect(isOverbooked).toBe(true);
    expect(conflictingBookings.length).toBeGreaterThan(0);
    expect(conflictingBookings[0].id).toBe(createdBookingId);
  });

  it("2. should allow booking for NON-OVERLAPPING dates", async () => {
    // Booking stay AFTER existing checkout (Sept 16 - Sept 18)
    const { isOverbooked } = await RoomAvailabilityService.checkOverbooking(
      createdRoomId,
      new Date("2026-09-16T12:00:00.000Z"),
      new Date("2026-09-18T11:00:00.000Z")
    );

    expect(isOverbooked).toBe(false);
  });

  it("3. should fetch live 14-day real-time availability matrix via GET /api/management/rooms/availability", async () => {
    const res = await fetch(`${BASE_URL}/api/management/rooms/availability?days=14`);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.rooms).toBeDefined();
    expect(json.summary).toBeDefined();
    expect(json.summary.totalRooms).toBeGreaterThanOrEqual(1);
  });

  it("4. should block and unblock room for administrative maintenance via POST /api/management/rooms/block", async () => {
    // Create an unbooked room for blocking
    const unbookedRoom = await prisma.room.create({
      data: {
        roomNumber: `BLK-${Math.floor(100 + Math.random() * 900)}`,
        type: "Single Deluxe Room",
        pricePerNight: 2500,
        capacity: 2,
        status: "AVAILABLE",
      },
    });

    // Block Room
    const blockRes = await fetch(`${BASE_URL}/api/management/rooms/block`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "block",
        roomId: unbookedRoom.id,
        reason: "Scheduled HVAC Filter Replacement",
      }),
    });

    const blockJson = await blockRes.json();
    if (blockRes.status !== 200) {
      console.error("Block API Error:", blockJson);
    }
    expect(blockRes.status).toBe(200);
    expect(blockJson.success).toBe(true);

    const blockedRoom = await prisma.room.findUnique({ where: { id: unbookedRoom.id } });
    expect(blockedRoom?.status).toBe("MAINTENANCE");

    // Unblock Room
    const unblockRes = await fetch(`${BASE_URL}/api/management/rooms/block`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "unblock",
        roomId: unbookedRoom.id,
      }),
    });

    expect(unblockRes.status).toBe(200);
    const unblockJson = await unblockRes.json();
    expect(unblockJson.success).toBe(true);

    const restoredRoom = await prisma.room.findUnique({ where: { id: unbookedRoom.id } });
    expect(restoredRoom?.status).toBe("AVAILABLE");

    // Cleanup
    await prisma.room.delete({ where: { id: unbookedRoom.id } });
  });
});

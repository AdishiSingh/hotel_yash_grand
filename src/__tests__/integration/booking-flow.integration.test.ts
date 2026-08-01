import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

describe("Integration: Room & Banquet Booking Flow Pipeline", () => {
  const customerA_Phone = `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`;
  const customerB_Phone = `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`;
  
  let customerA_Cookie = "";
  let customerB_Cookie = "";
  let customerA_Id = "";
  let customerB_Id = "";
  let bookingId_A = "";

  beforeAll(async () => {
    // 1. Register and Login Customer A
    const resA = await fetch(`${BASE_URL}/api/customer/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Customer A Integration",
        phone: customerA_Phone,
        password: "Password123!",
      }),
    });
    const dataA = await resA.json();
    customerA_Id = dataA.customer.id;

    const loginA = await fetch(`${BASE_URL}/api/customer/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: customerA_Phone, password: "Password123!" }),
    });
    customerA_Cookie = loginA.headers.get("set-cookie")!.split(";")[0];

    // 2. Register and Login Customer B
    const resB = await fetch(`${BASE_URL}/api/customer/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Customer B Integration",
        phone: customerB_Phone,
        password: "Password123!",
      }),
    });
    const dataB = await resB.json();
    customerB_Id = dataB.customer.id;

    const loginB = await fetch(`${BASE_URL}/api/customer/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: customerB_Phone, password: "Password123!" }),
    });
    customerB_Cookie = loginB.headers.get("set-cookie")!.split(";")[0];
  });

  afterAll(async () => {
    try {
      await prisma.bookingRequest.deleteMany({
        where: { customerId: { in: [customerA_Id, customerB_Id] } },
      });
      await prisma.notification.deleteMany({
        where: { customerId: { in: [customerA_Id, customerB_Id] } },
      });
      await prisma.customerSession.deleteMany({
        where: { customerId: { in: [customerA_Id, customerB_Id] } },
      });
      await prisma.customer.deleteMany({
        where: { id: { in: [customerA_Id, customerB_Id] } },
      });
    } catch (e) {
      console.warn("Cleanup warning:", e);
    }
  });

  it("should reject room booking request exceeding room max capacity", async () => {
    const res = await fetch(`${BASE_URL}/api/booking-requests`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Cookie: customerA_Cookie 
      },
      body: JSON.stringify({
        type: "ROOM",
        guestName: "Customer A Integration",
        mobile: customerA_Phone,
        checkIn: "2026-08-20",
        checkOut: "2026-08-25",
        roomType: "single-deluxe",
        adults: 3,
        children: 1,
      }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("exceeds maximum capacity");
  });

  it("should create a room booking request linked to Customer A in PostgreSQL with guest fields", async () => {
    const res = await fetch(`${BASE_URL}/api/booking-requests`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Cookie: customerA_Cookie 
      },
      body: JSON.stringify({
        type: "ROOM",
        guestName: "Customer A Integration",
        mobile: customerA_Phone,
        checkIn: "2026-08-20",
        checkOut: "2026-08-25",
        adults: 2,
        children: 1,
        roomType: "family-room",
        specialRequests: "High floor, quiet room",
      }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.requestId).toMatch(/^YG-REQ-2026-\d{4}$/);
    expect(data.data.status).toBe("PENDING");
    expect(data.data.adults).toBe(2);
    expect(data.data.children).toBe(1);
    expect(data.data.guestsCount).toBe(3);

    bookingId_A = data.data.id;

    // Verify linkage in PostgreSQL via Prisma
    const dbRecord = await prisma.bookingRequest.findUnique({
      where: { id: bookingId_A },
    });
    expect(dbRecord).not.toBeNull();
    expect(dbRecord?.customerId).toBe(customerA_Id);
    expect(dbRecord?.mobile).toBe(customerA_Phone);
    expect(dbRecord?.adults).toBe(2);
    expect(dbRecord?.children).toBe(1);
    expect(dbRecord?.guestsCount).toBe(3);
  });

  it("should create a banquet booking request linked to Customer A in PostgreSQL", async () => {
    const res = await fetch(`${BASE_URL}/api/booking-requests`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Cookie: customerA_Cookie 
      },
      body: JSON.stringify({
        type: "BANQUET",
        guestName: "Customer A Integration",
        mobile: customerA_Phone,
        eventDate: "2026-09-15",
        eventType: "WEDDING",
        guestsCount: 250,
        packageType: "ROYAL_PLATINUM",
        hallPreference: "Grand Imperial Ballroom",
      }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.requestId).toMatch(/^YG-REQ-2026-\d{4}$/);
  });

  it("should create a restaurant reservation request linked to Customer A in PostgreSQL", async () => {
    const res = await fetch(`${BASE_URL}/api/booking-requests`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Cookie: customerA_Cookie 
      },
      body: JSON.stringify({
        type: "RESTAURANT",
        guestName: "Customer A Integration",
        mobile: customerA_Phone,
        eventDate: "2026-08-10",
        eventTime: "20:00",
        eventType: "Anniversary Dinner",
        guestsCount: 4,
        specialRequest: "Window table, candle light",
      }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.type).toBe("RESTAURANT");
  });

  it("should allow Manager to approve Customer A's room booking and dispatch customer notification", async () => {
    const res = await fetch(`${BASE_URL}/api/booking-requests/${bookingId_A}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "approve",
        managerName: "Senior Duty Manager",
        assignedRoomNumber: "101",
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.bookingNumber).toBeDefined();

    // Verify status updated in PostgreSQL
    const updatedReq = await prisma.bookingRequest.findUnique({
      where: { id: bookingId_A },
    });
    expect(updatedReq?.status).toBe("APPROVED");

    // Verify Notification saved to PostgreSQL for Customer A
    const notifs = await prisma.notification.findMany({
      where: { customerId: customerA_Id },
    });
    expect(notifs.length).toBeGreaterThan(0);
    expect(notifs.some((n) => n.title.includes("Approved"))).toBe(true);
  });

  it("should retrieve Customer A's bookings via GET /api/customer/bookings", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/bookings`, {
      headers: { Cookie: customerA_Cookie },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.bookingRequests.length).toBe(3); // Room + Banquet + Restaurant
    expect(data.data.bookingRequests.some((b: any) => b.id === bookingId_A)).toBe(true);
  });

  it("should enforce cross-customer isolation (Customer B cannot retrieve Customer A's bookings)", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/bookings`, {
      headers: { Cookie: customerB_Cookie },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.bookingRequests.length).toBe(0); // Customer B has 0 bookings
    expect(data.data.bookingRequests.some((b: any) => b.id === bookingId_A)).toBe(false);
  });
});

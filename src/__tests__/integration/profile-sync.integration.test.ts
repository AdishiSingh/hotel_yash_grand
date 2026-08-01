import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

describe("Integration: Customer Profile Auto-Fill & Synchronization Pipeline", () => {
  const testPhone = `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`;
  const testEmail = `profilesync_${Date.now()}@yashgrand.com`;
  const testPassword = "SyncPassword123!";

  let customerId = "";
  let sessionCookie = "";

  beforeAll(async () => {
    // 1. Create a test customer in PostgreSQL
    const res = await fetch(`${BASE_URL}/api/customer/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Initial Profile Name",
        phone: testPhone,
        email: testEmail,
        password: testPassword,
      }),
    });

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    customerId = data.customer.id;

    const cookieHeader = res.headers.get("set-cookie");
    sessionCookie = cookieHeader!.split(";")[0];
  });

  afterAll(async () => {
    try {
      if (customerId) {
        await prisma.bookingRequest.deleteMany({ where: { customerId } });
        await prisma.customerSession.deleteMany({ where: { customerId } });
        await prisma.customer.deleteMany({ where: { id: customerId } });
      }
    } catch (e) {
      console.warn("Profile Sync test cleanup warning:", e);
    }
  });

  it("1. should fetch customer profile for auto-filling booking forms via GET /api/customer/profile", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/profile`, {
      headers: { Cookie: sessionCookie },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.customer).toBeDefined();
    expect(data.customer.name).toBe("Initial Profile Name");
    expect(data.customer.email).toBe(testEmail);
    expect(data.customer.phone).toBe(testPhone);
  });

  it("2. should update customer profile preferences when 'Save to Profile' option is selected", async () => {
    const updateRes = await fetch(`${BASE_URL}/api/customer/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        name: "Updated Profile Name",
        phone: testPhone,
        email: testEmail,
        favouriteRoom: "executive-suite",
        specialRequests: "High floor, quiet room away from elevator",
      }),
    });

    expect(updateRes.status).toBe(200);
    const updateData = await updateRes.json();
    expect(updateData.success).toBe(true);
    expect(updateData.customer.name).toBe("Updated Profile Name");
    expect(updateData.customer.favouriteRoom).toBe("executive-suite");
    expect(updateData.customer.specialRequests).toBe("High floor, quiet room away from elevator");

    // Verify DB update
    const dbCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    expect(dbCustomer?.name).toBe("Updated Profile Name");
    expect(dbCustomer?.favouriteRoom).toBe("executive-suite");
    expect(dbCustomer?.specialRequests).toBe("High floor, quiet room away from elevator");
  });

  it("3. should submit booking with custom values when 'Only for this booking' is selected without altering permanent profile", async () => {
    // Submit a booking request with temporary custom details
    const bookingRes = await fetch(`${BASE_URL}/api/booking-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        type: "ROOM",
        guestName: "Temporary One-Time Guest Name",
        mobile: testPhone,
        email: testEmail,
        roomType: "presidential-suite",
        checkIn: "2026-09-01",
        checkOut: "2026-09-05",
        adults: 2,
        children: 1,
        specialRequest: "Need airport pickup for this specific stay",
      }),
    });

    expect([200, 201]).toContain(bookingRes.status);
    const bookingData = await bookingRes.json();
    expect(bookingData.success).toBe(true);

    // Permanent customer profile in database MUST remain unchanged ("Updated Profile Name", "executive-suite")
    const dbCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    expect(dbCustomer?.name).toBe("Updated Profile Name");
    expect(dbCustomer?.favouriteRoom).toBe("executive-suite");
    expect(dbCustomer?.specialRequests).toBe("High floor, quiet room away from elevator");
  });
});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

describe("Integration: Customer Premium Guest Portal & Dashboard Metrics", () => {
  const profilePhone = `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`;
  let profileCookie = "";
  let customerId = "";

  beforeAll(async () => {
    // Register and Login test customer
    const regRes = await fetch(`${BASE_URL}/api/customer/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Premium Portal Guest",
        phone: profilePhone,
        password: "Password123!",
      }),
    });
    const regData = await regRes.json();
    customerId = regData.customer.id;

    const loginRes = await fetch(`${BASE_URL}/api/customer/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: profilePhone, password: "Password123!" }),
    });
    profileCookie = loginRes.headers.get("set-cookie")!.split(";")[0];

    // Create a pending booking request
    await fetch(`${BASE_URL}/api/booking-requests`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Cookie: profileCookie 
      },
      body: JSON.stringify({
        type: "ROOM",
        guestName: "Premium Portal Guest",
        mobile: profilePhone,
        checkIn: "2026-09-01",
        checkOut: "2026-09-05",
        guestsCount: 2,
        roomType: "Single Deluxe Room",
      }),
    });

    // Create a notification for this customer
    await fetch(`${BASE_URL}/api/customer/notifications`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Cookie: profileCookie 
      },
      body: JSON.stringify({
        title: "Welcome to Yash Grand Privileges",
        message: "Your guest account has been activated with Gold Patron eligibility.",
        type: "INFO",
      }),
    });
  });

  afterAll(async () => {
    try {
      await prisma.bookingRequest.deleteMany({ where: { customerId } });
      await prisma.notification.deleteMany({ where: { customerId } });
      await prisma.customerSession.deleteMany({ where: { customerId } });
      await prisma.customer.deleteMany({ where: { id: customerId } });
    } catch (e) {
      console.warn("Cleanup warning:", e);
    }
  });

  it("1. should update stay preferences in PostgreSQL via PUT /api/customer/profile", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/profile`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Cookie: profileCookie 
      },
      body: JSON.stringify({
        preferredFloor: "2nd",
        preferredCheckInTime: "12:00 PM",
        favouriteRoom: "executive-suite",
        specialRequests: "Quiet high-floor room, non-smoking",
        favouriteDishes: ["Pure Veg Awadhi", "Jain Thali"],
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify stored preferences in PostgreSQL
    const dbCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    expect(dbCustomer?.preferredFloor).toBe("2nd");
    expect(dbCustomer?.preferredCheckInTime).toBe("12:00 PM");
    expect(dbCustomer?.favouriteRoom).toBe("executive-suite");
    expect(dbCustomer?.favouriteDishes).toContain("Pure Veg Awadhi");
  });

  it("2. should fetch customer profile via GET /api/customer/profile", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/profile`, {
      headers: { Cookie: profileCookie },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.customer).toBeDefined();
    expect(data.customer.phone).toBe(profilePhone);
    expect(data.customer.preferredFloor).toBe("2nd");
  });

  it("3. should aggregate complete premium guest portal metrics via GET /api/customer/dashboard", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/dashboard`, {
      headers: { Cookie: profileCookie },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.stats).toBeDefined();

    const stats = data.data.stats;
    expect(stats.totalBookingsCount).toBeGreaterThanOrEqual(1);
    expect(stats.loyaltyPoints).toBeGreaterThanOrEqual(500); // 500 points minimum for visit
    expect(stats.loyaltyTier).toBeDefined();
    expect(stats.profileCompletionPercent).toBeGreaterThan(0);
    expect(data.data.profileChecklist).toBeDefined();
    expect(data.data.cancelledBookings).toBeDefined();
    expect(data.data.notifications).toBeDefined();
  });

  it("4. should mark customer portal notifications as read via PUT /api/customer/notifications", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/notifications`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Cookie: profileCookie 
      },
      body: JSON.stringify({ markAllRead: true }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify unread count is 0
    const getRes = await fetch(`${BASE_URL}/api/customer/notifications`, {
      headers: { Cookie: profileCookie },
    });
    const getData = await getRes.json();
    expect(getData.unreadCount).toBe(0);
  });
});

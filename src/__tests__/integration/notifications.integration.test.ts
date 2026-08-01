import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

describe("Integration: Customer Notification Center Pipeline", () => {
  const notifyPhone = `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`;
  let notifyCookie = "";
  let customerId = "";

  beforeAll(async () => {
    // Register and login test customer
    const regRes = await fetch(`${BASE_URL}/api/customer/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Notification Test Guest",
        phone: notifyPhone,
        password: "Password123!",
      }),
    });
    const regData = await regRes.json();
    customerId = regData.customer.id;

    const loginRes = await fetch(`${BASE_URL}/api/customer/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: notifyPhone, password: "Password123!" }),
    });
    notifyCookie = loginRes.headers.get("set-cookie")!.split(";")[0];

    // Trigger a booking request to generate an automatic notification
    await fetch(`${BASE_URL}/api/booking-requests`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Cookie: notifyCookie 
      },
      body: JSON.stringify({
        type: "ROOM",
        name: "Notification Test Guest",
        mobile: notifyPhone,
        checkInDate: "2026-10-01",
        checkOutDate: "2026-10-05",
        guestsCount: 1,
        roomType: "Single Deluxe Room",
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

  it("should fetch customer notifications via GET /api/customer/notifications", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/notifications`, {
      headers: { Cookie: notifyCookie },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.notifications).toBeDefined();
    expect(data.notifications.length).toBeGreaterThanOrEqual(1);
    expect(data.unreadCount).toBeGreaterThanOrEqual(1);
  });

  it("should update notification read state in PostgreSQL via PUT /api/customer/notifications", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/notifications`, {
      method: "PUT",
      headers: { Cookie: notifyCookie },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify unread count is 0 in database
    const unreadCountInDb = await prisma.notification.count({
      where: { customerId, isRead: false },
    });
    expect(unreadCountInDb).toBe(0);
  });
});

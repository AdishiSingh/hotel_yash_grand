import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

describe("Integration: Customer Authentication & Session Pipeline", () => {
  const testPhone = `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`;
  const testEmail = `auth_test_${Date.now()}@yashgrand.com`;
  const testPassword = "RoyalIntegrationPass123!";
  let sessionCookie = "";

  afterAll(async () => {
    try {
      await prisma.customerSession.deleteMany({
        where: { customer: { phone: testPhone } },
      });
      await prisma.customer.deleteMany({
        where: { phone: testPhone },
      });
    } catch (e) {
      console.warn("Cleanup warning:", e);
    }
  });

  it("should register a new customer in PostgreSQL database", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Integration Test Guest",
        phone: testPhone,
        email: testEmail,
        password: testPassword,
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.customer).toBeDefined();
    expect(data.customer.phone).toBe(testPhone);

    // Verify record in PostgreSQL via Prisma Client
    const dbRecord = await prisma.customer.findUnique({
      where: { phone: testPhone },
    });
    expect(dbRecord).not.toBeNull();
    expect(dbRecord?.name).toBe("Integration Test Guest");
  });

  it("should reject registration with duplicate phone number (400 Bad Request)", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Duplicate Guest",
        phone: testPhone, // Same phone number
        password: testPassword,
      }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("already exists");
  });

  it("should reject login with wrong password (401 Unauthorized)", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: testPhone,
        password: "WrongPassword999!",
      }),
    });

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("should authenticate customer with correct password and issue session cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: testPhone,
        password: testPassword,
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.customer.phone).toBe(testPhone);

    // Extract HTTP-Only Cookie
    const cookieHeader = res.headers.get("set-cookie");
    expect(cookieHeader).toBeDefined();
    expect(cookieHeader).toContain("customer_token=");
    sessionCookie = cookieHeader!.split(";")[0];

    // Verify session stored in PostgreSQL
    const token = sessionCookie.replace("customer_token=", "");
    const dbSession = await prisma.customerSession.findUnique({
      where: { sessionToken: token },
    });
    expect(dbSession).not.toBeNull();
    expect(dbSession?.customerId).toBe(data.customer.id);
  });

  it("should validate active session cookie via GET /api/customer/auth/me", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/auth/me`, {
      headers: { Cookie: sessionCookie },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.authenticated).toBe(true);
    expect(data.customer.phone).toBe(testPhone);
  });

  it("should destroy session in PostgreSQL on logout (POST /api/customer/auth/logout)", async () => {
    const token = sessionCookie.replace("customer_token=", "");

    const res = await fetch(`${BASE_URL}/api/customer/auth/logout`, {
      method: "POST",
      headers: { Cookie: sessionCookie },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify session record is deleted from PostgreSQL
    const dbSession = await prisma.customerSession.findUnique({
      where: { sessionToken: token },
    });
    expect(dbSession).toBeNull();
  });
});

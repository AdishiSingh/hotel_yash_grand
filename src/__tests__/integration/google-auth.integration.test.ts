import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

describe("Integration: Google OAuth & Customer Profile Merging Pipeline", () => {
  const testGoogleEmail = `google.guest.${Math.floor(100000 + Math.random() * 900000)}@gmail.com`;
  const testGoogleName = "Lord Vishwanath Guest";
  const testGoogleAvatar = "https://lh3.googleusercontent.com/a/test-avatar-123=s96-c";
  const testGoogleId = `google-oauth-sub-${Date.now()}`;

  let createdCustomerId = "";
  let customerCookie = "";

  afterAll(async () => {
    try {
      if (createdCustomerId) {
        await prisma.account.deleteMany({ where: { customerId: createdCustomerId } });
        await prisma.customerSession.deleteMany({ where: { customerId: createdCustomerId } });
        await prisma.customer.deleteMany({ where: { id: createdCustomerId } });
      }
    } catch (e) {
      console.warn("Google Auth cleanup warning:", e);
    }
  });

  it("1. should create a new Customer profile in PostgreSQL when signing in via Google OAuth", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testGoogleEmail,
        name: testGoogleName,
        avatar: testGoogleAvatar,
        googleId: testGoogleId,
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.customer.email).toBe(testGoogleEmail);
    expect(data.customer.name).toBe(testGoogleName);
    expect(data.customer.avatar).toBe(testGoogleAvatar);
    expect(data.customer.isEmailVerified).toBe(true);

    createdCustomerId = data.customer.id;

    // Verify session cookie header
    const cookieHeader = res.headers.get("set-cookie");
    expect(cookieHeader).toContain("customer_token");
    customerCookie = cookieHeader!.split(";")[0];

    // Verify record in PostgreSQL database via Prisma
    const dbCustomer = await prisma.customer.findUnique({
      where: { id: createdCustomerId },
      include: { accounts: true },
    });
    expect(dbCustomer).not.toBeNull();
    expect(dbCustomer?.provider).toBe("google");
    expect(dbCustomer?.isEmailVerified).toBe(true);
    expect(dbCustomer?.accounts.length).toBeGreaterThan(0);
    expect(dbCustomer?.accounts[0].provider).toBe("google");
    expect(dbCustomer?.accounts[0].providerAccountId).toBe(testGoogleId);
  });

  it("2. should retrieve customer session via GET /api/customer/auth/me using Google session cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/auth/me`, {
      headers: { Cookie: customerCookie },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.authenticated).toBe(true);
    expect(data.customer.id).toBe(createdCustomerId);
    expect(data.customer.email).toBe(testGoogleEmail);
  });

  it("3. should merge Email + Password registration into the SAME customer profile (duplicate prevention)", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Merged Customer Profile Name",
        email: testGoogleEmail, // Same email as Google OAuth account!
        phone: `9198${Math.floor(10000000 + Math.random() * 90000000)}`,
        password: "Password123!",
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.customer.id).toBe(createdCustomerId); // MUST MERGE INTO SAME CUSTOMER ID!

    // Verify database record merged
    const dbCustomer = await prisma.customer.findUnique({
      where: { id: createdCustomerId },
    });
    expect(dbCustomer?.passwordHash).not.toBeNull();
    expect(dbCustomer?.provider).toContain("google");
    expect(dbCustomer?.provider).toContain("credentials");
  });

  it("4. should authenticate via Email + Password using the merged profile credentials", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: testGoogleEmail,
        password: "Password123!",
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.customer.id).toBe(createdCustomerId);
  });

  it("5. should invalidate session and remove customer_token cookie on POST /api/customer/auth/logout", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/auth/logout`, {
      method: "POST",
      headers: { Cookie: customerCookie },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    // Verify session invalidated
    const meRes = await fetch(`${BASE_URL}/api/customer/auth/me`, {
      headers: { Cookie: customerCookie },
    });
    expect(meRes.status).toBe(401);
  });
});

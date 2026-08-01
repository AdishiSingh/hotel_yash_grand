import { describe, it, expect, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

describe("Integration: Security, RBAC & Database Integrity Pipeline", () => {
  const securityPhone = `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`;
  let createdCustomerId = "";

  afterAll(async () => {
    try {
      if (createdCustomerId) {
        await prisma.customerSession.deleteMany({ where: { customerId: createdCustomerId } });
        await prisma.customer.deleteMany({ where: { id: createdCustomerId } });
      }
    } catch (e) {
      console.warn("Cleanup warning:", e);
    }
  });

  describe("Security Endpoint Interception", () => {
    it("should reject unauthenticated request to /api/customer/profile (401 Unauthorized)", async () => {
      const res = await fetch(`${BASE_URL}/api/customer/profile`);
      expect(res.status).toBe(401);
    });

    it("should reject unauthenticated request to /api/customer/bookings (401 Unauthorized)", async () => {
      const res = await fetch(`${BASE_URL}/api/customer/bookings`);
      expect(res.status).toBe(401);
    });

    it("should reject tampered or invalid session cookie (401 Unauthorized)", async () => {
      const res = await fetch(`${BASE_URL}/api/customer/profile`, {
        headers: { Cookie: "customer_token=tampered_invalid_token_12345" },
      });
      expect(res.status).toBe(401);
    });
  });

  describe("Database Constraints & Cascading Integrity", () => {
    it("should enforce Customer.phone unique constraint in PostgreSQL", async () => {
      // Create initial record directly via Prisma
      const customer = await prisma.customer.create({
        data: {
          name: "Constraint Customer",
          phone: securityPhone,
        },
      });
      createdCustomerId = customer.id;

      // Attempting to create duplicate customer with same phone should throw Prisma P2002 error
      await expect(
        prisma.customer.create({
          data: {
            name: "Duplicate Customer",
            phone: securityPhone,
          },
        })
      ).rejects.toThrow();
    });

    it("should cascade delete sessions when Customer parent record is deleted from PostgreSQL", async () => {
      const cascadePhone = `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`;
      const customer = await prisma.customer.create({
        data: {
          name: "Cascade Test Customer",
          phone: cascadePhone,
        },
      });

      const session = await prisma.customerSession.create({
        data: {
          customerId: customer.id,
          sessionToken: `cascade_token_${Date.now()}`,
          expiresAt: new Date(Date.now() + 86400000),
        },
      });

      // Delete parent Customer record
      await prisma.customer.delete({
        where: { id: customer.id },
      });

      // Verify child CustomerSession is deleted automatically via CASCADE
      const deletedSession = await prisma.customerSession.findUnique({
        where: { id: session.id },
      });
      expect(deletedSession).toBeNull();
    });
  });
});

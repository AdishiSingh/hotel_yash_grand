import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { LoyaltyService } from "@/services/loyalty.service";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

describe("Integration: Guest Loyalty Program Pipeline & Tier Progression", () => {
  let createdCustomerId = "";

  beforeAll(async () => {
    // Create test customer
    const customer = await prisma.customer.create({
      data: {
        name: "Loyalty Test Patron",
        phone: `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`,
        email: `loyaltytest_${Date.now()}@yashgrand.com`,
        totalSpent: 12000,
        visitCount: 3,
        totalNights: 6,
        loyaltyPoints: 1000,
      },
    });
    createdCustomerId = customer.id;
  });

  afterAll(async () => {
    try {
      if (createdCustomerId) await prisma.customer.deleteMany({ where: { id: createdCustomerId } });
    } catch (e) {
      console.warn("Loyalty test cleanup warning:", e);
    }
  });

  it("1. should calculate metrics (Visits, Nights, Spend, Points) and assign Gold tier", async () => {
    const profile = await LoyaltyService.getGuestLoyaltyProfile(createdCustomerId);

    expect(profile).toBeDefined();
    expect(profile.totalVisits).toBeGreaterThanOrEqual(3);
    expect(profile.totalNights).toBeGreaterThanOrEqual(6);
    expect(profile.totalSpend).toBeGreaterThanOrEqual(12000);
    expect(profile.rewardPoints).toBeGreaterThan(2000);
    expect(profile.currentTier.name).toBe("Gold");
    expect(profile.perks.length).toBeGreaterThan(0);
  });

  it("2. should correctly transition customer through Silver -> Gold -> Platinum -> Diamond tiers", () => {
    // Silver starting tier
    expect(LoyaltyService.calculateTier(1000, 1, 1)).toBe("Silver");

    // Gold tier (5,000+ points or 3+ visits)
    expect(LoyaltyService.calculateTier(6000, 3, 5)).toBe("Gold");

    // Platinum tier (15,000+ points or 7+ visits)
    expect(LoyaltyService.calculateTier(18000, 7, 12)).toBe("Platinum");

    // Diamond tier (30,000+ points or 12+ visits)
    expect(LoyaltyService.calculateTier(35000, 15, 28)).toBe("Diamond");
  });

  it("3. should allow manager to award bonus loyalty points via POST /api/management/loyalty/award", async () => {
    const res = await fetch(`${BASE_URL}/api/management/loyalty/award`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: createdCustomerId,
        points: 5000,
        reason: "VIP Gala Event Attendance Bonus",
        managerName: "General Manager",
      }),
    });

    const json = await res.json();
    if (res.status !== 200) {
      console.error("Award Loyalty Points Error:", json);
    }
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);

    const updatedProfile = await LoyaltyService.getGuestLoyaltyProfile(createdCustomerId);
    expect(updatedProfile.rewardPoints).toBeGreaterThan(7000);
  });
});

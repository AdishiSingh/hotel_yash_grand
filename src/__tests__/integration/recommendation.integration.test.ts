import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { RecommendationService } from "@/services/recommendation.service";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:3000";

describe("Integration: Customer History AI Recommendation Pipeline & Explainability Engine", () => {
  let createdCustomerId = "";

  beforeAll(async () => {
    // Create test customer with rich history in PostgreSQL
    const customer = await prisma.customer.create({
      data: {
        name: "Historical Recommendation Guest",
        phone: `91${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 8)}`,
        email: `recc_guest_${Date.now()}@yashgrand.com`,
        favouriteRoom: "Executive Suite",
        favouriteDishes: ["Galouti Kebab", "Awadhi Biryani", "Shahi Tukda"],
        totalSpent: 28000,
        visitCount: 4,
      },
    });
    createdCustomerId = customer.id;
  });

  afterAll(async () => {
    try {
      if (createdCustomerId) await prisma.customer.deleteMany({ where: { id: createdCustomerId } });
    } catch (e) {
      console.warn("Recommendation test cleanup warning:", e);
    }
  });

  it("1. should generate recommendations for Rooms, Food, Banquets, Offers, Preferred Room, Favourite Cuisine, and Return Guest Discounts", async () => {
    const recc = await RecommendationService.getPersonalizedRecommendations(createdCustomerId);

    expect(recc).toBeDefined();
    expect(recc.guestName).toBe("Historical Recommendation Guest");
    expect(recc.visitCount).toBeGreaterThanOrEqual(4);
    expect(recc.isReturningGuest).toBe(true);

    // 1. Room Recommendation
    expect(recc.roomRecommendation.preferredRoom).toBe("Executive Suite");
    expect(recc.roomRecommendation.reason).toContain("Recommended because");

    // 2. Food & Favourite Cuisine
    expect(recc.foodRecommendation.favouriteCuisine).toContain("Awadhi");
    expect(recc.foodRecommendation.recommendedDishes.length).toBeGreaterThan(0);
    expect(recc.foodRecommendation.reason).toContain("Suggested based on");

    // 3. Banquet Package Recommendation
    expect(recc.banquetRecommendation.recommendedPackage).toBeDefined();
    expect(recc.banquetRecommendation.reason).toContain("Recommended based on");

    // 4. Return Guest Discount & Offer Recommendation
    expect(recc.offerRecommendation.discountPercent).toBeGreaterThanOrEqual(10);
    expect(recc.offerRecommendation.reason).toContain("Awarded to");
  });

  it("2. should fetch recommendations via GET /api/customer/recommendations?customerId=...", async () => {
    const res = await fetch(`${BASE_URL}/api/customer/recommendations?customerId=${createdCustomerId}`);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.recommendations).toBeDefined();
    expect(json.recommendations.roomRecommendation).toBeDefined();
    expect(json.recommendations.offerRecommendation.discountPercent).toBeGreaterThanOrEqual(10);
  });
});

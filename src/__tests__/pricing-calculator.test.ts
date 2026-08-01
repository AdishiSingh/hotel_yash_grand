import { describe, it, expect } from "vitest";
import { calculateStayPricing, calculateBanquetPricing } from "@/lib/booking-utils";

describe("calculateStayPricing", () => {
  it("should calculate base tariff correctly for Single Deluxe Room (1 night, 2 adults)", () => {
    const res = calculateStayPricing("SINGLE_DELUXE", 1, 2, 0);

    expect(res.baseRatePerNight).toBe(2500);
    expect(res.totalNights).toBe(1);
    expect(res.extraGuestFee).toBe(0);
    expect(res.subtotal).toBe(2500);
    expect(res.gstAmount).toBe(450); // 18% GST of 2500
    expect(res.grandTotal).toBe(2950);
  });

  it("should calculate Family Room pricing correctly (1 night, 4 adults)", () => {
    // 1 night in Family Room (4000/night), 4 adults (2 extra adults = 2000/night)
    const res = calculateStayPricing("FAMILY_ROOM", 1, 4, 0);

    expect(res.baseRatePerNight).toBe(4000);
    expect(res.totalNights).toBe(1);
    expect(res.extraGuestFee).toBe(2000); // 2 extra adults * 1000 * 1 night
    expect(res.subtotal).toBe(6000); // 4000 + 2000
    expect(res.gstAmount).toBe(1080); // 18% of 6000
    expect(res.grandTotal).toBe(7080);
  });

  it("should apply 10% promo code discount YASH10 correctly", () => {
    const res = calculateStayPricing("SINGLE_DELUXE", 2, 2, 0, "YASH10");

    expect(res.subtotal).toBe(5000);
    expect(res.discountAmount).toBe(500); // 10% of 5000
    expect(res.gstAmount).toBe(810); // 18% of 4500
    expect(res.grandTotal).toBe(5310);
  });

  it("should apply 20% promo code discount LUXURYVIP correctly", () => {
    const res = calculateStayPricing("FAMILY_ROOM", 1, 2, 0, "LUXURYVIP");

    expect(res.subtotal).toBe(4000);
    expect(res.discountAmount).toBe(800); // 20% of 4000
    expect(res.gstAmount).toBe(576); // 18% of 3200
    expect(res.grandTotal).toBe(3776);
  });

  it("should ignore invalid promo codes gracefully", () => {
    const res = calculateStayPricing("SINGLE_DELUXE", 1, 2, 0, "INVALID_PROMO");

    expect(res.discountAmount).toBe(0);
    expect(res.grandTotal).toBe(2950);
  });
});

describe("calculateBanquetPricing", () => {
  it("should calculate Gold Package pricing correctly for 100 guests", () => {
    const res = calculateBanquetPricing("GOLD", 100);

    expect(res.perPlateRate).toBe(1200);
    expect(res.hallRentalFee).toBe(25000);
    expect(res.subtotal).toBe(145000); // (1200 * 100) + 25000
    expect(res.gstAmount).toBe(26100); // 18% of 145000
    expect(res.grandTotal).toBe(171100);
  });

  it("should calculate Royal Platinum Package pricing for 300 guests", () => {
    const res = calculateBanquetPricing("ROYAL_PLATINUM", 300);

    expect(res.perPlateRate).toBe(1800);
    expect(res.hallRentalFee).toBe(50000);
    expect(res.subtotal).toBe(590000); // (1800 * 300) + 50000
    expect(res.gstAmount).toBe(106200); // 18% of 590000
    expect(res.grandTotal).toBe(696200);
  });

  it("should enforce minimum guest count threshold (50 guests)", () => {
    const res = calculateBanquetPricing("SILVER", 10); // Below 50 threshold

    expect(res.guestsCount).toBe(50);
    expect(res.subtotal).toBe(67500); // (950 * 50) + 20000
  });
});

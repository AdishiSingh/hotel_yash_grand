import { describe, it, expect } from "vitest";
import { calculateStayPricing, calculateBanquetPricing } from "@/lib/booking-utils";

describe("calculateStayPricing", () => {
  it("should calculate base tariff correctly for Single Deluxe Room (1 night, 2 adults)", () => {
    const res = calculateStayPricing("DELUXE", 1, 2, 0);

    expect(res.baseRatePerNight).toBe(3500);
    expect(res.totalNights).toBe(1);
    expect(res.extraGuestFee).toBe(0);
    expect(res.subtotal).toBe(3500);
    expect(res.gstAmount).toBe(630); // 18% GST of 3500
    expect(res.grandTotal).toBe(4130);
  });

  it("should calculate Executive Suite pricing with extra adult surcharges", () => {
    // 3 nights in Executive Room (5500/night), 3 adults (1 extra adult = 1000/night)
    const res = calculateStayPricing("EXECUTIVE", 3, 3, 0);

    expect(res.baseRatePerNight).toBe(5500);
    expect(res.totalNights).toBe(3);
    expect(res.extraGuestFee).toBe(3000); // 1 extra adult * 1000 * 3 nights
    expect(res.subtotal).toBe(19500); // (5500 * 3) + 3000
    expect(res.gstAmount).toBe(3510); // 18% of 19500
    expect(res.grandTotal).toBe(23010);
  });

  it("should calculate Presidential Suite pricing correctly", () => {
    const res = calculateStayPricing("PRESIDENTIAL_SUITE", 1, 2, 0);
    expect(res.baseRatePerNight).toBe(18000);
    expect(res.subtotal).toBe(18000);
  });

  it("should calculate Family Suite pricing correctly", () => {
    const res = calculateStayPricing("FAMILY_ROOM", 1, 2, 0);
    expect(res.baseRatePerNight).toBe(7500);
    expect(res.subtotal).toBe(7500);
  });

  it("should apply 10% promo code discount YASH10 correctly", () => {
    const res = calculateStayPricing("DELUXE", 2, 2, 0, "YASH10");

    expect(res.subtotal).toBe(7000);
    expect(res.discountAmount).toBe(700); // 10% of 7000
    expect(res.gstAmount).toBe(1134); // 18% of 6300
    expect(res.grandTotal).toBe(7434);
  });

  it("should apply 20% promo code discount LUXURYVIP correctly", () => {
    const res = calculateStayPricing("ROYAL_SUITE", 1, 2, 0, "LUXURYVIP");

    expect(res.subtotal).toBe(9500);
    expect(res.discountAmount).toBe(1900); // 20% of 9500
    expect(res.gstAmount).toBe(1368); // 18% of 7600
    expect(res.grandTotal).toBe(8968);
  });

  it("should ignore invalid promo codes gracefully", () => {
    const res = calculateStayPricing("DELUXE", 1, 2, 0, "INVALID_PROMO");

    expect(res.discountAmount).toBe(0);
    expect(res.grandTotal).toBe(4130);
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

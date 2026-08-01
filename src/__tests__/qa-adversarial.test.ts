import { describe, it, expect } from "vitest";
import { 
  validateBookingDates, 
  calculateStayPricing, 
  calculateBanquetPricing, 
  sanitizePhoneNumber, 
  computeTimelineStep 
} from "@/lib/booking-utils";
import { hashPassword, comparePassword } from "@/lib/customer-auth";

describe("QA Adversarial & Boundary Testing — Booking & Auth Utilities", () => {
  
  // 1. DATE VALIDATION ADVERSARIAL TESTS
  describe("validateBookingDates — Edge Cases & Null/Undefined", () => {
    it("should handle null and undefined date parameters gracefully", () => {
      expect(validateBookingDates(null as any, "2026-08-15").isValid).toBe(false);
      expect(validateBookingDates("2026-08-10", undefined as any).isValid).toBe(false);
      expect(validateBookingDates(null as any, undefined as any).isValid).toBe(false);
    });

    it("should reject malicious SQL injection / XSS date strings", () => {
      const res1 = validateBookingDates("2026-08-10' OR 1=1--", "2026-08-15");
      expect(res1.isValid).toBe(false);

      const res2 = validateBookingDates("<script>alert(1)</script>", "2026-08-15");
      expect(res2.isValid).toBe(false);
    });

    it("should handle leap year boundaries correctly (2028 is a leap year)", () => {
      const res = validateBookingDates("2028-02-28", "2028-03-01");
      expect(res.isValid).toBe(true);
      expect(res.nights).toBe(2);
    });

    it("should handle extreme future year bounds gracefully", () => {
      const res = validateBookingDates("2099-12-01", "2099-12-05");
      expect(res.isValid).toBe(true);
      expect(res.nights).toBe(4);
    });
  });

  // 2. PRICING CALCULATOR ADVERSARIAL TESTS
  describe("calculateStayPricing — Invalid Types, Negative & Large Values", () => {
    it("should handle null, undefined, or empty roomType by falling back to base rate", () => {
      const resNull = calculateStayPricing(null as any, 1, 2, 0);
      expect(resNull.baseRatePerNight).toBe(3500);

      const resEmpty = calculateStayPricing("", 1, 2, 0);
      expect(resEmpty.baseRatePerNight).toBe(3500);
    });

    it("should clamp negative nights or 0 nights to 1 night minimum", () => {
      const resZero = calculateStayPricing("DELUXE", 0, 2, 0);
      expect(resZero.totalNights).toBe(1);

      const resNeg = calculateStayPricing("DELUXE", -5, 2, 0);
      expect(resNeg.totalNights).toBe(1);
    });

    it("should handle negative adults count without producing negative surcharges", () => {
      const res = calculateStayPricing("DELUXE", 2, -10, 0);
      expect(res.extraGuestFee).toBe(0);
      expect(res.subtotal).toBe(7000);
    });

    it("should support lowercase promo codes yash10 and luxuryvip", () => {
      const res1 = calculateStayPricing("DELUXE", 1, 2, 0, "yash10");
      expect(res1.discountAmount).toBe(350);

      const res2 = calculateStayPricing("DELUXE", 1, 2, 0, "luxuryvip");
      expect(res2.discountAmount).toBe(700);
    });

    it("should handle large night values safely without numeric overflow", () => {
      const resLarge = calculateStayPricing("PRESIDENTIAL", 100, 2, 0);
      expect(resLarge.subtotal).toBe(1800000);
      expect(resLarge.grandTotal).toBe(2124000);
    });
  });

  // 3. BANQUET PRICING ADVERSARIAL TESTS
  describe("calculateBanquetPricing — Invalid Packages & Large Guest Counts", () => {
    it("should handle invalid package enum gracefully by defaulting to Gold per-plate rate", () => {
      const res = calculateBanquetPricing("INVALID_PACKAGE" as any, 100);
      expect(res.perPlateRate).toBe(1200);
    });

    it("should handle large guest counts (e.g. 5,000 guests) without failing", () => {
      const res = calculateBanquetPricing("ROYAL_PLATINUM", 5000);
      expect(res.subtotal).toBe(9050000); // (1800 * 5000) + 50000
    });
  });

  // 4. PHONE SANITIZER ADVERSARIAL TESTS
  describe("sanitizePhoneNumber — Edge Cases, Whitespace & Strings", () => {
    it("should handle null and undefined phone inputs gracefully", () => {
      expect(sanitizePhoneNumber(null as any).isValid).toBe(false);
      expect(sanitizePhoneNumber(undefined as any).isValid).toBe(false);
    });

    it("should strip spaces and leading/trailing whitespace correctly", () => {
      const res = sanitizePhoneNumber("   +91 91510 88115   ");
      expect(res.isValid).toBe(true);
      expect(res.cleanPhone).toBe("9151088115");
    });

    it("should reject phone numbers containing letters embedded inside", () => {
      const res = sanitizePhoneNumber("91510abc15");
      expect(res.isValid).toBe(false);
    });

    it("should handle extremely long string inputs safely", () => {
      const longInput = "9151088115" + "0".repeat(500);
      const res = sanitizePhoneNumber(longInput);
      expect(res.isValid).toBe(false);
    });
  });

  // 5. TIMELINE MAPPER ADVERSARIAL TESTS
  describe("computeTimelineStep — Case Insensitivity & Negative Logs", () => {
    it("should handle mixed-case status strings correctly (case-insensitive)", () => {
      expect(computeTimelineStep("cHeCkEd_In")).toBe(8);
      expect(computeTimelineStep("cOnFiRmEd")).toBe(4);
    });

    it("should handle negative logs count gracefully", () => {
      expect(computeTimelineStep("SUBMITTED", -5)).toBe(1);
    });
  });

  // 6. AUTHENTICATION HELPERS ADVERSARIAL TESTS
  describe("Customer Auth Helpers — Null/Empty & Extreme Passwords", () => {
    it("should return false when comparing null or undefined passwords against hash", async () => {
      const hash = await hashPassword("ValidPassword123!");

      expect(await comparePassword(null as any, hash)).toBe(false);
      expect(await comparePassword(undefined as any, hash)).toBe(false);
    });

    it("should handle extremely long passwords safely", async () => {
      const longPassword = "A".repeat(500) + "1!";
      const hash = await hashPassword(longPassword);

      expect(await comparePassword(longPassword, hash)).toBe(true);
      expect(await comparePassword("Wrong", hash)).toBe(false);
    });
  });
});

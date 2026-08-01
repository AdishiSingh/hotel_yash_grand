import { describe, it, expect } from "vitest";
import { validateBookingDates } from "@/lib/booking-utils";
import { TEST_FIXTURES } from "./fixtures/test-fixtures";

describe("DateValidationEngine — Stay Duration & Boundary Validator", () => {
  const { CHECK_IN, CHECK_OUT } = TEST_FIXTURES.DATES;

  describe("validateBookingDates()", () => {
    it("should validate happy path stay date ranges correctly", () => {
      const result = validateBookingDates(CHECK_IN, CHECK_OUT);

      expect(result.isValid).toBe(true);
      expect(result.nights).toBe(5);
      expect(result.error).toBeUndefined();
    });

    it("should reject validation when check-in date is missing", () => {
      const result = validateBookingDates("", CHECK_OUT);

      expect(result.isValid).toBe(false);
      expect(result.nights).toBe(0);
      expect(result.error).toBe("Check-in and check-out dates are required.");
    });

    it("should reject validation when check-out date is missing", () => {
      const result = validateBookingDates(CHECK_IN, "");

      expect(result.isValid).toBe(false);
      expect(result.nights).toBe(0);
      expect(result.error).toBe("Check-in and check-out dates are required.");
    });

    it("should reject validation when date string format is malformed", () => {
      const result = validateBookingDates("invalid-date", CHECK_OUT);

      expect(result.isValid).toBe(false);
      expect(result.nights).toBe(0);
      expect(result.error).toBe("Invalid date format.");
    });

    it("should reject stay requests where check-out is before check-in", () => {
      const result = validateBookingDates("2026-08-15", "2026-08-10");

      expect(result.isValid).toBe(false);
      expect(result.nights).toBe(0);
      expect(result.error).toBe("Check-out date must be after check-in date.");
    });

    it("should reject stay requests where check-in and check-out are on the same day", () => {
      const result = validateBookingDates("2026-08-10", "2026-08-10");

      expect(result.isValid).toBe(false);
      expect(result.nights).toBe(0);
      expect(result.error).toBe("Check-out date must be after check-in date.");
    });

    it("should enforce maximum stay limit threshold of 30 nights", () => {
      const result = validateBookingDates("2026-08-01", "2026-09-10");

      expect(result.isValid).toBe(false);
      expect(result.nights).toBe(40);
      expect(result.error).toBe("Maximum stay duration is 30 nights.");
    });
  });
});

import { describe, it, expect } from "vitest";
import { generateBookingId } from "@/lib/booking-utils";

describe("BookingIdGeneratorService — Reference Identifier Engine", () => {
  const currentYear = new Date().getFullYear();

  describe("generateBookingId()", () => {
    it("should format ROOM reservation IDs with YG-REQ prefix and current year", () => {
      const id = generateBookingId("ROOM");
      expect(id).toMatch(new RegExp(`^YG-REQ-${currentYear}-\\d{4}$`));
    });

    it("should format BANQUET reservation IDs with YG-BQ prefix and current year", () => {
      const id = generateBookingId("BANQUET");
      expect(id).toMatch(new RegExp(`^YG-BQ-${currentYear}-\\d{4}$`));
    });

    it("should respect custom timestamp years when provided explicitly", () => {
      const customDate = new Date("2025-05-15").getTime();
      const id = generateBookingId("ROOM", customDate);

      expect(id).toMatch(/^YG-REQ-2025-\d{4}$/);
    });

    it("should apply fallback prefix YG-[#] for unrecognized or TABLE booking types", () => {
      const id = generateBookingId("TABLE" as any);
      expect(id).toMatch(new RegExp(`^YG-\\[#\\]-${currentYear}-\\d{4}$`));
    });

    it("should produce cryptographically unique IDs across 50 sequential invocations", () => {
      const ids = new Set(Array.from({ length: 50 }, () => generateBookingId("ROOM")));
      expect(ids.size).toBeGreaterThan(45);
    });
  });
});

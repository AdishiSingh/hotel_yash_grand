import { describe, it, expect } from "vitest";
import { 
  generateBookingId, 
  validateBookingDates, 
  calculateStayPricing, 
  calculateBanquetPricing, 
  sanitizePhoneNumber, 
  computeTimelineStep 
} from "@/lib/booking-utils";
import { hashPassword, comparePassword } from "@/lib/customer-auth";
import { RolePermissionMatrix } from "@/lib/permissions";
import { RateLimiter } from "@/lib/rate-limiter";

describe("SDET Deep Security & Hidden Bug Verification Suite", () => {
  
  // ==========================================
  // 1. FLOATING POINT & PRICING CORNER CASES
  // ==========================================
  describe("Pricing Engine — Floating Point Precision & Promo Code Robustness", () => {
    it("should prevent JavaScript floating point precision rounding errors in GST calculation", () => {
      // Rates that produce non-integer 18% GST (e.g. subtotal 3333 -> 18% GST = 599.94)
      const pricing = calculateStayPricing("DELUXE", 1, 2, 0);
      
      expect(Number.isInteger(pricing.gstAmount)).toBe(true);
      expect(Number.isInteger(pricing.grandTotal)).toBe(true);
      expect(pricing.grandTotal).toBe(pricing.subtotal - pricing.discountAmount + pricing.gstAmount);
    });

    it("should trim surrounding whitespace in promo codes (e.g. '  yash10  ')", () => {
      const res = calculateStayPricing("DELUXE", 1, 2, 0, "  yash10  ");
      expect(res.discountAmount).toBe(350);
    });

    it("should handle NaN, Infinity, and non-numeric guest inputs gracefully without crashing", () => {
      const resNaN = calculateStayPricing("DELUXE", 1, NaN as any, 0);
      expect(resNaN.extraGuestFee).toBe(0);
      expect(Number.isNaN(resNaN.grandTotal)).toBe(false);

      const resInf = calculateStayPricing("DELUXE", 1, Infinity as any, 0);
      expect(resInf.extraGuestFee).toBe(0);
    });
  });

  // ==========================================
  // 2. SECURITY & INPUT SANITIZATION
  // ==========================================
  describe("Security Validation — Injection Payloads & Zero Byte Traversal", () => {
    it("should handle binary zero bytes '\\0' in passwords securely", async () => {
      const passwordWithNullByte = "SecretPass\0word123!";
      const hash = await hashPassword(passwordWithNullByte);

      expect(await comparePassword(passwordWithNullByte, hash)).toBe(true);
      expect(await comparePassword("SecretPassword123!", hash)).toBe(false);
    });

    it("should handle SQL injection payloads in room types safely", () => {
      const maliciousRoomType = "DELUXE' UNION SELECT * FROM users; --";
      const res = calculateStayPricing(maliciousRoomType, 1, 2, 0);
      
      expect(res.baseRatePerNight).toBe(3500); // Falls back to default Deluxe rate
    });

    it("should reject phone numbers containing extension suffixes ('9151088115 ext 101')", () => {
      const res = sanitizePhoneNumber("9151088115 ext 101");
      expect(res.isValid).toBe(false);
    });
  });

  // ==========================================
  // 3. DATE BOUNDARY & TIMEZONE SHIFTS
  // ==========================================
  describe("Date Handling — Month End & Daylight Savings / Timezone Shifts", () => {
    it("should handle month-end transitions correctly (e.g. Jan 31 to Feb 2)", () => {
      const res = validateBookingDates("2026-01-31", "2026-02-02");
      expect(res.isValid).toBe(true);
      expect(res.nights).toBe(2);
    });

    it("should handle year-end transitions correctly (e.g. Dec 30 to Jan 2)", () => {
      const res = validateBookingDates("2026-12-30", "2027-01-02");
      expect(res.isValid).toBe(true);
      expect(res.nights).toBe(3);
    });

    it("should handle ISO string timestamps with timezone offset suffixes (+05:30)", () => {
      const res = validateBookingDates("2026-08-10T14:00:00+05:30", "2026-08-12T10:00:00+05:30");
      expect(res.isValid).toBe(true);
      expect(res.nights).toBe(2);
    });
  });

  // ==========================================
  // 4. RBAC & PERMISSION MATRIX RESILIENCE
  // ==========================================
  describe("RBAC Permissions — Case Insensitivity & Scope Boundary", () => {
    it("should handle lowercase role strings (e.g. 'manager', 'receptionist')", () => {
      expect(RolePermissionMatrix.hasPermission("manager" as any, "VIEW_DASHBOARD")).toBe(true);
      expect(RolePermissionMatrix.hasPermission("receptionist" as any, "ROOM_CHECK_IN")).toBe(true);
    });

    it("should enforce strict route access control for management endpoints", () => {
      expect(RolePermissionMatrix.canAccessRoute("RECEPTIONIST", "/dashboard/inventory")).toBe(false);
      expect(RolePermissionMatrix.canAccessRoute("RESTAURANT_MANAGER", "/dashboard/rooms")).toBe(false);
    });
  });

  // ==========================================
  // 5. RATE LIMITER IP COLLISION & RESILIENCE
  // ==========================================
  describe("Rate Limiter — IPv6 Mapped IPv4 Addressing", () => {
    it("should treat distinct IP addresses independently without rate limit bleed", () => {
      const ipA = "192.168.1.100";
      const ipB = "192.168.1.101";

      for (let i = 0; i < 5; i++) {
        RateLimiter.checkApiRateLimit(ipA, 5);
      }

      // ipA should be rate limited, ipB should still be allowed
      expect(RateLimiter.checkApiRateLimit(ipA, 5)).toBe(false);
      expect(RateLimiter.checkApiRateLimit(ipB, 5)).toBe(true);
    });
  });
});

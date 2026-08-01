import { describe, it, expect } from "vitest";
import { sanitizePhoneNumber } from "@/lib/booking-utils";
import { TEST_FIXTURES } from "./fixtures/test-fixtures";

describe("PhoneSanitizerService — Indian Mobile Number Normalizer", () => {
  const { 
    STANDARD_10_DIGIT, 
    WITH_PLUS_91, 
    WITH_ZERO_PREFIX, 
    WITH_SYMBOLS, 
    INVALID_SHORT, 
    INVALID_PREFIX 
  } = TEST_FIXTURES.PHONE;

  it("should validate standard 10-digit Indian phone numbers starting with 6-9", () => {
    const res = sanitizePhoneNumber(STANDARD_10_DIGIT);
    expect(res.isValid).toBe(true);
    expect(res.cleanPhone).toBe(STANDARD_10_DIGIT);
  });

  it("should sanitize +91 international prefix formatting", () => {
    const res = sanitizePhoneNumber(WITH_PLUS_91);
    expect(res.isValid).toBe(true);
    expect(res.cleanPhone).toBe(STANDARD_10_DIGIT);
  });

  it("should sanitize 0-prefixed local numbers", () => {
    const res = sanitizePhoneNumber(WITH_ZERO_PREFIX);
    expect(res.isValid).toBe(true);
    expect(res.cleanPhone).toBe(STANDARD_10_DIGIT);
  });

  it("should strip formatting spaces, hyphens, and parentheses", () => {
    const res = sanitizePhoneNumber(WITH_SYMBOLS);
    expect(res.isValid).toBe(true);
    expect(res.cleanPhone).toBe(STANDARD_10_DIGIT);
  });

  it("should reject short phone numbers (< 10 digits)", () => {
    const res = sanitizePhoneNumber(INVALID_SHORT);
    expect(res.isValid).toBe(false);
  });

  it("should reject numbers starting with invalid digits (1-5)", () => {
    const res = sanitizePhoneNumber(INVALID_PREFIX);
    expect(res.isValid).toBe(false);
  });

  it("should handle empty or null string gracefully", () => {
    expect(sanitizePhoneNumber("").isValid).toBe(false);
    expect(sanitizePhoneNumber(null as any).isValid).toBe(false);
  });
});

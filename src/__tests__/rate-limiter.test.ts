import { describe, it, expect } from "vitest";
import { RateLimiter } from "@/lib/rate-limiter";

describe("RateLimiter.checkApiRateLimit", () => {
  it("should allow requests within limit threshold", () => {
    const testIp = `192.168.1.${Math.floor(Math.random() * 200) + 10}`;

    expect(RateLimiter.checkApiRateLimit(testIp, 5)).toBe(true);
    expect(RateLimiter.checkApiRateLimit(testIp, 5)).toBe(true);
    expect(RateLimiter.checkApiRateLimit(testIp, 5)).toBe(true);
  });

  it("should reject requests exceeding limit threshold", () => {
    const testIp = `10.0.0.${Math.floor(Math.random() * 200) + 10}`;

    // Exhaust 3 allowed requests
    RateLimiter.checkApiRateLimit(testIp, 3);
    RateLimiter.checkApiRateLimit(testIp, 3);
    RateLimiter.checkApiRateLimit(testIp, 3);

    // 4th request should be blocked
    const isAllowed = RateLimiter.checkApiRateLimit(testIp, 3);
    expect(isAllowed).toBe(false);
  });
});

describe("RateLimiter.checkLoginAttempts", () => {
  it("should allow login attempts for IP with no failed history", () => {
    const testIp = `172.16.0.${Math.floor(Math.random() * 200) + 10}`;

    const res = RateLimiter.checkLoginAttempts(testIp);
    expect(res.allowed).toBe(true);
    expect(res.remainingAttempts).toBe(5);
  });
});

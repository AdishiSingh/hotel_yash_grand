import { describe, it, expect } from "vitest";
import { generateSecureToken } from "@/lib/table-security";

describe("generateSecureToken", () => {
  it("should generate a 48-character hex string (24 random bytes)", () => {
    const token = generateSecureToken();

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.length).toBe(48);
    expect(token).toMatch(/^[a-f0-9]{48}$/);
  });

  it("should generate cryptographically unique tokens across calls", () => {
    const token1 = generateSecureToken();
    const token2 = generateSecureToken();

    expect(token1).not.toBe(token2);
  });
});

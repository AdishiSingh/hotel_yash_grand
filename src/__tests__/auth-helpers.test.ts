import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "@/lib/customer-auth";
import { TEST_FIXTURES } from "./fixtures/test-fixtures";

describe("CustomerAuthService — Password Security & Hashing", () => {
  const { PASSWORD, WRONG_PASSWORD } = TEST_FIXTURES.GUEST;

  describe("hashPassword()", () => {
    it("should generate a valid bcrypt salt hash for valid passwords", async () => {
      const hash = await hashPassword(PASSWORD);

      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(20);
      expect(hash).not.toEqual(PASSWORD);
    });

    it("should throw a explicit error when hashing empty or non-string inputs", async () => {
      await expect(hashPassword("")).rejects.toThrow("Password must be a non-empty string.");
      await expect(hashPassword(null as any)).rejects.toThrow("Password must be a non-empty string.");
    });
  });

  describe("comparePassword()", () => {
    it("should return true when comparing correct password against hash", async () => {
      const hash = await hashPassword(PASSWORD);
      const isValid = await comparePassword(PASSWORD, hash);

      expect(isValid).toBe(true);
    });

    it("should return false when comparing incorrect password against hash", async () => {
      const hash = await hashPassword(PASSWORD);
      const isValid = await comparePassword(WRONG_PASSWORD, hash);

      expect(isValid).toBe(false);
    });

    it("should safely return false for null, undefined, or empty password parameters", async () => {
      const hash = await hashPassword(PASSWORD);

      expect(await comparePassword("", hash)).toBe(false);
      expect(await comparePassword(null as any, hash)).toBe(false);
      expect(await comparePassword(undefined as any, hash)).toBe(false);
    });
  });
});

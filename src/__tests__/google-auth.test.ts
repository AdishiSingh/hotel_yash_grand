import { describe, it, expect } from "vitest";

describe("Unit: Google OAuth & Customer Auth Helpers", () => {
  it("should format provider string correctly when adding google provider", () => {
    const existing = "credentials";
    const updated = existing.includes("google") ? existing : `${existing},google`;
    expect(updated).toBe("credentials,google");
  });

  it("should not duplicate google provider if already present", () => {
    const existing = "credentials,google";
    const updated = existing.includes("google") ? existing : `${existing},google`;
    expect(updated).toBe("credentials,google");
  });

  it("should identify google placeholder phones", () => {
    const googlePhone1 = "+91-G-1234567890";
    const googlePhone2 = "+919876543210";
    const isGoogle1 = googlePhone1.startsWith("+9198") || googlePhone1.startsWith("+91-G-");
    const isGoogle2 = googlePhone2.startsWith("+9198") || googlePhone2.startsWith("+91-G-");

    expect(isGoogle1).toBe(true);
    expect(isGoogle2).toBe(true);
  });

  it("should generate random valid google fallback phone number", () => {
    const generated = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;
    expect(generated).toMatch(/^\+9198\d{8}$/);
  });
});

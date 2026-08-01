import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("should merge basic class names correctly", () => {
    const result = cn("bg-black", "text-white", "p-4");
    expect(result).toBe("bg-black text-white p-4");
  });

  it("should resolve conflicting Tailwind CSS classes", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("should handle conditional class expressions gracefully", () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn(
      "text-xs font-bold",
      isActive && "bg-gold text-black",
      isDisabled && "opacity-50 cursor-not-allowed"
    );

    expect(result).toBe("text-xs font-bold bg-gold text-black");
  });

  it("should handle null, undefined, and boolean values safely", () => {
    const result = cn("px-4", null, undefined, false, "py-2");
    expect(result).toBe("px-4 py-2");
  });
});

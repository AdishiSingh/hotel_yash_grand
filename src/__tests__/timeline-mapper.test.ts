import { describe, it, expect } from "vitest";
import { computeTimelineStep } from "@/lib/booking-utils";

describe("computeTimelineStep", () => {
  it("should map SUBMITTED or unknown status to Step 1", () => {
    expect(computeTimelineStep("SUBMITTED")).toBe(1);
    expect(computeTimelineStep("PENDING")).toBe(1);
    expect(computeTimelineStep("UNKNOWN_STATUS")).toBe(1);
    expect(computeTimelineStep("")).toBe(1);
  });

  it("should map IN_PROGRESS / ASSIGNED to Step 2 (Manager Reviewing)", () => {
    expect(computeTimelineStep("IN_PROGRESS")).toBe(2);
    expect(computeTimelineStep("ASSIGNED")).toBe(2);
  });

  it("should map CONTACTED or logs > 0 to Step 3 (Manager Contacted)", () => {
    expect(computeTimelineStep("CONTACTED")).toBe(3);
    expect(computeTimelineStep("PENDING", 1)).toBe(3);
  });

  it("should map CONFIRMED / APPROVED / BOOKED to Step 4", () => {
    expect(computeTimelineStep("CONFIRMED")).toBe(4);
    expect(computeTimelineStep("APPROVED")).toBe(4);
    expect(computeTimelineStep("BOOKED")).toBe(4);
  });

  it("should map PAYMENT_PENDING to Step 5", () => {
    expect(computeTimelineStep("PAYMENT_PENDING")).toBe(5);
  });

  it("should map PAID / PAYMENT_VERIFIED to Step 6", () => {
    expect(computeTimelineStep("PAID")).toBe(6);
    expect(computeTimelineStep("PAYMENT_VERIFIED")).toBe(6);
  });

  it("should map READY / ROOM_READY to Step 7", () => {
    expect(computeTimelineStep("READY")).toBe(7);
    expect(computeTimelineStep("ROOM_READY")).toBe(7);
  });

  it("should map CHECKED_IN to Step 8", () => {
    expect(computeTimelineStep("CHECKED_IN")).toBe(8);
  });

  it("should map CHECKED_OUT / COMPLETED to Step 9", () => {
    expect(computeTimelineStep("CHECKED_OUT")).toBe(9);
    expect(computeTimelineStep("COMPLETED")).toBe(9);
  });
});

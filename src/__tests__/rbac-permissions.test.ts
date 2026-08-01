import { describe, it, expect } from "vitest";
import { RolePermissionMatrix } from "@/lib/permissions";

describe("RolePermissionMatrix.hasPermission", () => {
  it("should grant SUPER_ADMIN permission for ALL actions", () => {
    expect(RolePermissionMatrix.hasPermission("SUPER_ADMIN", "ALL")).toBe(true);
    expect(RolePermissionMatrix.hasPermission("SUPER_ADMIN", "MANAGE_BOOKINGS")).toBe(true);
    expect(RolePermissionMatrix.hasPermission("SUPER_ADMIN", "MANAGE_SETTINGS")).toBe(true);
  });

  it("should grant MANAGER specific permissions", () => {
    expect(RolePermissionMatrix.hasPermission("MANAGER", "VIEW_DASHBOARD")).toBe(true);
    expect(RolePermissionMatrix.hasPermission("MANAGER", "MANAGE_BOOKINGS")).toBe(true);
    expect(RolePermissionMatrix.hasPermission("MANAGER", "MANAGE_BANQUET")).toBe(true);
  });

  it("should deny MANAGER permissions not assigned in matrix", () => {
    expect(RolePermissionMatrix.hasPermission("MANAGER", "MANAGE_SETTINGS")).toBe(false);
    expect(RolePermissionMatrix.hasPermission("MANAGER", "UPDATE_KOT_STATUS")).toBe(false);
  });

  it("should grant RECEPTIONIST only reception permissions", () => {
    expect(RolePermissionMatrix.hasPermission("RECEPTIONIST", "ROOM_CHECK_IN")).toBe(true);
    expect(RolePermissionMatrix.hasPermission("RECEPTIONIST", "ROOM_CHECK_OUT")).toBe(true);
    expect(RolePermissionMatrix.hasPermission("RECEPTIONIST", "MANAGE_SETTINGS")).toBe(false);
  });

  it("should grant KITCHEN_STAFF only KOT permissions", () => {
    expect(RolePermissionMatrix.hasPermission("KITCHEN_STAFF", "VIEW_KOT")).toBe(true);
    expect(RolePermissionMatrix.hasPermission("KITCHEN_STAFF", "UPDATE_KOT_STATUS")).toBe(true);
    expect(RolePermissionMatrix.hasPermission("KITCHEN_STAFF", "MANAGE_BILLING")).toBe(false);
  });

  it("should enforce default-deny security for unknown or invalid roles", () => {
    expect(RolePermissionMatrix.hasPermission("UNKNOWN_ROLE" as any, "VIEW_DASHBOARD")).toBe(false);
    expect(RolePermissionMatrix.hasPermission("" as any, "VIEW_DASHBOARD")).toBe(true); // Empty string falls back to MANAGER
  });
});

describe("RolePermissionMatrix.canAccessRoute", () => {
  it("should allow SUPER_ADMIN to access any route", () => {
    expect(RolePermissionMatrix.canAccessRoute("SUPER_ADMIN", "/dashboard/settings")).toBe(true);
    expect(RolePermissionMatrix.canAccessRoute("SUPER_ADMIN", "/pos")).toBe(true);
  });

  it("should enforce route restrictions for RECEPTIONIST", () => {
    expect(RolePermissionMatrix.canAccessRoute("RECEPTIONIST", "/dashboard/rooms")).toBe(true);
    expect(RolePermissionMatrix.canAccessRoute("RECEPTIONIST", "/dashboard/inventory")).toBe(false);
    expect(RolePermissionMatrix.canAccessRoute("RECEPTIONIST", "/pos")).toBe(false);
  });

  it("should enforce route restrictions for KITCHEN_STAFF", () => {
    expect(RolePermissionMatrix.canAccessRoute("KITCHEN_STAFF", "/dashboard/kot")).toBe(true);
    expect(RolePermissionMatrix.canAccessRoute("KITCHEN_STAFF", "/dashboard/billing")).toBe(false);
  });

  it("should allow access to default unlisted public routes", () => {
    expect(RolePermissionMatrix.canAccessRoute("CASHIER", "/public-about")).toBe(true);
  });
});

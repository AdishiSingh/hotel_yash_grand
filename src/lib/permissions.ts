import { Role } from "@prisma/client";

export type { Role };

export type Permission =
  | "ALL"
  | "VIEW_DASHBOARD"
  | "MANAGE_BOOKINGS"
  | "ROOM_CHECK_IN"
  | "ROOM_CHECK_OUT"
  | "MANAGE_MENU"
  | "MANAGE_ORDERS"
  | "VIEW_KOT"
  | "UPDATE_KOT_STATUS"
  | "ACCESS_POS"
  | "MANAGE_BILLING"
  | "MANAGE_PAYMENTS"
  | "MANAGE_INVENTORY"
  | "VIEW_CRM"
  | "VIEW_ANALYTICS"
  | "VIEW_REPORTS"
  | "MANAGE_BANQUET"
  | "MANAGE_SETTINGS";

/**
 * Enterprise RBAC Permission Matrix mapping each role to allowed permissions
 */
export class RolePermissionMatrix {
  private static matrix: Record<Role, Permission[]> = {
    SUPER_ADMIN: [
      "ALL",
      "VIEW_DASHBOARD",
      "MANAGE_BOOKINGS",
      "ROOM_CHECK_IN",
      "ROOM_CHECK_OUT",
      "MANAGE_MENU",
      "MANAGE_ORDERS",
      "VIEW_KOT",
      "UPDATE_KOT_STATUS",
      "ACCESS_POS",
      "MANAGE_BILLING",
      "MANAGE_PAYMENTS",
      "MANAGE_INVENTORY",
      "VIEW_CRM",
      "VIEW_ANALYTICS",
      "VIEW_REPORTS",
      "MANAGE_BANQUET",
      "MANAGE_SETTINGS",
    ],
    MANAGER: [
      "VIEW_DASHBOARD",
      "MANAGE_BOOKINGS",
      "ROOM_CHECK_IN",
      "ROOM_CHECK_OUT",
      "VIEW_CRM",
      "VIEW_ANALYTICS",
      "VIEW_REPORTS",
      "MANAGE_BANQUET",
    ],
    RECEPTIONIST: [
      "MANAGE_BOOKINGS",
      "ROOM_CHECK_IN",
      "ROOM_CHECK_OUT",
      "VIEW_CRM",
    ],
    RESTAURANT_MANAGER: [
      "MANAGE_MENU",
      "MANAGE_ORDERS",
      "VIEW_KOT",
      "MANAGE_INVENTORY",
      "ACCESS_POS",
    ],
    KITCHEN_STAFF: [
      "VIEW_KOT",
      "UPDATE_KOT_STATUS",
      "MANAGE_ORDERS",
    ],
    CASHIER: [
      "ACCESS_POS",
      "MANAGE_BILLING",
      "MANAGE_PAYMENTS",
      "MANAGE_ORDERS",
    ],
    ACCOUNTANT: [
      "MANAGE_BILLING",
      "MANAGE_PAYMENTS",
      "VIEW_ANALYTICS",
      "VIEW_REPORTS",
    ],
  };

  /**
   * Check if a specific role possesses a permission
   */
  public static hasPermission(role: Role | string, permission: Permission): boolean {
    const normRole = (role || "MANAGER").toString().toUpperCase() as Role;
    const allowed = this.matrix[normRole] || [];
    return allowed.includes("ALL") || allowed.includes(permission);
  }

  /**
   * Check if a role can access a specific route
   */
  public static canAccessRoute(role: Role | string, pathname: string): boolean {
    const normRole = (role || "MANAGER").toString().toUpperCase() as Role;
    const allowed = this.matrix[normRole] || [];

    if (allowed.includes("ALL")) return true;

    if (pathname.startsWith("/dashboard/orders")) return allowed.includes("MANAGE_ORDERS");
    if (pathname.startsWith("/dashboard/kot")) return allowed.includes("VIEW_KOT");
    if (pathname.startsWith("/dashboard/menu")) return allowed.includes("MANAGE_MENU");
    if (pathname.startsWith("/dashboard/rooms")) return allowed.includes("MANAGE_BOOKINGS") || allowed.includes("ROOM_CHECK_IN");
    if (pathname.startsWith("/dashboard/banquet")) return allowed.includes("MANAGE_BANQUET");
    if (pathname.startsWith("/dashboard/crm")) return allowed.includes("VIEW_CRM");
    if (pathname.startsWith("/dashboard/billing")) return allowed.includes("MANAGE_BILLING");
    if (pathname.startsWith("/dashboard/analytics")) return allowed.includes("VIEW_ANALYTICS") || allowed.includes("VIEW_REPORTS");
    if (pathname.startsWith("/dashboard/inventory")) return allowed.includes("MANAGE_INVENTORY");
    if (pathname.startsWith("/pos")) return allowed.includes("ACCESS_POS");
    if (pathname === "/dashboard") return allowed.includes("VIEW_DASHBOARD");

    return true; // default public routes
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Role, RolePermissionMatrix, Permission } from "@/lib/permissions";

export async function authorizeApiRequest(
  requiredPermission?: Permission,
  allowedRoles?: Role[]
) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Authentication session required" },
      { status: 401 }
    );
  }

  const userRole = ((session.user as any).role as Role) || "MANAGER";

  if (userRole === "SUPER_ADMIN") {
    return null; // Owner has full access
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return NextResponse.json(
      { success: false, error: `Forbidden: Role '${userRole}' cannot access this endpoint` },
      { status: 403 }
    );
  }

  if (requiredPermission && !RolePermissionMatrix.hasPermission(userRole, requiredPermission)) {
    return NextResponse.json(
      { success: false, error: `Forbidden: Permission '${requiredPermission}' required` },
      { status: 403 }
    );
  }

  return null; // Authorized
}

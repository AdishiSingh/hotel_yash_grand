import { NextRequest, NextResponse } from "next/server";
import { MANAGEMENT_COOKIE_NAME, revokeSession } from "@/lib/management-auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(MANAGEMENT_COOKIE_NAME)?.value;
    if (token) {
      await revokeSession(token);
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    response.cookies.set(MANAGEMENT_COOKIE_NAME, "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/management/auth/logout error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to logout." },
      { status: 500 }
    );
  }
}

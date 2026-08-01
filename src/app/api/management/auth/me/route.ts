import { NextRequest, NextResponse } from "next/server";
import { getManagementSession, MANAGEMENT_COOKIE_NAME } from "@/lib/management-auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(MANAGEMENT_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthenticated." },
        { status: 401 }
      );
    }

    const sessionData = await getManagementSession(token);
    if (!sessionData) {
      return NextResponse.json(
        { success: false, error: "Session expired or invalid." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: sessionData.user,
    });
  } catch (error: any) {
    console.error("GET /api/management/auth/me error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch session." },
      { status: 500 }
    );
  }
}

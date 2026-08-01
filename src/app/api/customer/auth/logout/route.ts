import { NextRequest, NextResponse } from "next/server";
import { deleteCustomerSession, CUSTOMER_COOKIE_NAME } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
    if (token) {
      await deleteCustomerSession(token);
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    response.cookies.set(CUSTOMER_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/customer/auth/logout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log out." },
      { status: 500 }
    );
  }
}

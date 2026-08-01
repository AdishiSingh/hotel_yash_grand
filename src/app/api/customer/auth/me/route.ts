import { NextRequest, NextResponse } from "next/server";
import { getCustomerSessionFromRequest } from "@/lib/customer-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getCustomerSessionFromRequest(req);

    if (!session) {
      return NextResponse.json(
        { success: false, authenticated: false, customer: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      customer: session.customer,
      sessionToken: session.sessionToken,
      expiresAt: session.expiresAt,
    });
  } catch (error: any) {
    console.error("GET /api/customer/auth/me error:", error);
    return NextResponse.json(
      { success: false, authenticated: false, error: "Failed to retrieve session." },
      { status: 500 }
    );
  }
}

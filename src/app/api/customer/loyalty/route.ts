import { NextRequest, NextResponse } from "next/server";
import { getCustomerSessionFromRequest } from "@/lib/customer-auth";
import { LoyaltyService } from "@/services/loyalty.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetCustomerId = searchParams.get("customerId");

    let customerIdToFetch = targetCustomerId;

    if (!customerIdToFetch) {
      const session = await getCustomerSessionFromRequest(req);
      if (!session) {
        return NextResponse.json(
          { success: false, error: "Authentication required to access loyalty program." },
          { status: 401 }
        );
      }
      customerIdToFetch = session.customer.id;
    }

    const profile = await LoyaltyService.getGuestLoyaltyProfile(customerIdToFetch);

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    console.error("GET /api/customer/loyalty error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch loyalty profile." },
      { status: 500 }
    );
  }
}

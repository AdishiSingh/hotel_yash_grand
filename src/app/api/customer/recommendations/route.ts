import { NextRequest, NextResponse } from "next/server";
import { getCustomerSessionFromRequest } from "@/lib/customer-auth";
import { RecommendationService } from "@/services/recommendation.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetCustomerId = searchParams.get("customerId");

    let customerIdToFetch = targetCustomerId;

    if (!customerIdToFetch) {
      const session = await getCustomerSessionFromRequest(req);
      if (!session) {
        return NextResponse.json(
          { success: false, error: "Authentication required to access personalized recommendations." },
          { status: 401 }
        );
      }
      customerIdToFetch = session.customer.id;
    }

    const recommendations = await RecommendationService.getPersonalizedRecommendations(customerIdToFetch);

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error: any) {
    console.error("GET /api/customer/recommendations error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate recommendations." },
      { status: 500 }
    );
  }
}

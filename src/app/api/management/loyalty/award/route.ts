import { NextRequest, NextResponse } from "next/server";
import { LoyaltyService } from "@/services/loyalty.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, points, reason, managerName } = body;

    if (!customerId || !points) {
      return NextResponse.json(
        { success: false, error: "customerId and points are required parameters." },
        { status: 400 }
      );
    }

    const updated = await LoyaltyService.awardManagerBonusPoints({
      customerId,
      points: Number(points),
      reason: reason || "Manager Discretionary VIP Bonus",
      managerName: managerName || "Duty Manager",
    });

    const newProfile = await LoyaltyService.getGuestLoyaltyProfile(customerId);

    return NextResponse.json({
      success: true,
      message: `Awarded ${points} bonus loyalty points!`,
      profile: newProfile,
    });
  } catch (error: any) {
    console.error("POST /api/management/loyalty/award error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to award loyalty points." },
      { status: 400 }
    );
  }
}

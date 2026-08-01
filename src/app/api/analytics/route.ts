import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@/services/analytics.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") || "30d";

    const analytics = await AnalyticsService.getAnalytics(timeframe);
    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to compute BI analytics" },
      { status: 500 }
    );
  }
}

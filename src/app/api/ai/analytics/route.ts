import { NextRequest, NextResponse } from "next/server";
import { AiAnalyticsService } from "@/services/ai-analytics.service";

export async function GET(req: NextRequest) {
  try {
    const aiData = await AiAnalyticsService.generateAiAnalytics();
    return NextResponse.json({
      success: true,
      data: aiData,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate AI analytics" },
      { status: 500 }
    );
  }
}

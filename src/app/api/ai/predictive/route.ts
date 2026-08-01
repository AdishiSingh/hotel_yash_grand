import { NextRequest, NextResponse } from "next/server";
import { PredictiveAiService } from "@/services/predictive-ai.service";

export async function GET() {
  try {
    const predictions = await PredictiveAiService.getLatestPredictions();
    return NextResponse.json({
      success: true,
      count: predictions.length,
      data: predictions,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch predictive ML forecasts" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const freshPredictions = await PredictiveAiService.runPredictivePipeline();
    return NextResponse.json({
      success: true,
      count: freshPredictions.length,
      data: freshPredictions,
      message: "Daily predictive ML job executed successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute predictive ML job" },
      { status: 500 }
    );
  }
}

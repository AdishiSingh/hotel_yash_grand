import { NextResponse } from "next/server";
import { TelemetryService } from "@/services/telemetry.service";

export async function GET() {
  try {
    const metrics = await TelemetryService.getMetrics();
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to collect SRE metrics" },
      { status: 500 }
    );
  }
}

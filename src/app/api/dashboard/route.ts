import { NextResponse } from "next/server";
import { DashboardService } from "@/services/dashboard.service";

export async function GET() {
  try {
    const kpis = await DashboardService.getDashboardKpis();
    return NextResponse.json({ success: true, data: kpis });
  } catch (error: any) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to calculate dashboard KPIs" }, { status: 500 });
  }
}

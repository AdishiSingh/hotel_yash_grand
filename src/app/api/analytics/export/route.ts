import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@/services/analytics.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "sales"; // sales, dishes, customers
    const timeframe = searchParams.get("timeframe") || "30d";

    const analytics = await AnalyticsService.getAnalytics(timeframe);

    let exportData: any[] = [];
    let filename = `yash_grand_report_${type}_${timeframe}.csv`;

    if (type === "dishes") {
      exportData = analytics.topDishes;
    } else if (type === "customers") {
      exportData = analytics.bestCustomers;
    } else {
      exportData = analytics.dailySalesTrend;
    }

    const csvContent = AnalyticsService.convertToCSV(exportData);

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate CSV export" },
      { status: 500 }
    );
  }
}

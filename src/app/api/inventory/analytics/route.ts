import { NextRequest, NextResponse } from "next/server";
import { InventoryService } from "@/services/inventory.service";

export async function GET(req: NextRequest) {
  try {
    const analytics = await InventoryService.getInventoryAnalytics();
    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch inventory analytics" },
      { status: 500 }
    );
  }
}

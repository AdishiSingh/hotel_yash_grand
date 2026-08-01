import { NextRequest, NextResponse } from "next/server";
import { InventoryService } from "@/services/inventory.service";

export async function GET(req: NextRequest) {
  try {
    const alerts = await InventoryService.getInventoryAlerts();
    return NextResponse.json({
      success: true,
      data: alerts,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch inventory alerts" },
      { status: 500 }
    );
  }
}

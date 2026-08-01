import { NextResponse } from "next/server";
import { InventoryService } from "@/services/inventory.service";
import { ZodError } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const department = searchParams.get("department") || undefined;

    const inventory = await InventoryService.getInventory({ category, department });
    return NextResponse.json({ success: true, count: inventory.length, data: inventory });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await InventoryService.createInventoryItem(body);

    return NextResponse.json({ success: true, message: "Inventory item added", data: item }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: (error as any).issues || (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

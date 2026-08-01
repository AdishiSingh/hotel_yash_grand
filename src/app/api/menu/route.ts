import { NextResponse } from "next/server";
import { MenuService } from "@/services/menu.service";
import { ZodError } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const catalog = searchParams.get("catalog");

    if (catalog === "true") {
      const menuCatalog = await MenuService.getMenuCatalog();
      return NextResponse.json({ success: true, data: menuCatalog });
    }

    const items = await MenuService.getMenuItems(categoryId);
    return NextResponse.json({ success: true, count: items.length, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await MenuService.createMenuItem(body);

    return NextResponse.json({ success: true, message: "Menu item created", data: item }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: (error as any).issues || (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

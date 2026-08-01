import { NextResponse } from "next/server";
import { MenuService } from "@/services/menu.service";
import { ZodError } from "zod";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await MenuService.updateMenuItem(id, body);

    return NextResponse.json({ success: true, message: "Menu item updated", data: updated });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: (error as any).issues || (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await MenuService.deleteMenuItem(id);

    return NextResponse.json({ success: true, message: "Menu item deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

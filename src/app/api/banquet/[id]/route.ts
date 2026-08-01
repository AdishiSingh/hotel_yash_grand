import { NextResponse } from "next/server";
import { BanquetService } from "@/services/banquet.service";
import { BanquetStatus } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = body.status as BanquetStatus;

    if (!status) {
      return NextResponse.json({ success: false, error: "Banquet status is required" }, { status: 400 });
    }

    const updated = await BanquetService.updateBanquetStatus(id, status);
    return NextResponse.json({ success: true, message: "Banquet status updated", data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { HrmsService } from "@/services/hrms.service";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { employee: true },
    });
    return NextResponse.json({ success: true, count: leaves.length, data: leaves });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch leave requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === "UPDATE_STATUS" && body.id && body.status) {
      const updated = await HrmsService.updateLeaveStatus(body.id, body.status);
      return NextResponse.json({ success: true, data: updated });
    }

    const leave = await HrmsService.createLeaveRequest(body);
    return NextResponse.json({ success: true, data: leave }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process leave request" },
      { status: 400 }
    );
  }
}

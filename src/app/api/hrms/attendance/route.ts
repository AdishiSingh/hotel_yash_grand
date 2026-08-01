import { NextRequest, NextResponse } from "next/server";
import { HrmsService } from "@/services/hrms.service";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const kpis = await HrmsService.getHrDashboardKpis();
    const todayLogs = await prisma.attendance.findMany({
      orderBy: { date: "desc" },
      take: 50,
      include: { employee: true },
    });
    return NextResponse.json({ success: true, kpis, data: todayLogs });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch attendance logs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.employeeId || !body.status) {
      return NextResponse.json({ success: false, error: "Missing employeeId or status" }, { status: 400 });
    }

    const attendance = await HrmsService.recordAttendance(
      body.employeeId,
      body.status,
      Number(body.overtimeHours || 0)
    );

    return NextResponse.json({ success: true, data: attendance });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to record attendance" },
      { status: 400 }
    );
  }
}

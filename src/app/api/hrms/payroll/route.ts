import { NextRequest, NextResponse } from "next/server";
import { HrmsService } from "@/services/hrms.service";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const payrolls = await prisma.payroll.findMany({
      orderBy: { paidAt: "desc" },
      include: { employee: true },
    });
    return NextResponse.json({ success: true, count: payrolls.length, data: payrolls });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch payroll records" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const month = Number(body.month) || new Date().getMonth() + 1;
    const year = Number(body.year) || new Date().getFullYear();

    const payrolls = await HrmsService.generateMonthlyPayroll(month, year);
    return NextResponse.json({ success: true, count: payrolls.length, data: payrolls }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate payroll" },
      { status: 400 }
    );
  }
}

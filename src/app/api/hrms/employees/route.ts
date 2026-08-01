import { NextRequest, NextResponse } from "next/server";
import { HrmsService } from "@/services/hrms.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department") || undefined;

    const employees = await HrmsService.getEmployees(department);
    return NextResponse.json({ success: true, count: employees.length, data: employees });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const employee = await HrmsService.createEmployee(body);
    return NextResponse.json({ success: true, data: employee }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create employee" },
      { status: 400 }
    );
  }
}

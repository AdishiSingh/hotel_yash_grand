import { NextRequest, NextResponse } from "next/server";
import { validateTableToken } from "@/lib/table-security";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tableParam = searchParams.get("table");
    const tokenParam = searchParams.get("token");

    if (!tableParam || !tokenParam) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: "Missing required search parameters: table and token.",
        },
        { status: 400 }
      );
    }

    // Clean table parameter (handles "5", "Table 5", "T-05", etc.)
    const cleanNum = tableParam.toString().replace(/[^0-9]/g, "");
    const tableNumber = parseInt(cleanNum, 10);

    if (isNaN(tableNumber)) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: "Invalid table number provided.",
        },
        { status: 400 }
      );
    }

    const validation = await validateTableToken(tableNumber, tokenParam);

    if (!validation.valid || !validation.table) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: validation.message || "Invalid or inactive QR code token.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      table: validation.table.tableNumber,
      token: validation.table.token,
      expiresAt: validation.expiresAt,
    });
  } catch (error: any) {
    console.error("GET /api/table/verify error:", error);
    return NextResponse.json(
      {
        success: false,
        verified: false,
        message: "Internal server error during verification.",
      },
      { status: 500 }
    );
  }
}

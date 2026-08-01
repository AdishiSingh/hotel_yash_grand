import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSecureToken, generateTableQRCodeDataUrl } from "@/lib/table-security";

// GET: List all restaurant tables with active tokens and QR Data URLs
export async function GET(req: NextRequest) {
  try {
    const tables = await prisma.restaurantTable.findMany({
      orderBy: { tableNumber: "asc" },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    const host = req.headers.get("host") 
      ? `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`
      : undefined;

    // Enhance table objects with generated QR Data URLs & direct URLs
    const enhancedTables = await Promise.all(
      tables.map(async (t) => {
        const qrUrl = `${host || "https://hotelyashgrand.com"}/menu?table=${t.tableNumber}&token=${t.token}`;
        let qrDataUrl = "";
        try {
          qrDataUrl = await generateTableQRCodeDataUrl(t.tableNumber, t.token, host);
        } catch (e) {
          console.error(`Failed to generate QR for Table ${t.tableNumber}`, e);
        }

        return {
          id: t.id,
          tableNumber: t.tableNumber,
          token: t.token,
          isActive: t.isActive,
          expiresAt: t.expiresAt,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          ordersCount: t._count.orders,
          qrUrl,
          qrDataUrl,
        };
      })
    );

    return NextResponse.json({
      success: true,
      tables: enhancedTables,
    });
  } catch (error: any) {
    console.error("GET /api/admin/tables error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch restaurant tables." },
      { status: 500 }
    );
  }
}

// POST: Create a new table or batch create tables
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tableNumber } = body;

    const num = parseInt(String(tableNumber).replace(/[^0-9]/g, ""), 10);
    if (isNaN(num) || num <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid table number (positive integer) is required." },
        { status: 400 }
      );
    }

    // Check if table number already exists
    const existing = await prisma.restaurantTable.findUnique({
      where: { tableNumber: num },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Table ${num} already exists. Use regenerate token if needed.` },
        { status: 409 }
      );
    }

    const token = generateSecureToken();

    const newTable = await prisma.restaurantTable.create({
      data: {
        tableNumber: num,
        token,
        isActive: true,
      },
    });

    const host = req.headers.get("host") 
      ? `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`
      : undefined;

    const qrDataUrl = await generateTableQRCodeDataUrl(newTable.tableNumber, newTable.token, host);

    return NextResponse.json({
      success: true,
      table: {
        ...newTable,
        qrUrl: `${host || "https://hotelyashgrand.com"}/menu?table=${newTable.tableNumber}&token=${newTable.token}`,
        qrDataUrl,
      },
    });
  } catch (error: any) {
    console.error("POST /api/admin/tables error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create table." },
      { status: 500 }
    );
  }
}

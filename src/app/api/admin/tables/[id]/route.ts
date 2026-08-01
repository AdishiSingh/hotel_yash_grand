import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSecureToken, generateTableQRCodeDataUrl } from "@/lib/table-security";

// PATCH: Update table (regenerate token, toggle isActive)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, isActive } = body;

    const table = await prisma.restaurantTable.findUnique({
      where: { id },
    });

    if (!table) {
      return NextResponse.json(
        { success: false, error: "Table not found." },
        { status: 404 }
      );
    }

    let updatedToken = table.token;
    let updatedActive = table.isActive;

    if (action === "regenerate") {
      updatedToken = generateSecureToken();
    }

    if (typeof isActive === "boolean") {
      updatedActive = isActive;
    }

    const updatedTable = await prisma.restaurantTable.update({
      where: { id },
      data: {
        token: updatedToken,
        isActive: updatedActive,
      },
    });

    const host = req.headers.get("host")
      ? `${req.headers.get("x-forwarded-proto") || "http"}://${req.headers.get("host")}`
      : undefined;

    const qrDataUrl = await generateTableQRCodeDataUrl(
      updatedTable.tableNumber,
      updatedTable.token,
      host
    );

    return NextResponse.json({
      success: true,
      table: {
        ...updatedTable,
        qrUrl: `${host || "https://hotelyashgrand.com"}/menu?table=${updatedTable.tableNumber}&token=${updatedTable.token}`,
        qrDataUrl,
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/admin/tables/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update table." },
      { status: 500 }
    );
  }
}

// DELETE: Deactivate or remove a table
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.restaurantTable.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Table deleted successfully.",
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/tables/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete table." },
      { status: 500 }
    );
  }
}

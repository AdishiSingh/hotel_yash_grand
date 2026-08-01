"use server";

import { prisma } from "@/lib/prisma";
import { validateTableToken, generateSecureToken, generateTableQRCodeDataUrl } from "@/lib/table-security";
import { revalidatePath } from "next/cache";

export async function verifyTableAction(tableNumber: number, token: string) {
  return await validateTableToken(tableNumber, token);
}

export async function getTablesAction() {
  try {
    const tables = await prisma.restaurantTable.findMany({
      orderBy: { tableNumber: "asc" },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    const enhanced = await Promise.all(
      tables.map(async (t) => {
        const qrUrl = `https://hotelyashgrand.com/menu?table=${t.tableNumber}&token=${t.token}`;
        let qrDataUrl = "";
        try {
          qrDataUrl = await generateTableQRCodeDataUrl(t.tableNumber, t.token);
        } catch (e) {
          console.error(`QR gen error for table ${t.tableNumber}`, e);
        }

        return {
          id: t.id,
          tableNumber: t.tableNumber,
          token: t.token,
          isActive: t.isActive,
          expiresAt: t.expiresAt?.toISOString() || null,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
          ordersCount: t._count.orders,
          qrUrl,
          qrDataUrl,
        };
      })
    );

    return { success: true, tables: enhanced };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch tables" };
  }
}

export async function createTableAction(tableNumber: number) {
  try {
    const existing = await prisma.restaurantTable.findUnique({
      where: { tableNumber },
    });

    if (existing) {
      return { success: false, error: `Table ${tableNumber} already exists.` };
    }

    const token = generateSecureToken();
    const table = await prisma.restaurantTable.create({
      data: {
        tableNumber,
        token,
        isActive: true,
      },
    });

    revalidatePath("/admin/tables");
    revalidatePath("/menu");

    return { success: true, table };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create table" };
  }
}

export async function regenerateTableTokenAction(id: string) {
  try {
    const newToken = generateSecureToken();
    const table = await prisma.restaurantTable.update({
      where: { id },
      data: { token: newToken },
    });

    revalidatePath("/admin/tables");
    revalidatePath("/menu");

    return { success: true, table };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to regenerate token" };
  }
}

export async function toggleTableActiveAction(id: string, isActive: boolean) {
  try {
    const table = await prisma.restaurantTable.update({
      where: { id },
      data: { isActive },
    });

    revalidatePath("/admin/tables");
    revalidatePath("/menu");

    return { success: true, table };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle table status" };
  }
}

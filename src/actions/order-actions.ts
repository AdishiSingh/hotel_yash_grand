"use server";

import { prisma } from "@/lib/prisma";
import { validateTableToken } from "@/lib/table-security";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface CreateOrderInput {
  tableNumber: number;
  token: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    price?: number;
    name?: string;
    variantLabel?: string;
  }>;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

export async function createOrderAction(input: CreateOrderInput) {
  const { tableNumber, token, items, customerName = "Guest", customerPhone, notes } = input;

  // 1. Validate Table & Token Security
  const verification = await validateTableToken(tableNumber, token);
  if (!verification.valid || !verification.table) {
    return {
      success: false,
      error: verification.message || "Invalid or inactive table QR session.",
    };
  }

  if (!items || items.length === 0) {
    return { success: false, error: "Cart is empty." };
  }

  try {
    // 2. Perform Transactional Save in PostgreSQL
    const order = await prisma.$transaction(async (tx) => {
      const tableRecord = await tx.restaurantTable.findUnique({
        where: { tableNumber },
      });

      if (!tableRecord || !tableRecord.isActive || tableRecord.token !== token) {
        throw new Error("Table verification failed during transaction.");
      }

      // Fetch prices from DB catalog
      const menuItemIds = items.map((i) => i.menuItemId).filter(Boolean);
      const dbMenuItems = await tx.menuItem.findMany({
        where: { id: { in: menuItemIds } },
      });

      const dbMap = new Map(dbMenuItems.map((m) => [m.id, m]));

      let subtotal = 0;
      let totalItems = 0;

      const preparedItems = items.map((item) => {
        const dbItem = dbMap.get(item.menuItemId);
        const price = dbItem ? dbItem.price : (item.price || 0);
        const name = dbItem ? dbItem.name : (item.name || "Menu Item");
        const qty = Math.max(1, item.quantity || 1);

        subtotal += price * qty;
        totalItems += qty;

        return {
          menuItemId: item.menuItemId || "custom-item",
          itemName: name,
          quantity: qty,
          price,
          variantLabel: item.variantLabel || null,
        };
      });

      const tax = Math.round(subtotal * 0.05 * 100) / 100;
      const grandTotal = Math.round((subtotal + tax) * 100) / 100;

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = `YG${randomNum}`;

      const created = await tx.restaurantOrder.create({
        data: {
          orderId,
          tableNumber: String(tableNumber),
          tableId: tableRecord.id,
          customerName,
          customerPhone: customerPhone || null,
          totalItems,
          subtotal,
          tax,
          grandTotal,
          status: OrderStatus.PENDING,
          notes: notes || null,
          items: {
            create: preparedItems,
          },
        },
        include: {
          items: true,
        },
      });

      return created;
    });

    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/kot");

    return {
      success: true,
      order: {
        id: order.id,
        orderId: order.orderId,
        orderNumber: order.orderId,
        tableNumber: order.tableNumber,
        grandTotal: order.grandTotal,
        totalItems: order.totalItems,
        createdAt: order.createdAt.toISOString(),
        items: order.items,
      },
    };
  } catch (err: any) {
    console.error("createOrderAction error:", err);
    return {
      success: false,
      error: err.message || "Failed to persist order in database.",
    };
  }
}

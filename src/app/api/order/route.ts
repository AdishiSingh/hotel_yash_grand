import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateTableToken } from "@/lib/table-security";
import { OrderStatus } from "@prisma/client";

interface IncomingOrderItem {
  menuItemId: string;
  quantity: number;
  price?: number;
  name?: string;
  variantLabel?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tableNumber,
      token,
      items,
      customerName = "Guest",
      customerPhone,
      notes,
    } = body;

    // 1. Mandatory Table & Token Verification
    const cleanNum = parseInt(String(tableNumber).replace(/[^0-9]/g, ""), 10);

    if (isNaN(cleanNum) || !token) {
      return NextResponse.json(
        {
          success: false,
          error: "Ordering is restricted. Please scan a valid restaurant table QR code.",
        },
        { status: 401 }
      );
    }

    const verification = await validateTableToken(cleanNum, token);
    if (!verification.valid || !verification.table) {
      return NextResponse.json(
        {
          success: false,
          error: verification.message || "Invalid table QR session. Please rescan your table QR code.",
        },
        { status: 401 }
      );
    }

    // 2. Validate Items Array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order must contain at least one item." },
        { status: 400 }
      );
    }

    // 3. Prisma Transaction Execution
    const result = await prisma.$transaction(async (tx) => {
      // Fetch table record inside transaction
      const tableRecord = await tx.restaurantTable.findUnique({
        where: { tableNumber: cleanNum },
      });

      if (!tableRecord || !tableRecord.isActive || tableRecord.token !== token) {
        throw new Error("Table verification failed inside transaction.");
      }

      // Fetch all menu items from DB to verify prices and existence
      const menuItemIds = items.map((i: IncomingOrderItem) => i.menuItemId).filter(Boolean);
      const dbMenuItems = await tx.menuItem.findMany({
        where: { id: { in: menuItemIds } },
      });

      const menuItemMap = new Map(dbMenuItems.map((m) => [m.id, m]));

      let subtotal = 0;
      let totalItems = 0;

      const preparedItems = items.map((item: IncomingOrderItem) => {
        const dbItem = menuItemMap.get(item.menuItemId);
        // Use database price if item exists in DB, otherwise use item.price
        const unitPrice = dbItem ? dbItem.price : (item.price || 0);
        const itemName = dbItem ? dbItem.name : (item.name || "Menu Item");
        const qty = Math.max(1, item.quantity || 1);

        subtotal += unitPrice * qty;
        totalItems += qty;

        return {
          menuItemId: item.menuItemId || "custom-item",
          itemName,
          quantity: qty,
          price: unitPrice,
          variantLabel: item.variantLabel || null,
        };
      });

      // Calculate taxes (5% GST for restaurant dining)
      const tax = Math.round(subtotal * 0.05 * 100) / 100;
      const grandTotal = Math.round((subtotal + tax) * 100) / 100;

      // Unique Order ID format: YG1032
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = `YG${randomNum}`;

      // Create Order in DB
      const order = await tx.restaurantOrder.create({
        data: {
          orderId,
          tableNumber: String(cleanNum),
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
          table: true,
        },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      order: {
        id: result.id,
        orderId: result.orderId,
        orderNumber: result.orderId,
        tableNumber: result.tableNumber,
        status: result.status,
        subtotal: result.subtotal,
        tax: result.tax,
        grandTotal: result.grandTotal,
        totalItems: result.totalItems,
        createdAt: result.createdAt,
        items: result.items,
      },
    });
  } catch (error: any) {
    console.error("POST /api/order error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save order in PostgreSQL.",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID parameter is required." },
        { status: 400 }
      );
    }

    // Search by cuid `id` or orderId e.g. `YG1032` or `#YG1032`
    const cleanId = id.replace("#", "");

    const order = await prisma.restaurantOrder.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { orderId: cleanId },
          { orderId: `YG${cleanId}` },
        ],
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        table: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order '${id}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderId: order.orderId,
        orderNumber: order.orderId,
        tableNumber: order.tableNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        totalItems: order.totalItems,
        subtotal: order.subtotal,
        tax: order.tax,
        grandTotal: order.grandTotal,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items.map((i) => ({
          id: i.id,
          menuItemId: i.menuItemId,
          itemName: i.itemName,
          quantity: i.quantity,
          price: i.price,
          variantLabel: i.variantLabel,
        })),
      },
    });
  } catch (error: any) {
    console.error("GET /api/order/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching order." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { buildFormattedWhatsAppMessage, getWhatsAppDeepLink, OFFICIAL_HOTEL_WHATSAPP } from "@/lib/whatsapp";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, tableNumber, items, totalQuantity, totalAmount, timeStr } = body;

    let orderData = {
      orderId: orderId || "YG1000",
      tableNumber: tableNumber || 1,
      items: items || [],
      totalQuantity: totalQuantity || 0,
      totalAmount: totalAmount || 0,
      timeStr: timeStr,
    };

    // If orderId is provided, attempt to pull authoritative order from PostgreSQL
    if (orderId && (!items || items.length === 0)) {
      const cleanId = String(orderId).replace("#", "");
      const dbOrder = await prisma.restaurantOrder.findFirst({
        where: {
          OR: [{ id: cleanId }, { orderId: cleanId }],
        },
        include: { items: true },
      });

      if (dbOrder) {
        orderData = {
          orderId: dbOrder.orderId,
          tableNumber: dbOrder.tableNumber,
          items: dbOrder.items.map((i) => ({
            name: i.itemName,
            quantity: i.quantity,
            price: i.price,
          })),
          totalQuantity: dbOrder.totalItems,
          totalAmount: dbOrder.grandTotal,
          timeStr: dbOrder.createdAt.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        };
      }
    }

    const formattedMessage = buildFormattedWhatsAppMessage(orderData);
    const whatsappUrl = getWhatsAppDeepLink(orderData, OFFICIAL_HOTEL_WHATSAPP);

    return NextResponse.json({
      success: true,
      orderId: orderData.orderId,
      tableNumber: orderData.tableNumber,
      formattedMessage,
      whatsappUrl,
    });
  } catch (error: any) {
    console.error("POST /api/whatsapp error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate WhatsApp order deep link." },
      { status: 500 }
    );
  }
}

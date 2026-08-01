import { NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import { ZodError } from "zod";
import { OrderStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as OrderStatus | null;
    const tableNumber = searchParams.get("tableNumber") || undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

    const orders = await OrderService.getOrders({
      status: status || undefined,
      tableNumber,
      limit,
    });

    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = await OrderService.createOrder(body);

    return NextResponse.json({ success: true, message: "Order created successfully", data: newOrder }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: (error as any).issues || (error as any).errors }, { status: 400 });
    }
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create order" }, { status: 500 });
  }
}

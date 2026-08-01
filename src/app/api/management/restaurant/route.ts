import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const tableNumber = searchParams.get("tableNumber") || undefined;
    const paymentStatus = searchParams.get("paymentStatus") || undefined;
    const search = searchParams.get("search") || undefined;
    const date = searchParams.get("date") || undefined;

    const todayStart = date ? new Date(date) : new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = date ? new Date(date) : new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Build filter query
    const where: any = {
      createdAt: { gte: todayStart, lte: todayEnd },
    };

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (tableNumber && tableNumber !== "ALL") {
      where.tableNumber = tableNumber;
    }

    if (paymentStatus && paymentStatus !== "ALL") {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { orderId: { contains: q, mode: "insensitive" } },
        { customerName: { contains: q, mode: "insensitive" } },
        { tableNumber: { contains: q, mode: "insensitive" } },
      ];
    }

    // 1. Fetch Orders from PostgreSQL
    const orders = await prisma.restaurantOrder.findMany({
      where,
      include: {
        items: true,
        bill: true,
        payments: true,
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch Restaurant Tables
    const tables = await prisma.restaurantTable.findMany({
      orderBy: { tableNumber: "asc" },
      include: {
        orders: {
          where: {
            status: { in: ["NEW", "IN_KITCHEN", "PREPARING", "READY", "SERVED"] },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    // 3. Compute Live Statistics
    const totalOrdersToday = await prisma.restaurantOrder.count({
      where: { createdAt: { gte: todayStart, lte: todayEnd } },
    });

    const totalSalesSum = await prisma.restaurantOrder.aggregate({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        status: { in: ["PAID", "SERVED", "COMPLETED"] },
      },
      _sum: { grandTotal: true },
    });

    const activeKitchenOrders = await prisma.restaurantOrder.count({
      where: {
        status: { in: ["NEW", "IN_KITCHEN", "PREPARING"] },
      },
    });

    const servedAndPaidCount = await prisma.restaurantOrder.count({
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        status: { in: ["SERVED", "PAID", "COMPLETED"] },
      },
    });

    // 4. Payment Method Sales Breakdown
    const paymentBreakdown = await prisma.restaurantOrder.groupBy({
      by: ["paymentMethod"],
      where: {
        createdAt: { gte: todayStart, lte: todayEnd },
        status: { in: ["PAID", "SERVED", "COMPLETED"] },
      },
      _sum: { grandTotal: true },
      _count: { id: true },
    });

    // Fetch Audit Trail Logs for Orders
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        action: { in: ["ORDER_CREATED", "ORDER_UPDATED"] },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
      tables,
      statistics: {
        totalOrdersToday,
        totalSalesToday: totalSalesSum._sum.grandTotal || 0,
        activeKitchenOrders,
        servedAndPaidCount,
        activeTablesCount: tables.filter((t) => t.orders.length > 0).length,
        totalTablesCount: tables.length,
      },
      paymentBreakdown,
      auditLogs,
    });
  } catch (error: any) {
    console.error("GET /api/management/restaurant error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch restaurant management data." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "csv"; // csv, excel, pdf
    const timeframe = searchParams.get("range") || "MONTHLY";

    const now = new Date();
    const startDate = new Date();
    if (timeframe === "DAILY") startDate.setHours(0, 0, 0, 0);
    else if (timeframe === "WEEKLY") startDate.setDate(now.getDate() - 7);
    else if (timeframe === "MONTHLY") startDate.setMonth(now.getMonth() - 1);
    else if (timeframe === "YEARLY") startDate.setFullYear(now.getFullYear() - 1);

    const restaurantAggr = await prisma.restaurantOrder.aggregate({
      where: { createdAt: { gte: startDate }, status: { in: ["PAID", "SERVED", "COMPLETED"] } },
      _sum: { grandTotal: true },
      _count: { id: true },
    });

    const roomAggr = await prisma.roomBooking.aggregate({
      where: { checkIn: { gte: startDate }, status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] } },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    const banquetAggr = await prisma.banquetBooking.aggregate({
      where: { eventDate: { gte: startDate }, status: { in: ["BOOKED", "COMPLETED"] } },
      _sum: { budget: true },
      _count: { id: true },
    });

    const restRev = restaurantAggr._sum.grandTotal || 0;
    const roomRev = roomAggr._sum.totalAmount || 0;
    const banquetRev = banquetAggr._sum.budget || 0;
    const grandRev = restRev + roomRev + banquetRev;

    if (format === "csv" || format === "excel") {
      const csvData = [
        "HOTEL YASH GRAND - FINANCIAL & OPERATIONAL REPORT",
        `Timeframe,${timeframe}`,
        `Generated At,${now.toISOString()}`,
        "",
        "Module,Volume Count,Revenue Generated (INR)",
        `Restaurant POS,${restaurantAggr._count.id || 0},${restRev}`,
        `Room Stay Bookings,${roomAggr._count.id || 0},${roomRev}`,
        `Banquet Events,${banquetAggr._count.id || 0},${banquetRev}`,
        `TOTAL GRAND REVENUE,,${grandRev}`,
      ].join("\n");

      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="yash_grand_report_${timeframe.toLowerCase()}.csv"`,
        },
      });
    }

    // PDF / HTML Text Export
    const htmlReport = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hotel Yash Grand Financial Report</title>
          <style>
            body { font-family: sans-serif; background: #0A0C10; color: #FFFFFF; padding: 40px; }
            h1 { color: #DFBA73; border-bottom: 2px solid #DFBA73; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #333; padding: 12px; text-align: left; }
            th { background: #161920; color: #DFBA73; }
            .grand { font-weight: bold; font-size: 16px; color: #10B981; }
          </style>
        </head>
        <body>
          <h1>HOTEL YASH GRAND - EXECUTIVE FINANCIAL REPORT</h1>
          <p>Timeframe: <strong>${timeframe}</strong> | Generated: <strong>${now.toLocaleString()}</strong></p>
          <table>
            <thead>
              <tr><th>Module Department</th><th>Volume Count</th><th>Revenue Generated (₹)</th></tr>
            </thead>
            <tbody>
              <tr><td>Restaurant POS Dining</td><td>${restaurantAggr._count.id || 0} Orders</td><td>₹${restRev.toLocaleString()}</td></tr>
              <tr><td>Room Stay Allocations</td><td>${roomAggr._count.id || 0} Bookings</td><td>₹${roomRev.toLocaleString()}</td></tr>
              <tr><td>Banquet Ceremonial Galas</td><td>${banquetAggr._count.id || 0} Events</td><td>₹${banquetRev.toLocaleString()}</td></tr>
              <tr class="grand"><td>TOTAL COMBINED REVENUE</td><td>-</td><td>₹${grandRev.toLocaleString()}</td></tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    return new NextResponse(htmlReport, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="yash_grand_report_${timeframe.toLowerCase()}.html"`,
      },
    });
  } catch (error: any) {
    console.error("GET /api/management/reports/export error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

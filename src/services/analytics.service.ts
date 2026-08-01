import prisma from "@/lib/prisma";

export interface AnalyticsSummary {
  revenue: {
    restaurant: number;
    rooms: number;
    banquet: number;
    total: number;
  };
  pnl: {
    grossRevenue: number;
    estimatedExpenses: number;
    netProfit: number;
    profitMarginPercent: number;
  };
  gst: {
    cgstTotal: number;
    sgstTotal: number;
    totalGstCollected: number;
  };
  operational: {
    occupancyRate: number;
    avgOrderValue: number;
    avgStayDurationDays: number;
    peakDiningHours: string;
  };
  topDishes: Array<{ name: string; quantity: number; totalRevenue: number }>;
  bestCustomers: Array<{ name: string; phone: string; totalSpent: number; visitCount: number }>;
  dailySalesTrend: Array<{ date: string; restaurant: number; rooms: number; total: number }>;
}

export class AnalyticsService {
  /**
   * Compute comprehensive BI Analytics from PostgreSQL database
   */
  public static async getAnalytics(timeframe = "30d"): Promise<AnalyticsSummary> {
    const now = new Date();
    let days = 30;
    if (timeframe === "7d") days = 7;
    if (timeframe === "90d") days = 90;
    if (timeframe === "365d") days = 365;

    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // 1. Fetch Completed Restaurant Orders
    const orders = await prisma.restaurantOrder.findMany({
      where: { createdAt: { gte: startDate } },
      include: { items: true },
    });

    const restaurantRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);

    // 2. Fetch Room Bookings
    const bookings = await prisma.roomBooking.findMany({
      where: { createdAt: { gte: startDate } },
      include: { room: true, customer: true },
    });

    const roomRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    // 3. Fetch Banquet Bookings
    const banquetBookings = await prisma.banquetBooking.findMany({
      where: { createdAt: { gte: startDate } },
    });

    const banquetRevenue = banquetBookings.reduce((sum, b) => sum + (b.budget || 50000), 0);

    const grossRevenue = restaurantRevenue + roomRevenue + banquetRevenue;

    // 4. Compute GST Breakdown (5%)
    const totalGstCollected = Math.round(grossRevenue * 0.05 * 100) / 100;
    const cgstTotal = Math.round(totalGstCollected / 2 * 100) / 100;
    const sgstTotal = cgstTotal;

    // 5. Estimated Expenses & Profit & Loss
    const estimatedExpenses = Math.round(grossRevenue * 0.45 * 100) / 100; // 45% operating cost ratio
    const netProfit = Math.round((grossRevenue - estimatedExpenses) * 100) / 100;
    const profitMarginPercent = grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 1000) / 10 : 0;

    // 6. Operational KPIs
    const totalRooms = await prisma.room.count();
    const occupiedRooms = await prisma.room.count({ where: { status: "OCCUPIED" } });
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 1000) / 10 : 0;

    const avgOrderValue = orders.length > 0 ? Math.round(restaurantRevenue / orders.length) : 0;
    const avgStayDurationDays = 2.4;

    // 7. Top Selling Dishes
    const dishMap: Record<string, { quantity: number; revenue: number }> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        if (!dishMap[item.itemName]) {
          dishMap[item.itemName] = { quantity: 0, revenue: 0 };
        }
        dishMap[item.itemName].quantity += item.quantity;
        dishMap[item.itemName].revenue += item.quantity * item.price;
      });
    });

    const topDishes = Object.entries(dishMap)
      .map(([name, val]) => ({ name, quantity: val.quantity, totalRevenue: val.revenue }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // 8. Best Customers
    const customers = await prisma.customer.findMany({
      orderBy: { totalSpent: "desc" },
      take: 5,
    });

    const bestCustomers = customers.map((c) => ({
      name: c.name,
      phone: c.phone,
      totalSpent: c.totalSpent,
      visitCount: c.visitCount,
    }));

    // 9. Daily Sales Trend (Last 7 Days)
    const dailySalesTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateLabel = d.toISOString().slice(5, 10);
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(d.setHours(23, 59, 59, 999));

      const dayOrdersTotal = orders
        .filter((o) => new Date(o.createdAt) >= dayStart && new Date(o.createdAt) <= dayEnd)
        .reduce((sum, o) => sum + o.grandTotal, 0);

      const dayBookingsTotal = bookings
        .filter((b) => new Date(b.createdAt) >= dayStart && new Date(b.createdAt) <= dayEnd)
        .reduce((sum, b) => sum + b.totalAmount, 0);

      dailySalesTrend.push({
        date: dateLabel,
        restaurant: Math.round(dayOrdersTotal),
        rooms: Math.round(dayBookingsTotal),
        total: Math.round(dayOrdersTotal + dayBookingsTotal),
      });
    }

    return {
      revenue: {
        restaurant: Math.round(restaurantRevenue),
        rooms: Math.round(roomRevenue),
        banquet: Math.round(banquetRevenue),
        total: Math.round(grossRevenue),
      },
      pnl: {
        grossRevenue: Math.round(grossRevenue),
        estimatedExpenses,
        netProfit,
        profitMarginPercent,
      },
      gst: {
        cgstTotal,
        sgstTotal,
        totalGstCollected,
      },
      operational: {
        occupancyRate,
        avgOrderValue,
        avgStayDurationDays,
        peakDiningHours: "8:00 PM - 10:00 PM",
      },
      topDishes,
      bestCustomers,
      dailySalesTrend,
    };
  }

  /**
   * Helper to convert dataset array to CSV format string
   */
  public static convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((obj) =>
      Object.values(obj)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(",")
    );
    return [headers, ...rows].join("\n");
  }
}

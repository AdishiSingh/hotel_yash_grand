export interface BusinessInsight {
  id: string;
  metric: string;
  trend: "positive" | "warning" | "neutral";
  message: string;
}

export function generateBusinessInsights(): BusinessInsight[] {
  return [
    {
      id: "ins-01",
      metric: "Menu Demand",
      trend: "positive",
      message: "Paneer Butter Masala sales increased by 18% this week. Suggest featuring it on restaurant recommendation banners."
    },
    {
      id: "ins-02",
      metric: "Stock Warning",
      trend: "warning",
      message: "Mineral Water Bottles stock is below the minimum limit (45 units remaining). Restock recommended today."
    },
    {
      id: "ins-03",
      metric: "Banquet Scheduling",
      trend: "neutral",
      message: "Wedding Season bookings peaking between Nov 10 - Nov 20. Confirm advance decor supplier agreements."
    },
    {
      id: "ins-04",
      metric: "Occupancy Boost",
      trend: "positive",
      message: "Room Occupancy stands at 85% this morning, driven by corporate stays for executive suites."
    }
  ];
}

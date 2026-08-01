"use client";

import * as React from "react";
import { TrendingUp, Users, Utensils, BedDouble, Download, FileText, DollarSign, Percent, BarChart3 } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";
import { AnalyticsSummary } from "@/services/analytics.service";
import { AiInsightsWidget } from "@/components/analytics/AiInsightsWidget";
import { PredictiveAiWidget } from "@/components/analytics/PredictiveAiWidget";

export default function ErpAnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [timeframe, setTimeframe] = React.useState<string>("30d");

  const fetchAnalytics = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/analytics?timeframe=${timeframe}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useRealtime(["DASHBOARD_REFRESH", "PAYMENT_RECORDED", "ORDER_UPDATED", "BOOKING_UPDATED"], () => {
    fetchAnalytics();
  });

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportCSV = (type: string) => {
    window.open(`/api/analytics/export?type=${type}&timeframe=${timeframe}`, "_blank");
  };

  const handlePrintReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-neutral-400 font-mono text-xs">
        Computing Business Intelligence Analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-red-400 font-mono text-xs">
        Failed to load analytics data.
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">Business Intelligence & Executive Analytics</h2>
          <p className="text-xs text-neutral-400 font-light">
            Revenue velocity, Profit & Loss (P&L), GST tax summary, room occupancy, and CSV exports.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Timeframe selector */}
          <div className="flex bg-neutral-950 border border-white/10 p-1 rounded-lg text-xs font-mono">
            {["7d", "30d", "90d", "365d"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded transition-colors cursor-pointer uppercase ${
                  timeframe === t ? "bg-[#C5A880] text-black font-bold" : "text-neutral-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExportCSV("sales")}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Download className="h-3.5 w-3.5 text-[#C5A880]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-3 py-1.5 bg-[#C5A880] hover:bg-[#A37C40] text-black rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* AI Decision Support & Predictive Insights Widget */}
      <AiInsightsWidget />

      {/* Predictive ML Intelligence & Explainable AI Widget */}
      <PredictiveAiWidget />

      {/* Primary BI KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 border border-white/10 bg-neutral-950 rounded-xl space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold block">Gross Revenue ({timeframe})</span>
          <div className="text-2xl font-serif text-white font-semibold">₹{data.revenue.total.toLocaleString()}</div>
          <div className="flex gap-2 text-[10px] text-neutral-400">
            <span>Rest: ₹{data.revenue.restaurant.toLocaleString()}</span>
            <span>•</span>
            <span>Room: ₹{data.revenue.rooms.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-6 border border-white/10 bg-neutral-950 rounded-xl space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold block">Net Profit & Margin</span>
          <div className="text-2xl font-serif text-emerald-400 font-semibold">₹{data.pnl.netProfit.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-300 font-mono font-bold">{data.pnl.profitMarginPercent}% Margin</span>
        </div>

        <div className="p-6 border border-white/10 bg-neutral-950 rounded-xl space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-amber-300 font-bold block">5% GST Collected</span>
          <div className="text-2xl font-serif text-amber-300 font-semibold">₹{data.gst.totalGstCollected.toLocaleString()}</div>
          <span className="text-[10px] text-neutral-400">CGST ₹{data.gst.cgstTotal} / SGST ₹{data.gst.sgstTotal}</span>
        </div>

        <div className="p-6 border border-white/10 bg-neutral-950 rounded-xl space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold block">Room Occupancy Rate</span>
          <div className="text-2xl font-serif text-white font-semibold">{data.operational.occupancyRate}%</div>
          <span className="text-[10px] text-neutral-400">Peak Dining: {data.operational.peakDiningHours}</span>
        </div>
      </div>

      {/* Visual Chart - Sales Trend */}
      <div className="p-6 border border-white/10 bg-neutral-950 rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#C5A880]" />
            <h3 className="font-serif text-base font-semibold text-white">Daily Revenue Velocity Trend</h3>
          </div>
          <span className="text-xs font-mono text-neutral-400">Rest vs Rooms</span>
        </div>

        <div className="h-44 flex items-end gap-3 justify-between pt-4 border-b border-white/10">
          {data.dailySalesTrend.map((item, idx) => {
            const max = Math.max(...data.dailySalesTrend.map((d) => d.total || 1), 1000);
            const heightPercent = Math.min(100, Math.max(15, (item.total / max) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[9px] font-mono text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{item.total}
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-gradient-to-t from-[#C5A880]/40 to-[#C5A880] rounded-t transition-all duration-300 relative group-hover:bg-amber-400"
                />
                <span className="text-[10px] font-mono text-neutral-400">{item.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Insights Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Dishes */}
        <div className="p-6 border border-white/10 bg-neutral-950 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="font-serif text-sm font-semibold text-white">Top Performing Dishes</h3>
            <button
              onClick={() => handleExportCSV("dishes")}
              className="text-[10px] text-[#C5A880] hover:text-white font-mono uppercase font-bold"
            >
              CSV
            </button>
          </div>
          <div className="space-y-3 text-xs">
            {data.topDishes.length === 0 ? (
              <p className="text-neutral-500 italic">No sales recorded yet.</p>
            ) : (
              data.topDishes.map((dish, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-neutral-200">{i + 1}. {dish.name}</span>
                  <span className="font-mono text-[#C5A880] font-bold">{dish.quantity} orders (₹{dish.totalRevenue})</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Best VIP Customers */}
        <div className="p-6 border border-white/10 bg-neutral-950 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="font-serif text-sm font-semibold text-white">Top VIP Guests</h3>
            <button
              onClick={() => handleExportCSV("customers")}
              className="text-[10px] text-[#C5A880] hover:text-white font-mono uppercase font-bold"
            >
              CSV
            </button>
          </div>
          <div className="space-y-3 text-xs">
            {data.bestCustomers.length === 0 ? (
              <p className="text-neutral-500 italic">No VIP records found.</p>
            ) : (
              data.bestCustomers.map((cust, i) => (
                <div key={i} className="flex justify-between items-center py-1 border-b border-white/5">
                  <div>
                    <span className="text-neutral-200 font-medium block">{cust.name}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{cust.phone}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">₹{cust.totalSpent.toLocaleString()} ({cust.visitCount} visits)</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

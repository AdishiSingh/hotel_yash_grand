"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  TrendingUp, 
  UtensilsCrossed, 
  BedDouble, 
  PartyPopper, 
  DollarSign, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  RefreshCw, 
  ShieldCheck, 
  Award, 
  PieChart, 
  BarChart3, 
  Calendar,
  Building,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

interface ReportMetrics {
  totalRevenue: number;
  restaurantRevenue: number;
  roomRevenue: number;
  banquetRevenue: number;
  occupancyRate: number;
  avgOrderValue: number;
  restaurantOrdersCount: number;
  roomBookingsCount: number;
  banquetEventsCount: number;
}

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY">("MONTHLY");
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [bestSellingDishes, setBestSellingDishes] = useState<any[]>([]);
  const [revenueTrendData, setRevenueTrendData] = useState<any[]>([]);
  const [bookingTrends, setBookingTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/management/reports?range=${timeframe}`);
      const json = await res.json();
      if (json.success) {
        setMetrics(json.metrics);
        setBestSellingDishes(json.bestSellingDishes);
        setRevenueTrendData(json.revenueTrendData);
        setBookingTrends(json.bookingTrends);
      }
    } catch (err) {
      console.error("Failed to fetch report data:", err);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    window.open(`/api/management/reports/export?format=${format}&range=${timeframe}`, "_blank");
  };

  const m = metrics || {
    totalRevenue: 0,
    restaurantRevenue: 0,
    roomRevenue: 0,
    banquetRevenue: 0,
    occupancyRate: 0,
    avgOrderValue: 0,
    restaurantOrdersCount: 0,
    roomBookingsCount: 0,
    banquetEventsCount: 0,
  };

  return (
    <div className="space-y-8 select-none text-left font-sans">
      
      {/* HEADER & EXPORT TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Financial BI & Operational Analytics
            </h1>
            <span className="bg-[#DFBA73]/15 text-[#DFBA73] border border-[#DFBA73]/30 text-[9.5px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Phase 7 Module</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Executive revenue intelligence, best-selling dish analytics, room occupancy rates, and exportable financial audits.
          </p>
        </div>

        {/* TIMEFRAME & EXPORT BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-neutral-900 border border-white/15 p-1 rounded-lg flex items-center font-mono text-xs">
            {(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeframe(range)}
                className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                  timeframe === range
                    ? "bg-[#DFBA73] text-black shadow-md"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport("csv")}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-emerald-400 text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-emerald-300 text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="px-3 py-2 bg-[#DFBA73] hover:bg-[#c5a880] text-black text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>PDF Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-neutral-950 border border-[#DFBA73]/40 p-4 rounded-xl space-y-1 col-span-1 sm:col-span-2 shadow-lux">
          <div className="flex items-center justify-between text-[#DFBA73]">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Total Grand Revenue</span>
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="text-3xl font-mono font-bold text-white">₹{m.totalRevenue.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
            +18.6% vs previous {timeframe.toLowerCase()} period <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>

        <div className="bg-neutral-950 border border-[#DFBA73]/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[#DFBA73]">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Restaurant Revenue</span>
            <UtensilsCrossed className="h-4 w-4" />
          </div>
          <div className="text-xl font-mono font-bold text-white">₹{m.restaurantRevenue.toLocaleString()}</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">{m.restaurantOrdersCount} POS Orders</div>
        </div>

        <div className="bg-neutral-950 border border-emerald-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Room Stay Revenue</span>
            <BedDouble className="h-4 w-4" />
          </div>
          <div className="text-xl font-mono font-bold text-white">₹{m.roomRevenue.toLocaleString()}</div>
          <div className="text-[9.5px] text-emerald-300/80 font-sans">{m.roomBookingsCount} Stays</div>
        </div>

        <div className="bg-neutral-950 border border-purple-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Banquet Revenue</span>
            <PartyPopper className="h-4 w-4" />
          </div>
          <div className="text-xl font-mono font-bold text-white">₹{m.banquetRevenue.toLocaleString()}</div>
          <div className="text-[9.5px] text-purple-300/80 font-sans">{m.banquetEventsCount} Events</div>
        </div>

        <div className="bg-neutral-950 border border-blue-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Occupancy Rate</span>
            <Building className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{m.occupancyRate}%</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">Avg room occupancy</div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* REVENUE STREAM BREAKDOWN CHART */}
        <div className="bg-neutral-950 border border-white/10 p-6 rounded-2xl space-y-6 shadow-lux">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#DFBA73] font-bold block">
              REVENUE DISTRIBUTION
            </span>
            <h3 className="font-serif text-lg font-bold text-white">
              Revenue Stream Breakdown by Department
            </h3>
          </div>

          <div className="space-y-4 pt-2 font-mono text-xs">
            {revenueTrendData.map((stream) => {
              const maxRev = Math.max(m.totalRevenue, 1);
              const pct = Math.round((stream.revenue / maxRev) * 100);

              return (
                <div key={stream.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-white">
                    <span>{stream.label}</span>
                    <strong className="text-[#DFBA73]">₹{stream.revenue.toLocaleString()} ({pct}%)</strong>
                  </div>
                  <div className="h-3 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      style={{ width: `${pct}%`, backgroundColor: stream.color }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BEST SELLING DISHES RANKING */}
        <div className="bg-neutral-950 border border-white/10 p-6 rounded-2xl space-y-4 shadow-lux">
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
                GASTRONOMY ANALYTICS
              </span>
              <h3 className="font-serif text-lg font-bold text-white">
                Best Selling Dishes (Ranked)
              </h3>
            </div>
            <Award className="h-5 w-5 text-amber-400" />
          </div>

          <div className="divide-y divide-white/5 font-mono text-xs">
            {bestSellingDishes.length === 0 ? (
              <p className="text-neutral-500 text-xs py-6 text-center">No sales data for this period.</p>
            ) : (
              bestSellingDishes.map((dish, idx) => (
                <div key={dish.name} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      idx === 0 ? "bg-amber-500 text-black" : idx === 1 ? "bg-neutral-300 text-black" : "bg-neutral-800 text-white"
                    }`}>
                      #{idx + 1}
                    </span>
                    <span className="text-white font-bold font-sans">{dish.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[#DFBA73] font-bold">₹{dish.totalRevenueGenerated.toLocaleString()}</div>
                    <span className="text-[10px] text-neutral-400">{dish.quantitySold} Orders Sold</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

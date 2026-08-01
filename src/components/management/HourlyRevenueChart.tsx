"use client";

import React, { useState } from "react";
import { TrendingUp, PieChart, Layers, ArrowUpRight, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { HourlyRevenueItem, DashboardMetrics } from "./types";

interface HourlyRevenueChartProps {
  data: HourlyRevenueItem[];
  metrics: DashboardMetrics;
}

export function HourlyRevenueChart({ data = [], metrics }: HourlyRevenueChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<HourlyRevenueItem | null>(null);

  const defaultData: HourlyRevenueItem[] = [
    { hour: "08 AM", value: 12000 },
    { hour: "10 AM", value: 24000 },
    { hour: "12 PM", value: 45000 },
    { hour: "02 PM", value: 32000 },
    { hour: "04 PM", value: 18000 },
    { hour: "06 PM", value: 28000 },
    { hour: "08 PM", value: 35000 },
  ];

  const chartPoints = data.length > 0 ? data : defaultData;
  const maxValue = Math.max(...chartPoints.map((d) => d.value), 50000);

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 20;

  const pointsString = chartPoints
    .map((item, idx) => {
      const x = paddingX + (idx / (chartPoints.length - 1)) * (svgWidth - paddingX * 2);
      const y = svgHeight - paddingY - (item.value / maxValue) * (svgHeight - paddingY * 2);
      return `${x},${y}`;
    })
    .join(" ");

  // Departmental revenue calculation
  const totalRev = metrics.todayRevenue || 1;
  const roomPct = Math.round(((metrics.roomRevenue || 0) / totalRev) * 100) || 55;
  const diningPct = Math.round(((metrics.restaurantRevenue || 0) / totalRev) * 100) || 25;
  const banquetPct = Math.round(((metrics.banquetRevenue || 0) / totalRev) * 100) || 20;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. HOURLY REVENUE TREND VISUALIZER */}
      <div className="lg:col-span-2 p-6 bg-[#12141A] rounded-2xl border border-[#C8A96A]/20 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C8A96A]/15 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#C8A96A]" />
              <h2 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
                Intraday Revenue Flow (Hourly Peak Telemetry)
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono">Realtime booking & POS transaction density</p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-emerald-400 font-bold bg-emerald-950/30 px-3 py-1 rounded-xl border border-emerald-500/30">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Peak Velocity: ₹{maxValue.toLocaleString()} / hr</span>
          </div>
        </div>

        {/* SVG CHART CONTAINER */}
        <div className="relative w-full overflow-hidden pt-2">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8A96A" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#C8A96A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* GRID LINES */}
            {[0.25, 0.5, 0.75, 1].map((pct, idx) => (
              <line
                key={idx}
                x1={paddingX}
                y1={svgHeight - paddingY - pct * (svgHeight - paddingY * 2)}
                x2={svgWidth - paddingX}
                y2={svgHeight - paddingY - pct * (svgHeight - paddingY * 2)}
                stroke="#C8A96A"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
            ))}

            {/* AREA FILL */}
            <polygon
              points={`${paddingX},${svgHeight - paddingY} ${pointsString} ${svgWidth - paddingX},${svgHeight - paddingY}`}
              fill="url(#chartGradient)"
            />

            {/* LINE PATH */}
            <polyline
              fill="none"
              stroke="#C8A96A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />

            {/* DATA POINTS & TOOLTIPS */}
            {chartPoints.map((item, idx) => {
              const x = paddingX + (idx / (chartPoints.length - 1)) * (svgWidth - paddingX * 2);
              const y = svgHeight - paddingY - (item.value / maxValue) * (svgHeight - paddingY * 2);
              const isHovered = hoveredPoint?.hour === item.hour;

              return (
                <g key={idx} onMouseEnter={() => setHoveredPoint(item)} onMouseLeave={() => setHoveredPoint(null)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 7 : 4}
                    className="fill-[#0B0B0B] stroke-[#C8A96A] stroke-2 cursor-pointer transition-all duration-200"
                  />
                  <text
                    x={x}
                    y={svgHeight - 2}
                    textAnchor="middle"
                    className="fill-slate-400 font-mono text-[10px]"
                  >
                    {item.hour}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* HOVER TOOLTIP */}
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-2 right-4 bg-[#0B0B0B] border border-[#C8A96A]/50 px-3 py-1.5 rounded-xl text-xs font-mono shadow-2xl text-white pointer-events-none"
            >
              <span className="text-slate-400">{hoveredPoint.hour}: </span>
              <span className="text-[#C8A96A] font-bold">₹{hoveredPoint.value.toLocaleString()}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* 2. DEPARTMENT REVENUE BREAKDOWN */}
      <div className="p-6 bg-[#12141A] rounded-2xl border border-[#C8A96A]/20 space-y-4 shadow-xl flex flex-col justify-between">
        <div className="border-b border-[#C8A96A]/15 pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-[#C8A96A]" />
            <h2 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
              Revenue Split by Segment
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">Distribution across core revenue centers</p>
        </div>

        {/* PROGRESS BARS */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Room Stay & Suites</span>
              <span className="text-[#C8A96A] font-bold">₹{metrics.roomRevenue.toLocaleString()} ({roomPct}%)</span>
            </div>
            <div className="h-2 w-full bg-[#0B0B0B] rounded-full overflow-hidden border border-[#C8A96A]/20">
              <div className="h-full bg-gradient-to-r from-[#C8A96A] to-amber-500 rounded-full" style={{ width: `${roomPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Dining & Room Service POS</span>
              <span className="text-amber-400 font-bold">₹{metrics.restaurantRevenue.toLocaleString()} ({diningPct}%)</span>
            </div>
            <div className="h-2 w-full bg-[#0B0B0B] rounded-full overflow-hidden border border-amber-500/20">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${diningPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-300">Banquets & Event Galas</span>
              <span className="text-purple-400 font-bold">₹{metrics.banquetRevenue.toLocaleString()} ({banquetPct}%)</span>
            </div>
            <div className="h-2 w-full bg-[#0B0B0B] rounded-full overflow-hidden border border-purple-500/20">
              <div className="h-full bg-purple-400 rounded-full" style={{ width: `${banquetPct}%` }} />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#C8A96A]/10 text-[10.5px] font-mono text-slate-400 flex items-center justify-between">
          <span>Gross Aggregate Today:</span>
          <span className="text-[#C8A96A] font-bold text-xs">₹{metrics.todayRevenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

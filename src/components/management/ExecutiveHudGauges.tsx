"use client";

import React from "react";
import { BedDouble, DollarSign, ArrowUpRight, CheckCircle2, AlertTriangle, LogIn, LogOut, Clock } from "lucide-react";
import { DashboardMetrics } from "./types";

interface ExecutiveHudGaugesProps {
  metrics: DashboardMetrics;
}

export function ExecutiveHudGauges({ metrics }: ExecutiveHudGaugesProps) {
  const {
    todayRevenue = 0,
    roomRevenue = 0,
    restaurantRevenue = 0,
    banquetRevenue = 0,
    totalRoomsCount = 24,
    occupiedRoomsCount = 0,
    availableRoomsCount = 0,
    maintenanceRoomsCount = 0,
    occupancyRatePercent = 0,
    todayCheckInsCount = 0,
    todayCheckOutsCount = 0,
    pendingRequestsCount = 0,
  } = metrics || {};

  // Radial SVG calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (occupancyRatePercent / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left font-sans">
      
      {/* 1. RADIAL OCCUPANCY GAUGE HUD */}
      <div className="p-6 bg-[#171E27] rounded-3xl border border-[#D4AF37]/30 shadow-xl flex items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3">
          <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
            Live Occupancy Telemetry
          </span>
          <div>
            <div className="text-3xl font-serif font-bold text-white">{occupancyRatePercent}%</div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {occupiedRoomsCount} of {totalRoomsCount} Luxury Suites Occupied
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono pt-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>{availableRoomsCount} Available</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>{occupiedRoomsCount} Occupied</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span>{maintenanceRoomsCount} Maint</span>
            </div>
          </div>
        </div>

        {/* RADIAL CIRCULAR GAUGE SVG */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#0B0F14"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#D4AF37"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <BedDouble className="h-5 w-5 text-[#D4AF37]" />
            <span className="text-xs font-mono font-bold text-white">{occupancyRatePercent}%</span>
          </div>
        </div>
      </div>

      {/* 2. REVENUE STREAM VELOCITY HUD */}
      <div className="lg:col-span-2 p-6 bg-[#171E27] rounded-3xl border border-[#D4AF37]/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-3">
          <div>
            <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              Revenue Stream Breakdown
            </span>
            <div className="text-2xl font-serif font-bold text-white flex items-center gap-2">
              ₹{todayRevenue.toLocaleString()}
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center">
                <ArrowUpRight className="h-4 w-4" /> +14.2%
              </span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-black border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* PROGRESS BARS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Room Stay</span>
              <span className="text-[#D4AF37] font-bold">₹{roomRevenue.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-[#0B0F14] rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-500 rounded-full w-[65%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Dining POS</span>
              <span className="text-amber-400 font-bold">₹{restaurantRevenue.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-[#0B0F14] rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-amber-400 rounded-full w-[45%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Banquet Galas</span>
              <span className="text-purple-400 font-bold">₹{banquetRevenue.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-[#0B0F14] rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-purple-400 rounded-full w-[80%]" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

"use client";

import React from "react";
import { Crown, Sun, Download, Printer, RefreshCw, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMetrics } from "./types";

interface ExecutiveHeroProps {
  metrics: DashboardMetrics;
  onExportCSV: () => void;
  onPrintReport: () => void;
  onRefresh: () => void;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
}

export function ExecutiveHero({
  metrics,
  onExportCSV,
  onPrintReport,
  onRefresh,
  autoRefreshEnabled,
  onToggleAutoRefresh,
}: ExecutiveHeroProps) {
  const {
    todayRevenue = 0,
    occupancyRatePercent = 0,
    availableRoomsCount = 0,
    occupiedRoomsCount = 0,
    maintenanceRoomsCount = 0,
    todayCheckInsCount = 0,
    todayCheckOutsCount = 0,
    pendingRequestsCount = 0,
  } = metrics || {};

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#12141A] via-[#161922] to-[#12141A] p-6 sm:p-8 border border-[#C8A96A]/30 shadow-2xl">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#C8A96A]/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[#C8A96A]/10 text-[#C8A96A] border border-[#C8A96A]/30 font-bold">
              <Crown className="h-3 w-3 text-[#C8A96A]" /> EXECUTIVE DESK ONLINE
            </span>
            <span className="text-xs font-mono text-slate-300 flex items-center gap-1">
              <Sun className="h-3.5 w-3.5 text-amber-400" /> Lucknow 28°C • {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Good Evening, <span className="text-[#C8A96A]">General Manager</span>
          </h1>

          <p className="text-xs text-slate-400 font-sans max-w-xl">
            Live operational telemetry across 24 Luxury Suites, POS Dining, Banquet Galas & Staff Rosters.
          </p>
        </div>

        {/* QUICK TOPBAR ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onToggleAutoRefresh}
            className={`px-3 py-1.5 rounded-xl border font-mono text-[11px] flex items-center gap-1.5 transition-all ${
              autoRefreshEnabled
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/40"
                : "bg-[#0B0B0B] text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
            title="Auto-refresh every 30s"
          >
            <Radio className={`h-3.5 w-3.5 ${autoRefreshEnabled ? "animate-pulse text-emerald-400" : ""}`} />
            <span>30s Polling: {autoRefreshEnabled ? "ON" : "OFF"}</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportCSV}
            startIcon={<Download className="h-4 w-4" />}
          >
            Export CSV
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onPrintReport}
            startIcon={<Printer className="h-4 w-4" />}
          >
            Print Report
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onRefresh}
            startIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh Realtime
          </Button>
        </div>
      </div>

      {/* 15-METRIC OWNER TELEMETRY BAR */}
      <div className="mt-8 pt-6 border-t border-[#C8A96A]/20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-center">
        <div className="p-2.5 bg-[#0B0B0B]/70 rounded-xl border border-[#C8A96A]/20">
          <div className="text-[9.5px] text-slate-400 uppercase font-medium">Rev Today</div>
          <div className="text-sm font-bold text-[#C8A96A]">₹{todayRevenue.toLocaleString()}</div>
        </div>

        <div className="p-2.5 bg-[#0B0B0B]/70 rounded-xl border border-[#C8A96A]/20">
          <div className="text-[9.5px] text-slate-400 uppercase font-medium">Occupancy</div>
          <div className="text-sm font-bold text-emerald-400">{occupancyRatePercent}%</div>
        </div>

        <div className="p-2.5 bg-[#0B0B0B]/70 rounded-xl border border-[#C8A96A]/20">
          <div className="text-[9.5px] text-slate-400 uppercase font-medium">Available</div>
          <div className="text-sm font-bold text-emerald-400">{availableRoomsCount}</div>
        </div>

        <div className="p-2.5 bg-[#0B0B0B]/70 rounded-xl border border-[#C8A96A]/20">
          <div className="text-[9.5px] text-slate-400 uppercase font-medium">Occupied</div>
          <div className="text-sm font-bold text-amber-400">{occupiedRoomsCount}</div>
        </div>

        <div className="p-2.5 bg-[#0B0B0B]/70 rounded-xl border border-[#C8A96A]/20">
          <div className="text-[9.5px] text-slate-400 uppercase font-medium">Maintenance</div>
          <div className="text-sm font-bold text-red-400">{maintenanceRoomsCount}</div>
        </div>

        <div className="p-2.5 bg-[#0B0B0B]/70 rounded-xl border border-[#C8A96A]/20">
          <div className="text-[9.5px] text-slate-400 uppercase font-medium">Check-ins</div>
          <div className="text-sm font-bold text-white">{todayCheckInsCount}</div>
        </div>

        <div className="p-2.5 bg-[#0B0B0B]/70 rounded-xl border border-[#C8A96A]/20">
          <div className="text-[9.5px] text-slate-400 uppercase font-medium">Check-outs</div>
          <div className="text-sm font-bold text-white">{todayCheckOutsCount}</div>
        </div>

        <div className="p-2.5 bg-[#0B0B0B]/70 rounded-xl border border-[#C8A96A]/20">
          <div className="text-[9.5px] text-slate-400 uppercase font-medium">Pending Approvals</div>
          <div className="text-sm font-bold text-amber-400">{pendingRequestsCount}</div>
        </div>
      </div>
    </section>
  );
}

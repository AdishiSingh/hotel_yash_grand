"use client";

import React, { useEffect, useState } from "react";
import { Crown, Sun, Download, Printer, RefreshCw, Radio, Sparkles, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMetrics } from "./types";

interface CommandCenterHeaderProps {
  metrics: DashboardMetrics;
  onExportCSV: () => void;
  onPrintReport: () => void;
  onRefresh: () => void;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
  onOpenCommandPalette: () => void;
}

export function CommandCenterHeader({
  metrics,
  onExportCSV,
  onPrintReport,
  onRefresh,
  autoRefreshEnabled,
  onToggleAutoRefresh,
  onOpenCommandPalette,
}: CommandCenterHeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const { occupancyRatePercent = 0, todayRevenue = 0, pendingRequestsCount = 0 } = metrics || {};

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#171E27] via-[#121820] to-[#171E27] p-6 sm:p-8 border border-[#D4AF37]/35 shadow-[0_15px_40px_rgba(0,0,0,0.7)] text-left select-none">
      {/* LUXURY GOLD AMBIENT GLOW */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#D4AF37]/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* BRANDING & LIVE STATUS */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10.5px] font-mono font-bold uppercase tracking-widest bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Crown className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>COMMAND CENTER • ACTIVE</span>
            </span>

            <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5 bg-[#0B0F14]/70 px-3 py-1 rounded-full border border-white/10">
              <Sun className="h-3.5 w-3.5 text-amber-400" />
              <span>Lucknow 28°C</span>
              <span className="text-slate-500">•</span>
              <span className="text-[#D4AF37] font-bold">{timeStr || "12:00 PM"}</span>
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
              Good Evening, <span className="text-[#D4AF37]">Dharmpal Gupta</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              HOTEL YASH GRAND Executive Command System • 24 Luxury Suites • Dining POS • Banquet Galas
            </p>
          </div>
        </div>

        {/* QUICK CONTROL TOOLS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenCommandPalette}
            className="px-3.5 py-2 rounded-xl bg-[#0B0F14] border border-[#D4AF37]/35 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-2 transition-all hover:border-[#D4AF37] shadow-md cursor-pointer"
          >
            <Command className="h-4 w-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">Search Command</span>
            <kbd className="bg-[#171E27] text-slate-400 px-1.5 py-0.5 text-[9.5px] rounded border border-slate-700">⌘K</kbd>
          </button>

          <button
            onClick={onToggleAutoRefresh}
            className={`px-3.5 py-2 rounded-xl border font-mono text-xs flex items-center gap-2 transition-all cursor-pointer ${
              autoRefreshEnabled
                ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/40"
                : "bg-[#0B0F14] text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
          >
            <Radio className={`h-3.5 w-3.5 ${autoRefreshEnabled ? "animate-pulse text-emerald-400" : ""}`} />
            <span>30s Sync: {autoRefreshEnabled ? "ON" : "OFF"}</span>
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
            Print
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onRefresh}
            startIcon={<RefreshCw className="h-4 w-4" />}
          >
            Sync
          </Button>
        </div>
      </div>
    </section>
  );
}

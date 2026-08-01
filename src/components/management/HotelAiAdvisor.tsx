"use client";

import React from "react";
import { Sparkles, TrendingUp, AlertTriangle, Info, Clock, DollarSign, Utensils, ShieldCheck } from "lucide-react";
import { generateBusinessInsights } from "@/ai/analytics/adminAiInsights";

export function HotelAiAdvisor() {
  const insights = generateBusinessInsights();

  return (
    <section className="p-6 bg-[#171E27] rounded-3xl border border-[#D4AF37]/30 shadow-2xl space-y-5 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 h-48 w-48 bg-[#D4AF37]/10 blur-[80px] pointer-events-none rounded-full" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D4AF37]/20 pb-4 gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-black border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-white tracking-wide">
              Hotel AI Operations Advisor
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Predictive revenue forecasting, peak occupancy algorithms & automated warnings
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 font-bold self-start sm:self-auto">
          <ShieldCheck className="h-3.5 w-3.5" /> SADYA AI ENGINE ACTIVE
        </span>
      </div>

      {/* INSIGHTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="p-4 bg-[#121820] rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                {ins.metric}
              </span>
              <div className="shrink-0">
                {ins.trend === "positive" && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                {ins.trend === "warning" && <AlertTriangle className="h-4 w-4 text-amber-400" />}
                {ins.trend === "neutral" && <Info className="h-4 w-4 text-slate-400" />}
              </div>
            </div>

            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              {ins.message}
            </p>
          </div>
        ))}
      </div>

      {/* QUICK PREDICTIVE TELEMETRY BADGES */}
      <div className="pt-3 border-t border-[#D4AF37]/15 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 bg-[#121820]/80 rounded-xl border border-[#D4AF37]/15 flex items-center justify-between">
          <div>
            <div className="text-[9.5px] text-slate-400 uppercase">Peak POS Hours</div>
            <div className="text-xs font-bold text-amber-400">08:00 PM - 10:30 PM</div>
          </div>
          <Clock className="h-4 w-4 text-amber-400 opacity-60" />
        </div>

        <div className="p-3 bg-[#121820]/80 rounded-xl border border-[#D4AF37]/15 flex items-center justify-between">
          <div>
            <div className="text-[9.5px] text-slate-400 uppercase">Menu Upsell Suggestion</div>
            <div className="text-xs font-bold text-[#D4AF37]">Mughlai Gala Thali</div>
          </div>
          <Utensils className="h-4 w-4 text-[#D4AF37] opacity-60" />
        </div>

        <div className="p-3 bg-[#121820]/80 rounded-xl border border-[#D4AF37]/15 flex items-center justify-between">
          <div>
            <div className="text-[9.5px] text-slate-400 uppercase">Tomorrow's Forecast</div>
            <div className="text-xs font-bold text-emerald-400">₹1,85,000 (+12%)</div>
          </div>
          <DollarSign className="h-4 w-4 text-emerald-400 opacity-60" />
        </div>

        <div className="p-3 bg-[#121820]/80 rounded-xl border border-[#D4AF37]/15 flex items-center justify-between">
          <div>
            <div className="text-[9.5px] text-slate-400 uppercase">Inventory Safety</div>
            <div className="text-xs font-bold text-emerald-400">All Reorder Levels OK</div>
          </div>
          <ShieldCheck className="h-4 w-4 text-emerald-400 opacity-60" />
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Lightbulb, ShieldAlert, Cpu, CheckCircle2 } from "lucide-react";
import { AiAnalyticsResponse } from "@/services/ai-analytics.service";

export function AiInsightsWidget() {
  const [aiData, setAiData] = useState<AiAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"insights" | "recommendations">("insights");

  useEffect(() => {
    async function loadAiAnalytics() {
      try {
        const res = await fetch("/api/ai/analytics");
        const json = await res.json();
        if (json.success && json.data) {
          setAiData(json.data);
        }
      } catch (err) {
        console.error("Failed to load AI analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAiAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-neutral-950 border border-gold/30 rounded-2xl animate-pulse space-y-3">
        <div className="flex items-center gap-2 text-gold text-xs font-mono">
          <Sparkles className="h-4 w-4 animate-spin" />
          <span>Generating AI Predictive Insights from PostgreSQL Data...</span>
        </div>
      </div>
    );
  }

  if (!aiData) return null;

  return (
    <div className="bg-neutral-950 border border-[#C5A880]/30 rounded-2xl p-6 space-y-6 shadow-lux">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              AI Decision Support & Predictive Insights
              <span className="px-2 py-0.5 rounded bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-[9px] font-mono font-bold uppercase tracking-wider">
                Live Engine
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              Machine-learning insights generated from PostgreSQL stay, sales, and guest behaviors.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-neutral-900 border border-white/10 p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "insights" ? "bg-[#C5A880] text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Insights ({aiData.insights.length})
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeTab === "recommendations" ? "bg-[#C5A880] text-black font-bold" : "text-neutral-400 hover:text-white"
            }`}
          >
            Recommendations
          </button>
        </div>
      </div>

      {/* AI Key Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-neutral-900/60 p-4 rounded-xl border border-white/5">
        <div>
          <span className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider">MoM Revenue Growth</span>
          <span className="font-serif text-xl font-bold text-emerald-400">+{aiData.kpis.revenueGrowthPercent}%</span>
        </div>
        <div>
          <span className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider">Occupancy Index</span>
          <span className="font-serif text-xl font-bold text-white">{aiData.kpis.occupancyGrowthPercent}%</span>
        </div>
        <div>
          <span className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider">Customer Lifetime Value</span>
          <span className="font-serif text-xl font-bold text-[#C5A880]">₹{aiData.kpis.customerLifetimeValue.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[9px] uppercase font-bold text-neutral-400 block tracking-wider">Guest Retention Rate</span>
          <span className="font-serif text-xl font-bold text-amber-300">{aiData.kpis.customerRetentionRate}%</span>
        </div>
      </div>

      {/* Tab 1: AI Insights */}
      {activeTab === "insights" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiData.insights.map((item, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/40 border border-white/10 p-4 rounded-xl space-y-2 hover:border-[#C5A880]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-[#C5A880] uppercase tracking-wider">
                  {item.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                    item.impactScore === "CRITICAL"
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : item.impactScore === "HIGH"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  {item.impactScore} Impact
                </span>
              </div>
              <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
              <p className="text-[11px] text-neutral-300 leading-relaxed font-light">{item.insight}</p>
              <div className="pt-2 border-t border-white/5 flex items-start gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-[10px] text-amber-200/90 italic leading-snug">{item.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Actionable AI Recommendations */}
      {activeTab === "recommendations" && (
        <div className="space-y-4 text-xs">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#C5A880] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Strategies to Increase Occupancy</span>
            </h4>
            <ul className="space-y-1 pl-4 list-disc text-neutral-300 text-[11px]">
              {aiData.recommendations.increaseOccupancy.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Strategies to Improve Restaurant Sales & Reduce Wastage</span>
            </h4>
            <ul className="space-y-1 pl-4 list-disc text-neutral-300 text-[11px]">
              {aiData.recommendations.improveSales.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
              {aiData.recommendations.reduceWastage.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import { generateBusinessInsights } from "@/ai/analytics/adminAiInsights";
import { Sparkles, TrendingUp, AlertTriangle, Info } from "lucide-react";

export function AiInsightsCard() {
  const insights = generateBusinessInsights();

  return (
    <div className="border border-neutral-800 bg-[#14161C]/50 rounded-xl p-6 space-y-4 text-left select-none">
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <Sparkles className="h-4.5 w-4.5 text-gold animate-pulse" />
        <h4 className="font-serif text-sm font-semibold text-white">Yash Grand AI Copilot</h4>
      </div>

      <div className="space-y-3.5">
        {insights.map((ins) => (
          <div key={ins.id} className="flex items-start gap-3 text-xs leading-relaxed">
            <div className="shrink-0 mt-0.5">
              {ins.trend === "positive" && (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              )}
              {ins.trend === "warning" && (
                <AlertTriangle className="h-4 w-4 text-red-400" />
              )}
              {ins.trend === "neutral" && (
                <Info className="h-4 w-4 text-[#DFBA73]" />
              )}
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">
                {ins.metric}
              </span>
              <p className="text-neutral-300 font-sans font-light select-text">{ins.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

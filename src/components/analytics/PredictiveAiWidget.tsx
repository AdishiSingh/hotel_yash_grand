"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BrainCircuit, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, HelpCircle, Layers } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";
import { PredictionResult } from "@/services/predictive-ai.service";

export function PredictiveAiWidget() {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningJob, setRunningJob] = useState(false);

  const fetchPredictions = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/predictive");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPredictions(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch predictions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useRealtime(["DASHBOARD_REFRESH"], () => {
    fetchPredictions();
  });

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const handleRunMlPipeline = async () => {
    setRunningJob(true);
    try {
      const res = await fetch("/api/ai/predictive", { method: "POST" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPredictions(json.data);
      }
    } catch (err) {
      console.error("Failed to run ML pipeline:", err);
    } finally {
      setRunningJob(false);
    }
  };

  const getModuleBadgeClass = (targetModule: string) => {
    switch (targetModule) {
      case "OCCUPANCY":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "REVENUE":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "INVENTORY":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "CHURN":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-neutral-950 border border-white/10 rounded-2xl animate-pulse text-xs font-mono text-neutral-400">
        Loading ML Predictive Intelligence Models...
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-6 shadow-lux">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              Predictive ML Intelligence & Explainable AI (XAI)
              <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[9px] font-mono font-bold uppercase tracking-wider">
                PostgreSQL ML
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-light">
              Time-series forecasts, occupancy demand, customer churn, and inventory depletion models.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunMlPipeline}
          disabled={runningJob}
          className="px-3.5 py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold text-xs rounded-lg flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${runningJob ? "animate-spin" : ""}`} />
          <span>{runningJob ? "Executing Pipeline..." : "Run ML Pipeline"}</span>
        </button>
      </div>

      {/* Grid of ML Forecast Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((p) => (
          <div
            key={p.id}
            className="bg-neutral-900/50 border border-white/10 p-4 rounded-xl space-y-3 hover:border-purple-500/30 transition-colors"
          >
            {/* Module Badge & Confidence Meter */}
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold uppercase tracking-wider ${getModuleBadgeClass(p.targetModule)}`}>
                {p.targetModule} • {p.predictionType}
              </span>

              {/* Confidence Meter */}
              <div className="flex items-center gap-1.5 bg-neutral-950 px-2 py-0.5 rounded border border-white/10 text-[10px] font-mono font-bold text-emerald-400">
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span>{p.confidenceScore}% Confidence</span>
              </div>
            </div>

            {/* Predicted Output Value */}
            <div className="font-serif text-sm font-semibold text-white leading-snug">
              {p.predictedValue}
            </div>

            {/* Explainable AI (XAI) Feature Importance Box */}
            <div className="p-2.5 bg-black/40 border border-white/5 rounded-lg space-y-1">
              <span className="text-[9px] font-mono font-bold text-[#C5A880] uppercase tracking-widest block">
                Explainable AI (XAI) Feature Importance:
              </span>
              <p className="text-[10px] text-neutral-300 leading-relaxed font-light font-sans">
                {p.explainableReason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

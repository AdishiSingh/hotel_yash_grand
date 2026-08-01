"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw, Sparkles } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to console or monitoring dashboards
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#F8F8F8] flex flex-col items-center justify-center text-center p-6 select-none font-sans relative overflow-hidden">
      {/* Background meshes */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-[0.05]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-gold animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold">
            HOTEL YASH GRAND
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-extralight text-white leading-tight">
            An Anomaly <span className="italic text-red-400 font-light">Has Occurred</span>
          </h1>
          <span className="text-[10.5px] uppercase tracking-widest text-neutral-500 font-mono block">
            Error Code 500 // System Fault
          </span>
        </div>

        <p className="text-xs text-neutral-400 font-sans font-light leading-relaxed">
          Our operations systems encountered an unexpected block during execution. Click retry below to reload or contact front desk support.
        </p>

        <div className="pt-4 font-buttons flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#DFBA73] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm cursor-pointer transition-all duration-500 shadow-md"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Operation</span>
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent border border-white/10 hover:border-gold/30 hover:bg-white/5 text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm cursor-pointer transition-all duration-300"
          >
            <span>Return Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}

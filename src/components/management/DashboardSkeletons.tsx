"use client";

import React from "react";

export function ExecutiveDashboardSkeleton() {
  return (
    <div className="space-y-8 pb-12 animate-pulse text-white" aria-busy="true" aria-label="Loading dashboard telemetry">
      {/* HERO SKELETON */}
      <div className="rounded-3xl bg-[#12141A] p-6 sm:p-8 border border-[#C8A96A]/20 space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div className="space-y-3 w-full max-w-lg">
            <div className="h-5 w-44 bg-neutral-800 rounded-full" />
            <div className="h-8 w-72 bg-neutral-800 rounded-xl" />
            <div className="h-4 w-96 bg-neutral-800/60 rounded-lg" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-28 bg-neutral-800 rounded-xl" />
            <div className="h-9 w-28 bg-neutral-800 rounded-xl" />
            <div className="h-9 w-36 bg-neutral-800 rounded-xl" />
          </div>
        </div>
        <div className="pt-6 border-t border-neutral-800/60 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 bg-[#0B0B0B] rounded-xl border border-neutral-800" />
          ))}
        </div>
      </div>

      {/* KPI CARDS SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 bg-[#12141A] rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-neutral-800 rounded" />
              <div className="h-9 w-9 bg-neutral-800 rounded-xl" />
            </div>
            <div className="h-7 w-36 bg-neutral-800 rounded-lg" />
            <div className="h-1.5 w-full bg-neutral-800 rounded-full" />
          </div>
        ))}
      </div>

      {/* CHARTS SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-72 bg-[#12141A] rounded-2xl border border-neutral-800 p-6" />
        <div className="h-72 bg-[#12141A] rounded-2xl border border-neutral-800 p-6" />
      </div>

      {/* ROOM MATRIX SKELETON */}
      <div className="p-6 bg-[#12141A] rounded-2xl border border-neutral-800 space-y-4">
        <div className="h-6 w-48 bg-neutral-800 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-24 bg-[#0B0B0B] rounded-xl border border-neutral-800" />
          ))}
        </div>
      </div>
    </div>
  );
}

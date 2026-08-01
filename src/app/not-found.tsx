"use client";

import React from "react";
import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F1115] text-[#F8F8F8] flex flex-col items-center justify-center text-center p-6 select-none font-sans relative overflow-hidden">
      {/* Background meshes */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-[0.05]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#DFBA73]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-gold animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-gold font-mono">404 — Page Not Found</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-wide font-light">
          Out of Bounds
        </h1>

        <p className="text-xs text-neutral-400 font-sans font-light leading-relaxed">
          The coordinates you requested do not point to any of our hotel rooms, restaurant halls, or operational panels. Let us guide you back.
        </p>

        <div className="pt-4 font-buttons">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#DFBA73] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm cursor-pointer transition-all duration-500 shadow-md"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Return to Grand Lobby</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

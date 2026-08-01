"use client";

import * as React from "react";
import { WhyChooseUsCards } from "@/components/about/WhyChooseUsCards";
import { Sparkles } from "lucide-react";

export function WhyChooseUs() {
  return (
    <section className="relative w-full py-28 sm:py-36 bg-[#171A21]/40 text-[#F8F8F8] overflow-hidden border-t border-b border-white/5">
      {/* Background meshes */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-[0.04]" />
      <div className="absolute -bottom-10 right-1/4 w-[300px] h-[300px] bg-[#8B5E3C]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-20">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto select-none">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold">
              02 // Why Hotel Yash Grand
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light">
            Luxury Defined by Service
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide pt-1">
            Setting the standard for luxury weddings, corporate banqueting, and premium family dining experiences in Varanasi.
          </p>
        </div>

        {/* Dynamic Features Cards Grid */}
        <WhyChooseUsCards />

      </div>
    </section>
  );
}

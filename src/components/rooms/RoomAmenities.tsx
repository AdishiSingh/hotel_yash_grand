import React from "react";
import { AmenitiesGrid } from "./AmenitiesGrid";
import { Sparkles } from "lucide-react";

export function RoomAmenities() {
  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold">
            03 // Suite Conveniences
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Modern In-Room Luxuries
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          Bespoke details engineered to make your Varanasi stay fully comfortable and seamless.
        </p>
      </div>

      {/* Grid of Amenities */}
      <AmenitiesGrid />
    </div>
  );
}

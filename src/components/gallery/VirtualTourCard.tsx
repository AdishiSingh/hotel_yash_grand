import React from "react";
import { Compass, Eye, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface VirtualTourCardProps {
  onScheduleClick: () => void;
}

export function VirtualTourCard({ onScheduleClick }: VirtualTourCardProps) {
  return (
    <div className="relative w-full border border-[#DFBA73]/15 rounded-2xl p-8 bg-[#14161C]/30 backdrop-blur-md overflow-hidden select-none shadow-lux flex flex-col items-center justify-center text-center space-y-6 mt-16 max-w-4xl mx-auto">
      {/* Decorative Radial Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,186,115,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Casing Icon */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="h-16 w-16 border border-gold/20 rounded-full flex items-center justify-center text-gold bg-black/60 relative shadow-md"
      >
        <Compass className="h-6 w-6" />
        <div className="absolute -inset-2 border border-gold/5 rounded-full scale-100 animate-pulse pointer-events-none" />
      </motion.div>

      {/* Label and Descriptions */}
      <div className="space-y-3.5 max-w-lg relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 border border-gold/15 rounded-full text-[8px] uppercase tracking-widest text-gold font-bold">
          <Sparkles className="h-2.5 w-2.5" />
          <span>360° Spatial Tour</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-light text-white leading-tight">
          Immersive Virtual Walkthroughs
        </h3>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A97E] block font-bold">
          Coming Soon // Matterport Powered
        </span>
        <p className="text-[11.5px] text-neutral-400 font-sans font-light leading-relaxed">
          Soon you will be able to stroll through our grand ballroom corridors, examine suite vanity layouts, and review restaurant seating plans in fully immersive 360-degree high definition.
        </p>
      </div>

      {/* CTA Trigger */}
      <div className="pt-2 font-buttons relative z-10">
        <button
          onClick={onScheduleClick}
          className="px-8 py-3.5 bg-[#DFBA73] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm flex items-center gap-2 cursor-pointer transition-all duration-500 shadow-md"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Schedule a Physical Visit</span>
        </button>
      </div>
    </div>
  );
}

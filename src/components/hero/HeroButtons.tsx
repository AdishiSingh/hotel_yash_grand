import React from "react";
import { Calendar, Utensils } from "lucide-react";
import { motion } from "framer-motion";

interface HeroButtonsProps {
  onBookStay: () => void;
}

export function HeroButtons({ onBookStay }: HeroButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex w-full flex-col items-center justify-center gap-3.5 pt-8 sm:pt-11 sm:flex-row md:justify-start select-none"
    >
      {/* 1. Primary Button: Book Your Stay */}
      <button
        onClick={onBookStay}
        aria-label="Book your room stay at Hotel Yash Grand"
        className="group relative flex w-full items-center justify-center gap-2.5 rounded-sm border border-[#E9D4A7]/50 bg-[#C5A880] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-[#17130D] shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-[#D7BA8A] hover:shadow-[0_15px_30px_rgba(197,168,128,0.3)] font-sans cursor-pointer sm:w-auto min-h-[48px] active:scale-[0.98]"
      >
        <Calendar className="w-4 h-4 text-black" />
        <span>Book Your Stay</span>
      </button>

      {/* 2. Secondary Button: Explore Restaurant */}
      <a
        href="/dining"
        aria-label="Explore Awadhi fine dining restaurant menu and table seating"
        className="group inline-flex w-full items-center justify-center gap-2.5 rounded-sm border border-white/[0.36] bg-black/20 px-8 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] backdrop-blur-md transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-[#E0C489]/75 hover:bg-white/[0.1] hover:text-[#F1D8A7] hover:shadow-[0_15px_30px_rgba(0,0,0,0.24)] font-sans cursor-pointer sm:w-auto min-h-[48px] active:scale-[0.98]"
      >
        <Utensils className="w-4 h-4 text-[#D4AF37]" />
        <span>Explore Restaurant</span>
      </a>

    </motion.div>
  );
}

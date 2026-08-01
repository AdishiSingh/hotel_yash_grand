"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MenuSearch({
  value,
  onChange,
  placeholder = "Search your favourite dishes...",
}: MenuSearchProps) {
  const [showHelperTooltip, setShowHelperTooltip] = useState(false);

  // Timed 2.5-second helper tooltip for first-time session visitors
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSeenTooltip = sessionStorage.getItem("has_seen_search_tooltip");
    if (!hasSeenTooltip) {
      const showTimer = setTimeout(() => {
        setShowHelperTooltip(true);
        sessionStorage.setItem("has_seen_search_tooltip", "true");

        // Auto dismiss after 5 seconds
        const dismissTimer = setTimeout(() => {
          setShowHelperTooltip(false);
        }, 5000);

        return () => clearTimeout(dismissTimer);
      }, 2500);

      return () => clearTimeout(showTimer);
    }
  }, []);

  return (
    <div className="relative w-full md:w-96 select-none font-sans">
      
      {/* FIRST-TIME SESSION HELPER TOOLTIP */}
      <AnimatePresence>
        {showHelperTooltip && !value && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute -top-14 left-0 z-30 p-3 bg-[#0F1115] border border-[#C5A880]/50 rounded-xl shadow-lux text-white space-y-0.5 cursor-pointer backdrop-blur-xl max-w-xs"
            onClick={() => setShowHelperTooltip(false)}
          >
            <div className="flex items-center gap-1.5 text-[#C5A880] text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Looking for something specific?</span>
            </div>
            <p className="text-[11px] text-neutral-300 font-light">
              Search your favourite dishes, cuisines, or ingredients here.
            </p>
            {/* Pointer Arrow */}
            <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#0F1115] border-r border-b border-[#C5A880]/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HIGHLIGHTED LUXURY SEARCH CONTAINER */}
      <div className="relative w-full flex items-center bg-neutral-900/90 border border-[#C5A880]/30 focus-within:border-[#C5A880] focus-within:shadow-[0_0_25px_rgba(197,168,128,0.25)] rounded-xl transition-all duration-300 min-h-[52px]">
        <Search className="absolute left-4 h-5 w-5 text-[#C5A880] shrink-0" />
        
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (showHelperTooltip) setShowHelperTooltip(false);
            onChange(e.target.value);
          }}
          className="w-full bg-transparent py-3.5 pl-12 pr-10 focus:outline-none text-sm text-white placeholder-neutral-400 font-sans tracking-wide font-normal"
        />

        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3.5 text-neutral-400 hover:text-[#C5A880] transition-colors cursor-pointer p-1 rounded-full hover:bg-white/5"
            aria-label="Clear search input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

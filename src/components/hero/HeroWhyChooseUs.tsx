"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const WHY_CHOOSE_US_ITEMS = [
  "Near Heritage Hospital",
  "Walking Distance from SMS College",
  "Near SHEPA College",
  "Comfortable Family Rooms",
  "Premium Restaurant",
  "Banquet for Weddings & Events",
  "Highway View Rooms",
  "Attached Balcony",
  "24×7 Room Service",
  "Direct Restaurant Food Delivery to Rooms",
  "Free High-Speed Wi-Fi",
];

export function HeroWhyChooseUs() {
  return (
    <section className="w-full py-16 sm:py-20 bg-[#0E1015] border-t border-b border-[#C5A880]/15 relative overflow-hidden select-none">
      {/* Soft background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-10">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A880] font-semibold font-sans">
              Hotel Yash Grand Highlights
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-light text-white tracking-wide">
            Why Choose Hotel Yash Grand
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-xl font-light leading-relaxed">
            Unmatched comfort, prime proximity to leading institutions, and authentic hospitality in Varanasi.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
        >
          {WHY_CHOOSE_US_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-4 py-3 rounded-sm bg-white/[0.03] border border-[#C5A880]/20 hover:border-[#C5A880]/50 hover:bg-white/[0.06] transition-all duration-300 backdrop-blur-sm shadow-sm"
            >
              <div className="flex items-center justify-center h-4.5 w-4.5 rounded-full bg-[#C5A880]/20 text-[#C5A880] shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-[13px] font-sans text-neutral-100 font-normal tracking-wide">
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

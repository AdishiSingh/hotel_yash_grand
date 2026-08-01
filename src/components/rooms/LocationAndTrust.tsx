"use client";

import React from "react";
import { MapPin, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function LocationAndTrust() {
  const locationHighlights = [
    "Near Heritage Hospital",
    "Near SHEPA College",
    "Walking Distance from SMS College",
    "Easy Highway Connectivity",
    "Convenient Location for Families, Business Travellers and Students",
    "Quick Access to Local Restaurants, Shopping and Transportation"
  ];

  const stayHighlights = [
    "Near Heritage Hospital",
    "Near SHEPA College",
    "Walking Distance from SMS College",
    "Highway View Rooms",
    "Attached Balcony",
    "24×7 Room Service",
    "Direct Restaurant Food Delivery",
    "Free High-Speed Wi-Fi",
    "LED Smart TV",
    "Comfortable Family-Friendly Stay"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 select-none border-t border-white/5 pt-28 w-full max-w-6xl mx-auto">
      {/* Column 1: Perfectly Located in Varanasi */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="p-8 border border-white/5 bg-[#14161C]/50 backdrop-blur-sm rounded-xl space-y-6 flex flex-col justify-between hover:border-[#DFBA73]/20 transition-colors duration-500"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold shrink-0" />
            <span className="text-[10px] uppercase tracking-widest text-[#C8A97E] font-bold">
              Location Advantages
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3.5xl font-light text-white leading-tight">
            Perfectly Located in Varanasi
          </h3>
          <p className="text-xs text-neutral-400 font-sans font-light leading-relaxed">
            Positioned near academic hubs and medical centers with excellent highway connectivity, HOTEL YASH GRAND offers convenient access for business and family stays.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
          {locationHighlights.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-[11px] text-neutral-300 font-sans font-light leading-relaxed">
              <span className="h-5 w-5 rounded bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <MapPin className="h-3 w-3" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Column 2: Why Stay at HOTEL YASH GRAND? */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="p-8 border border-white/5 bg-[#14161C]/50 backdrop-blur-sm rounded-xl space-y-6 flex flex-col justify-between hover:border-[#DFBA73]/20 transition-colors duration-500"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold shrink-0" />
            <span className="text-[10px] uppercase tracking-widest text-[#C8A97E] font-bold">
              Guest Value Checklist
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3.5xl font-light text-white leading-tight">
            Why Stay at HOTEL YASH GRAND?
          </h3>
          <p className="text-xs text-neutral-400 font-sans font-light leading-relaxed">
            A premium selection of amenities, private balconies, highway views, and delicious on-demand dining designed for a hassle-free Varanasi experience.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          {stayHighlights.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2.5 text-[11px] text-neutral-300 font-sans font-light">
              <span className="h-5 w-5 rounded bg-[#DFBA73]/10 text-[#DFBA73] flex items-center justify-center shrink-0">
                <Check className="h-3 w-3" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

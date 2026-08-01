"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, Shield, HeartHandshake, Utensils, Zap, HelpCircle } from "lucide-react";

const AMENITIES = [
  { icon: Compass, name: "Glossy Marble Floors", description: "Sleek, polished pathways reflecting indirect warmth." },
  { icon: HeartHandshake, name: "Bespoke Room Service", description: "Bespoke personal coordinates available 24/7." },
  { icon: Utensils, name: "Fine Awadhi Dining", description: "Heritage multi-cuisine menu at HOTEL YASH GRAND." },
  { icon: Shield, name: "Hygienic Kitchen", description: "Vegetables and culinary stations conforming to high hygiene standards." },
  { icon: Compass, name: "Valet Private Parking", description: "Convenient secure vehicle custody upon guest arrival." },
  { icon: Zap, name: "Acoustic Insulation", description: "Acoustic wooden buffer panels to guarantee deep rest." },
];

export function Amenities() {
  return (
    <section className="relative w-full py-28 sm:py-36 bg-[#0F1115] text-[#F8F8F8] overflow-hidden border-t border-white/5">
      
      {/* Decorative grids */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-[0.04]" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* Left Column - Large Typography Focus */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="flex items-center gap-2 select-none">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold">
              05 // The Sanctuary Experience
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight leading-[1.1]">
            Conveying peace, <br />
            <span className="italic font-light text-gold font-serif">crafted for you</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#A9A9A9] font-sans font-light leading-relaxed tracking-wide max-w-sm pt-2">
            Every specification is tailored to ensure seamless operations, quiet spaces, and absolute privacy.
          </p>
        </motion.div>

        {/* Right Column - Grid of Luxury cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
          {AMENITIES.map((amenity, idx) => {
            const IconComp = amenity.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="space-y-3.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#D4AF37]/40 select-none font-bold">
                    0{idx + 1}
                  </span>
                  <IconComp className="h-4 w-4 text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors duration-500" />
                </div>
                
                <h3 className="font-serif text-xl font-semibold text-[#F8F8F8] tracking-wide group-hover:text-[#D4AF37] transition-colors duration-300">
                  {amenity.name}
                </h3>
                <p className="text-xs text-[#A9A9A9] leading-relaxed font-sans font-light">
                  {amenity.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

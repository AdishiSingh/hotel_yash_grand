"use client";

import * as React from "react";
import { NEARBY_ATTRACTIONS_DATA } from "@/shared/data/nearby-attractions";
import { motion } from "framer-motion";
import { Sparkles, MapPin } from "lucide-react";

export function Attractions() {
  return (
    <section className="relative w-full py-28 sm:py-36 bg-[#171A21]/40 text-[#F8F8F8] overflow-hidden border-t border-[#D4AF37]/10">
      
      {/* Decorative meshes */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-[0.04]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-2xl space-y-4 mb-20 select-none">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold">
              08 // Spatial Proximity
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white">
            Varanasi at Your Doorstep
          </h2>
          <p className="text-xs sm:text-sm text-[#A9A9A9] font-sans font-light leading-relaxed tracking-wide pt-1">
            Conveniently situated near SMS College, Varanasi to bridge modern luxury travel with the timeless temples, ghats, and spiritual coordinates of the oldest living city.
          </p>
        </div>

        {/* Attractions List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {NEARBY_ATTRACTIONS_DATA.map((attraction, idx) => (
            <motion.div
              key={attraction.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="border border-white/5 bg-[#171A21]/60 p-6 rounded-xl space-y-4 hover:border-gold/25 transition-all duration-300 shadow-md group hover:bg-[#171A21]"
            >
              <div className="flex justify-between items-center select-none">
                <span className="text-[10px] font-mono text-gold tracking-widest uppercase font-bold flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-[#D4AF37]" />
                  {attraction.distance}
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#F8F8F8] group-hover:text-gold transition-colors duration-300">
                {attraction.name}
              </h3>
              <p className="text-xs text-[#A9A9A9] leading-relaxed font-sans font-light">
                {attraction.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

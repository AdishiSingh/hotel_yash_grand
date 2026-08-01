import React from "react";
import { Clock, MapPin, Sparkles, ChefHat, Users, CheckCircle } from "lucide-react";
import { RESTAURANT_DATA } from "@/data/restaurant";
import { motion } from "framer-motion";

export function RestaurantInfo() {
  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            05 // Operational Details
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Restaurant Specifications
        </h2>
      </div>

      {/* Grid of Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Gastronomy & Cuisine */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-[9px] uppercase tracking-widest text-[#DFBA73] font-bold">Dining & Cuisine</span>
            <ChefHat className="h-4 w-4 text-[#DFBA73]/60" />
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-base text-white font-medium">Cuisine</h4>
            <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed select-text">
              {RESTAURANT_DATA.cuisine}
            </p>
            <span className="text-[8px] uppercase tracking-widest text-[#DFBA73] font-bold block pt-1">
              Veg & Non-Veg Multi-Cuisine
            </span>
          </div>
        </motion.div>

        {/* Card 2: Operations & Hours */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-[9px] uppercase tracking-widest text-[#DFBA73] font-bold">Timing</span>
            <Clock className="h-4 w-4 text-[#DFBA73]/60" />
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-base text-white font-medium">Opening Hours</h4>
            <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed select-text">
              {RESTAURANT_DATA.openingHours}
            </p>
            <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold block pt-1">
              Open 7 Days a week
            </span>
          </div>
        </motion.div>

        {/* Card 3: Seating & Setup */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-[9px] uppercase tracking-widest text-[#DFBA73] font-bold">Capacity</span>
            <Users className="h-4 w-4 text-[#DFBA73]/60" />
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-base text-white font-medium">Seating Capacity</h4>
            <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed select-text">
              120+ Seats (Fully climate-controlled indoor dining space + family cabins).
            </p>
            <span className="text-[8px] uppercase tracking-widest text-gold font-bold block pt-1">
              Family-Friendly Seating
            </span>
          </div>
        </motion.div>

        {/* Card 4: Key Conveniences */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-[9px] uppercase tracking-widest text-[#DFBA73] font-bold">Services</span>
            <CheckCircle className="h-4 w-4 text-[#DFBA73]/60" />
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-base text-white font-medium">Dining Facilities</h4>
            <ul className="text-[10px] text-neutral-400 font-sans font-light leading-normal space-y-1">
              <li>• Safe on-site Valet Parking</li>
              <li>• Counter Takeaway Available</li>
              <li>• Digital QR Menu enabled</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

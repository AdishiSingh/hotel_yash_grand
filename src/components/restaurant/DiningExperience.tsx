import React from "react";
import Image from "next/image";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function DiningExperience() {
  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Column: Narrative storytelling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 space-y-6 text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
              04 // The Culinary Haven
            </span>
          </div>

          <div className="space-y-3.5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-bold block">
              Luxury Environment
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
              An Immersive Dining Sanctuary
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide select-text">
            Settle into a refined Veg & Non-Veg multi-cuisine sanctuary in Varanasi. Under architectural wooden panel ceilings, our family dining halls pair modern cooling systems with warm indirect lights. We deliver a quiet space built for shared celebrations, fine conversations, and absolute comfort.
          </p>

          <div className="grid grid-cols-2 gap-6 text-left pt-4">
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                Family Dining Chambers
              </h4>
              <p className="text-[10.5px] text-neutral-400 font-sans font-light leading-relaxed">
                Generously spaced tables and private chambers ensuring complete comfort and privacy.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                Air-Conditioned Comfort
              </h4>
              <p className="text-[10.5px] text-neutral-400 font-sans font-light leading-relaxed">
                Fully climate-controlled interiors letting you escape the humid city heat.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                Hygienic Preparation
              </h4>
              <p className="text-[10.5px] text-neutral-400 font-sans font-light leading-relaxed">
                Fresh meals prepared in a highly sanitary kitchen by certified culinary masters.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                Warm Indian Hospitality
              </h4>
              <p className="text-[10.5px] text-neutral-400 font-sans font-light leading-relaxed">
                Traditional table-side care delivering personal service for each guest.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Layered Collage */}
        <div className="lg:col-span-6 relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
          {/* Main Back Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="absolute top-0 left-0 w-4/5 h-4/5 border border-white/5 rounded-xl overflow-hidden shadow-lux bg-neutral-900"
          >
            <Image
              src={ASSET_MANIFEST.restaurant.diningSeatingOverview}
              alt="Hotel Yash Grand dining seating overview"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Front overlapping image */}
          <motion.div
            initial={{ opacity: 0, y: 30, x: 20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.25, ease: "easeOut" }}
            className="absolute bottom-0 right-0 w-3/5 h-3/5 border border-gold/15 p-1 bg-[#171A21] rounded-xl overflow-hidden shadow-lux"
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <Image
                src={ASSET_MANIFEST.restaurant.familyDiningRoom}
                alt="Hotel Yash Grand family dining room setup"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

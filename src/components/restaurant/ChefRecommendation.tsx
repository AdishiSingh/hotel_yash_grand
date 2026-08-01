import React from "react";
import Image from "next/image";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import { ChefHat, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ChefRecommendation() {
  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            03 // The Master Chef's Selection
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Chef Recommends
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          An exceptional, curated pairing representing the peak of our Awadhi culinary craft.
        </p>
      </div>

      {/* Main Feature Cards Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Large Plating Photo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative group"
        >
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden border border-gold/15 p-2 bg-[#171A21]/30 rounded-xl shadow-lux">
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <Image
                src="/assets/food/main-course/Paneer Tikka Masala.png"
                alt="Hotel Yash Grand Chef Signature Plating"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>
          {/* Floating Chef Recommendation Badge */}
          <div className="absolute top-6 right-6 bg-[#DFBA73] text-black px-4 py-2 text-[9px] uppercase tracking-[0.2em] font-bold rounded-sm shadow-md flex items-center gap-1.5 font-sans">
            <ChefHat className="h-3.5 w-3.5" />
            <span>Signature Combo</span>
          </div>
        </motion.div>

        {/* Right Column: Culinary Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 space-y-6 text-center lg:text-left"
        >
          <div className="space-y-3.5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#DFBA73] font-bold block">
              Awadhi Paneer & Naan Combo
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-white font-light tracking-wide leading-tight">
              Shahi Paneer Tikka Masala <br />
              <span className="italic font-light text-gold font-serif">with Garlic Butter Naan</span>
            </h3>
            <span className="font-mono text-xl text-[#DFBA73] font-semibold block">
              ₹399 <span className="text-xs text-neutral-500 font-sans font-light">all-inclusive</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide select-text">
            Indulge in clay-oven grilled paneer tikkas simmered in a highly seasoned tomato-onion masala gravy, served alongside fresh butter garlic naans. Prepared using organic cream and hand-ground spices for a rich, royal taste.
          </p>

          {/* Chef Quote Card */}
          <div className="p-5 border-l-2 border-[#DFBA73] bg-white/[0.01] text-left">
            <p className="text-[11.5px] italic text-neutral-300 font-serif leading-relaxed select-text">
              "We prepare this combination using traditional slow-cook methods in our tandoor woks, sourcing local dairy and whole spices daily to match Taj-level gourmet standards here in Kashi."
            </p>
            <span className="text-[8px] uppercase tracking-widest text-[#C8A97E] font-bold font-sans block mt-3">
              — Executive Chef, Hotel Yash Grand
            </span>
          </div>

          {/* CTA Link */}
          <div className="pt-4 flex justify-center lg:justify-start font-buttons">
            <a
              href="/dining"
              className="inline-flex items-center gap-2 text-[9.5px] uppercase tracking-[0.25em] font-bold text-white hover:text-[#DFBA73] transition-colors duration-300 group cursor-pointer"
            >
              <span>Explore Full Menu</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

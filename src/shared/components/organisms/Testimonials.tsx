"use client";

import * as React from "react";
import { REVIEWS_DATA } from "@/shared/data/reviews";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Quote } from "lucide-react";

export function Testimonials() {
  const [activeIdx, setActiveIdx] = React.useState(0);

  // Auto-play loop: change slide every 5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev === REVIEWS_DATA.length - 1 ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const currentReview = REVIEWS_DATA[activeIdx];

  return (
    <section className="relative w-full py-28 sm:py-36 bg-[#171A21]/40 text-[#F8F8F8] overflow-hidden border-t border-b border-white/5">
      
      {/* Background grids */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-[0.04]" />
      <div className="absolute -top-10 left-10 w-[300px] h-[300px] bg-[#8B5E3C]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-16">
        
        {/* Section Header */}
        <div className="space-y-4 select-none">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold">
              07 // Guest Memoirs
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light">
            Loved by Our Visitors
          </h2>
        </div>

        {/* Carousel Area */}
        <div className="relative min-h-[280px] sm:min-h-[220px] flex items-center justify-center bg-[#171A21]/50 border border-white/5 p-8 sm:p-12 rounded-2xl shadow-lux max-w-3xl mx-auto">
          
          {/* Quote large decoration icon */}
          <div className="absolute top-6 left-6 text-[#D4AF37]/5 select-none pointer-events-none">
            <Quote className="h-16 w-16 fill-[#D4AF37]/5" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center items-center space-y-6 w-full"
            >
              {/* Star ratings */}
              <div className="flex gap-1 items-center select-none">
                {Array.from({ length: currentReview.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                ))}
              </div>

              {/* Quote content */}
              <p className="font-serif text-base sm:text-xl font-light italic leading-relaxed text-[#A9A9A9] max-w-2xl px-2">
                "{currentReview.quote}"
              </p>

              {/* Author info */}
              <div className="text-xs sm:text-sm font-sans">
                <span className="font-semibold text-white tracking-wider">
                  {currentReview.author}
                </span>
                <span className="text-[#C8A97E] mx-2.5 font-light">|</span>
                <span className="text-[#C8A97E] text-[10px] uppercase tracking-widest font-semibold">
                  {currentReview.origin}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-3.5 pt-4">
          {REVIEWS_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === activeIdx ? "bg-[#D4AF37] w-8" : "bg-neutral-700 w-2 hover:bg-neutral-600"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

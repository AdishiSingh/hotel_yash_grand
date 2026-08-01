import React, { useState } from "react";
import Image from "next/image";
import { GALLERY_ITEMS } from "@/data/gallery";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FeaturedCarousel() {
  const featuredItems = React.useMemo(() => {
    return GALLERY_ITEMS.filter((item) => item.featured).slice(0, 6);
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % featuredItems.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  };

  if (featuredItems.length === 0) return null;

  return (
    <div className="space-y-12 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
              01 // Featured Moments
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
            Curated Visual Highlights
          </h2>
        </div>

        {/* Carousel arrows */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="h-10 w-10 border border-white/10 text-white rounded-full flex items-center justify-center hover:border-gold hover:text-gold cursor-pointer transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="h-10 w-10 border border-white/10 text-white rounded-full flex items-center justify-center hover:border-gold hover:text-gold cursor-pointer transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main viewport */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 shadow-lux bg-neutral-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={featuredItems[activeIndex].image || featuredItems[activeIndex].thumbnail}
              alt={featuredItems[activeIndex].alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            {/* Dark bottom shade */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none" />

            {/* Captions */}
            <div className="absolute bottom-8 left-8 right-8 text-left space-y-2 relative z-10">
              <span className="text-[8px] uppercase tracking-widest text-gold font-bold font-sans">
                Featured // {featuredItems[activeIndex].category.toUpperCase()}
              </span>
              <h3 className="font-serif text-xl sm:text-3xl text-white font-light tracking-wide leading-tight max-w-xl">
                {featuredItems[activeIndex].title}
              </h3>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-sans font-light leading-relaxed max-w-md hidden sm:block">
                {featuredItems[activeIndex].alt}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

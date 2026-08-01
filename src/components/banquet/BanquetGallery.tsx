import React, { useState } from "react";
import Image from "next/image";
import { BANQUET_DATA } from "@/data/banquet";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export function BanquetGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleOpen = (idx: number) => {
    setLightboxIndex(idx);
  };

  const handleClose = () => {
    setLightboxIndex(null);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % BANQUET_DATA.images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + BANQUET_DATA.images.length) % BANQUET_DATA.images.length);
  };

  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            02 // Visual Grandeur Gallery
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Pinterest-Style Gallery
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          Browse real photographs of our wedding stages, ballroom ceilings, and pre-function flower decorations.
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
        {BANQUET_DATA.images.map((img, idx) => {
          // Staggered heights for Pinterest layout
          const heightClass = idx % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/3]";
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onClick={() => handleOpen(idx)}
              className={`break-inside-avoid relative overflow-hidden border border-white/5 rounded-xl bg-neutral-900 shadow-md group cursor-pointer ${heightClass}`}
            >
              <Image
                src={img}
                alt={`Banquet Hall decor showcase ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Luxury gold hover vignette */}
              <div className="absolute inset-0 bg-[#0F1115]/30 group-hover:bg-[#DFBA73]/5 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Expand trigger icon */}
              <div className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-black/85 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="h-3.5 w-3.5 text-gold" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Fullscreen Portal Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={handleClose}
          >
            {/* Close trigger */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 h-10 w-10 bg-white/5 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer z-[110]"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Slider triggers */}
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/5 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer z-[110]"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/5 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer z-[110]"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Main Visual Image */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-[90vw] h-[80vh] max-w-5xl"
            >
              <Image
                src={BANQUET_DATA.images[lightboxIndex]}
                alt="Fullscreen banquet decor preview"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

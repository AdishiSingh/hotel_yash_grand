import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomGalleryProps {
  images: string[];
  name: string;
}

export function RoomGallery({ images, name }: RoomGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const trigger360Tour = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Experience a 360° virtual walk of this suite coming soon in Phase 6!");
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full aspect-[16/11] overflow-hidden rounded-lg bg-neutral-900 group/gallery select-none"
    >
      {/* 1. Image Rotator with Fade Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[currentIndex]}
            alt={`${name} photography ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[3000ms] ease-out group-hover/gallery:scale-105"
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>

      {/* Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/30 pointer-events-none" />

      {/* 2. Navigation Arrows (Visible on Hover) */}
      <AnimatePresence>
        {isHovered && images.length > 1 && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#0F1115]/80 backdrop-blur-sm border border-white/5 flex items-center justify-center text-white hover:text-gold cursor-pointer hover:bg-black transition-colors duration-300 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#0F1115]/80 backdrop-blur-sm border border-white/5 flex items-center justify-center text-white hover:text-gold cursor-pointer hover:bg-black transition-colors duration-300 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* 3. Dot Indicators */}
      <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              idx === currentIndex ? "w-4 bg-gold" : "w-1.5 bg-white/40"
            )}
          />
        ))}
      </div>

      {/* 4. Future 360 Virtual Tour Placeholder */}
      <button
        onClick={trigger360Tour}
        className="absolute top-4 left-4 bg-black/75 hover:bg-[#DFBA73] backdrop-blur-sm border border-gold/20 px-3 py-1 text-[8px] tracking-widest uppercase font-bold text-gold hover:text-black flex items-center gap-1.5 rounded-sm transition-all duration-300 cursor-pointer shadow-md"
      >
        <Eye className="h-2.5 w-2.5" />
        <span>360° Tour</span>
      </button>
    </div>
  );
}

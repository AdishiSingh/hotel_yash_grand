import React, { useEffect } from "react";
import Image from "next/image";
import { GalleryItem } from "@/data/gallery";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LightboxProps {
  items: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Lightbox({ items, activeIndex, onClose, onNext, onPrev }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, onNext, onPrev, onClose]);

  if (activeIndex === null) return null;
  const currentItem = items[activeIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 select-none"
        onClick={onClose}
      >
        {/* Controls Header */}
        <div className="flex items-center justify-between w-full relative z-10 text-white/80 select-none">
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-bold">
              Asset {activeIndex + 1} of {items.length}
            </span>
            <span className="text-[11px] font-sans font-light mt-1 text-white/90 max-w-lg hidden sm:block">
              {currentItem.alt}
            </span>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 border border-white/10 hover:border-gold hover:text-gold flex items-center justify-center transition-colors duration-300 cursor-pointer rounded-full bg-white/5"
            aria-label="Close Lightbox"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mid Viewport slider */}
        <div className="flex-1 flex items-center justify-between relative w-full h-full my-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="h-12 w-12 border border-white/10 hover:border-gold hover:text-gold flex items-center justify-center bg-black/40 backdrop-blur-sm transition-colors duration-300 z-10 cursor-pointer rounded-full"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            className="relative w-full max-w-4xl h-[70vh] mx-4 overflow-hidden border border-white/5 bg-neutral-950 p-2 rounded-xl"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()} // Disable download save
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              {currentItem.mediaType === "video" && currentItem.video ? (
                <video
                  src={currentItem.video}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={currentItem.image}
                  alt={currentItem.alt}
                  fill
                  sizes="100vw"
                  className="object-contain pointer-events-none select-none" // Block drag saving
                  priority
                />
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="h-12 w-12 border border-white/10 hover:border-gold hover:text-gold flex items-center justify-center bg-black/40 backdrop-blur-sm transition-colors duration-300 z-10 cursor-pointer rounded-full"
            aria-label="Next Image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Footer Details */}
        <div className="text-center py-2 select-none">
          <span className="text-[8px] uppercase tracking-[0.3em] text-gold font-bold">
            Category: {currentItem.category}
          </span>
          <p className="text-[10px] text-neutral-400 font-sans font-light mt-1 max-w-sm mx-auto block sm:hidden">
            {currentItem.alt}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

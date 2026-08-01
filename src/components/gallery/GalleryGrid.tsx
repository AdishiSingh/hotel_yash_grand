import React, { useState, useMemo } from "react";
import { GalleryItem } from "@/data/gallery";
import { GalleryCard } from "./GalleryCard";
import { Lightbox } from "./Lightbox";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount);
  }, [items, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, items.length));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % items.length);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + items.length) % items.length);
  };

  return (
    <div className="space-y-12">
      {/* Masonry Columns container */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, idx) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={idx}
              onClick={() => setLightboxIndex(idx)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-20 border border-dashed border-white/5 rounded-xl">
          <span className="text-sm text-neutral-500 uppercase tracking-widest block mb-2">No Assets Found</span>
          <p className="text-xs text-neutral-600">Please choose another category filter.</p>
        </div>
      )}

      {/* Load More Trigger */}
      {visibleCount < items.length && (
        <div className="flex justify-center pt-8 font-buttons select-none">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3.5 bg-transparent border border-white/10 hover:border-gold/30 hover:bg-white/[0.02] text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm cursor-pointer transition-all duration-300"
          >
            Load More Assets
          </button>
        </div>
      )}

      {/* Fullscreen Lightbox Portal */}
      <Lightbox
        items={items}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}

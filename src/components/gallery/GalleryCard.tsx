import React from "react";
import Image from "next/image";
import { GalleryItem } from "@/data/gallery";
import { Maximize2, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  onClick: () => void;
}

export function GalleryCard({ item, index, onClick }: GalleryCardProps) {
  // Staggered heights for Pinterest feel
  const aspectClass = index % 3 === 0 ? "aspect-[3/4]" : index % 3 === 1 ? "aspect-[4/3]" : "aspect-[1/1]";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`relative w-full break-inside-avoid overflow-hidden border border-white/5 rounded-xl bg-neutral-900 shadow-md group cursor-zoom-in ${aspectClass} mb-6`}
    >
      <Image
        src={item.image || item.thumbnail}
        alt={item.alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-105"
        loading="lazy"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-[#DFBA73]/5 transition-all duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

      {/* Hover info overlay details */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <span className="text-[8px] uppercase tracking-widest text-[#DFBA73] font-bold block">
            {item.category}
          </span>
          <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
            {item.title}
          </h4>
          <p className="text-[10px] text-neutral-400 font-sans font-light leading-relaxed line-clamp-2">
            {item.alt}
          </p>
          <div className="flex items-center gap-1.5 text-[8.5px] uppercase tracking-widest text-gold font-bold pt-1.5">
            <Maximize2 className="h-3 w-3" />
            <span>Maximize View</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const CATEGORIES = [
  { id: "all", label: "All Photos" },
  { id: "hotel", label: "Hotel & Lobby" },
  { id: "rooms", label: "Rooms & Suites" },
  { id: "restaurant", label: "Dining & Restaurant" },
  { id: "banquet", label: "Banquet Halls" },
  { id: "food", label: "Food & Dishes" }
] as const;

interface GalleryFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function GalleryFilters({ activeTab, onTabChange }: GalleryFiltersProps) {
  return (
    <div className="flex justify-center border-b border-white/5 pb-4 overflow-x-auto scrollbar-none gap-2 select-none">
      {CATEGORIES.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold px-4 py-3 transition-all duration-300 relative cursor-pointer flex-shrink-0",
              isActive ? "text-gold" : "text-neutral-400 hover:text-foreground"
            )}
          >
            {tab.label}
            {isActive && (
              <motion.span
                layoutId="galleryTabUnderline"
                className="absolute bottom-0 left-0 w-full h-[2px] bg-gold"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

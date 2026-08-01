import React from "react";
import { FilterType } from "./useMenu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MenuFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

interface FilterOption {
  value: FilterType;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Items" },
  { value: "veg", label: "Veg Only" },
  { value: "non-veg", label: "Non-Veg" },
  { value: "beverages", label: "Beverages" },
  { value: "popular", label: "Popular" },
  { value: "special", label: "Today's Special" }
];

export function MenuFilters({ activeFilter, onFilterChange }: MenuFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-1 border border-gold/15 bg-[#14161C]/50 rounded-full select-none max-w-full overflow-x-auto scrollbar-none">
      {FILTER_OPTIONS.map((opt) => {
        const isActive = activeFilter === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={cn(
              "px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer relative",
              isActive ? "text-black font-bold z-10" : "text-neutral-400 hover:text-white"
            )}
          >
            <span className="relative z-10">{opt.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 bg-[#DFBA73] rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

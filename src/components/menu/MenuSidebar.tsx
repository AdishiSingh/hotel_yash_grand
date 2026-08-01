import React from "react";
import { CategoryInfo } from "./useMenu";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MenuSidebarProps {
  categories: CategoryInfo[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export function MenuSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  className
}: MenuSidebarProps) {
  return (
    <aside
      className={cn(
        "bg-transparent lg:bg-[#14161C]/30 lg:border lg:border-gold/10 lg:p-6 lg:rounded-xl lg:shadow-lux space-y-4 lg:space-y-6 w-full overflow-hidden select-none",
        className
      )}
    >
      <h3 className="hidden lg:block font-serif text-[18px] text-gold border-b border-gold/10 pb-3 tracking-wide font-medium">
        Menu Categories
      </h3>

      <nav className="flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible pb-2.5 lg:pb-0 scrollbar-none px-1 lg:px-0">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "flex items-center justify-between gap-3 px-4 py-2.5 lg:py-3.5 border transition-all duration-300 cursor-pointer flex-shrink-0 text-left lg:w-full rounded-full lg:rounded-none text-xs lg:text-[13.5px] uppercase tracking-[0.12em] font-semibold relative overflow-hidden",
                isActive
                  ? "border-gold bg-gold/10 text-white shadow-[0_0_15px_rgba(223,186,115,0.08)]"
                  : "border-gold/10 text-neutral-400 bg-neutral-900/20 hover:border-gold/25 hover:text-white"
              )}
            >
              <div className="flex items-center gap-2.5 relative z-10">
                <span className="text-sm lg:text-base">{cat.icon}</span>
                <span>{cat.label}</span>
              </div>
              <span
                className={cn(
                  "text-[9px] font-mono font-medium px-2 py-0.5 rounded-full relative z-10 flex-shrink-0",
                  isActive ? "bg-gold text-black font-bold" : "bg-neutral-800 text-neutral-400"
                )}
              >
                {cat.count}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBorder"
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold hidden lg:block"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

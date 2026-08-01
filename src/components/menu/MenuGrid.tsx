import React from "react";
import { MenuItem } from "@/data/menu";
import { MenuCard } from "./MenuCard";
import { motion, AnimatePresence } from "framer-motion";

interface MenuGridProps {
  items: MenuItem[];
  onAddToBill: (item: MenuItem, selectedVariant?: { label: string; price: number }) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function MenuGrid({ items, onAddToBill }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full py-24 text-center space-y-4 border border-white/5 bg-[#14161C]/20 rounded-xl"
      >
        <span className="text-3xl block">🍽️</span>
        <p className="text-sm text-neutral-400 font-sans font-light tracking-wide">
          No gastronomy items match your search or filter parameters.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-[400px]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key="grid-container"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              layout
              className="h-full"
            >
              <MenuCard item={item} onAddToBill={onAddToBill} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

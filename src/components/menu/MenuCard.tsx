import React, { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/data/menu";
import { VegBadge } from "./VegBadge";
import { PriceTag } from "./PriceTag";
import { getFallbackDescription } from "./useMenu";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { Clock, Award, TrendingUp, Sparkles, Plus, Check } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
  onAddToBill: (item: MenuItem, selectedVariant?: { label: string; price: number }) => void;
  className?: string;
  isAdded?: boolean;
}

// Helper to determine special badges dynamically
const getItemBadge = (item: MenuItem): "Chef's Choice" | "Bestseller" | "New" | null => {
  if (item.featured) return "Chef's Choice";
  
  const bestSellers = ["soup-5", "starter-15", "starter-25", "rice-33", "rice-34", "main-38", "main-41", "main-57", "main-60"];
  if (bestSellers.includes(item.id)) return "Bestseller";

  const newItems = ["soup-7", "starter-18", "starter-20", "rice-31", "main-45", "main-59"];
  if (newItems.includes(item.id) || item.id.includes("-15") || item.id.includes("-18") || item.id.includes("-60") || item.id.includes("-70")) {
    return "New";
  }

  return null;
};

// Helper for preparation times
const getPrepTime = (item: MenuItem): string => {
  if (item.preparationTime) return item.preparationTime;
  const cat = item.category.toLowerCase();
  if (cat.includes("soup")) return "10m";
  if (cat.includes("salad")) return "5m";
  if (cat.includes("chinese") || cat.includes("noodles") || cat.includes("rice")) return "15m";
  if (cat.includes("main")) return "20m";
  if (cat.includes("dal")) return "15m";
  if (cat.includes("bread")) return "8m";
  if (cat.includes("tandoor")) return "18m";
  if (cat.includes("south")) return "12m";
  return "15m";
};

// Helper to generate initials for image fallbacks
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export function MenuCard({ item, onAddToBill, className }: MenuCardProps) {
  const [imageError, setImageError] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<{ label: string; price: number } | undefined>(
    item.variants && item.variants.length > 0 ? item.variants[0] : undefined
  );

  // 3D Tilt Card physics
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [6, -6]);
  const rotateY = useTransform(mouseX, [0, 1], [-6, 6]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const badge = getItemBadge(item);
  const prepTime = getPrepTime(item);
  const description = getFallbackDescription(item);
  const hasImage = !!item.image && !imageError;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileHover={{
        y: -6,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 20px rgba(197, 168, 128, 0.08)"
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col justify-between border border-white/5 bg-[#14161C] transition-all duration-300 hover:border-gold/20 rounded-xl overflow-hidden h-full select-none",
        className
      )}
    >
      <div style={{ transform: "translateZ(15px)" }} className="flex flex-col justify-between h-full flex-1">
        
        {/* 1. Large Food Image Area (16:9 aspect) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-950 border-b border-white/5 flex-shrink-0">
          {hasImage ? (
            <Image
              src={item.image!}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Premium fall-back for missing photos */
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 to-neutral-900 flex flex-col items-center justify-center p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.03)_0%,transparent_75%)]" />
              <div className="border border-gold/10 p-3 flex flex-col items-center justify-center w-full h-full rounded-sm">
                <span className="font-serif text-3xl font-extralight text-gold/25 tracking-[0.25em] transition-colors duration-500 group-hover:text-gold/40">
                  {getInitials(item.name)}
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-500 mt-2 font-medium">
                  Hotel Yash Grand
                </span>
              </div>
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <VegBadge type={item.type} />
          </div>

          {badge && (
            <div
              className={cn(
                "absolute top-2.5 right-2.5 z-10 px-2 py-0.5 text-[7px] uppercase tracking-wider font-bold border backdrop-blur-md rounded-[2px] flex items-center gap-1 shadow-sm",
                badge === "Chef's Choice" && "bg-neutral-950/90 text-gold border-gold/30",
                badge === "Bestseller" && "bg-neutral-950/90 text-amber-400 border-amber-400/20",
                badge === "New" && "bg-neutral-950/90 text-sky-400 border-sky-400/20"
              )}
            >
              {badge === "Chef's Choice" && <Award className="h-2 w-2" />}
              {badge === "Bestseller" && <TrendingUp className="h-2 w-2" />}
              {badge === "New" && <Sparkles className="h-2 w-2" />}
              <span>{badge}</span>
            </div>
          )}

          {/* Preparation Time */}
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/75 backdrop-blur-sm px-2 py-0.5 border border-white/5 rounded-[2px] text-[7.5px] uppercase tracking-widest text-neutral-300 font-sans font-medium flex items-center gap-1">
            <Clock className="h-2.5 w-2.5 text-gold/80" />
            <span>{prepTime}</span>
          </div>
        </div>

        {/* 2. Text Content & Variant Selector */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[8px] uppercase tracking-widest text-gold/80 font-semibold font-sans block">
              {item.category}
            </span>
            <h3 className="font-serif text-lg font-medium text-white group-hover:text-gold transition-colors duration-300 tracking-wide leading-tight">
              {item.name}
            </h3>
            <p className="text-xs text-neutral-400 font-sans font-light leading-relaxed tracking-wide line-clamp-3">
              {description}
            </p>

            {/* Custom variant tags if available */}
            {item.variants && item.variants.length > 0 && (
              <div className="flex gap-1.5 pt-2 flex-wrap">
                {item.variants.map((v) => {
                  const isSelected = selectedVariant?.label === v.label;
                  return (
                    <button
                      key={v.label}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariant(v);
                      }}
                      className={cn(
                        "px-2.5 py-0.5 text-[8px] uppercase tracking-widest font-semibold border transition-all duration-300 rounded-full cursor-pointer",
                        isSelected
                          ? "bg-gold border-gold text-black font-bold shadow-lux"
                          : "border-gold/15 bg-transparent hover:border-gold/40 text-gold/80 hover:text-white"
                      )}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Pricing and Add to Cart Action Footer */}
          <div className="pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-auto w-full shrink-0">
            <PriceTag
              price={item.price}
              displayPrice={item.displayPrice}
              selectedVariant={selectedVariant}
              className="shrink-0"
            />

            <motion.button
              whileHover={{ scale: item.available !== false ? 1.02 : 1 }}
              whileTap={{ scale: item.available !== false ? 0.98 : 1 }}
              disabled={item.available === false}
              onClick={(e) => {
                e.stopPropagation();
                if (item.available !== false) {
                  onAddToBill(item, selectedVariant);
                }
              }}
              className={cn(
                "h-11 min-h-[44px] px-3.5 sm:px-4 rounded-xl flex items-center justify-center gap-2",
                "bg-gradient-to-r from-[#C5A880] via-[#D4B78F] to-[#C5A880] hover:from-[#D4B78F] hover:to-[#C5A880]",
                "text-black font-semibold text-xs tracking-wider uppercase whitespace-nowrap",
                "shadow-md hover:shadow-[0_4px_20px_rgba(197,168,128,0.35)] transition-all duration-200 cursor-pointer border border-[#E5C890]/40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A880] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                "flex-1 sm:flex-initial min-w-0 max-w-full"
              )}
              aria-label={item.available === false ? `${item.name} is currently sold out` : `Add ${item.name} to cart`}
            >
              <Plus className="h-4 w-4 text-black shrink-0" />
              <span className="truncate">{item.available === false ? "Sold Out" : "Add to Cart"}</span>
            </motion.button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

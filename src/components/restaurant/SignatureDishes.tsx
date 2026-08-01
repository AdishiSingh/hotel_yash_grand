import React from "react";
import Image from "next/image";
import { MENU_ITEMS } from "@/data/menu";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SignatureDishes() {
  // Query featured dishes from the central menu dataset
  const featuredDishes = React.useMemo(() => {
    return MENU_ITEMS.filter((item) => item.featured).slice(0, 6);
  }, []);

  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
              02 // Gastronomic Signatures
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
            Curated Signature Dishes
          </h2>
        </div>
        <a
          href="/dining"
          className="inline-flex items-center gap-2 text-[9.5px] uppercase tracking-[0.25em] font-bold text-[#DFBA73] hover:text-white transition-colors duration-300 group cursor-pointer"
        >
          <span>Explore Full Menu</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredDishes.map((dish, idx) => (
          <motion.div
            key={dish.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between border border-white/5 bg-[#14161C]/50 rounded-xl overflow-hidden shadow-lux hover:border-[#DFBA73]/25 transition-all duration-500 p-3"
          >
            <div className="space-y-4">
              {/* Image Container with Fallback */}
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-neutral-900">
                {dish.image ? (
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                      Culinary Plating
                    </span>
                  </div>
                )}
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                {/* Veg/Non-veg Dot Badge */}
                <div className="absolute top-4 left-4 bg-black/75 border border-white/5 p-1.5 rounded-[2px] flex items-center justify-center">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      dish.type === "veg" ? "bg-emerald-500" : "bg-red-500"
                    )}
                    title={dish.type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
                  />
                </div>
              </div>

              {/* Text detail */}
              <div className="px-2.5 space-y-2">
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="font-serif text-lg font-semibold text-white group-hover:text-gold transition-colors duration-300">
                    {dish.name}
                  </h3>
                  <span className="font-mono text-sm text-[#DFBA73] font-semibold flex-shrink-0">
                    ₹{dish.price}
                  </span>
                </div>
                
                <span className="text-[8px] uppercase tracking-[0.2em] text-[#C8A97E] block font-bold">
                  {dish.category}
                </span>

                {dish.description && (
                  <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed line-clamp-2 select-text">
                    {dish.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* CTA action trigger */}
            <div className="pt-4 mt-4 border-t border-white/5 px-2.5 pb-1 flex justify-end font-buttons">
              <a
                href="/dining"
                className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 hover:text-[#DFBA73] flex items-center gap-1.5 group-hover:translate-x-1 transition-all duration-300"
              >
                <span>Order Now</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { Sparkles, Award, ChefHat, Heart, Utensils, Zap, ShieldCheck, Flame } from "lucide-react";
import { motion } from "framer-motion";

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: "Fresh Ingredients",
    desc: "Varanasi's freshest greens and quality grains sourced daily for authentic seasonings."
  },
  {
    icon: ChefHat,
    title: "Experienced Chefs",
    desc: "A culinary brigade trained to orchestrate authentic Indian and Awadhi slow-cook methods."
  },
  {
    icon: Flame,
    title: "Authentic Taste",
    desc: "Traditional clay-oven tandoor setups and house masalas yielding heritage flavors."
  },
  {
    icon: Award,
    title: "Premium Dining",
    desc: "Fine glassware, warm direct-ambient illumination, and grand solid wood interior trims."
  },
  {
    icon: Heart,
    title: "Family Restaurant",
    desc: "Generously spaced family seating chambers designed for complete peace and conversation."
  },
  {
    icon: Zap,
    title: "Fast Table Service",
    desc: "Prompt and professional hospitality crew ready to coordinate your order seamlessly."
  },
  {
    icon: ShieldCheck,
    title: "Hygienic Kitchen",
    desc: "Highly sanitary open-counter kitchen conforming to strict safety certifications."
  },
  {
    icon: Utensils,
    title: "Comfortable Seating",
    desc: "Plush, deep-cushioned upholstery configurations allowing ultimate physical relaxation."
  }
];

export function RestaurantHighlights() {
  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            01 // The Culinary Craft
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Crafting Fine Sensations
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          Every details is managed to shape a quiet, hygienic, and authentic family dining affair.
        </p>
      </div>

      {/* Grid */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-5%" }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {HIGHLIGHTS.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 15 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
              }}
              whileHover={{ y: -5, borderColor: "rgba(223,186,115,0.25)" }}
              className="p-6 border border-white/5 bg-[#14161C]/50 backdrop-blur-sm rounded-xl flex flex-col gap-4 transition-all duration-300 shadow-md group hover:bg-[#14161C]"
            >
              {/* Gold Icon */}
              <div className="h-10 w-10 border border-[#DFBA73]/15 rounded-lg flex items-center justify-center bg-[#0F1115] text-[#DFBA73] group-hover:bg-[#DFBA73] group-hover:text-black group-hover:shadow-[0_0_15px_rgba(223,186,115,0.25)] transition-all duration-500 shrink-0">
                <IconComp className="h-4.5 w-4.5" />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                  {item.title}
                </h4>
                <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

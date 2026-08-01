import React from "react";
import { Flame, Sparkles, Zap, Utensils, Award, Heart } from "lucide-react";
import { motion } from "framer-motion";

const ADVANTAGES = [
  {
    icon: Flame,
    title: "Authentic Recipes",
    desc: "Traditional Awadhi slow-cook seasonings prepared using hand-ground whole spices."
  },
  {
    icon: Sparkles,
    title: "Fresh Ingredients",
    desc: "Dairy items, farm paneer, and fresh greens sourced daily for healthy recipes."
  },
  {
    icon: Zap,
    title: "Fast Table Service",
    desc: "A highly responsive restaurant crew coordinating food preparation and delivery quickly."
  },
  {
    icon: Utensils,
    title: "Comfortable Dining",
    desc: "Fully air-conditioned luxury chambers featuring high wood ceilings and soft cushions."
  },
  {
    icon: Award,
    title: "Affordable Luxury",
    desc: "A fine-dining experience matching Taj-level preparations at accessible rates."
  },
  {
    icon: Heart,
    title: "Professional Care",
    desc: "Attentive table-side service prioritizing children and family dining requests."
  }
];

export function WhyDineWithUs() {
  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            07 // Direct Guest Commitments
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Why Dine With Us?
        </h2>
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {ADVANTAGES.map((item, idx) => {
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

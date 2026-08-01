import React from "react";
import { Bed, MapPin, Heart, Sparkles, Smile, Shield, Utensils, Award } from "lucide-react";
import { motion } from "framer-motion";

const REASONS = [
  {
    icon: Bed,
    title: "Comfortable Rooms",
    desc: "Plush, deep-cushion beds and soundproofing panels that guarantee quiet rest."
  },
  {
    icon: MapPin,
    title: "Prime Location",
    desc: "Positioned close to SMS College with swift connectivity to spiritual temples and ghats."
  },
  {
    icon: Heart,
    title: "Excellent Hospitality",
    desc: "A warm, responsive team trained to assist you around the clock with signature warmth."
  },
  {
    icon: Sparkles,
    title: "Affordable Luxury",
    desc: "Premium boutique settings, quality linens, and marble baths at sensible rates."
  },
  {
    icon: Smile,
    title: "Family Friendly",
    desc: "A safe, secure, and clean environment suitable for family vacations and corporate retreats."
  },
  {
    icon: Shield,
    title: "Secure Valet Parking",
    desc: "Gated on-site parking spots monitored by security cameras 24/7."
  },
  {
    icon: Utensils,
    title: "Restaurant Inside",
    desc: "A multi-cuisine Veg & Non-Veg restaurant serving warm Awadhi delicacies."
  },
  {
    icon: Award,
    title: "Banquet Facilities",
    desc: "A grand ballroom and lawn spaces configured to hold up to 500 guests."
  }
];

export function WhyStayWithUs() {
  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold">
            04 // The Yash Grand Advantage
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Why Stay With Us?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          Uncompromised standards designed to deliver peaceful comfort during your Varanasi visit.
        </p>
      </div>

      {/* Grid of Cards */}
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
        {REASONS.map((item, idx) => {
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

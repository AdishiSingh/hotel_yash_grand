import React from "react";
import { Award, Sparkles, Maximize, Paintbrush, Smile, Briefcase, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";

const ADVANTAGES = [
  {
    icon: Award,
    title: "Premium Interior",
    desc: "Grand columnless design featuring handcrafted wood ceiling accents and white marbles."
  },
  {
    icon: Sparkles,
    title: "Elegant Lighting",
    desc: "Customizable warm direct-ambient lighting setups matching wedding photography requirements."
  },
  {
    icon: Maximize,
    title: "Spacious Hall & Lawn",
    desc: "A massive 6,000 sq ft ballroom integrated with outdoor lawns to hold up to 500+ guests."
  },
  {
    icon: Paintbrush,
    title: "Flexible Decoration",
    desc: "Coordinate with our top-tier panels or bring your chosen styling team to shape your theme."
  },
  {
    icon: Smile,
    title: "Family Friendly",
    desc: "A safe, clean sanctuary equipped with comfortable bridal lounges and family dining woks."
  },
  {
    icon: Briefcase,
    title: "Corporate Ready",
    desc: "Soundproofing boards, high-speed WiFi, lapel mics, and coffee tables for business meets."
  },
  {
    icon: MapPin,
    title: "Prime Location",
    desc: "Conveniently situated near SMS College with secure valet zones and simple highway access."
  },
  {
    icon: Heart,
    title: "Professional Service",
    desc: "A dedicated banquet manager and support crew coordinating logistics, staging, and catering."
  }
];

export function WhyChooseBanquet() {
  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            05 // The Yash Grand Standard
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Why Choose Our Banquet?
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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

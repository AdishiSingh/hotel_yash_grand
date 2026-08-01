import React from "react";
import { Wifi, Wind, Tv, Clock, Car, Utensils, Award, Headphones, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

const AMENITIES = [
  {
    icon: Wifi,
    title: "Free High-Speed WiFi",
    desc: "Uncapped, high-bandwidth connection across all rooms and public spaces."
  },
  {
    icon: Wind,
    title: "Air Conditioning",
    desc: "Whisper-quiet climate control setups customized to your absolute preference."
  },
  {
    icon: Tv,
    title: "Smart LED TV",
    desc: "Flat-screen TVs loaded with premium satellite channels and casting setups."
  },
  {
    icon: Clock,
    title: "24/7 Room Service",
    desc: "Bespoke in-room gourmet dining, linens, and assistance available at any hour."
  },
  {
    icon: Car,
    title: "Spacious Valet Parking",
    desc: "Private, secure on-site vehicle parking with active round-the-clock watch."
  },
  {
    icon: Utensils,
    title: "Veg & Non-Veg Restaurant",
    desc: "Award-winning fine dining serving authentic North Indian and Awadhi recipes."
  },
  {
    icon: Award,
    title: "Grand Banquet Halls",
    desc: "Pre-function spaces and ballrooms crafted to host royal wedding functions."
  },
  {
    icon: Headphones,
    title: "24/7 Reception Desk",
    desc: "Personalized guest check-in, local travel concierge, and immediate help."
  },
  {
    icon: Sparkles,
    title: "Daily Housekeeping",
    desc: "Rigorous cleaning protocols and sanitization matching high luxury standards."
  },
  {
    icon: Zap,
    title: "100% Power Backup",
    desc: "Automatic generator fail-safes ensuring uninterrupted cooling and power."
  }
];

export function AmenitiesGrid() {
  return (
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 select-none"
    >
      {AMENITIES.map((item, idx) => {
        const IconComp = item.icon;
        return (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 15 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            whileHover={{ y: -5, borderColor: "rgba(223,186,115,0.25)" }}
            className="p-5 border border-white/5 bg-[#14161C]/50 backdrop-blur-sm rounded-xl flex flex-col justify-between gap-4 transition-all duration-300 shadow-md group hover:bg-[#14161C]"
          >
            {/* Header / Icon */}
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-mono text-neutral-600 font-bold group-hover:text-gold/40 transition-colors">
                0{idx + 1}
              </span>
              <IconComp className="h-4.5 w-4.5 text-[#DFBA73]/60 group-hover:text-[#DFBA73] transition-colors duration-500" />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-xs font-semibold text-white tracking-wide leading-normal">
                {item.title}
              </h4>
              <p className="text-[10px] text-neutral-400 font-sans font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

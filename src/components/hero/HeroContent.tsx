import React from "react";
import { motion } from "framer-motion";
import { MapPin, GraduationCap, PartyPopper } from "lucide-react";

const LOCATION_CHIPS = [
  { label: "Near Heritage Hospital", icon: MapPin },
  { label: "Walking Distance to SMS College", icon: GraduationCap },
  { label: "Banquet • Restaurant • Rooms", icon: PartyPopper },
];

export function HeroContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full space-y-10 text-center md:text-left select-none"
    >
      <div className="space-y-6">
        <motion.h1
          variants={itemVariants}
          className="font-serif text-3xl min-[375px]:text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal text-white leading-[1.1] tracking-[-0.028em] select-text drop-shadow-[0_3px_18px_rgba(0,0,0,0.28)]"
        >
          HOTEL YASH GRAND
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="font-sans text-[11px] sm:text-sm lg:text-base font-medium leading-relaxed tracking-[0.29em] text-[#E0C489] uppercase"
        >
          Restaurant • Banquet • Premium Stay
        </motion.div>
      </div>

      <motion.p
        variants={itemVariants}
        className="max-w-[520px] text-[15px] sm:text-base text-[#E5E1DA] font-sans font-normal leading-7 sm:leading-8 tracking-[0.01em] text-center md:text-left select-text drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
      >
        Experience premium hospitality, authentic dining, comfortable stays and memorable celebrations in the heart of Varanasi.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex max-w-[35rem] flex-wrap items-center justify-center gap-3 pt-1 md:justify-start"
      >
        {LOCATION_CHIPS.map((chip, idx) => {
          const IconComponent = chip.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl border border-white/[0.16] bg-white/[0.08] px-3.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-[#E0C489]/45 hover:bg-white/[0.13] hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
            >
              <IconComponent className="h-3.5 w-3.5 text-[#E0C489]" />
              <span className="text-[10px] sm:text-[11px] font-sans font-medium text-white tracking-[0.015em]">
                {chip.label}
              </span>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

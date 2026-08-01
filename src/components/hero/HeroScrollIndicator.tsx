import React from "react";
import { motion } from "framer-motion";

export function HeroScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
      className="relative z-10 w-full pb-8 flex flex-col items-center justify-center text-center select-none"
    >
      <span className="text-[7.5px] uppercase tracking-[0.4em] text-neutral-400 mb-3.5 font-bold font-sans">
        Scroll Down
      </span>
      
      {/* Scroll Mouse Shape */}
      <div className="w-[18px] h-[30px] border border-[#C5A880]/50 rounded-full flex justify-center p-1.5 relative overflow-hidden">
        {/* Animated wheel dot */}
        <motion.div
          animate={{
            y: [0, 8, 0],
            opacity: [1, 0.2, 1]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="h-1.5 w-1.5 bg-[#C5A880] rounded-full"
        />
      </div>
    </motion.div>
  );
}

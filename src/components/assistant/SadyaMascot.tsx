"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface SadyaMascotProps {
  size?: number;
  className?: string;
}

/**
 * SADYA — Royal Digital Hospitality Concierge Mascot Logo
 * Crafted in Hotel Yash Grand's luxury gold (#C5A880), ebony (#0F1115), and ivory (#F5EBE0) palette.
 * Represents royal Indian hospitality with a friendly, welcoming, editorial cartoon aesthetic.
 */
export function SadyaMascot({ size = 48, className = "" }: SadyaMascotProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.06 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(197,168,128,0.25)]"
      >
        {/* Outer Royal Golden Aura Ring */}
        <circle cx="50" cy="50" r="48" fill="#0F1115" stroke="#C5A880" strokeWidth="2.5" />
        
        {/* Subtle Decorative Inner Ring */}
        <circle cx="50" cy="50" r="43" stroke="#C5A880" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

        {/* Royal Turban Base (Gold & Ivory Waves) */}
        <path
          d="M24 40 C24 24, 38 16, 50 16 C62 16, 76 24, 76 40 C76 45, 72 48, 68 50 C58 55, 42 55, 32 50 C28 48, 24 45, 24 40 Z"
          fill="url(#turbanGoldGrad)"
        />

        {/* Royal Feather Crest (Kalgi) */}
        <path
          d="M50 16 C48 8, 52 4, 50 1 C47 4, 48 10, 50 16 Z"
          fill="#E0C489"
          stroke="#F5EBE0"
          strokeWidth="0.8"
        />
        <circle cx="50" cy="16" r="3" fill="#D4AF37" />

        {/* Concierge Face (Warm Ivory Tone) */}
        <ellipse cx="50" cy="52" rx="20" ry="22" fill="#F5EBE0" />

        {/* Friendly Expressive Eyes */}
        <ellipse cx="43" cy="48" rx="2.5" ry="3.5" fill="#0F1115" />
        <ellipse cx="57" cy="48" rx="2.5" ry="3.5" fill="#0F1115" />
        
        {/* Eye Catchlights */}
        <circle cx="44" cy="47" r="1" fill="#FFFFFF" />
        <circle cx="58" cy="47" r="1" fill="#FFFFFF" />

        {/* Subtle Tilak / Royal Welcoming Dot */}
        <circle cx="50" cy="42" r="1.8" fill="#C5A880" />

        {/* Friendly Warm Smile */}
        <path
          d="M44 58 C47 62, 53 62, 56 58"
          stroke="#8B5E3C"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Royal Black Collar & Gold Bow-Tie / Coat */}
        <path
          d="M30 72 L50 82 L70 72 L74 96 H26 Z"
          fill="#171A21"
          stroke="#C5A880"
          strokeWidth="1.5"
        />
        
        {/* Namaste Golden Lapel Brooch */}
        <path
          d="M50 72 L46 78 L50 84 L54 78 Z"
          fill="#C5A880"
        />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="turbanGoldGrad" x1="24" y1="16" x2="76" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0C489" />
            <stop offset="50%" stopColor="#C5A880" />
            <stop offset="100%" stopColor="#8B5E3C" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

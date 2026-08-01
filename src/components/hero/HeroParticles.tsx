import React from "react";
import { motion } from "framer-motion";

// Pre-generated positions for subtle golden dust specs
const DUST_PARTICLES = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  size: 2 + (i % 3), // 2px - 4px
  initialX: (i * 5.5 + 2) % 95, // % across screen width
  initialY: (i * 7 + 10) % 90, // % down screen height
  duration: 12 + (i % 7) * 2, // 12s - 24s
  delay: (i % 5) * 1.5,
  driftX: (i % 2 === 0 ? 1 : -1) * (15 + (i % 4) * 10),
}));

export function HeroParticles() {
  return (
    <div className="absolute inset-0 z-[2] select-none pointer-events-none overflow-hidden">
      {/* 1. Soft Cinematic Light Rays (Subtle golden light beams) */}
      <div className="absolute -top-20 right-1/4 w-[600px] h-[700px] opacity-15 rotate-[-25deg] bg-gradient-to-b from-[#C5A880]/20 via-[#C5A880]/5 to-transparent blur-3xl pointer-events-none" />

      {/* 2. Floating Golden Dust Particles */}
      {DUST_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.initialX}vw`,
            y: `${p.initialY}vh`,
            opacity: 0.1,
            scale: 0.8,
          }}
          animate={{
            y: [`${p.initialY}vh`, `${Math.max(0, p.initialY - 25)}vh`],
            x: [
              `${p.initialX}vw`,
              `calc(${p.initialX}vw + ${p.driftX}px)`,
            ],
            opacity: [0.1, 0.45, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: "reverse",
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          className="absolute rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]"
        />
      ))}
    </div>
  );
}

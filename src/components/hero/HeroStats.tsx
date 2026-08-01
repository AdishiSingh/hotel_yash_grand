import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface CounterStatProps {
  targetNum?: number;
  displayText?: string;
  suffix?: string;
  label: string;
}

function StatCounter({ targetNum, displayText, suffix = "", label }: CounterStatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView || targetNum === undefined) return;

    let start = 0;
    const end = targetNum;
    const duration = 1800; // 1.8 seconds
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      // Quad ease-out
      const easeProgress = progress * (2 - progress);

      setCount(Math.floor(easeProgress * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, targetNum]);

  return (
    <div ref={ref} className="text-center md:text-left space-y-1">
      <span className="font-serif text-3xl sm:text-4xl text-[#C5A880] font-normal tracking-wide block">
        {displayText ? displayText : `${count}${suffix}`}
      </span>
      <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#A1A1AA] font-sans block leading-normal font-medium">
        {label}
      </span>
    </div>
  );
}

export function HeroStats() {
  return (
    <section className="relative overflow-hidden border-y border-[#C5A880]/15 bg-[#0E1015] px-6 py-14 sm:py-16 md:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.05)_0%,transparent_58%)] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto grid w-full max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10 select-none"
      >
        <StatCounter targetNum={11} label="Luxury Rooms" />
        <StatCounter targetNum={50} suffix="+" label="Restaurant Seating" />
        <StatCounter displayText="150–200" label="Banquet Capacity" />
        <StatCounter displayText="Prime Location" label="Varanasi Highway" />
      </motion.div>
    </section>
  );
}

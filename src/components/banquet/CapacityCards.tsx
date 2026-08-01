import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Utensils, Maximize2, Car, Wind, Sparkles } from "lucide-react";

interface StatProps {
  icon: any;
  target?: number;
  suffix?: string;
  staticVal?: string;
  label: string;
}

function StatCard({ icon: Icon, target, suffix = "", staticVal, label }: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView || !target) return;

    const start = 0;
    const end = target;
    const duration = 2000;
    const startTime = performance.now();

    const updateVal = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // quad ease out
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(updateVal);
      }
    };

    requestAnimationFrame(updateVal);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-4 hover:border-gold/15 transition-all duration-300">
      <div className="mx-auto h-11 w-11 border border-[#DFBA73]/15 rounded-lg flex items-center justify-center bg-black text-[#DFBA73]">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="space-y-1.5">
        <span className="font-serif text-3xl text-white font-medium block">
          {target ? `${count}${suffix}` : staticVal}
        </span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-sans block font-semibold">
          {label}
        </span>
      </div>
    </div>
  );
}

export function CapacityCards() {
  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            04 // Hall Metrics
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Ballroom Specifications
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
        <StatCard icon={Users} target={500} suffix="+" label="Guests Capacity" />
        <StatCard icon={Utensils} target={350} suffix="+" label="Dining Capacity" />
        <StatCard icon={Maximize2} staticVal="32' x 16'" label="Stage Size" />
        <StatCard icon={Car} target={100} suffix="+" label="Valet Parking" />
        <StatCard icon={Wind} staticVal="100% AC" label="Air Conditioned" />
        <StatCard icon={Sparkles} staticVal="Flexible" label="Decor Support" />
      </div>
    </div>
  );
}

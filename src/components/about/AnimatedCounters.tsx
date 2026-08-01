import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, BedDouble, UtensilsCrossed, PartyPopper, MapPin, ConciergeBell } from "lucide-react";

interface GlanceCardProps {
  numberVal?: number;
  suffix?: string;
  displayText?: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
}

function GlanceCard({ numberVal, suffix = "", displayText, subtitle, description, icon: Icon }: GlanceCardProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!isInView || numberVal === undefined) return;

    const start = 0;
    const end = numberVal;
    const duration = 1800;
    const startTime = performance.now();

    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // quad ease out
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }, [isInView, numberVal]);

  return (
    <div
      ref={ref}
      className="p-7 border border-white/10 bg-[#14161C]/50 backdrop-blur-md rounded-xl flex-1 min-w-[240px] max-w-[340px] hover:border-[#C5A880]/35 transition-all duration-300 shadow-md group flex flex-col justify-between space-y-4"
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <span className="font-serif text-4xl sm:text-5xl text-[#C5A880] font-light tracking-wide block">
          {displayText ? displayText : `${count}${suffix}`}
        </span>
        <div className="h-10 w-10 rounded-lg bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] group-hover:bg-[#C5A880] group-hover:text-black transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs uppercase tracking-[0.2em] text-white font-sans font-semibold">
          {subtitle}
        </h3>
        <p className="text-xs text-neutral-300 font-sans font-light leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function AnimatedCounters() {
  return (
    <div className="space-y-12 select-none">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A880] font-bold">
            Hotel Yash Grand Highlights
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight uppercase tracking-wide">
          HOTEL YASH GRAND AT A GLANCE
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 font-sans font-light leading-relaxed tracking-wide">
          Everything you need for a comfortable stay, delicious dining, and memorable celebrations.
        </p>
      </div>

      {/* Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto"
      >
        <GlanceCard
          numberVal={11}
          subtitle="Premium Rooms"
          description="Comfortable and well-maintained rooms for business travellers, couples and families."
          icon={BedDouble}
        />
        <GlanceCard
          numberVal={50}
          suffix="+"
          subtitle="Restaurant Seating"
          description="Spacious family restaurant serving North Indian, Chinese, South Indian and more."
          icon={UtensilsCrossed}
        />
        <GlanceCard
          displayText="150–200"
          subtitle="Banquet Capacity"
          description="Ideal venue for weddings, birthdays, engagements, corporate events and family celebrations."
          icon={PartyPopper}
        />
        <GlanceCard
          displayText="Prime"
          subtitle="Location"
          description="Near Heritage Hospital, Near SHEPA College and Walking Distance from SMS College."
          icon={MapPin}
        />
        <GlanceCard
          displayText="24×7"
          subtitle="Hospitality"
          description="24×7 Room Service, Free Wi-Fi and Direct Restaurant Food Delivery to Rooms."
          icon={ConciergeBell}
        />
      </motion.div>
    </div>
  );
}

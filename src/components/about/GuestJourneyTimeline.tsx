import React from "react";
import { motion } from "framer-motion";
import { Sparkles, CalendarCheck, Hotel, CookingPot, PartyPopper, Heart } from "lucide-react";

const STEPS = [
  {
    title: "Book Your Stay",
    desc: "Reserve your room or banquet online or contact us directly for personalized assistance.",
    icon: CalendarCheck
  },
  {
    title: "Check In",
    desc: "Receive a warm welcome and enjoy a smooth, hassle-free check-in experience.",
    icon: Hotel
  },
  {
    title: "Relax & Dine",
    desc: "Stay in comfortable rooms and enjoy delicious food from our in-house restaurant with direct room service.",
    icon: CookingPot
  },
  {
    title: "Celebrate",
    desc: "Host birthdays, anniversaries, family gatherings, meetings or special events in our banquet hall.",
    icon: PartyPopper
  },
  {
    title: "Leave with Memories",
    desc: "Experience genuine hospitality and leave with memorable moments from HOTEL YASH GRAND.",
    icon: Heart
  }
];

export function GuestJourneyTimeline() {
  return (
    <div className="space-y-16 select-none">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A880] font-bold">
            Guest Experience Lifecycle
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight uppercase tracking-wide">
          Your Experience at HOTEL YASH GRAND
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 font-sans font-light leading-relaxed tracking-wide">
          From booking to checkout, every step is designed for comfort and convenience.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-2xl mx-auto px-4">
        {/* Continuous vertical timeline connector line */}
        <div className="absolute left-[31px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#C5A880]/50 via-[#C5A880]/20 to-transparent" />

        {/* Timeline Steps */}
        <div className="space-y-10">
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: Math.min(idx * 0.08, 0.4), ease: "easeOut" }}
                className="flex items-start gap-6 relative group"
              >
                {/* Node icon and pulsing ring */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="h-10 w-10 border border-[#C5A880]/30 rounded-full flex items-center justify-center bg-[#0F1115] text-[#C5A880] group-hover:bg-[#C5A880] group-hover:text-black transition-all duration-500 shadow-md">
                    <StepIcon className="h-4.5 w-4.5" />
                  </div>
                  {/* Outer pulsing ring for active visual trigger */}
                  <div className="absolute -inset-1 rounded-full border border-[#C5A880]/15 scale-100 group-hover:scale-125 group-hover:opacity-0 transition-all duration-700 pointer-events-none" />
                </div>

                {/* Step content card */}
                <div className="space-y-1.5 pt-1 flex-1 border-b border-white/5 pb-5 group-hover:border-[#C5A880]/20 transition-colors duration-300">
                  <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold block">
                    STEP 0{idx + 1}
                  </span>
                  <h3 className="font-serif text-lg font-normal text-white tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

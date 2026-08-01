import React from "react";
import { Compass, Eye, Calendar, Paintbrush, Award, Smile, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const JOURNEY_STEPS = [
  {
    title: "Enquiry",
    desc: "Submit your guest list size, calendar dates, and event format through our digital portals.",
    icon: Compass
  },
  {
    title: "Venue Visit",
    desc: "Tour the Ballroom and outdoor lawn setups alongside our banquet coordinators.",
    icon: Eye
  },
  {
    title: "Booking Confirmation",
    desc: "Deposit the booking advance to secure and block the date on our reservation grids.",
    icon: Calendar
  },
  {
    title: "Decoration Planning",
    desc: "Finalize theme designs, staging dimensions, floral decors, and lighting grids.",
    icon: Paintbrush
  },
  {
    title: "The Celebration",
    desc: "Host your dream weddings or corporate meets while our crew coordinates logistics.",
    icon: Award
  },
  {
    title: "Unforgettable Memories",
    desc: "Depart with a heart full of joy, gorgeous photographs, and happy guests.",
    icon: Smile
  }
];

export function GuestJourney() {
  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            07 // Event Milestones
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Event Planning Journey
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          An overview of the collaborative phases shaped to coordinate your grand celebration.
        </p>
      </div>

      {/* Timeline track */}
      <div className="relative max-w-2xl mx-auto px-4">
        {/* Connector line */}
        <div className="absolute left-[31px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#DFBA73]/50 via-[#DFBA73]/10 to-transparent" />

        <div className="space-y-10">
          {JOURNEY_STEPS.map((step, idx) => {
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
                {/* Node circular casing */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="h-9 w-9 border border-[#DFBA73]/30 rounded-full flex items-center justify-center bg-[#0F1115] text-[#DFBA73] group-hover:bg-[#DFBA73] group-hover:text-black transition-all duration-500 shadow-lux">
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <div className="absolute -inset-1 rounded-full border border-gold/10 scale-100 group-hover:scale-125 group-hover:opacity-0 transition-all duration-700 pointer-events-none" />
                </div>

                {/* Card details */}
                <div className="space-y-1.5 pt-1.5 flex-1 border-b border-white/5 pb-4 group-hover:border-gold/15 transition-colors duration-300">
                  <span className="text-[8.5px] uppercase tracking-widest text-[#DFBA73] font-bold block">
                    Phase 0{idx + 1} // {step.title}
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                    {step.title}
                  </h4>
                  <p className="text-[11.5px] text-neutral-400 font-sans font-light leading-relaxed">
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

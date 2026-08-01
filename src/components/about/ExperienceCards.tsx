import React from "react";
import Image from "next/image";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/features/booking/store/use-booking-store";
import { useBookingGuard } from "@/context/BookingGuardContext";

const EXPERIENCES = [
  {
    title: "Luxury Stay",
    image: ASSET_MANIFEST.rooms.royalSuite,
    desc: "Bespoke hotel rooms crafted for deep rest and ultimate relaxation.",
    ctaLabel: "Reserve Suite",
    type: "room"
  },
  {
    title: "Fine Restaurant",
    image: ASSET_MANIFEST.restaurant.diningSeatingOverview,
    desc: "Curated multi-cuisine recipes prepared fresh daily by master culinary artists.",
    ctaLabel: "View Menu",
    link: "/dining"
  },
  {
    title: "Grand Banquet Ballroom",
    image: ASSET_MANIFEST.banquet.emptyGrandHall,
    desc: "State-of-the-art ballroom accommodating up to 500 guests for celebrations.",
    ctaLabel: "Inquire Booking",
    type: "banquet"
  },
  {
    title: "Family Celebrations",
    image: ASSET_MANIFEST.restaurant.familyDiningRoom,
    desc: "Intimate private dining spaces to host anniversaries and family functions.",
    ctaLabel: "Reserve Table",
    type: "dining"
  },
  {
    title: "Corporate Events",
    image: ASSET_MANIFEST.banquet.ceilingArchitecture,
    desc: "Refined conference settings equipped with professional audio-visual controls.",
    ctaLabel: "Book Conference",
    type: "banquet"
  },
  {
    title: "Birthday Parties",
    image: ASSET_MANIFEST.restaurant.diningTables,
    desc: "Vibrant dining tables and dedicated event planning for memorable milestones.",
    ctaLabel: "Plan Party",
    type: "dining"
  },
  {
    title: "Elegant Banquet Hall",
    image: "/assets/banquet/banquethall.png",
    desc: "Celebrate weddings, birthdays, anniversaries, corporate events and family gatherings in our beautifully designed banquet hall.",
    ctaLabel: "Explore Banquet",
    link: "/banquet"
  }
];

export function ExperienceCards() {
  const { setDrawerOpen, setBookingType } = useBookingStore();
  const { requireAuth } = useBookingGuard();

  const handleActionClick = (exp: typeof EXPERIENCES[0]) => {
    if (exp.link) {
      window.location.href = exp.link;
    } else {
      requireAuth(() => {
        if (exp.type) setBookingType(exp.type as any);
        setDrawerOpen(true);
      });
    }
  };

  return (
    <div className="space-y-16 select-none">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold">
            02 // Curated Stays & Affairs
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Signature Experiences
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          Bespoke services tailored to shape unforgettable moments, celebrations, and retreats.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EXPERIENCES.map((exp, idx) => {
          // Make the last one span full width on desktop for visual balance
          const isLast = idx === EXPERIENCES.length - 1;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative group overflow-hidden border border-white/5 rounded-xl aspect-[16/11] sm:aspect-[4/3] bg-neutral-900 shadow-lux flex flex-col justify-end p-6 md:p-8 cursor-pointer",
                isLast && "lg:col-span-3 lg:aspect-[16/5]"
              )}
              onClick={() => handleActionClick(exp)}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={exp.image}
                  alt={`${exp.title} photography`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={cn(
                    "object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-105",
                    isLast && "object-[center_58%] saturate-[1.08] sepia-[0.08]"
                  )}
                  loading="lazy"
                />
                {/* Luxury overlay fader */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-950/10 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-neutral-950/30 group-hover:bg-[#DFBA73]/5 transition-colors duration-500" />
              </div>

              {/* Text content */}
              <div className={cn(
                "relative z-10 space-y-3",
                isLast && "lg:max-w-2xl"
              )}>
                <h3 className="font-serif text-xl sm:text-2xl text-white tracking-wide group-hover:text-gold transition-colors duration-300">
                  {exp.title}
                </h3>
                <p className="text-xs text-neutral-300 font-sans font-light leading-relaxed max-w-sm">
                  {exp.desc}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-bold text-gold group-hover:translate-x-1.5 transition-transform duration-300">
                  <span>{exp.ctaLabel}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

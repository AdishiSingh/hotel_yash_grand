import React from "react";
import Image from "next/image";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import { motion } from "framer-motion";
import { Calendar, Users, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const EVENTS = [
  {
    title: "Royal Weddings",
    image: ASSET_MANIFEST.banquet.stageSetup,
    desc: "Complete planning coordinates, grand stage decor, bridal setups, and buffet systems.",
    capacity: "Up to 500 Guests",
    type: "banquet"
  },
  {
    title: "Wedding Receptions",
    image: ASSET_MANIFEST.banquet.emptyGrandHall,
    desc: "Spacious layout matching grand celebrations, gourmet catering, and valet coverage.",
    capacity: "Up to 500 Guests",
    type: "banquet"
  },
  {
    title: "Engagement Ceremonies",
    image: ASSET_MANIFEST.banquet.flowerDecoration,
    desc: "Intimate seating arrangements and customized floral configurations.",
    capacity: "Up to 300 Guests",
    type: "banquet"
  },
  {
    title: "Corporate Conferences",
    image: ASSET_MANIFEST.banquet.ceilingArchitecture,
    desc: "Soundproofing boards, projectors, lapel mics, and coffee service configurations.",
    capacity: "Up to 150 Guests",
    type: "banquet"
  },
  {
    title: "Birthday Milestones",
    image: ASSET_MANIFEST.restaurant.diningTables,
    desc: "Children-friendly menus, theme lighting, and custom staging details.",
    capacity: "Up to 200 Guests",
    type: "dining"
  },
  {
    title: "Anniversaries & Socials",
    image: ASSET_MANIFEST.restaurant.familyDiningRoom,
    desc: "Elegant dining tables, background music coordination, and private spaces.",
    capacity: "Up to 150 Guests",
    type: "dining"
  }
];

export function EventTypes() {
  const handleBooking = (type: string) => {
    // Open global booking drawer on window
    const event = new CustomEvent("openBookingDrawer", {
      detail: { type }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            03 // Event Formats
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Suited for Every Occasion
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          From grand marriage celebrations to quiet corporate setups, we mold our hall to fit your exact coordinates.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EVENTS.map((event, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between border border-white/5 bg-[#14161C]/50 rounded-xl overflow-hidden shadow-lux hover:border-[#DFBA73]/25 transition-all duration-500 p-3 cursor-pointer"
            onClick={() => handleBooking(event.type)}
          >
            <div className="space-y-4">
              {/* Image Frame */}
              <div className="relative w-full aspect-[16/11] overflow-hidden rounded-lg bg-neutral-900">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                
                {/* Capacity badge */}
                <div className="absolute bottom-4 left-4 bg-black/75 border border-white/5 px-2.5 py-1 text-[8.5px] uppercase tracking-wider text-gold font-sans font-semibold rounded-sm flex items-center gap-1.5">
                  <Users className="h-3 w-3" />
                  <span>{event.capacity}</span>
                </div>
              </div>

              {/* Text content */}
              <div className="px-2 space-y-2">
                <h3 className="font-serif text-lg font-semibold text-white group-hover:text-gold transition-colors duration-300">
                  {event.title}
                </h3>
                <p className="text-[11.5px] text-neutral-400 font-sans font-light leading-relaxed">
                  {event.desc}
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 mt-4 border-t border-white/5 px-2 pb-1 flex justify-end font-buttons">
              <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 group-hover:text-[#DFBA73] flex items-center gap-1.5 transition-colors duration-300">
                <span>Inquire Booking</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

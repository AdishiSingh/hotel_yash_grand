"use client";

import React from "react";
import { ROOMS_DATA } from "@/data/rooms";
import { RoomCard } from "./RoomCard";
import { RoomAmenities } from "./RoomAmenities";
import { WhyStayWithUs } from "./WhyStayWithUs";
import { LocationAndTrust } from "./LocationAndTrust";
import { BookingCTA } from "./BookingCTA";
import { useBookingStore } from "@/features/booking/store/use-booking-store";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function RoomsSection() {
  const { setDrawerOpen, selectRoomCategory } = useBookingStore();
  const { requireAuth } = useBookingGuard();

  const handleBooking = (id: string) => {
    requireAuth(() => {
      // Select the category and toggle the drawer
      selectRoomCategory(id);
      setDrawerOpen(true);
    });
  };

  return (
    <section className="relative w-full py-28 sm:py-36 bg-[#0F1115] text-[#F8F8F8] overflow-hidden border-t border-b border-white/5">
      {/* Editorial Mesh Background */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-[0.05]" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-[#8B5E3C]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full space-y-20 sm:space-y-28 relative z-10">
        
        {/* Top Cinematic Room Video Header Banner */}
        <div className="relative w-full h-[36vh] sm:h-[46vh] min-h-[280px] rounded-2xl overflow-hidden border border-white/10 shadow-lux group">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          >
            <source src="/assets/rooms/rooms.mp4" type="video/mp4" />
          </video>
          
          {/* Ambient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/30 to-transparent" />

          {/* Floating Tag */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 space-y-1.5 z-10">
            <span className="text-[8.5px] uppercase tracking-[0.3em] font-bold text-black bg-[#C5A880] px-3 py-1 rounded-sm shadow-md inline-block">
              Sanctuary Tour
            </span>
            <h3 className="font-serif text-lg sm:text-2xl text-white font-light tracking-wide drop-shadow-md">
              High-Speed Wi-Fi, Highway Views & Luxury Living
            </h3>
          </div>
        </div>

        {/* 1. SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 select-none">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
                PREMIUM ACCOMMODATION
              </span>
            </div>
            <h2 className="font-serif text-3.5xl sm:text-5xl lg:text-6xl font-extralight tracking-tight leading-none text-white">
              Luxury Rooms Designed <br className="hidden md:inline" />
              <span className="italic font-light text-gold font-serif">for Pure Comfort</span>
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide select-text">
            Immerse yourself in premium interiors designed for quiet, family-friendly relaxation. Each room features highway views, modern air-conditioning, and the warm hospitality of Kashi.
          </p>
        </div>

        {/* Subtle animated gold divider */}
        <div className="relative w-full h-[1px] select-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DFBA73]/30 to-transparent" />
          <motion.div
            initial={{ left: "-10%" }}
            animate={{ left: "110%" }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 w-24 h-[1px] bg-gradient-to-r from-transparent via-[#DFBA73] to-transparent"
          />
        </div>

        {/* 2. ROOM CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-8 w-full">
          {ROOMS_DATA.map((room, idx) => (
            <RoomCard
              key={room.id}
              room={room}
              onBook={handleBooking}
              idx={idx}
            />
          ))}
        </div>

        {/* 3. AMENITIES GRID SECTION */}
        <RoomAmenities />

        {/* 4. WHY STAY WITH US CARDS */}
        <WhyStayWithUs />

        {/* Location & Booking highlights */}
        <LocationAndTrust />

        {/* 5. RESERVATION CTA BANNER */}
        <BookingCTA onBookClick={() => handleBooking("single-deluxe")} />

      </div>
    </section>
  );
}

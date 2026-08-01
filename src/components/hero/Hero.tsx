"use client";

import React from "react";
import { useBookingStore } from "@/features/booking/store/use-booking-store";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { HeroVideo } from "./HeroVideo";
import { HeroOverlay } from "./HeroOverlay";
import { HeroContent } from "./HeroContent";
import { HeroButtons } from "./HeroButtons";

export function Hero() {
  const { setDrawerOpen, setBookingType } = useBookingStore();
  const { requireAuth } = useBookingGuard();

  const handleBooking = () => {
    requireAuth(() => {
      setBookingType("room");
      setDrawerOpen(true);
    });
  };

  return (
    <section className="relative w-full min-h-[88vh] sm:min-h-[90vh] md:min-h-[100svh] bg-[#0A0C0F] text-[#F8F8F8] overflow-hidden">
      {/* Cinematic hotel facade */}
      <HeroVideo />

      {/* Restrained text-legibility gradient */}
      <HeroOverlay />

      <div className="relative z-10 mx-auto flex min-h-[88vh] sm:min-h-[90vh] md:min-h-[100svh] w-full max-w-7xl items-center px-4 sm:px-6 pb-14 pt-28 sm:pb-20 sm:pt-36 md:px-12 md:pb-24 md:pt-44">
        <div className="flex w-full max-w-full sm:max-w-[32rem] flex-col items-center text-center md:items-start md:text-left xl:max-w-[33rem] translate-y-2 sm:translate-y-6 lg:translate-y-10">
          <HeroContent />

          <HeroButtons onBookStay={handleBooking} />
        </div>
      </div>
    </section>
  );
}


"use client";

import React from "react";
import { RestaurantHero } from "./RestaurantHero";
import { RestaurantHighlights } from "./RestaurantHighlights";
import { SignatureDishes } from "./SignatureDishes";
import { ChefRecommendation } from "./ChefRecommendation";
import { DiningExperience } from "./DiningExperience";
import { RestaurantInfo } from "./RestaurantInfo";
import { QuickActions } from "./QuickActions";
import { MenuPreview } from "./MenuPreview";
import { WhyDineWithUs } from "./WhyDineWithUs";
import { useBookingStore } from "@/features/booking/store/use-booking-store";
import { useBookingGuard } from "@/context/BookingGuardContext";

export function RestaurantSection() {
  const { setDrawerOpen, setBookingType } = useBookingStore();
  const { requireAuth } = useBookingGuard();

  const handleReserve = () => {
    requireAuth(() => {
      setBookingType("dining");
      setDrawerOpen(true);
    });
  };

  return (
    <section id="dining" className="relative w-full bg-[#0F1115] text-[#F8F8F8] overflow-hidden border-t border-b border-white/5">
      {/* 1. Cinematic Video Background Hero */}
      <RestaurantHero />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full space-y-28 relative z-10 pb-28">
        
        {/* 2. Quick CTAs Table Reservation Band */}
        <QuickActions onReserveClick={handleReserve} />

        {/* 3. Restaurant Feature Highlights */}
        <RestaurantHighlights />

        {/* 4. Horizontal/Grid Signature Dishes Showcase */}
        <SignatureDishes />

        {/* 5. Chef Recommendation Split Highlight */}
        <ChefRecommendation />

        {/* 6. Immersive Storytelling Details */}
        <DiningExperience />

        {/* 7. Operational Specifications & Info Cards */}
        <RestaurantInfo />

        {/* 8. Menu Category Previews */}
        <MenuPreview />

        {/* 9. Direct Guest Benefits */}
        <WhyDineWithUs />

      </div>
    </section>
  );
}

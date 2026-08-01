"use client";

import React from "react";
import { BanquetHero } from "./BanquetHero";
import { EventTypes } from "./EventTypes";
import { CapacityCards } from "./CapacityCards";
import { WhyChooseBanquet } from "./WhyChooseBanquet";
import { BanquetGallery } from "./BanquetGallery";
import { PackageCards } from "./PackageCards";
import { GuestJourney } from "./GuestJourney";
import { ReviewCarousel } from "./ReviewCarousel";
import { FAQAccordion } from "./FAQAccordion";
import { BookingCTA } from "./BookingCTA";
import { useBookingStore } from "@/features/booking/store/use-booking-store";
import { useBookingGuard } from "@/context/BookingGuardContext";

export function BanquetSection() {
  const { setDrawerOpen, setBookingType } = useBookingStore();
  const { requireAuth } = useBookingGuard();

  const handleBook = () => {
    requireAuth(() => {
      setBookingType("banquet");
      setDrawerOpen(true);
    });
  };

  return (
    <section id="banquet" className="relative w-full bg-[#0F1115] text-[#F8F8F8] overflow-hidden border-t border-[#DFBA73]/15">
      {/* 1. Cinematic Video Background Hero */}
      <BanquetHero />

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full space-y-28 relative z-10 pb-28">
        
        {/* 2. Scale capacities & statistics counters */}
        <CapacityCards />

        {/* 3. Event Formats Cards */}
        <EventTypes />

        {/* 4. Why Choose Our Banquet advantages */}
        <WhyChooseBanquet />

        {/* 5. Pinterest-Style Masonry Photo Gallery */}
        <BanquetGallery />

        {/* 6. Pricing Packages Placeholders */}
        <PackageCards />

        {/* 7. Event planning milestone timeline */}
        <GuestJourney />

        {/* 8. Google Testimonials Carousel */}
        <ReviewCarousel />

        {/* 9. Inquiries Accordion FAQs */}
        <FAQAccordion />

        {/* 10. Booking CTA Banner */}
        <BookingCTA onBookClick={handleBook} />

      </div>
    </section>
  );
}

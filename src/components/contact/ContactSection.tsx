"use client";

import React from "react";
import { BookingHub } from "./BookingHub";
import { ContactCards } from "./ContactCards";
import { GoogleMap } from "./GoogleMap";
import { ReviewSection } from "./ReviewSection";
import { FAQ } from "./FAQ";
import { ContactCTA } from "./ContactCTA";
import { WhatsAppButton } from "./WhatsAppButton";
import { CallButton } from "./CallButton";
import { useBookingStore } from "@/features/booking/store/use-booking-store";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { Sparkles } from "lucide-react";

export function ContactSection() {
  const { setDrawerOpen, setBookingType } = useBookingStore();
  const { requireAuth } = useBookingGuard();

  const handleBook = () => {
    requireAuth(() => {
      setBookingType("room");
      setDrawerOpen(true);
    });
  };

  return (
    <section id="contact" className="relative w-full bg-[#0F1115] text-[#F8F8F8] overflow-hidden border-t border-white/5 pt-28">
      {/* Decorative meshes */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-[0.04]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full space-y-28 relative z-10 pb-28">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
              RESERVATIONS & CONTACTS
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-white leading-tight">
            Connect With Us <br />
            <span className="italic font-light text-gold font-serif">Today</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
            Book room stays, reserve dining tables, or coordinate weddings easily. Get in touch with our desk managers for immediate assistance.
          </p>
        </div>

        {/* Casing split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct contact details and Google Maps */}
          <div className="lg:col-span-5 space-y-8 w-full">
            <ContactCards />
            <GoogleMap />
          </div>

          {/* Right Column: Dynamic Form Casing */}
          <div className="lg:col-span-7 w-full">
            <BookingHub />
          </div>
        </div>

        {/* Trust Indicators (Google Testimonial statistics) */}
        <ReviewSection />

        {/* Frequently Asked Questions */}
        <FAQ />

        {/* Bottom Converter Call-to-action Banner */}
        <ContactCTA onBookClick={handleBook} />

      </div>

      {/* Floating Helpers */}
      <WhatsAppButton />
      <CallButton />
    </section>
  );
}

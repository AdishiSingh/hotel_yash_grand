"use client";

import * as React from "react";
import Image from "next/image";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/features/booking/store/use-booking-store";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { BANQUET_EVENTS, BANQUET_PACKAGES } from "@/shared/data/banquet";
import { cn } from "@/lib/utils";

export function BanquetCatalog() {
  const { setDrawerOpen } = useBookingStore();
  const { requireAuth } = useBookingGuard();
  const [activeEventTab, setActiveEventTab] = React.useState("weddings");
  const [inquiryData, setInquiryData] = React.useState({ date: "", guestCount: "", name: "" });

  const activeEvent = BANQUET_EVENTS.find((e) => e.id === activeEventTab) || BANQUET_EVENTS[0];

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth((customer) => {
      const message = `Hello, I'd like to inquire about hosting a ${activeEvent.name} at Hotel Yash Grand on ${inquiryData.date} for ${inquiryData.guestCount} guests. My name is ${inquiryData.name || customer.name}.`;
      const whatsappUrl = `https://wa.me/919151088115?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      setInquiryData({ date: "", guestCount: "", name: "" });
    }, inquiryData);
  };

  return (
    <section className="relative w-full py-24 bg-background text-foreground overflow-hidden">
      {/* Background cinematic banner video */}
      <div className="relative w-full h-[60vh] bg-black overflow-hidden flex items-center justify-center select-none pointer-events-none mb-24">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-100"
          preload="auto"
        >
          <source src={ASSET_MANIFEST.videos.banquetBallroom} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-neutral-950/60" />
        <div className="absolute z-10 text-center space-y-4 px-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
            The Grand Ballroom
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-white tracking-wide">
            Royal Events & Banquets
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Showcase Event Switcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center mb-24 sm:mb-32">
          
          {/* Staggered Event Image frame - Image First on Mobile */}
          <div className="lg:col-span-7 order-first lg:order-last space-y-4">
            <div className="relative w-full aspect-[16/10] bg-neutral-900 shadow-lux overflow-hidden rounded-xl border border-white/5">
              <Image
                src={activeEvent.imageUrl}
                alt={activeEvent.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-1000 ease-expo-out hover:scale-105"
              />
            </div>
          </div>

          {/* Dynamic Event Details Content */}
          <div className="lg:col-span-5 order-last lg:order-first space-y-6 sm:space-y-8">
            <div className="flex gap-1.5 sm:gap-2 flex-wrap border-b border-gold/10 pb-4">
              {BANQUET_EVENTS.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveEventTab(type.id)}
                  className={cn(
                    "text-[10px] uppercase tracking-widest font-semibold px-3.5 py-2.5 min-h-[44px] transition-all duration-300 relative cursor-pointer",
                    activeEventTab === type.id ? "text-gold" : "text-neutral-400 hover:text-foreground"
                  )}
                >
                  {type.name.split(" ")[0]}
                  {activeEventTab === type.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold" />
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <span className="text-[9px] uppercase tracking-widest text-gold font-bold">
                {activeEvent.tagline}
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-light text-foreground">
                {activeEvent.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-light">
                {activeEvent.description}
              </p>
            </div>

            <div className="border-t border-gold/10 pt-4 flex justify-between text-xs text-neutral-400 font-sans">
              <span>Seating Threshold</span>
              <span className="font-semibold text-gold">{activeEvent.capacity}</span>
            </div>
          </div>

        </div>

        {/* Decoration Packages Grid */}
        <div className="mb-32">
          <div className="text-center space-y-4 mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
              Curated Themes
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light">
              Decoration Packages
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BANQUET_PACKAGES.map((pkg, idx) => (
              <div key={idx} className="border border-white/5 p-8 bg-[#171A21]/60 backdrop-blur-md rounded-xl shadow-lux space-y-4 flex flex-col justify-between hover:border-gold/25 transition-all duration-300">
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-[#C8A97E] font-bold">Theme 0{idx + 1}</span>
                  <h4 className="font-serif text-xl font-semibold text-white">{pkg.name}</h4>
                  <p className="text-xs text-[#A9A9A9] font-sans font-light leading-relaxed">{pkg.theme}</p>
                </div>
                <div className="border-t border-white/5 pt-4 mt-6 text-xs text-[#A9A9A9] font-sans font-light">
                  Includes: {pkg.inclusion}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Inquire Form (Strongest Conversion Module) */}
        <div className="border border-white/5 bg-[#171A21]/60 backdrop-blur-md shadow-lux p-8 sm:p-16 max-w-4xl mx-auto rounded-2xl">
          <div className="text-center space-y-4 mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
              Instant Reservations
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-light">
              Book the Grand Ballroom
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Verify dates immediately. Submitting this inquiry will launch a direct secure booking query to our events manager via WhatsApp.
            </p>
          </div>

          <form onSubmit={handleInquiry} className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="relative">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                Your Name
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-gold/20 py-2.5 focus:outline-none focus:border-gold transition-colors text-sm"
                value={inquiryData.name}
                onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                placeholder="Rakesh Sharma"
                required
              />
            </div>
            
            <div className="relative">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                Event Date
              </label>
              <input
                type="date"
                className="w-full bg-transparent border-b border-gold/20 py-2.5 focus:outline-none focus:border-gold transition-colors text-sm cursor-pointer"
                value={inquiryData.date}
                onChange={(e) => setInquiryData({ ...inquiryData, date: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">
                Guest Limit
              </label>
              <select
                className="w-full bg-transparent border-b border-gold/20 py-2.5 focus:outline-none focus:border-gold transition-colors text-sm cursor-pointer"
                value={inquiryData.guestCount}
                onChange={(e) => setInquiryData({ ...inquiryData, guestCount: e.target.value })}
                required
              >
                <option value="" disabled className="bg-background text-foreground">Select Capacity</option>
                <option value="50-150" className="bg-background text-foreground">50 - 150 Guests</option>
                <option value="150-300" className="bg-background text-foreground">150 - 300 Guests</option>
                <option value="300-500" className="bg-background text-foreground">300 - 500 Guests</option>
              </select>
            </div>

            <div className="sm:col-span-3 pt-6">
              <Button type="submit" variant="accent" size="lg" className="w-full text-xs font-semibold py-4">
                Verify Availability via WhatsApp
              </Button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}

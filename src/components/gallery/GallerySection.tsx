"use client";

import React, { useState, useMemo } from "react";
import { GALLERY_ITEMS } from "@/data/gallery";
import { GalleryFilters } from "./GalleryFilters";
import { GalleryGrid } from "./GalleryGrid";
import { VideoGallery } from "./VideoGallery";
import { FeaturedCarousel } from "./FeaturedCarousel";
import { VirtualTourCard } from "./VirtualTourCard";
import { useBookingStore } from "@/features/booking/store/use-booking-store";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { Sparkles } from "lucide-react";

export function GallerySection() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { setDrawerOpen, setBookingType } = useBookingStore();
  const { requireAuth } = useBookingGuard();

  const handleSchedule = () => {
    requireAuth(() => {
      setBookingType("banquet"); // Open event tour booking
      setDrawerOpen(true);
    });
  };

  const filteredItems = useMemo(() => {
    // Exclude videos from the primary image grid layout to display them in their premium dedicated section
    const imagesOnly = GALLERY_ITEMS.filter((item) => item.mediaType === "image");
    if (activeTab === "all") return imagesOnly;
    return imagesOnly.filter((item) => item.category === activeTab);
  }, [activeTab]);

  return (
    <section className="relative w-full bg-[#0F1115] text-[#F8F8F8] overflow-hidden select-none pb-28">
      {/* Decorative Radial Background */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-[0.05]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-20">
        
        {/* 1. Page Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
              EXPLORE HOTEL YASH GRAND
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-white leading-tight">
            Discover Every Corner <br />
            <span className="italic font-light text-gold font-serif">of Our Hospitality</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
            Tour the property in Varanasi through authentic, high-resolution photographs and videos showcasing our luxury suites, fine-dining lobbies, and grand celebration stages.
          </p>
        </div>

        {/* 2. Featured Highlights Moments Carousel */}
        <FeaturedCarousel />

        {/* 3. Category Filter Tabs */}
        <GalleryFilters activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 4. Masonry Pinterest Grid & Lightbox */}
        <GalleryGrid items={filteredItems} />

        {/* 5. Separate Premium Video Gallery */}
        <VideoGallery />

        {/* 6. 360 Virtual Tour coming soon placeholder */}
        <VirtualTourCard onScheduleClick={handleSchedule} />

      </div>
    </section>
  );
}

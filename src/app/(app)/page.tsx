"use client";

import * as React from "react";
import { IntroVideoLoader } from "@/shared/components/organisms/IntroVideoLoader";
import { Hero } from "@/shared/components/organisms/Hero";
import { HeroWhyChooseUs } from "@/components/hero/HeroWhyChooseUs";
import { HeroStats } from "@/components/hero/HeroStats";
import { About } from "@/shared/components/organisms/About";
import { RoomsPreview } from "@/shared/components/organisms/RoomsPreview";
import { RestaurantShowcase } from "@/shared/components/organisms/RestaurantShowcase";
import { BanquetShowcase } from "@/shared/components/organisms/BanquetShowcase";
import { Amenities } from "@/shared/components/organisms/Amenities";
import { GalleryGrid } from "@/shared/components/organisms/GalleryGrid";
import { Testimonials } from "@/shared/components/organisms/Testimonials";
import { Attractions } from "@/shared/components/organisms/Attractions";
import { ContactSection } from "@/shared/components/organisms/ContactSection";
import { LuxuryDivider } from "@/shared/components/atoms/LuxuryDivider";
import { Reveal } from "@/shared/components/atoms/Reveal";
import { WhyChooseUs } from "@/shared/components/organisms/WhyChooseUs";

export default function Home() {
  return (
    <>
      {/* 1. Cinematic Intro / Splash Overlay Player */}
      <IntroVideoLoader />

      {/* 2. Main Storytelling Landing Content (Preloaded in background) */}
      <div className="flex flex-col min-h-screen bg-background">
        
        {/* Cinematic Hero */}
        <Hero />

        {/* Hotel statistics now sit outside the hero for a calmer first impression */}
        <HeroStats />

        {/* Why Choose Hotel Yash Grand Feature List */}
        <Reveal>
          <HeroWhyChooseUs />
        </Reveal>

        {/* About Narrative */}
        <Reveal>
          <About />
        </Reveal>
        <LuxuryDivider />

        {/* Suites Preview */}
        <Reveal>
          <RoomsPreview />
        </Reveal>

        {/* Restaurant digital showcase */}
        <Reveal>
          <RestaurantShowcase />
        </Reveal>
        <LuxuryDivider />

        {/* Banquet events showcase */}
        <Reveal>
          <BanquetShowcase />
        </Reveal>

        {/* Amenities Highlights */}
        <Reveal>
          <Amenities />
        </Reveal>
        <LuxuryDivider />

        {/* Why Choose Us */}
        <Reveal>
          <WhyChooseUs />
        </Reveal>
        <LuxuryDivider />

        {/* Behind-The-Scenes Gallery */}
        <Reveal>
          <GalleryGrid />
        </Reveal>

        {/* Guest Reviews */}
        <Reveal>
          <Testimonials />
        </Reveal>

        {/* Local Attractions */}
        <Reveal>
          <Attractions />
        </Reveal>

        {/* Contact form coordinates */}
        <Reveal>
          <ContactSection />
        </Reveal>
      </div>
    </>
  );
}

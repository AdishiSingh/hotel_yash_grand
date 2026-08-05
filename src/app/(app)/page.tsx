"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Hero } from "@/shared/components/organisms/Hero";
import { LuxuryDivider } from "@/shared/components/atoms/LuxuryDivider";
import { Reveal } from "@/shared/components/atoms/Reveal";

// Dynamic Imports for Below-the-Fold Components
const IntroVideoLoader = dynamic(
  () => import("@/shared/components/organisms/IntroVideoLoader").then((m) => m.IntroVideoLoader),
  { ssr: false }
);
const HeroStats = dynamic(() => import("@/components/hero/HeroStats").then((m) => m.HeroStats));
const HeroWhyChooseUs = dynamic(() => import("@/components/hero/HeroWhyChooseUs").then((m) => m.HeroWhyChooseUs));
const About = dynamic(() => import("@/shared/components/organisms/About").then((m) => m.About));
const RoomsPreview = dynamic(() => import("@/shared/components/organisms/RoomsPreview").then((m) => m.RoomsPreview));
const RestaurantShowcase = dynamic(() => import("@/shared/components/organisms/RestaurantShowcase").then((m) => m.RestaurantShowcase));
const BanquetShowcase = dynamic(() => import("@/shared/components/organisms/BanquetShowcase").then((m) => m.BanquetShowcase));
const Amenities = dynamic(() => import("@/shared/components/organisms/Amenities").then((m) => m.Amenities));
const WhyChooseUs = dynamic(() => import("@/shared/components/organisms/WhyChooseUs").then((m) => m.WhyChooseUs));
const GalleryGrid = dynamic(() => import("@/shared/components/organisms/GalleryGrid").then((m) => m.GalleryGrid));
const Testimonials = dynamic(() => import("@/shared/components/organisms/Testimonials").then((m) => m.Testimonials));
const Attractions = dynamic(() => import("@/shared/components/organisms/Attractions").then((m) => m.Attractions));
const ContactSection = dynamic(() => import("@/shared/components/organisms/ContactSection").then((m) => m.ContactSection));

export default function Home() {
  return (
    <>
      {/* 1. Cinematic Intro / Splash Overlay Player */}
      <IntroVideoLoader />

      {/* 2. Main Storytelling Landing Content */}
      <div className="flex flex-col min-h-screen bg-background">
        
        {/* Cinematic Hero - Synchronous for instant FCP/LCP */}
        <Hero />

        {/* Hotel statistics */}
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

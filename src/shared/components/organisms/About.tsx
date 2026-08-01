"use client";

import * as React from "react";
import { AboutStory } from "@/components/about/AboutStory";
import { ExperienceCards } from "@/components/about/ExperienceCards";
import { AnimatedCounters } from "@/components/about/AnimatedCounters";
import { GuestJourneyTimeline } from "@/components/about/GuestJourneyTimeline";
import { LocationHighlights } from "@/components/about/LocationHighlights";

export function About() {
  return (
    <section className="relative w-full py-28 sm:py-36 bg-[#0F1115] text-[#F8F8F8] overflow-hidden">
      {/* Decorative radial background grid */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-[0.08]" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[350px] h-[350px] bg-[#8B5E3C]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full space-y-36 relative z-10">
        {/* Section 1: Story Narrative */}
        <AboutStory />

        {/* Section 3: Signature Experiences */}
        <ExperienceCards />

        {/* Section 4: Our Numbers */}
        <AnimatedCounters />

        {/* Section 6: Luxury Timeline */}
        <GuestJourneyTimeline />

        {/* Section 5: Location Highlights */}
        <LocationHighlights />
      </div>
    </section>
  );
}

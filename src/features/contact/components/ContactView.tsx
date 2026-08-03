"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { LuxuryInput } from "@/shared/components/atoms/LuxuryInput";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import Image from "next/image";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";

const TRANSIT_DISTANCES = [
  { name: "Varanasi Junction Railway Station (Cantt)", distance: "6.5 km (18 mins drive)", route: "Direct highway access" },
  { name: "Lal Bahadur Shastri International Airport (Babatpur)", distance: "24 km (45 mins drive)", route: "NH31 Express route" },
  { name: "Kashi Vishwanath Temple & Ganga Ghats", distance: "7.8 km (20 mins drive)", route: "Heritage corridor route" },
  { name: "SMS College Varanasi", distance: "Adjacent (Walking distance)", route: "Located right next door" },
];

export function ContactView() {
  const [loadMap, setLoadMap] = React.useState(false);
  const [inquiryName, setInquiryName] = React.useState("");

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${inquiryName}. Your query has been registered. our desk manager will reach out shortly.`);
    setInquiryName("");
  };

  return (
    <section className="relative w-full py-24 bg-background text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl space-y-6 mb-20 sm:mb-28 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-gold/50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
              Location & Contact
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-wide">
            Directions & Inquiries
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-neutral-500 font-sans font-light leading-relaxed tracking-wide">
            Situated near the academic hub of SMS College, Hotel Yash Grand serves as a convenient coordinates bridge for spiritual tourists, wedding planners, and business delegates.
          </p>
        </div>

        {/* Action Pathways: Call, WhatsApp, Directions, Instagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div
            className="border border-white/5 p-8 bg-[#171A21]/60 backdrop-blur-md rounded-xl flex flex-col justify-between items-start gap-6 group hover:border-[#D4AF37]/35 transition-all duration-500 shadow-lux"
          >
            <span className="text-[10px] uppercase tracking-widest text-[#C8A97E] font-bold">Call Front Desk</span>
            <div className="space-y-2">
              <a href="tel:+919151088115" className="font-serif text-xl sm:text-2xl font-semibold text-white block hover:text-gold transition-colors">
                +91 91510 88115
              </a>
              <a href="tel:+919151088116" className="font-serif text-xl sm:text-2xl font-semibold text-white block hover:text-gold transition-colors">
                +91 91510 88116
              </a>
            </div>
            <span className="text-[10px] text-neutral-400 group-hover:text-gold transition-colors duration-300">Tap either number to dial directly →</span>
          </div>

          <a
            href="https://wa.me/919151088115?text=Hello%20Hotel%20Yash%20Grand%20Varanasi"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/5 p-8 bg-[#171A21]/60 backdrop-blur-md rounded-xl flex flex-col justify-between items-start gap-6 group hover:border-[#D4AF37]/35 transition-all duration-500 shadow-lux"
          >
            <span className="text-[10px] uppercase tracking-widest text-[#C8A97E] font-bold">WhatsApp Concierge</span>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white">Instant Booking Help</h3>
            <span className="text-[10px] text-neutral-400 group-hover:text-gold transition-colors duration-300">Start chat session →</span>
          </a>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/5 p-8 bg-[#171A21]/60 backdrop-blur-md rounded-xl flex flex-col justify-between items-start gap-6 group hover:border-[#D4AF37]/35 transition-all duration-500 shadow-lux"
          >
            <span className="text-[10px] uppercase tracking-widest text-[#C8A97E] font-bold">Open Directions</span>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white">Get Google Route Map</h3>
            <span className="text-[10px] text-neutral-400 group-hover:text-gold transition-colors duration-300">Navigate in maps app →</span>
          </a>

          <a
            href="https://www.instagram.com/yash_grand_?igsh=dXNtcjNwcmpwNThy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit HOTEL YASH GRAND on Instagram"
            className="border border-white/5 p-8 bg-[#171A21]/60 backdrop-blur-md rounded-xl flex flex-col justify-between items-start gap-6 group hover:border-[#D4AF37]/35 hover:-translate-y-0.5 transition-all duration-500 shadow-lux min-h-[44px] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <InstagramIcon className="h-4 w-4 text-[#C8A97E]" />
              <span className="text-[10px] uppercase tracking-widest text-[#C8A97E] font-bold">Follow HOTEL YASH GRAND</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-white group-hover:text-gold transition-colors">Official Instagram</h3>
            <span className="text-[10px] text-neutral-400 group-hover:text-gold transition-colors duration-300">Instagram →</span>
          </a>
        </div>

        {/* Map & Transit Distance split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch mb-32">
          
          {/* Map display pane */}
          <div className="lg:col-span-7 border border-white/5 p-2 bg-[#171A21]/30 rounded-xl relative shadow-lux min-h-[400px] flex items-center justify-center overflow-hidden">
            {!loadMap ? (
              <div className="relative w-full h-full min-h-[400px] flex flex-col items-center justify-center text-center p-6 bg-neutral-900 rounded-lg">
                {/* Lazy-load static exterior porch placeholder */}
                <Image
                  src={ASSET_MANIFEST.hotel.porchSign}
                  alt="Hotel facade sign board"
                  fill
                  className="object-cover opacity-20 select-none pointer-events-none rounded-lg"
                />
                <div className="relative z-10 space-y-4">
                  <span className="text-[9px] uppercase tracking-widest text-[#C8A97E] font-bold font-buttons">Interactive GIS</span>
                  <h4 className="font-serif text-xl text-white">Google Map Integration</h4>
                  <p className="text-xs text-[#A9A9A9] max-w-sm mx-auto font-sans font-light">
                    Loading interactive maps loads external cookies. Click to pull real-time route maps from Google.
                  </p>
                  <Button
                    onClick={() => setLoadMap(true)}
                    className="text-[9.5px] uppercase tracking-widest font-bold py-3 bg-[#D4AF37] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white transition-all duration-500 rounded-sm cursor-pointer"
                  >
                    Load Map View
                  </Button>
                </div>
              </div>
            ) : (
              <iframe
                title="Hotel Yash Grand google maps location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.232338573215!2d82.97548231501062!3d25.297482283848624!2m3!1f0!2f0!3f0!3m2!1i1024!2i1080!4f13.1!3m3!1m2!1s0x398e2db7bf0f9d9f%3A0x6b1076b6d51a9e34!2sSchool%20of%20Management%20Sciences!5e0!3m2!1sen!2sin!4v1689325983792!5m2!1sen!2sin"
                className="w-full h-full min-h-[400px] border-none rounded-lg"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>

          {/* Distances logs */}
          <div className="lg:col-span-5 flex flex-col justify-between py-4">
            <div className="space-y-4">
              <span className="text-[9.5px] uppercase tracking-widest text-[#C8A97E] font-bold block">Transit Distances</span>
              <h3 className="font-serif text-2xl font-light">Convenient Proximity</h3>
            </div>

            <div className="space-y-6 border-t border-white/5 pt-6 mt-6">
              {TRANSIT_DISTANCES.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 text-xs font-sans">
                  <div className="space-y-0.5">
                    <span className="font-medium text-white block">{item.name}</span>
                    <span className="text-[#A9A9A9] font-light block">{item.route}</span>
                  </div>
                  <span className="font-semibold text-gold text-right flex-shrink-0">{item.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Google Reviews Promotion Card */}
        <div className="border border-white/5 bg-[#171A21]/60 backdrop-blur-md shadow-lux p-8 sm:p-12 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 rounded-2xl hover:border-gold/15 transition-all duration-300">
          <div className="space-y-3 max-w-xl text-center sm:text-left">
            <span className="text-[10px] uppercase tracking-widest text-[#C8A97E] font-bold">Customer Trust</span>
            <h4 className="font-serif text-2xl font-semibold text-white">Share your experience with us</h4>
            <p className="text-xs text-[#A9A9A9] font-sans font-light leading-relaxed">
              Help Varanasi tourists and families discover Hotel Yash Grand. Leave a verified star review on Google Maps.
            </p>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#D4AF37] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white px-8 py-3.5 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 font-buttons rounded-sm cursor-pointer"
          >
            Write Google Review
          </a>
        </div>

      </div>
    </section>
  );
}

import React from "react";
import { CONTACT_DATA } from "@/data/contact";
import { MapPin, Navigation, Phone } from "lucide-react";

export function GoogleMap() {
  const handleDirections = () => {
    window.open(CONTACT_DATA.googleMapsDirections, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${CONTACT_DATA.phones[0].replace(/\s+/g, "")}`;
  };

  return (
    <div className="relative w-full border border-white/5 bg-[#14161C]/50 rounded-2xl p-3 shadow-lux overflow-hidden select-none space-y-4">
      {/* 1. Interactive Styled Map Frame */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-[16/10] overflow-hidden rounded-xl bg-neutral-900 border border-white/5">
        <iframe
          src={CONTACT_DATA.googleMapsEmbed}
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(1) invert(1) contrast(1.1) opacity(0.4)" }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hotel Yash Grand Varanasi Location Map"
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent pointer-events-none" />
      </div>

      {/* 2. Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-buttons p-1">
        <div className="flex items-start gap-2.5 text-left">
          <MapPin className="h-4.5 w-4.5 text-[#DFBA73] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase tracking-wider text-neutral-500 block font-semibold">Location Landmark</span>
            <p className="text-[11.5px] text-neutral-300 font-sans font-light">
              Near SMS College, Varanasi, UP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Directions */}
          <button
            onClick={handleDirections}
            className="flex-1 sm:flex-none px-6 py-3 bg-[#DFBA73] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white text-[9px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 shadow-sm"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Get Directions</span>
          </button>

          {/* Call desk */}
          <button
            onClick={handleCall}
            className="flex-1 sm:flex-none px-6 py-3 bg-transparent border border-white/10 hover:border-gold/30 hover:bg-[#DFBA73]/5 text-white text-[9px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
          >
            <Phone className="h-3.5 w-3.5 text-gold" />
            <span>Call Desk</span>
          </button>
        </div>
      </div>
    </div>
  );
}

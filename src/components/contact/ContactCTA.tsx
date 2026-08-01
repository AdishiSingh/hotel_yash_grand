import React from "react";
import Image from "next/image";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import { Calendar, Phone, MessageCircle } from "lucide-react";
import { useBookingGuard } from "@/context/BookingGuardContext";

interface ContactCTAProps {
  onBookClick: () => void;
}

export function ContactCTA({ onBookClick }: ContactCTAProps) {
  const { requireAuth } = useBookingGuard();

  const handleCall = () => {
    window.location.href = "tel:+919151088115";
  };

  const handleWhatsApp = () => {
    requireAuth((customer) => {
      const text = encodeURIComponent(`Hello Hotel Yash Grand! I would like to make a reservation booking. Guest: ${customer.name}`);
      window.open(`https://wa.me/919151088115?text=${text}`, "_blank");
    });
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/5 py-20 px-8 sm:px-12 text-center md:text-left select-none shadow-lux mt-28">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src={ASSET_MANIFEST.hotel.porchSign}
          alt="Hotel Yash Grand front porch signage welcoming guest stays"
          fill
          sizes="100vw"
          className="object-cover scale-100"
          loading="lazy"
        />
        {/* Dark gold overlay */}
        <div className="absolute inset-0 bg-neutral-950/85 md:bg-gradient-to-r md:from-black/95 md:via-black/75 md:to-transparent" />
      </div>

      {/* Casing grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
        <div className="md:col-span-8 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#DFBA73] font-bold block">
            Let's Make Your Stay Memorable
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
            Ready to Experience Grandeur?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed max-w-xl">
            Book your rooms, reserve dining tables, or organize royal wedding celebrations with Varanasi's premium luxury hospitality brand.
          </p>
        </div>

        <div className="md:col-span-4 flex flex-col gap-4 w-full sm:w-auto md:w-full font-buttons">
          {/* Booking trigger */}
          <button
            onClick={onBookClick}
            className="w-full py-4.5 bg-[#DFBA73] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-500 shadow-md"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Book Now</span>
          </button>

          {/* Call desk */}
          <button
            onClick={handleCall}
            className="w-full py-4.5 bg-transparent border border-white/10 hover:border-gold/30 hover:bg-[#DFBA73]/5 text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
          >
            <Phone className="h-3.5 w-3.5 text-gold" />
            <span>Call Desk</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="w-full py-4.5 bg-transparent border border-white/10 hover:border-gold/30 hover:bg-[#DFBA73]/5 text-neutral-300 hover:text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span>WhatsApp Enquiry</span>
          </button>
        </div>
      </div>
    </div>
  );
}

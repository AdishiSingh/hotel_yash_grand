import React from "react";
import { Calendar, Phone, MessageCircle, FileText } from "lucide-react";
import { useBookingGuard } from "@/context/BookingGuardContext";

interface QuickActionsProps {
  onReserveClick: () => void;
}

export function QuickActions({ onReserveClick }: QuickActionsProps) {
  const { requireAuth } = useBookingGuard();

  const handleCall = () => {
    window.location.href = "tel:+919151088115";
  };

  const handleWhatsApp = () => {
    requireAuth((customer) => {
      const text = encodeURIComponent(`Hello Hotel Yash Grand! I would like to reserve a table at the restaurant. Guest: ${customer.name}`);
      window.open(`https://wa.me/919151088115?text=${text}`, "_blank");
    });
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full pt-8 font-buttons select-none">
      {/* 1. Reserve Table */}
      <button
        onClick={onReserveClick}
        className="w-full sm:w-auto px-8 py-4 bg-[#DFBA73] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-500 shadow-md"
      >
        <Calendar className="h-3.5 w-3.5" />
        <span>Reserve Table</span>
      </button>

      {/* 2. Call Restaurant */}
      <button
        onClick={handleCall}
        className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 hover:border-gold/30 hover:bg-[#DFBA73]/5 text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
      >
        <Phone className="h-3.5 w-3.5 text-gold" />
        <span>Call Restaurant</span>
      </button>

      {/* 3. WhatsApp Booking */}
      <button
        onClick={handleWhatsApp}
        className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 hover:border-gold/30 hover:bg-[#DFBA73]/5 text-neutral-300 hover:text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
      >
        <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
        <span>WhatsApp Channel</span>
      </button>

      {/* 4. View Full Menu */}
      <a
        href="/dining"
        className="w-full sm:w-auto inline-flex items-center justify-center border border-white/10 hover:border-[#DFBA73]/40 bg-transparent py-4 px-8 text-[9.5px] uppercase tracking-widest font-bold text-neutral-400 hover:text-white transition-all duration-300 rounded-sm cursor-pointer gap-2"
      >
        <FileText className="h-3.5 w-3.5 text-neutral-500" />
        <span>View Full Menu</span>
      </a>
    </div>
  );
}

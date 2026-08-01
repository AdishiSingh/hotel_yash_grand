import React from "react";
import { Phone } from "lucide-react";
import { CONTACT_DATA } from "@/data/contact";

export function CallButton() {
  const handleCall = () => {
    window.location.href = `tel:${CONTACT_DATA.phones[0].replace(/\s+/g, "")}`;
  };

  return (
    <div className="fixed bottom-6 left-6 z-[90] md:hidden select-none">
      <button
        onClick={handleCall}
        className="h-14 w-14 rounded-full bg-[#DFBA73] text-[#0F1115] hover:text-white hover:bg-[#8B5E3C] flex items-center justify-center cursor-pointer shadow-lg relative group transition-all duration-300"
        aria-label="Call Front Desk"
      >
        <Phone className="h-5.5 w-5.5 fill-current" />
        <span className="absolute -inset-1 rounded-full border-2 border-[#DFBA73]/30 scale-100 group-hover:scale-110 animate-ping pointer-events-none" />
      </button>
    </div>
  );
}

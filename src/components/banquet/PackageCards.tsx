import React from "react";
import { BANQUET_DATA } from "@/data/banquet";
import { Sparkles, MessageCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useBookingGuard } from "@/context/BookingGuardContext";

export function PackageCards() {
  const { requireAuth } = useBookingGuard();

  const handleInquiry = (packageName: string) => {
    requireAuth((customer) => {
      const text = encodeURIComponent(`Hello! I'm interested in the "${packageName}" at your Banquet Hall. Guest: ${customer.name}`);
      window.open(`https://wa.me/919151088115?text=${text}`, "_blank");
    }, { packageName });
  };

  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            06 // Curated Event Plans
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Event Package Offerings
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          Bespoke layouts and services mapped to cover different celebration sizes.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BANQUET_DATA.packages.map((pkg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
            className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl flex flex-col justify-between h-full hover:border-gold/15 transition-all duration-300 group"
          >
            <div className="space-y-4">
              <span className="text-[8.5px] uppercase tracking-widest text-[#DFBA73] font-bold block">
                {pkg.capacityRange}
              </span>
              <h4 className="font-serif text-lg font-semibold text-white group-hover:text-gold transition-colors duration-300">
                {pkg.name}
              </h4>
              <p className="text-[11.5px] text-neutral-400 font-sans font-light leading-relaxed">
                {pkg.desc}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 space-y-4 font-buttons">
              <div className="text-center md:text-left">
                <span className="text-[8.5px] uppercase tracking-wider text-neutral-500 font-sans block font-semibold">Tariff Status</span>
                <span className="font-serif text-base text-[#DFBA73] font-medium tracking-wide">
                  {pkg.pricePlaceholder}
                </span>
              </div>
              
              <button
                onClick={() => handleInquiry(pkg.name)}
                className="w-full py-3 bg-transparent border border-white/10 hover:border-gold/30 hover:bg-[#DFBA73]/5 text-white hover:text-gold text-[9px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300"
              >
                <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>Inquire Details</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

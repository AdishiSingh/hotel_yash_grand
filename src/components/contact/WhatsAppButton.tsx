import React, { useState } from "react";
import { MessageCircle, X, Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMessage = (text: string) => {
    const prefilledText = encodeURIComponent(text);
    window.open(`https://wa.me/919151088115?text=${prefilledText}`, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] select-none text-left font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-4 w-72 sm:w-80 border border-white/5 bg-[#14161C]/95 backdrop-blur-md rounded-2xl p-5 shadow-lux relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-[#DFBA73] font-bold">
                  Yash Grand Concierge
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-white cursor-pointer"
                aria-label="Close popup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Welcome messages */}
            <div className="py-3 space-y-1">
              <p className="text-xs text-white font-medium">Hello there! 👋</p>
              <p className="text-[10.5px] text-neutral-400 font-light leading-relaxed">
                Welcome to Hotel Yash Grand. How may we accommodate your booking today?
              </p>
            </div>

            {/* Suggested messages */}
            <div className="space-y-2 pt-2 font-buttons">
              <button
                onClick={() => handleMessage("Hello! I would like to book a room at Hotel Yash Grand.")}
                className="w-full text-left p-3 text-[10.5px] border border-white/5 hover:border-gold/30 bg-black/40 hover:bg-[#DFBA73]/5 text-neutral-300 hover:text-white rounded-lg flex items-center justify-between transition-all duration-300 cursor-pointer"
              >
                <span>🏨 Book a Room</span>
                <Send className="h-3 w-3 text-gold/60" />
              </button>

              <button
                onClick={() => handleMessage("Hello! I want banquet details and pricing configurations.")}
                className="w-full text-left p-3 text-[10.5px] border border-white/5 hover:border-gold/30 bg-black/40 hover:bg-[#DFBA73]/5 text-neutral-300 hover:text-white rounded-lg flex items-center justify-between transition-all duration-300 cursor-pointer"
              >
                <span>🎉 Banquet Inquiries</span>
                <Send className="h-3 w-3 text-gold/60" />
              </button>

              <button
                onClick={() => handleMessage("Hello! I want to reserve a table at the restaurant.")}
                className="w-full text-left p-3 text-[10.5px] border border-white/5 hover:border-gold/30 bg-black/40 hover:bg-[#DFBA73]/5 text-neutral-300 hover:text-white rounded-lg flex items-center justify-between transition-all duration-300 cursor-pointer"
              >
                <span>🍽 Reserve a Table</span>
                <Send className="h-3 w-3 text-gold/60" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center cursor-pointer shadow-lg relative group transition-all duration-300"
        aria-label="Toggle WhatsApp Help"
      >
        <MessageCircle className="h-6 w-6 fill-current" />
        <span className="absolute -inset-1 rounded-full border-2 border-emerald-500/30 scale-100 group-hover:scale-110 animate-ping pointer-events-none" />
      </button>
    </div>
  );
}

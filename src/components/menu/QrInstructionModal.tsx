"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Smartphone, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

interface QrInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QrInstructionModal({ isOpen, onClose }: QrInstructionModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-[#0F1115] border border-[#DFBA73]/30 rounded-2xl shadow-lux overflow-hidden text-foreground flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-neutral-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#DFBA73]/15 border border-[#DFBA73]/30 flex items-center justify-center text-[#DFBA73]">
                <QrCode className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  Dining at HOTEL YASH GRAND
                </h3>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#DFBA73] font-semibold">
                  Table Order Verification
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6 text-center">
            {/* Visual Icon Illustration */}
            <div className="relative mx-auto w-24 h-24 rounded-2xl bg-neutral-900 border border-[#DFBA73]/40 flex items-center justify-center text-[#DFBA73] shadow-inner">
              <Smartphone className="h-12 w-12 animate-pulse" />
              <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-[#DFBA73] text-black font-bold flex items-center justify-center text-xs shadow-md">
                QR
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-2xl text-white font-light">
                Scan the QR code placed on your table.
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed max-w-md mx-auto">
                To prevent unauthorized or fake orders, digital dining requires scanning the unique QR standee located at your assigned table.
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-white/10 text-left space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-[#DFBA73]/20 text-[#DFBA73] font-mono font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-white font-medium block">Locate Table QR Standee</strong>
                  <span className="text-neutral-400 text-[11px]">Look for the acrylic QR card on your table stand.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-[#DFBA73]/20 text-[#DFBA73] font-mono font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-white font-medium block">Scan with Phone Camera</strong>
                  <span className="text-neutral-400 text-[11px]">Open your phone camera or WhatsApp scanner to open the link.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-[#DFBA73]/20 text-[#DFBA73] font-mono font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-white font-medium block">Instant Verified Menu Access</strong>
                  <span className="text-neutral-400 text-[11px]">Your table session will verify automatically for 2 hours.</span>
                </div>
              </div>
            </div>

            {/* Warning info */}
            <div className="bg-amber-950/40 border border-amber-500/20 p-3 rounded-lg flex items-center gap-2 text-[11px] text-amber-200 text-left">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Ordering directly from the website without a valid table QR token is disabled.</span>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#DFBA73] hover:bg-[#c5a880] text-black font-bold text-xs uppercase tracking-widest transition-all rounded-sm shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Understand & Continue Browsing Menu</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, QrCode, ShieldCheck, Clock, Info } from "lucide-react";
import { motion } from "framer-motion";

interface TableVerificationBannerProps {
  isVerified: boolean;
  isVerifying: boolean;
  tableNumber: number | null;
  expiresAt: string | null;
  onOpenInstructionModal: () => void;
}

export function TableVerificationBanner({
  isVerified,
  isVerifying,
  tableNumber,
  expiresAt,
  onOpenInstructionModal,
}: TableVerificationBannerProps) {
  if (isVerifying) {
    return (
      <div className="w-full bg-neutral-900 border-b border-gold/20 py-3 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#DFBA73] animate-pulse">
          <div className="h-2 w-2 rounded-full bg-[#DFBA73] animate-ping" />
          <span>Verifying Table QR Session...</span>
        </div>
      </div>
    );
  }

  if (isVerified && tableNumber) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-emerald-950/90 border-b border-emerald-500/30 text-emerald-200 py-3 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg z-30 relative"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-white text-base">
                Table {tableNumber}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified ✓
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/80 font-sans">
              Instant digital ordering enabled. Orders are synced directly with kitchen & WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-emerald-900/60 text-emerald-200 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dining at Table {tableNumber}</span>
          </span>
          {expiresAt && (
            <span className="hidden md:flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <Clock className="h-3 w-3" />
              Session active (2 hrs)
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // UNVERIFIED STATE (Website Visitor)
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-amber-950/90 border-b border-amber-500/40 text-amber-200 py-3.5 px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md z-30 relative"
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-white text-sm sm:text-base">
              Browsing Menu
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full">
              Ordering Disabled
            </span>
          </div>
          <p className="text-xs text-amber-200/90 font-sans mt-0.5">
            Please scan the QR code on your restaurant table to place an order.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <button
          onClick={onOpenInstructionModal}
          className="w-full md:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <QrCode className="h-4 w-4" />
          <span>I am dining at the restaurant</span>
        </button>
      </div>
    </motion.div>
  );
}

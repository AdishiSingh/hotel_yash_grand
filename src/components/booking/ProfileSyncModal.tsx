"use client";

import React from "react";
import { UserCheck, Sparkles, Check, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChangedField {
  label: string;
  oldValue: string;
  newValue: string;
}

interface ProfileSyncModalProps {
  isOpen: boolean;
  onSaveToProfile: () => void | Promise<void>;
  onOnlyForBooking: () => void | Promise<void>;
  changedFields?: ChangedField[];
}

export function ProfileSyncModal({
  isOpen,
  onSaveToProfile,
  onOnlyForBooking,
  changedFields = [],
}: ProfileSyncModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          onClick={onOnlyForBooking}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#0F1115] border border-[#C5A880]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 z-10 overflow-hidden text-left"
        >
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#C5A880]/10 rounded-full blur-[60px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#C5A880] to-[#8C6D3F] p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-[#0F1115] rounded-2xl flex items-center justify-center text-[#C5A880]">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A880] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Profile Synchronization
              </span>
              <h3 className="font-serif text-lg font-bold text-white leading-snug">
                Save these changes to your profile?
              </h3>
            </div>
          </div>

          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
            You modified profile details during this booking. Would you like to save these updated preferences to your guest profile for future stays?
          </p>

          {/* Changed Fields Summary */}
          {changedFields.length > 0 && (
            <div className="p-3.5 bg-neutral-950/80 border border-white/10 rounded-2xl space-y-2 text-xs">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                Modified Preferences
              </span>
              <div className="space-y-1.5 font-sans">
                {changedFields.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px]">
                    <span className="text-neutral-400">{item.label}:</span>
                    <span className="text-[#C5A880] font-medium truncate max-w-[180px]">{item.newValue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onSaveToProfile}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <Check className="w-4 h-4" />
              <span>Save</span>
            </button>

            <button
              type="button"
              onClick={onOnlyForBooking}
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 border border-white/15 text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              <X className="w-4 h-4 text-neutral-500" />
              <span>Only for this booking</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

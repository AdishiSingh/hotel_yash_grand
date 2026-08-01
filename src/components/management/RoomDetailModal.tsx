"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BedDouble, User, Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { Room } from "./types";
import { Button } from "@/components/ui/button";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
}

export function RoomDetailModal({ room, onClose }: RoomDetailModalProps) {
  const modalRef = useFocusTrap<HTMLDivElement>(!!room);

  if (!room) return null;

  const activeBooking = room.bookings && room.bookings.length > 0 ? room.bookings[0] : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-[#12141A] rounded-2xl border border-[#C8A96A]/40 p-6 space-y-6 shadow-2xl text-white font-sans"
          role="dialog"
          aria-modal="true"
          aria-labelledby="room-modal-title"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-[#C8A96A]/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#C8A96A]/30 to-black border border-[#C8A96A]/50 flex items-center justify-center text-[#C8A96A]">
                <BedDouble className="h-5 w-5" />
              </div>
              <div>
                <h3 id="room-modal-title" className="font-serif font-bold text-lg text-white flex items-center gap-2">
                  Suite #{room.roomNumber}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                    room.status === "AVAILABLE" ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/40" :
                    room.status === "OCCUPIED" ? "bg-amber-950/40 text-amber-400 border-amber-500/40" :
                    room.status === "RESERVED" ? "bg-blue-950/40 text-blue-400 border-blue-500/40" :
                    "bg-red-950/40 text-red-400 border-red-500/40"
                  }`}>
                    {room.status}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">Floor {room.floor} • {room.type}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ROOM SPECS & TARRIF */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#0B0B0B] p-4 rounded-xl border border-[#C8A96A]/15">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Nightly Rate</span>
              <span className="text-[#C8A96A] font-bold text-sm">₹{room.pricePerNight.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Housekeeping</span>
              <span className={room.isClean ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {room.isClean ? "Clean & Sanitized" : "Turnaround Required"}
              </span>
            </div>
          </div>

          {/* CURRENT OCCUPANT / BOOKING INFO IF OCCUPIED OR RESERVED */}
          {activeBooking ? (
            <div className="space-y-3 p-4 bg-[#0B0B0B] rounded-xl border border-[#C8A96A]/20 font-mono text-xs">
              <div className="text-[11px] text-[#C8A96A] uppercase font-bold flex items-center gap-1.5 border-b border-[#C8A96A]/15 pb-2">
                <User className="h-3.5 w-3.5" /> Active Guest Folio
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Guest Name:</span>
                <span className="font-bold text-white">{activeBooking.customer?.name || "Registered Guest"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact:</span>
                <span className="text-slate-200">{activeBooking.customer?.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stay Duration:</span>
                <span className="text-slate-200">
                  {new Date(activeBooking.checkIn).toLocaleDateString()} - {new Date(activeBooking.checkOut).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Folio Total:</span>
                <span className="text-emerald-400 font-bold">₹{activeBooking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#0B0B0B] rounded-xl border border-dashed border-[#C8A96A]/20 text-center font-mono text-xs text-slate-400">
              No active occupant. Suite ready for immediate check-in dispatch.
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close Inspector
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

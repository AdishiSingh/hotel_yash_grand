"use client";

import React, { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  PhoneCall, 
  MessageSquare, 
  CreditCard, 
  Sparkles, 
  BedDouble, 
  Calendar, 
  AlertCircle, 
  XCircle, 
  PartyPopper,
  ShieldCheck,
  RefreshCw,
  Info
} from "lucide-react";
import { motion } from "framer-motion";

export interface TimelineStep {
  key: string;
  title: string;
  subtitle: string;
  icon: any;
  stepNumber: number;
}

export const TIMELINE_STAGES: TimelineStep[] = [
  {
    key: "SUBMITTED",
    title: "Submitted",
    subtitle: "Booking request saved in PostgreSQL",
    icon: Calendar,
    stepNumber: 1,
  },
  {
    key: "MANAGER_REVIEWING",
    title: "Manager Reviewing",
    subtitle: "Front Desk reviewing availability & tariff",
    icon: Clock,
    stepNumber: 2,
  },
  {
    key: "MANAGER_CONTACTED",
    title: "Manager Contacted",
    subtitle: "Desk reached out via Call/WhatsApp",
    icon: PhoneCall,
    stepNumber: 3,
  },
  {
    key: "CONFIRMED",
    title: "Confirmed",
    subtitle: "Room assigned & reservation approved",
    icon: CheckCircle2,
    stepNumber: 4,
  },
  {
    key: "PAYMENT_PENDING",
    title: "Payment Pending",
    subtitle: "Advance deposit invoice generated",
    icon: CreditCard,
    stepNumber: 5,
  },
  {
    key: "PAID",
    title: "Paid",
    subtitle: "Payment received & verified by Accounts",
    icon: ShieldCheck,
    stepNumber: 6,
  },
  {
    key: "READY",
    title: "Ready for Guest",
    subtitle: "Room sanitized & prepared by Housekeeping",
    icon: Sparkles,
    stepNumber: 7,
  },
  {
    key: "CHECKED_IN",
    title: "Checked In",
    subtitle: "Keycard issued at Front Desk",
    icon: UserCheck,
    stepNumber: 8,
  },
  {
    key: "COMPLETED",
    title: "Completed",
    subtitle: "Guest checked out smoothly",
    icon: BedDouble,
    stepNumber: 9,
  },
];

interface CustomerBookingTimelineProps {
  booking: any;
  onRefresh?: () => void;
}

export function CustomerBookingTimeline({ booking, onRefresh }: CustomerBookingTimelineProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Compute current stage index based on booking status & logs
  const computeCurrentStepIndex = (status: string, logs: any[] = []): number => {
    const s = (status || "").toUpperCase();

    if (s === "CHECKED_OUT" || s === "COMPLETED") return 8; // Step 9
    if (s === "CHECKED_IN") return 7; // Step 8
    if (s === "ROOM_READY" || s === "READY") return 6; // Step 7
    if (s === "PAID" || s === "PAYMENT_VERIFIED") return 5; // Step 6
    if (s === "PAYMENT_PENDING") return 4; // Step 5
    if (s === "CONFIRMED" || s === "APPROVED" || s === "BOOKED") return 3; // Step 4
    if (s === "CONTACTED" || logs.some((l: any) => l.channel === "CALL" || l.channel === "WHATSAPP")) return 2; // Step 3
    if (s === "IN_PROGRESS" || s === "ASSIGNED") return 1; // Step 2
    return 0; // Step 1: SUBMITTED
  };

  const isCancelled = booking.status === "CANCELLED" || booking.status === "REJECTED";
  const currentStepIndex = isCancelled ? -1 : computeCurrentStepIndex(booking.status, booking.communicationLogs || []);
  const progressPercentage = isCancelled ? 0 : Math.round(((currentStepIndex + 1) / TIMELINE_STAGES.length) * 100);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) await onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="space-y-6 bg-[#0F1115] border border-[#C5A880]/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left select-none">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C5A880]/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Top Header & Real-time Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold">
              REAL-TIME POSTGRESQL TIMELINE TRACKER
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
            Booking Progress: #{booking.bookingId || booking.requestId}
          </h3>
          <div className="text-xs text-neutral-300 font-mono">
            Guests: <strong className="text-emerald-400 font-bold">{booking.guestsCount || (booking.adults || 1) + (booking.children || 0)}</strong> ({booking.adults || booking.guests || 1} Adults, {booking.children || 0} Children) • {booking.roomType || "Single Deluxe"}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880] text-xs font-mono font-bold">
            {progressPercentage}% Complete
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Refresh Timeline Status"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#C5A880]" : ""}`} />
          </button>
        </div>
      </div>

      {/* CANCELLED / REJECTED BANNER */}
      {isCancelled ? (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-start gap-3 text-xs text-red-300">
          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white block font-semibold">Reservation Cancelled / Rejected</strong>
            <p className="mt-0.5 text-neutral-300">
              Reason: {booking.rejectionReason || booking.managerRemarks || "Unavailable for selected dates."}
            </p>
            <a
              href="https://wa.me/919151088115"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-[#C5A880] font-semibold hover:underline"
            >
              <span>Contact Desk to Reschedule</span>
            </a>
          </div>
        </div>
      ) : (
        /* PROGRESS BAR */
        <div className="space-y-2 relative z-10">
          <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/10 p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-emerald-400 rounded-full"
            />
          </div>
        </div>
      )}

      {/* LUXURY STEP TIMELINE GRID */}
      <div className="space-y-4 pt-2 relative z-10">
        <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C5A880]" />
          <span>Stage-by-Stage Stay Progress</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TIMELINE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isDone = !isCancelled && idx < currentStepIndex;
            const isCurrent = !isCancelled && idx === currentStepIndex;
            const isFuture = !isCancelled && idx > currentStepIndex;

            return (
              <div
                key={stage.key}
                className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                  isDone
                    ? "bg-emerald-950/20 border-emerald-500/30 text-white"
                    : isCurrent
                    ? "bg-[#C5A880]/15 border-[#C5A880] shadow-lg shadow-[#C5A880]/10 text-white"
                    : isCancelled
                    ? "bg-neutral-950/60 border-white/5 opacity-40 text-neutral-500"
                    : "bg-neutral-950/60 border-white/5 text-neutral-400"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      isDone
                        ? "bg-emerald-500/20 text-emerald-400"
                        : isCurrent
                        ? "bg-[#C5A880] text-black font-bold"
                        : "bg-neutral-900 text-neutral-500"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                      Step 0{stage.stepNumber}
                    </span>
                  </div>

                  {isDone && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      DONE
                    </span>
                  )}
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#C5A880] text-black animate-pulse">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-white mb-0.5">{stage.title}</div>
                <div className="text-[11px] text-neutral-400 leading-tight">{stage.subtitle}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COMMUNICATION LOGS & MANAGER NOTES FEED */}
      {booking.communicationLogs && booking.communicationLogs.length > 0 && (
        <div className="pt-4 border-t border-white/10 space-y-3 relative z-10">
          <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-bold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#C5A880]" />
            <span>Management Activity & Updates</span>
          </h4>

          <div className="space-y-2">
            {booking.communicationLogs.map((log: any) => (
              <div key={log.id} className="p-3 bg-neutral-950 rounded-xl border border-white/5 flex items-start gap-3 text-xs">
                <Info className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{log.channel} • {log.managerName}</span>
                    <span className="text-[10px] font-mono text-neutral-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-neutral-400 mt-0.5">{log.notes || "Communication event logged."}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

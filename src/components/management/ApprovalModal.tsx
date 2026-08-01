"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, Check, AlertCircle, MessageSquare } from "lucide-react";
import { BookingRequest } from "./types";
import { Button } from "@/components/ui/button";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface ApprovalModalProps {
  request: BookingRequest | null;
  onClose: () => void;
  onSuccess: (status: "APPROVED" | "REJECTED", remarks: string) => Promise<void>;
}

export function ApprovalModal({ request, onClose, onSuccess }: ApprovalModalProps) {
  const [managerNotes, setManagerNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useFocusTrap<HTMLDivElement>(!!request);

  if (!request) return null;

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    setLoading(true);
    try {
      const finalRemarks = managerNotes.trim() || (status === "APPROVED" ? "Approved by Executive Desk" : "Declined by Executive Desk");
      await onSuccess(status, finalRemarks);
    } finally {
      setLoading(false);
    }
  };

  const PRESET_REMARKS = [
    "Approved & Confirmed - Welcome VIP",
    "Room assigned & suite prepped",
    "Declined - High occupancy on requested date",
    "Contacted guest for deposit confirmation",
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-[#12141A] rounded-2xl border border-[#C8A96A]/40 p-6 space-y-5 shadow-2xl text-white font-sans"
          role="dialog"
          aria-modal="true"
          aria-labelledby="approval-modal-title"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-[#C8A96A]/20 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#C8A96A]" />
              <h3 id="approval-modal-title" className="font-serif font-bold text-base uppercase tracking-wider text-white">
                Review Executive Booking Request
              </h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close modal">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* REQUEST SUMMARY */}
          <div className="space-y-2.5 text-xs font-mono bg-[#0B0B0B] p-4 rounded-xl border border-[#C8A96A]/15">
            <div className="flex justify-between">
              <span className="text-slate-400">Guest Name:</span>
              <span className="font-bold text-white">{request.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Contact Mobile:</span>
              <span className="text-[#C8A96A] font-bold">{request.mobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Category / Type:</span>
              <span className="text-white font-bold">{request.type} ({request.roomType || request.eventType || "Standard Suite"})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Requested Date:</span>
              <span className="text-slate-200">{new Date(request.eventDate || request.checkIn || request.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* QUICK REMARKS PRESETS */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-[#C8A96A]" />
              1-Click Manager Remarks Presets:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_REMARKS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setManagerNotes(preset)}
                  className="px-2.5 py-1 bg-[#0B0B0B] hover:bg-[#1A1D24] border border-[#C8A96A]/25 rounded-lg text-[10px] font-mono text-slate-300 hover:text-[#C8A96A] transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* REMARKS TEXTAREA */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Custom Manager Directives / Notes</label>
            <textarea
              value={managerNotes}
              onChange={(e) => setManagerNotes(e.target.value)}
              placeholder="Type remarks or executive notes..."
              className="w-full h-20 p-3 bg-[#0B0B0B] border border-[#C8A96A]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8A96A]"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleAction("REJECTED")}
              isLoading={loading}
            >
              Decline Request
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleAction("APPROVED")}
              isLoading={loading}
            >
              Approve & Confirm Stay
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldAlert, Clock, User, Phone, Sparkles } from "lucide-react";
import { BookingRequest } from "./types";
import { Button } from "@/components/ui/button";

interface PriorityApprovalFeedProps {
  requests: BookingRequest[];
  onSelectRequest: (request: BookingRequest) => void;
  onQuickApprove: (request: BookingRequest) => void;
}

export function PriorityApprovalFeed({
  requests = [],
  onSelectRequest,
  onQuickApprove,
}: PriorityApprovalFeedProps) {
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredRequests = requests.filter((r) => {
    if (filterType === "ALL") return true;
    return r.type === filterType;
  });

  return (
    <div className="p-6 bg-[#171E27] rounded-3xl border border-[#D4AF37]/30 shadow-xl space-y-5 text-left font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D4AF37]/20 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider">
              Priority Booking Approval Feed ({requests.length})
            </h2>
            <p className="text-xs text-slate-400 font-mono">1-Click Executive Action Queue</p>
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
              filterType === "ALL"
                ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-md"
                : "bg-[#121820] text-slate-400 border-transparent hover:text-white"
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilterType("ROOM")}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
              filterType === "ROOM"
                ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-md"
                : "bg-[#121820] text-slate-400 border-transparent hover:text-white"
            }`}
          >
            Rooms ({requests.filter((r) => r.type === "ROOM").length})
          </button>
          <button
            onClick={() => setFilterType("BANQUET")}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
              filterType === "BANQUET"
                ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-md"
                : "bg-[#121820] text-slate-400 border-transparent hover:text-white"
            }`}
          >
            Banquets ({requests.filter((r) => r.type === "BANQUET").length})
          </button>
        </div>
      </div>

      {/* FEED CARDS */}
      {filteredRequests.length === 0 ? (
        <div className="p-10 text-center bg-[#121820] rounded-2xl border border-dashed border-[#D4AF37]/20 space-y-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto opacity-70" />
          <div className="text-sm font-serif font-bold text-slate-200">Zero Pending Approvals</div>
          <p className="text-xs text-slate-400 font-mono">
            All guest reservation requests have been processed cleanly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 bg-[#121820] rounded-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 space-y-3 flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-white text-base">{req.guestName}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {req.type || "ROOM"}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono space-y-1 bg-[#0B0F14] p-3 rounded-xl border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="text-white font-bold">{req.roomType || req.eventType || "Deluxe Suite"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact:</span>
                    <span className="text-[#D4AF37] font-bold">{req.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Requested Date:</span>
                    <span className="text-slate-200">
                      {new Date(req.eventDate || req.checkIn || req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION CHIPS */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D4AF37]/15">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSelectRequest(req)}
                >
                  Review
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onQuickApprove(req)}
                  startIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                >
                  Approve Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Filter, AlertCircle } from "lucide-react";
import { BookingRequest } from "./types";
import { Button } from "@/components/ui/button";

interface PendingApprovalsListProps {
  requests: BookingRequest[];
  onSelectRequest: (request: BookingRequest) => void;
}

export function PendingApprovalsList({ requests = [], onSelectRequest }: PendingApprovalsListProps) {
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredRequests = requests.filter((r) => {
    if (filterType === "ALL") return true;
    return r.type === filterType;
  });

  return (
    <div className="p-6 bg-[#12141A] rounded-2xl border border-[#C8A96A]/20 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#C8A96A]/15 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h2 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
            Pending Booking Requests ({requests.length})
          </h2>
        </div>

        {/* QUICK CATEGORY FILTER */}
        <div className="flex items-center gap-1 font-mono text-[11px]">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              filterType === "ALL"
                ? "bg-[#C8A96A]/20 text-[#C8A96A] border-[#C8A96A]/40 font-bold"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilterType("ROOM")}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              filterType === "ROOM"
                ? "bg-[#C8A96A]/20 text-[#C8A96A] border-[#C8A96A]/40 font-bold"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            Rooms ({requests.filter((r) => r.type === "ROOM").length})
          </button>
          <button
            onClick={() => setFilterType("BANQUET")}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              filterType === "BANQUET"
                ? "bg-[#C8A96A]/20 text-[#C8A96A] border-[#C8A96A]/40 font-bold"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            Banquets ({requests.filter((r) => r.type === "BANQUET").length})
          </button>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs bg-[#0B0B0B] rounded-xl border border-dashed border-[#C8A96A]/15">
          Zero pending requests in queue. All guest approvals are up to date!
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 bg-[#0B0B0B] rounded-xl border border-[#C8A96A]/15 hover:border-[#C8A96A]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif font-bold text-white">{req.guestName}</span>
                  <span className="px-2 py-0.5 rounded text-[9.5px] font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                    {req.type || "ROOM"}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  {req.roomType || req.eventType || "Deluxe Suite Stay"} • <span className="text-[#C8A96A]">{req.mobile}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Requested Date: {new Date(req.eventDate || req.checkIn || req.createdAt).toLocaleDateString()}
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => onSelectRequest(req)}
                startIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
              >
                Review Request
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

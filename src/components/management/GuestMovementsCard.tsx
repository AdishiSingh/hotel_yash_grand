"use client";

import React, { useState } from "react";
import { RoomBooking } from "./types";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";

interface GuestMovementsCardProps {
  checkIns: RoomBooking[];
  checkOuts: RoomBooking[];
}

export function GuestMovementsCard({ checkIns = [], checkOuts = [] }: GuestMovementsCardProps) {
  const [activeTab, setActiveTab] = useState<"checkIns" | "checkOuts">("checkIns");
  const [expanded, setExpanded] = useState(false);

  const activeList = activeTab === "checkIns" ? checkIns : checkOuts;
  const displayedList = expanded ? activeList : activeList.slice(0, 4);

  return (
    <div className="p-6 bg-[#12141A] rounded-2xl border border-[#C8A96A]/20 space-y-4 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#C8A96A]/15 pb-3">
          <h2 className="text-sm font-serif font-bold text-[#C8A96A] uppercase tracking-wider flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Today's Guest Movements
          </h2>
        </div>

        {/* TAB HEADERS */}
        <div className="grid grid-cols-2 gap-2 mt-4 font-mono text-xs">
          <button
            onClick={() => {
              setActiveTab("checkIns");
              setExpanded(false);
            }}
            className={`p-2.5 rounded-xl border font-bold transition-all ${
              activeTab === "checkIns"
                ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/40"
                : "bg-[#0B0B0B] text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            Check-ins ({checkIns.length})
          </button>

          <button
            onClick={() => {
              setActiveTab("checkOuts");
              setExpanded(false);
            }}
            className={`p-2.5 rounded-xl border font-bold transition-all ${
              activeTab === "checkOuts"
                ? "bg-amber-950/30 text-amber-400 border-amber-500/40"
                : "bg-[#0B0B0B] text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            Check-outs ({checkOuts.length})
          </button>
        </div>

        {/* MOVEMENTS LIST */}
        <div className="space-y-2 mt-4">
          {displayedList.length === 0 ? (
            <div className="p-4 bg-[#0B0B0B] rounded-xl text-center text-xs font-mono text-slate-400 border border-dashed border-[#C8A96A]/15">
              No scheduled {activeTab === "checkIns" ? "check-ins" : "check-outs"} remaining today.
            </div>
          ) : (
            displayedList.map((b) => (
              <div
                key={b.id}
                className={`p-3 bg-[#0B0B0B] rounded-xl text-xs flex items-center justify-between border ${
                  activeTab === "checkIns" ? "border-emerald-500/20" : "border-amber-500/20"
                }`}
              >
                <div>
                  <div className="font-bold text-white">{b.customer?.name || "Patron Guest"}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Suite #{b.room?.roomNumber || "N/A"} • {b.customer?.phone || ""}
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                    activeTab === "checkIns"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {activeTab === "checkIns" ? "SCHEDULED" : "LEAVING"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* EXPAND TOGGLE */}
      {activeList.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full pt-3 mt-2 border-t border-[#C8A96A]/10 text-xs font-mono text-[#C8A96A] hover:text-[#DFBA73] flex items-center justify-center gap-1"
        >
          <span>{expanded ? "Show Less" : `View All ${activeList.length} Guests`}</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}

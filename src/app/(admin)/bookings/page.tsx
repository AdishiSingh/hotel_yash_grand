"use client";

import React, { useState, useMemo } from "react";
import { INITIAL_ENQUIRIES, BookingEnquiry } from "@/data/admin";
import { Sparkles, Calendar, Clipboard, Filter, User, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookingsManagerPage() {
  const [enquiries, setEnquiries] = useState<BookingEnquiry[]>(INITIAL_ENQUIRIES);
  const [filterType, setFilterType] = useState<"all" | "room" | "restaurant" | "banquet">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all");

  const filteredList = useMemo(() => {
    return enquiries.filter((item) => {
      const matchType = filterType === "all" || item.type === filterType;
      const matchStatus = filterStatus === "all" || item.status === filterStatus;
      return matchType && matchStatus;
    });
  }, [enquiries, filterType, filterStatus]);

  const handleStatus = (id: string, newStatus: any) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  return (
    <div className="space-y-8 text-neutral-100 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6 text-left">
        <div>
          <h3 className="font-serif text-2xl text-white">Reservation Enquiries</h3>
          <p className="text-xs text-neutral-500 font-sans">
            Review room booking check-ins, dining table reservations, and wedding banquet requests.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-900/40 p-4 border border-neutral-800 rounded-xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {(["all", "room", "restaurant", "banquet"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all cursor-pointer",
                filterType === type
                  ? "bg-[#DFBA73] text-black border-[#DFBA73] shadow-md"
                  : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
              )}
            >
              {type === "all" ? "All categories" : type}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 font-sans text-xs">
          <Filter className="h-4 w-4 text-gold shrink-0" />
          <span className="text-neutral-400 font-medium">Status Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-lg text-white outline-none focus:border-gold"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Reservation Cards List */}
      <div className="space-y-4">
        {filteredList.map((enq) => (
          <div
            key={enq.id}
            className="p-6 border border-neutral-800 bg-[#14161C]/50 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold/15 transition-all duration-300"
          >
            <div className="space-y-4 text-left flex-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold px-2 py-0.5 bg-gold/10 border border-gold/15 rounded-[3px]">
                  {enq.type}
                </span>
                <span className="text-[10.5px] text-neutral-500 font-mono">ID: {enq.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Guest Details */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-500 block font-semibold">Contact Guest</span>
                  <div className="flex items-center gap-2 text-white">
                    <User className="h-3.5 w-3.5 text-neutral-500" />
                    <span className="text-sm font-medium select-text">{enq.name}</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 block select-text">{enq.phone}</span>
                  <span className="text-[11px] text-neutral-500 block select-text">{enq.email}</span>
                </div>

                {/* Event Details */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-500 block font-semibold">Details & Capacity</span>
                  <p className="text-[11.5px] text-neutral-300 font-sans leading-relaxed select-text">
                    {enq.details}
                  </p>
                  <span className="text-[10.5px] text-neutral-500 block font-semibold">
                    Expected: {enq.guests} Guests
                  </span>
                </div>

                {/* Schedule */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-500 block font-semibold">Schedule Timing</span>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                    <span className="text-xs">{enq.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Casing status & actions controls */}
            <div className="flex md:flex-col items-end justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-800/40">
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-neutral-500 block font-semibold mb-1">Status</span>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-[3px] text-[9.5px] uppercase tracking-widest font-bold border",
                    enq.status === "confirmed"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15"
                      : enq.status === "completed"
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/15"
                      : enq.status === "cancelled"
                      ? "bg-red-500/10 text-red-400 border-red-500/15"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/15"
                  )}
                >
                  {enq.status}
                </span>
              </div>

              <div className="flex gap-2 font-buttons">
                {enq.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatus(enq.id, "confirmed")}
                      className="px-3.5 py-1.5 bg-emerald-500 text-black hover:bg-emerald-600 rounded-[3px] font-bold text-[9.5px] uppercase tracking-wider cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleStatus(enq.id, "cancelled")}
                      className="px-3.5 py-1.5 bg-neutral-800 text-neutral-400 hover:text-white rounded-[3px] font-bold text-[9.5px] uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {enq.status === "confirmed" && (
                  <button
                    onClick={() => handleStatus(enq.id, "completed")}
                    className="px-3.5 py-1.5 bg-blue-500 text-black hover:bg-blue-600 rounded-[3px] font-bold text-[9.5px] uppercase tracking-wider cursor-pointer"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl">
            <span className="text-sm text-neutral-500 uppercase tracking-widest block mb-2">No Enquiries Found</span>
            <p className="text-xs text-neutral-600">No bookings match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

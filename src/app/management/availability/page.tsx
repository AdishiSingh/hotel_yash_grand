"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Building, 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  Clock, 
  User, 
  Sliders, 
  X,
  Search,
  Filter,
  Ban
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RealTimeRoomAvailabilityPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [processingBlock, setProcessingBlock] = useState(false);

  const fetchAvailabilityMatrix = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/management/rooms/availability?days=14");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch availability matrix:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilityMatrix();
  }, []);

  const handleBlockUnblock = async (action: "block" | "unblock") => {
    if (!selectedRoom) return;
    setProcessingBlock(true);

    try {
      const res = await fetch("/api/management/rooms/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          roomId: selectedRoom.roomId,
          reason: blockReason || "Administrative hold",
        }),
      });

      if (res.ok) {
        setSelectedRoom(null);
        setBlockReason("");
        fetchAvailabilityMatrix();
      }
    } catch (err) {
      console.error("Block action error:", err);
    } finally {
      setProcessingBlock(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs font-mono text-[#DFBA73] animate-pulse space-y-2">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#DFBA73]" />
        <div>CALCULATING REAL-TIME ROOM AVAILABILITY MATRIX & OVERBOOKING PROTECTION...</div>
      </div>
    );
  }

  const rooms = data?.rooms || [];
  const summary = data?.summary || {
    totalRooms: 24,
    available: 24,
    reserved: 0,
    occupied: 0,
    maintenance: 0,
    blocked: 0,
    occupancyPercent: 0,
  };

  // Filtered rooms list
  const filteredRooms = rooms.filter((r: any) => {
    const matchesSearch = 
      r.roomNumber.includes(searchQuery) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || r.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Unique dates from matrix
  const datesList = rooms[0]?.dateMatrix?.map((d: any) => d.date) || [];

  return (
    <div className="space-y-8 select-none text-left font-sans">
      
      {/* 1. HEADER CONTROL BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Real-Time Room Availability Engine
            </h1>
            <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9.5px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Zero Overbooking Protection Active</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Live 14-day inventory grid synchronized with Manager Approvals and Front Desk check-ins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAvailabilityMatrix}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#DFBA73]" />
            <span>Sync Inventory</span>
          </button>
        </div>
      </div>

      {/* 2. 5-STATUS SUMMARY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Total Rooms */}
        <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-4 space-y-1">
          <span className="text-[9.5px] uppercase tracking-widest text-neutral-400 font-bold">Total Rooms</span>
          <div className="font-mono text-xl font-bold text-white">{summary.totalRooms}</div>
        </div>

        {/* 1. Available */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-4 space-y-1">
          <span className="text-[9.5px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Available
          </span>
          <div className="font-mono text-xl font-bold text-white">{summary.available}</div>
        </div>

        {/* 2. Reserved */}
        <div className="bg-blue-950/20 border border-blue-500/40 rounded-2xl p-4 space-y-1">
          <span className="text-[9.5px] uppercase tracking-widest text-blue-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" /> Reserved
          </span>
          <div className="font-mono text-xl font-bold text-white">{summary.reserved}</div>
        </div>

        {/* 3. Occupied */}
        <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-4 space-y-1">
          <span className="text-[9.5px] uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Occupied
          </span>
          <div className="font-mono text-xl font-bold text-white">{summary.occupied}</div>
        </div>

        {/* 4. Maintenance */}
        <div className="bg-red-950/20 border border-red-500/40 rounded-2xl p-4 space-y-1">
          <span className="text-[9.5px] uppercase tracking-widest text-red-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400" /> Maintenance
          </span>
          <div className="font-mono text-xl font-bold text-white">{summary.maintenance}</div>
        </div>

        {/* 5. Blocked */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-4 space-y-1">
          <span className="text-[9.5px] uppercase tracking-widest text-neutral-300 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-neutral-400" /> Blocked
          </span>
          <div className="font-mono text-xl font-bold text-white">{summary.blocked}</div>
        </div>

      </div>

      {/* 3. SEARCH & FILTER TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F1115] border border-white/10 p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search room number or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#07090D] border border-white/15 focus:border-[#DFBA73] pl-8 pr-3 py-2 rounded-xl text-xs text-white outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#07090D] border border-white/15 focus:border-[#DFBA73] px-3 py-2 rounded-xl text-xs text-white outline-none cursor-pointer font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available Only</option>
            <option value="RESERVED">Reserved Only</option>
            <option value="OCCUPIED">Occupied Only</option>
            <option value="MAINTENANCE">Maintenance Only</option>
            <option value="BLOCKED">Blocked Only</option>
          </select>
        </div>

        <div className="text-xs text-neutral-400 font-mono">
          Showing {filteredRooms.length} of {rooms.length} Rooms
        </div>
      </div>

      {/* 4. REAL-TIME 14-DAY CALENDAR MATRIX GRID */}
      <div className="bg-[#0F1115] border border-white/10 rounded-2xl overflow-x-auto p-4 scrollbar-none">
        <table className="w-full text-left text-xs border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400 font-mono text-[10.5px]">
              <th className="p-3 sticky left-0 bg-[#0F1115] z-10 w-44">Room & Type</th>
              <th className="p-3 w-28 text-center">Status</th>
              {datesList.map((d: string) => (
                <th key={d} className="p-2 text-center min-w-[65px]">
                  <div>{new Date(d).toLocaleDateString("en-US", { weekday: "short" })}</div>
                  <div className="font-bold text-white">{new Date(d).getDate()}</div>
                </th>
              ))}
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredRooms.map((rm: any) => (
              <tr key={rm.roomId} className="hover:bg-white/[0.02] transition-all">
                
                {/* Room Details */}
                <td className="p-3 sticky left-0 bg-[#0F1115] z-10 font-mono">
                  <div className="font-bold text-white text-sm">Room {rm.roomNumber}</div>
                  <div className="text-[10px] text-neutral-400">{rm.type}</div>
                </td>

                {/* Status Badge */}
                <td className="p-3 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold uppercase tracking-wider ${
                    rm.currentStatus === "AVAILABLE"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : rm.currentStatus === "RESERVED"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      : rm.currentStatus === "OCCUPIED"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : rm.currentStatus === "BLOCKED"
                      ? "bg-neutral-800 text-neutral-300 border border-neutral-600"
                      : "bg-red-500/20 text-red-300 border border-red-500/40"
                  }`}>
                    {rm.currentStatus}
                  </span>
                </td>

                {/* 14-Day Status Cells */}
                {rm.dateMatrix.map((cell: any) => {
                  const isAvail = cell.status === "AVAILABLE";
                  const isRes = cell.status === "RESERVED";
                  const isOcc = cell.status === "OCCUPIED";
                  const isBlock = cell.status === "BLOCKED";

                  return (
                    <td key={cell.date} className="p-1.5 text-center">
                      <div
                        title={cell.guestName ? `Guest: ${cell.guestName} (#${cell.bookingRef})` : cell.status}
                        className={`h-9 rounded-lg flex items-center justify-center font-mono text-[9px] font-bold transition-all cursor-pointer ${
                          isAvail
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 hover:border-emerald-400"
                            : isRes
                            ? "bg-blue-950/60 text-blue-300 border border-blue-500/30"
                            : isOcc
                            ? "bg-amber-950/60 text-amber-300 border border-amber-500/30"
                            : isBlock
                            ? "bg-neutral-900 text-neutral-400 border border-neutral-700"
                            : "bg-red-950/60 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {isAvail ? "✓" : isRes ? "RES" : isOcc ? "OCC" : isBlock ? "BLK" : "MNT"}
                      </div>
                    </td>
                  );
                })}

                {/* Actions: Block / Unblock */}
                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedRoom(rm)}
                    className="px-3 py-1 rounded-lg bg-neutral-900 border border-white/15 text-neutral-200 text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                  >
                    {rm.currentStatus === "BLOCKED" ? "Unblock" : "Block Room"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. BLOCK / UNBLOCK MODAL */}
      <AnimatePresence>
        {selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0F1115] border border-[#DFBA73]/40 rounded-3xl p-6 max-w-md w-full space-y-5 text-left shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#DFBA73]">ADMINISTRATIVE BLOCK CONTROL</span>
                  <h3 className="text-lg font-serif font-bold text-white">Room {selectedRoom.roomNumber} ({selectedRoom.type})</h3>
                </div>
                <button onClick={() => setSelectedRoom(null)} className="text-neutral-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-neutral-300">
                <div><strong>Current Status:</strong> <span className="font-mono text-[#DFBA73]">{selectedRoom.currentStatus}</span></div>
                <div><strong>Floor:</strong> Floor {selectedRoom.floor}</div>
              </div>

              {selectedRoom.currentStatus !== "BLOCKED" && (
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                    Reason for Administrative Block
                  </label>
                  <textarea
                    rows={3}
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="e.g. Deep cleaning, HVAC repair, or VIP reservation hold."
                    className="w-full bg-[#07090D] border border-white/15 focus:border-[#DFBA73] px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-neutral-600 outline-none resize-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="py-3 rounded-xl border border-white/15 bg-neutral-900 text-neutral-300 font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                {selectedRoom.currentStatus === "BLOCKED" ? (
                  <button
                    onClick={() => handleBlockUnblock("unblock")}
                    disabled={processingBlock}
                    className="py-3 rounded-xl bg-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Restore Available Status
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlockUnblock("block")}
                    disabled={processingBlock}
                    className="py-3 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Apply Room Block
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

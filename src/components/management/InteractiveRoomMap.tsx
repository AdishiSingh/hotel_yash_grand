"use client";

import React, { useMemo, useState } from "react";
import { BedDouble, Search, Filter, AlertCircle, Sparkles, Building } from "lucide-react";
import { Room } from "./types";

interface InteractiveRoomMapProps {
  rooms: Room[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  onSelectRoom: (room: Room) => void;
}

export function InteractiveRoomMap({
  rooms = [],
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onSelectRoom,
}: InteractiveRoomMapProps) {
  const [selectedFloor, setSelectedFloor] = useState<number | "ALL">("ALL");

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || room.status === statusFilter;
      const matchesFloor = selectedFloor === "ALL" || room.floor === selectedFloor;
      return matchesSearch && matchesStatus && matchesFloor;
    });
  }, [rooms, searchQuery, statusFilter, selectedFloor]);

  // Group rooms by floor
  const floors = useMemo(() => {
    const map = new Map<number, Room[]>();
    filteredRooms.forEach((r) => {
      const f = r.floor || 1;
      if (!map.has(f)) map.set(f, []);
      map.get(f)!.push(r);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [filteredRooms]);

  return (
    <section className="p-6 bg-[#171E27] rounded-3xl border border-[#D4AF37]/30 shadow-xl space-y-6 text-left font-sans">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-[#D4AF37]" />
            <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider">
              Spatial Room Inventory Map ({rooms.length} Suites)
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Interactive floor-by-floor luxury suite allocation map
          </p>
        </div>

        {/* SEARCH, STATUS & FLOOR FILTERS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Suite..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-[#0B0F14] border border-[#D4AF37]/30 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37] font-mono"
            />
          </div>

          {/* FLOOR FILTER */}
          <div className="flex items-center gap-1 font-mono text-xs">
            {["ALL", 1, 2, 3].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFloor(f as any)}
                className={`px-2.5 py-1.5 rounded-xl border transition-all ${
                  selectedFloor === f
                    ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold"
                    : "bg-[#0B0F14] text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                {f === "ALL" ? "All Floors" : `Floor ${f}`}
              </button>
            ))}
          </div>

          {/* STATUS SELECT */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-1.5 bg-[#0B0F14] border border-[#D4AF37]/30 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37] font-mono cursor-pointer"
          >
            <option value="ALL">All Statuses ({rooms.length})</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="RESERVED">Reserved</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* FLOOR MAP RENDER */}
      {floors.length === 0 ? (
        <div className="p-12 text-center bg-[#0B0F14] rounded-2xl border border-dashed border-[#D4AF37]/20 space-y-3">
          <AlertCircle className="h-8 w-8 text-[#D4AF37] mx-auto opacity-70" />
          <div className="text-sm font-serif font-bold text-slate-200">No Suites Match Current Filter</div>
          <p className="text-xs text-slate-400 font-mono">
            No rooms found for search "{searchQuery}" on selected floor/status.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {floors.map(([floorNum, floorRooms]) => (
            <div key={floorNum} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-wider border-b border-[#D4AF37]/15 pb-1.5">
                <Building className="h-4 w-4" />
                <span>Floor {floorNum} Suite Wing ({floorRooms.length} Suites)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {floorRooms.map((room) => {
                  const isAvailable = room.status === "AVAILABLE";
                  const isOccupied = room.status === "OCCUPIED";
                  const isReserved = room.status === "RESERVED";
                  const activeBk = room.bookings && room.bookings.length > 0 ? room.bookings[0] : null;

                  return (
                    <div
                      key={room.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectRoom(room)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectRoom(room);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-left space-y-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37] hover:scale-[1.02] shadow-md ${
                        isAvailable
                          ? "bg-emerald-950/20 border-emerald-500/35 hover:border-emerald-400"
                          : isOccupied
                          ? "bg-amber-950/20 border-amber-500/35 hover:border-amber-400"
                          : isReserved
                          ? "bg-blue-950/20 border-blue-500/35 hover:border-blue-400"
                          : "bg-red-950/20 border-red-500/35 hover:border-red-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-white">#{room.roomNumber}</span>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isAvailable
                              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                              : isOccupied
                              ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                              : isReserved
                              ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                              : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                          }`}
                        />
                      </div>

                      <div className="text-[10px] text-slate-400 truncate font-sans">{room.type}</div>

                      {activeBk ? (
                        <div className="text-[10px] font-mono text-[#D4AF37] truncate font-bold">
                          👤 {activeBk.customer?.name || "In-house Guest"}
                        </div>
                      ) : (
                        <div className="text-[9.5px] uppercase font-mono font-bold tracking-wider" style={{
                          color: isAvailable ? "#34D399" : isOccupied ? "#FBBF24" : isReserved ? "#60A5FA" : "#F87171"
                        }}>
                          {room.status}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

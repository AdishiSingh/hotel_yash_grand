"use client";

import React, { useMemo } from "react";
import { Search, BedDouble, Filter, AlertCircle } from "lucide-react";
import { Room } from "./types";

interface RoomInventoryGridProps {
  rooms: Room[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  onSelectRoom: (room: Room) => void;
}

export function RoomInventoryGrid({
  rooms = [],
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onSelectRoom,
}: RoomInventoryGridProps) {
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || room.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rooms, searchQuery, statusFilter]);

  return (
    <section className="p-6 bg-[#12141A] rounded-2xl border border-[#C8A96A]/20 space-y-4 shadow-xl">
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C8A96A]/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-[#C8A96A]" />
            <h2 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
              Live Room Inventory Matrix ({rooms.length} Suites)
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Interactive room inventory with real-time operational status
          </p>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Room or Type..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-[#0B0B0B] border border-[#C8A96A]/25 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8A96A] placeholder-slate-500 font-mono"
              aria-label="Search rooms by number or suite type"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-1.5 bg-[#0B0B0B] border border-[#C8A96A]/25 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-[#C8A96A] font-mono cursor-pointer"
            aria-label="Filter rooms by status"
          >
            <option value="ALL">All Statuses ({rooms.length})</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="RESERVED">Reserved</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      {/* GRID OR EMPTY STATE */}
      {filteredRooms.length === 0 ? (
        <div className="p-12 text-center bg-[#0B0B0B] rounded-xl border border-dashed border-[#C8A96A]/20 space-y-3">
          <AlertCircle className="h-8 w-8 text-[#C8A96A] mx-auto opacity-60" />
          <div className="text-sm font-serif font-bold text-slate-300">No Suites Match Search Filter</div>
          <p className="text-xs text-slate-400 font-mono">
            No rooms found matching "{searchQuery}" with status "{statusFilter}". Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredRooms.map((room) => {
            const isAvailable = room.status === "AVAILABLE";
            const isOccupied = room.status === "OCCUPIED";
            const isReserved = room.status === "RESERVED";

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
                aria-label={`Suite ${room.roomNumber}, ${room.type}, status ${room.status}. Press to inspect.`}
                className={`p-3 rounded-xl border text-left space-y-1.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C8A96A] ${
                  isAvailable
                    ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/40"
                    : isOccupied
                    ? "bg-amber-950/20 border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/40"
                    : isReserved
                    ? "bg-blue-950/20 border-blue-500/30 hover:border-blue-400 hover:bg-blue-950/40"
                    : "bg-red-950/20 border-red-500/30 hover:border-red-400 hover:bg-red-950/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-white">#{room.roomNumber}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isAvailable
                        ? "bg-emerald-400"
                        : isOccupied
                        ? "bg-amber-400"
                        : isReserved
                        ? "bg-blue-400"
                        : "bg-red-400"
                    }`}
                  />
                </div>
                <div className="text-[10px] text-slate-400 truncate">{room.type}</div>
                <div
                  className="text-[9.5px] uppercase font-mono font-bold tracking-wider"
                  style={{
                    color: isAvailable
                      ? "#34D399"
                      : isOccupied
                      ? "#FBBF24"
                      : isReserved
                      ? "#60A5FA"
                      : "#F87171",
                  }}
                >
                  {room.status}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

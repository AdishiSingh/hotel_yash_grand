"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  BedDouble, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  RefreshCw, 
  Eye, 
  Wrench, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  FileText, 
  History, 
  Sparkles,
  Phone,
  Send,
  Building
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastNotification } from "@/components/management/ToastNotification";

interface RoomRecord {
  id: string;
  roomNumber: string;
  type: string;
  floor: number;
  pricePerNight: number;
  capacity: number;
  status: string; // AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED, CLEANING
  bookings: any[];
}

export default function RoomManagementPage() {
  const [activeTab, setActiveTab] = useState<"CARDS" | "REQUESTS" | "CONFIRMED" | "GUESTS" | "FUTURE">("CARDS");
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<any[]>([]);
  const [currentGuests, setCurrentGuests] = useState<any[]>([]);
  const [futureReservations, setFutureReservations] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Drawer / Profile Modal
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"ROOM" | "BOOKING">("ROOM");
  const [updating, setUpdating] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<string>("");

  const fetchRoomsData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.set("search", searchQuery);
      if (statusFilter !== "ALL") queryParams.set("status", statusFilter);
      if (typeFilter !== "ALL") queryParams.set("roomType", typeFilter);
      if (selectedDate) queryParams.set("date", selectedDate);

      const res = await fetch(`/api/management/rooms?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRooms(json.rooms);
        setBookingRequests(json.bookingRequests);
        setConfirmedBookings(json.confirmedBookings);
        setCurrentGuests(json.currentGuests);
        setFutureReservations(json.futureReservations);
        setStatistics(json.statistics);
      }
    } catch (err) {
      console.error("Failed to fetch room management data:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, typeFilter, selectedDate]);

  useEffect(() => {
    fetchRoomsData();
  }, [fetchRoomsData]);

  const [toast, setToast] = useState<{ id: string; type: "success" | "error"; title: string; message?: string } | null>(null);

  const showToast = (type: "success" | "error", title: string, message?: string) => {
    setToast({ id: Date.now().toString(), type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle Room Status Update (AVAILABLE, MAINTENANCE, OCCUPIED)
  const handleUpdateRoomStatus = async (roomId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/management/rooms/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-room-status",
          status: newStatus,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("success", "Room Status Updated", `Room status changed to ${newStatus}.`);
        fetchRoomsData();
        setSelectedItem(null);
      } else {
        showToast("error", "Update Failed", json.error || "Failed to update room status.");
      }
    } catch (err) {
      console.error("Room status update error:", err);
      showToast("error", "Error", "An unexpected error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Check-In / Check-Out
  const handleGuestAction = async (bookingId: string, action: "check-in-guest" | "check-out-guest") => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/management/rooms/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          bookingId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("success", action === "check-in-guest" ? "Check-in Successful" : "Check-out Complete", "Guest status updated in system.");
        fetchRoomsData();
        setSelectedItem(null);
      } else {
        showToast("error", "Action Failed", json.error || "Failed to execute guest action.");
      }
    } catch (err) {
      console.error("Guest action error:", err);
      showToast("error", "Error", "An unexpected error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8 select-none text-left font-sans">
      
      {/* HEADER & BRANDING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Hotel Rooms & Stay Management
            </h1>
            <span className="bg-[#DFBA73]/15 text-[#DFBA73] border border-[#DFBA73]/30 text-[9.5px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Phase 4 Module</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Real-time management for room allocations, guest check-ins, occupancy rates, and maintenance logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRoomsData}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#DFBA73]" />
            <span>Sync Room Data</span>
          </button>
        </div>
      </div>

      {/* LIVE OCCUPANCY & ROOM METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-neutral-950 border border-emerald-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Available Rooms</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.availableRooms || 0}</div>
          <div className="text-[9.5px] text-emerald-300/80 font-sans">Ready for check-in</div>
        </div>

        <div className="bg-neutral-950 border border-amber-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Occupied Rooms</span>
            <BedDouble className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.occupiedRooms || 0}</div>
          <div className="text-[9.5px] text-amber-300/80 font-sans">In-house guests</div>
        </div>

        <div className="bg-neutral-950 border border-blue-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Today's Check-ins</span>
            <LogIn className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.todayCheckIns || 0}</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">Arriving guests</div>
        </div>

        <div className="bg-neutral-950 border border-purple-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Today's Check-outs</span>
            <LogOut className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.todayCheckOuts || 0}</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">Departing guests</div>
        </div>

        <div className="bg-neutral-950 border border-[#DFBA73]/30 p-4 rounded-xl space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#DFBA73]">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Occupancy Rate</span>
            <Building className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.occupancyRate || 0}%</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">
            {statistics?.occupiedRooms || 0} of {statistics?.totalRooms || 0} Rooms
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex border-b border-white/15 gap-2 font-mono text-xs overflow-x-auto">
        {[
          { id: "CARDS", label: "Visual Room Cards", icon: BedDouble, badge: rooms.length },
          { id: "REQUESTS", label: "Booking Requests", icon: Clock, badge: bookingRequests.filter((r) => r.status === "PENDING").length },
          { id: "CONFIRMED", label: "Confirmed Bookings", icon: CheckCircle2, badge: confirmedBookings.length },
          { id: "GUESTS", label: "Current Guests", icon: User, badge: currentGuests.length },
          { id: "FUTURE", label: "Future Reservations", icon: Calendar, badge: futureReservations.length },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-3 border-b-2 font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-[#DFBA73] text-[#DFBA73] bg-neutral-900/60"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
              {Boolean(t.badge) && (
                <span className="bg-neutral-900 border border-white/15 text-neutral-300 text-[9.5px] px-1.5 py-0.2 rounded-full">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-neutral-950 p-4 border border-white/10 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Guest, Mobile, Room Number..."
            className="w-full bg-neutral-900 border border-white/10 focus:border-[#DFBA73] pl-9 pr-3 py-2 text-xs text-white outline-none rounded"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-xs font-mono">
          {/* Room Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-900 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="RESERVED">Reserved</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          {/* Room Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400">Category:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-neutral-900 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Single Deluxe Room">Single Deluxe</option>
              <option value="Family Room">Family Room</option>
              <option value="Executive Suite">Executive Suite</option>
              <option value="Presidential Suite">Presidential Suite</option>
            </select>
          </div>
        </div>
      </div>

      {/* TAB 1: VISUAL ROOM CARDS GRID */}
      {activeTab === "CARDS" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading ? (
            <div className="col-span-full py-20 text-center text-xs font-mono text-neutral-500 animate-pulse">
              Loading visual room cards from PostgreSQL...
            </div>
          ) : rooms.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-xl text-xs text-neutral-400">
              No rooms match selected filters.
            </div>
          ) : (
            rooms.map((room) => {
              const activeBk = room.bookings && room.bookings.length > 0 ? room.bookings[0] : null;
              const isOccupied = room.status === "OCCUPIED";
              const isAvailable = room.status === "AVAILABLE";
              const isMaintenance = room.status === "MAINTENANCE";

              return (
                <motion.div
                  key={room.id}
                  whileHover={{ y: -2 }}
                  className={`bg-neutral-950 border rounded-2xl p-5 space-y-4 shadow-lux transition-all text-left ${
                    isOccupied
                      ? "border-amber-500/40 bg-amber-950/[0.04]"
                      : isAvailable
                      ? "border-emerald-500/30"
                      : isMaintenance
                      ? "border-red-500/40 bg-red-950/[0.04]"
                      : "border-blue-500/30"
                  }`}
                >
                  {/* ROOM NUMBER & STATUS HEADER */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFBA73]">
                        {room.floor}nd Floor • ₹{room.pricePerNight}/night
                      </span>
                      <h3 className="font-serif text-xl font-bold text-white">
                        Room {room.roomNumber}
                      </h3>
                    </div>
                    <span className={`text-[9.5px] font-mono uppercase font-bold tracking-widest px-2.5 py-0.5 rounded border ${
                      isOccupied
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                        : isAvailable
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : isMaintenance
                        ? "bg-red-500/20 text-red-300 border-red-500/40"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    }`}>
                      {room.status}
                    </span>
                  </div>

                  {/* ROOM TYPE & OCCUPANT INFO */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="text-neutral-300 font-sans">{room.type}</div>

                    {activeBk ? (
                      <div className="bg-neutral-900 p-3 rounded-lg border border-white/5 space-y-1">
                        <div className="text-[#DFBA73] font-bold font-sans">
                          👤 {activeBk.customer?.name || "In-house Guest"}
                        </div>
                        <div className="text-neutral-400 text-[11px]">
                          {new Date(activeBk.checkIn).toLocaleDateString()} → {new Date(activeBk.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-neutral-500 text-[11px] py-1">
                        No active stay. Available for walk-in.
                      </div>
                    )}
                  </div>

                  {/* QUICK ACTIONS TOOLBAR */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                    {isAvailable && (
                      <button
                        onClick={() => handleUpdateRoomStatus(room.id, "MAINTENANCE")}
                        className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 rounded font-mono text-[10.5px] cursor-pointer flex items-center gap-1"
                      >
                        <Wrench className="h-3 w-3" />
                        <span>Maintenance</span>
                      </button>
                    )}

                    {isMaintenance && (
                      <button
                        onClick={() => handleUpdateRoomStatus(room.id, "AVAILABLE")}
                        className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded font-mono text-[10.5px] cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Set Available</span>
                      </button>
                    )}

                    {activeBk && activeBk.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleGuestAction(activeBk.id, "check-in-guest")}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-[11px] cursor-pointer ml-auto flex items-center gap-1"
                      >
                        <LogIn className="h-3.5 w-3.5" />
                        <span>Check In</span>
                      </button>
                    )}

                    {activeBk && activeBk.status === "CHECKED_IN" && (
                      <button
                        onClick={() => handleGuestAction(activeBk.id, "check-out-guest")}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-[11px] cursor-pointer ml-auto flex items-center gap-1"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Check Out</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* TAB: PENDING BOOKING REQUESTS TABLE */}
      {activeTab === "REQUESTS" && (
        <div className="overflow-x-auto bg-neutral-950 border border-white/10 rounded-xl shadow-lux">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-neutral-900/90 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Room Category</th>
                <th className="py-3.5 px-4">Guests</th>
                <th className="py-3.5 px-4">Check-in</th>
                <th className="py-3.5 px-4">Check-out</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-200 font-mono">
              {bookingRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500 font-sans">
                    No room booking requests found.
                  </td>
                </tr>
              ) : (
                bookingRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3.5 px-4 text-[#DFBA73] font-bold">{req.requestId}</td>
                    <td className="py-3.5 px-4 font-sans font-medium text-white">{req.guestName}</td>
                    <td className="py-3.5 px-4">{req.mobile}</td>
                    <td className="py-3.5 px-4 font-sans text-neutral-300">{req.roomType || "Single Deluxe"}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">
                      {req.guestsCount || (req.adults || 1) + (req.children || 0)} ({req.adults || 1}A, {req.children || 0}C)
                    </td>
                    <td className="py-3.5 px-4 text-[#DFBA73]">
                      {req.checkIn ? new Date(req.checkIn).toLocaleDateString() : "TBD"}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">
                      {req.checkOut ? new Date(req.checkOut).toLocaleDateString() : "TBD"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[9.5px] uppercase font-bold px-2.5 py-0.5 rounded border ${
                        req.status === "APPROVED" || req.status === "CONFIRMED"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : req.status === "REJECTED"
                          ? "bg-red-500/20 text-red-300 border-red-500/40"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === "PENDING" && (
                          <>
                            <button
                              onClick={async () => {
                                const res = await fetch(`/api/booking-requests/${req.id}`, {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ action: "approve", managerName: "Duty Manager" }),
                                });
                                const json = await res.json();
                                if (json.success) fetchRoomsData();
                                else alert(json.error || "Approval failed");
                              }}
                              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-[11px] cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={async () => {
                                const reason = prompt("Enter rejection reason:", "Room dates unavailable");
                                if (!reason) return;
                                const res = await fetch(`/api/booking-requests/${req.id}`, {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ action: "reject", rejectionReason: reason }),
                                });
                                const json = await res.json();
                                if (json.success) fetchRoomsData();
                                else alert(json.error || "Rejection failed");
                              }}
                              className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/30 rounded text-[11px] cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: CONFIRMED BOOKINGS TABLE */}
      {activeTab === "CONFIRMED" && (
        <div className="overflow-x-auto bg-neutral-950 border border-white/10 rounded-xl shadow-lux">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-neutral-900/90 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
              <tr>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Room Number</th>
                <th className="py-3.5 px-4">Check-in</th>
                <th className="py-3.5 px-4">Check-out</th>
                <th className="py-3.5 px-4">Tariff Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-200 font-mono">
              {confirmedBookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3.5 px-4 text-[#DFBA73] font-bold">{bk.bookingId}</td>
                  <td className="py-3.5 px-4 font-sans font-medium text-white">{bk.customer?.name || "Guest"}</td>
                  <td className="py-3.5 px-4 font-bold text-white">Room {bk.room?.roomNumber || "101"}</td>
                  <td className="py-3.5 px-4 text-[#DFBA73]">{new Date(bk.checkIn).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-neutral-400">{new Date(bk.checkOut).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-white font-bold">₹{bk.totalAmount}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[9.5px] uppercase font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {bk.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleGuestAction(bk.id, "check-in-guest")}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-[11px] cursor-pointer ml-auto flex items-center gap-1"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      <span>Execute Check-In</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: CURRENT IN-HOUSE GUESTS TABLE */}
      {activeTab === "GUESTS" && (
        <div className="overflow-x-auto bg-neutral-950 border border-white/10 rounded-xl shadow-lux">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-neutral-900/90 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
              <tr>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Assigned Room</th>
                <th className="py-3.5 px-4">Check-in Date</th>
                <th className="py-3.5 px-4">Expected Check-out</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-200 font-mono">
              {currentGuests.map((bk) => (
                <tr key={bk.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3.5 px-4 text-[#DFBA73] font-bold">{bk.bookingId}</td>
                  <td className="py-3.5 px-4 font-sans font-medium text-white">{bk.customer?.name || "Guest"}</td>
                  <td className="py-3.5 px-4">{bk.customer?.phone || "N/A"}</td>
                  <td className="py-3.5 px-4 font-bold text-amber-400">Room {bk.room?.roomNumber || "101"}</td>
                  <td className="py-3.5 px-4 text-neutral-400">{new Date(bk.checkIn).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-[#DFBA73]">{new Date(bk.checkOut).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleGuestAction(bk.id, "check-out-guest")}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded text-[11px] cursor-pointer ml-auto flex items-center gap-1"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Execute Check-Out</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TOAST FEEDBACK NOTIFICATIONS */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

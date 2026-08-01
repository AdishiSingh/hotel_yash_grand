"use client";

import * as React from "react";
import { BedDouble, CheckCircle2, UserCheck, Key, AlertTriangle, Plus } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";

export default function ErpRoomsPage() {
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<string>("ALL");
  const [loading, setLoading] = React.useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBookings(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch room bookings from API:", err);
    } finally {
      setLoading(false);
    }
  };

  useRealtime(["BOOKING_UPDATED", "DASHBOARD_REFRESH"], () => {
    fetchBookings();
  });

  React.useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookings();
    } catch (err) {
      console.error("Failed to update booking status via API:", err);
    }
  };

  const filteredBookings = bookings.filter((b) =>
    filterStatus === "ALL" ? true : b.status === filterStatus
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">Hotel Rooms & Stay Control</h2>
          <p className="text-xs text-neutral-400 font-light">
            Live PostgreSQL room inventory grid, guest check-in/check-out workflow, and housekeeping status.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
          {(["ALL", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-sm text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                filterStatus === st
                  ? "bg-[#C5A880] text-black shadow-md"
                  : "bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.length === 0 ? (
          <div className="col-span-full border border-white/10 bg-neutral-950 p-12 text-center rounded-xl text-neutral-400">
            {loading ? "Loading database room stays..." : "No room stays found in this status."}
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="border border-white/10 bg-neutral-950 p-6 rounded-xl space-y-4 shadow-lux relative overflow-hidden"
            >
              {/* Top Badge & Room Number */}
              <div className="flex justify-between items-start border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold block">
                    {b.room?.type || "Deluxe Room"}
                  </span>
                  <span className="font-serif text-2xl font-semibold text-white">
                    Room {b.room?.roomNumber || "101"}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-sm text-[9.5px] uppercase tracking-widest font-bold border ${
                    b.status === "CHECKED_IN"
                      ? "bg-amber-950/80 border-amber-500/30 text-amber-300"
                      : b.status === "CONFIRMED"
                      ? "bg-blue-950/80 border-blue-500/30 text-blue-300"
                      : b.status === "CHECKED_OUT"
                      ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
                      : "bg-red-950/80 border-red-500/30 text-red-300"
                  }`}
                >
                  {b.status}
                </span>
              </div>

              {/* Price & Current Guest info */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Total Amount:</span>
                  <span className="font-mono text-[#C5A880] font-bold text-sm">₹{b.totalAmount}</span>
                </div>

                <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg space-y-1">
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest">Active Guest:</div>
                  <div className="font-medium text-white text-sm">{b.customer?.name || "Guest"}</div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    Check-In: {new Date(b.checkIn).toLocaleDateString()} • Out: {new Date(b.checkOut).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Room Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex gap-2 justify-end">
                {b.status === "CONFIRMED" && (
                  <button
                    onClick={() => updateBookingStatus(b.id, "CHECKED_IN")}
                    className="w-full py-2.5 bg-[#C5A880] hover:bg-[#A37C40] text-black font-bold text-xs uppercase tracking-widest rounded-sm cursor-pointer shadow-md transition-colors min-h-[38px]"
                  >
                    Guest Check-In →
                  </button>
                )}

                {b.status === "CHECKED_IN" && (
                  <button
                    onClick={() => updateBookingStatus(b.id, "CHECKED_OUT")}
                    className="w-full py-2.5 bg-neutral-800 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-sm cursor-pointer border border-white/10 transition-colors min-h-[38px]"
                  >
                    Complete Check-Out ✓
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

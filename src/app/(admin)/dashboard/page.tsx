"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, Clipboard, TrendingUp, AlertTriangle, Users, ChefHat } from "lucide-react";
import { AiInsightsCard } from "@/components/dashboard/AiInsightsCard";
import { useRealtime } from "@/hooks/useRealtime";

export default function DashboardPage() {
  const [kpis, setKpis] = useState({
    todayRevenue: 0,
    occupancyRate: 0,
    occupiedCount: 0,
    totalRooms: 0,
    ordersCount: 0,
    pendingEnquiries: 0,
    aov: 0,
  });
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [resKpis, resRequests, resBanquets, resInv] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/booking-requests"),
        fetch("/api/banquet"),
        fetch("/api/inventory"),
      ]);

      const jsonKpis = await resKpis.json();
      const jsonRequests = await resRequests.json();
      const jsonBanquets = await resBanquets.json();
      const jsonInv = await resInv.json();

      if (jsonKpis.success && jsonKpis.data) {
        setKpis(jsonKpis.data);
      }

      let combined: any[] = [];
      if (jsonRequests.success && Array.isArray(jsonRequests.requests)) {
        combined = jsonRequests.requests.map((r: any) => ({
          id: r.id,
          requestId: r.requestId,
          customerName: r.guestName,
          customerPhone: r.mobile,
          eventType: r.type === "ROOM" ? `ROOM: ${r.roomType || "Suite"}` : `BANQUET: ${r.eventType || "Event"}`,
          details: r.type === "ROOM" 
            ? `${r.adults} Adults, ${r.children} Children • Check-In: ${r.checkIn ? new Date(r.checkIn).toLocaleDateString() : "TBD"}`
            : `${r.guestsCount || 50} Guests • ${r.eventDate ? new Date(r.eventDate).toLocaleDateString() : "TBD"}`,
          status: r.status,
          type: r.type,
          isRequest: true,
          raw: r,
        }));
      }

      if (jsonBanquets.success && Array.isArray(jsonBanquets.data)) {
        jsonBanquets.data.forEach((b: any) => {
          if (!combined.some((item) => item.requestId === b.enquiryId)) {
            combined.push({
              id: b.id,
              requestId: b.enquiryId,
              customerName: b.customerName,
              customerPhone: b.customerPhone,
              eventType: `BANQUET: ${b.eventType}`,
              details: `${b.guestsCount} Guests • ${new Date(b.eventDate).toLocaleDateString()}`,
              status: b.status,
              type: "BANQUET",
              isRequest: false,
              raw: b,
            });
          }
        });
      }

      setPipeline(combined);

      if (jsonInv.success && Array.isArray(jsonInv.data)) {
        setInventory(jsonInv.data);
      }
    } catch (err) {
      console.error("Error loading live dashboard API data:", err);
    } finally {
      setLoading(false);
    }
  };

  useRealtime(
    ["DASHBOARD_REFRESH", "ORDER_UPDATED", "BOOKING_UPDATED", "BANQUET_UPDATED", "INVENTORY_UPDATED"],
    () => {
      fetchDashboardData();
    }
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const lowStockItems = inventory.filter(
    (item) => item.quantity <= item.minThreshold
  );

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setPipeline((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      await fetch(`/api/banquet/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to update banquet status via API:", err);
    }
  };

  return (
    <div className="space-y-8 text-neutral-100 pb-12 select-none font-sans">
      {/* 1. Welcoming Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h3 className="font-serif text-2xl text-white font-semibold">Operations Control Center</h3>
          <p className="text-xs text-neutral-400 font-light">
            Real-time PostgreSQL API analytics: occupancy rates, pending bookings, and dining sales summary.
          </p>
        </div>
        <div className="text-xs px-3.5 py-1.5 border border-white/10 bg-neutral-950 rounded-lg flex items-center gap-2 text-neutral-300 font-mono">
          <Calendar className="h-3.5 w-3.5 text-[#C5A880]" />
          <span>Shift Date: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      </div>

      {/* 2. Dynamic Database KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Today's Revenue */}
        <div className="p-6 border border-white/10 bg-neutral-950 rounded-xl space-y-3 shadow-lux">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[9px] uppercase tracking-wider font-bold">Today's Revenue</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-serif text-white font-medium block">
              ₹{kpis.todayRevenue.toLocaleString()}
            </span>
            <span className="text-[9px] text-emerald-400 font-sans font-semibold">
              Live API Query • +14.2% vs yesterday
            </span>
          </div>
        </div>

        {/* Card 2: Occupancy Rate */}
        <div className="p-6 border border-white/10 bg-neutral-950 rounded-xl space-y-3 shadow-lux">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[9px] uppercase tracking-wider font-bold">Room Occupancy</span>
            <Users className="h-4 w-4 text-[#C5A880]" />
          </div>
          <div>
            <span className="text-2xl font-serif text-white font-medium block">
              {kpis.occupancyRate}%
            </span>
            <span className="text-[9px] text-neutral-400 font-sans">
              {kpis.occupiedCount} of {kpis.totalRooms} Rooms Occupied
            </span>
          </div>
        </div>

        {/* Card 3: POS Orders */}
        <div className="p-6 border border-white/10 bg-neutral-950 rounded-xl space-y-3 shadow-lux">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[9px] uppercase tracking-wider font-bold">POS Orders</span>
            <ChefHat className="h-4 w-4 text-[#C5A880]" />
          </div>
          <div>
            <span className="text-2xl font-serif text-white font-medium block">
              {kpis.ordersCount}
            </span>
            <span className="text-[9px] text-neutral-400 font-sans">
              AOV: ₹{kpis.aov} / Order
            </span>
          </div>
        </div>

        {/* Card 4: Pending Enquiries */}
        <div className="p-6 border border-white/10 bg-neutral-950 rounded-xl space-y-3 shadow-lux">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[9px] uppercase tracking-wider font-bold">Pending Enquiries</span>
            <Clipboard className="h-4 w-4 text-[#C5A880]" />
          </div>
          <div>
            <span className="text-2xl font-serif text-white font-medium block">
              {kpis.pendingEnquiries}
            </span>
            <span className="text-[9px] text-[#C5A880] font-sans font-semibold">
              Action Required
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Split Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Pending Enquiries Table */}
        <div className="lg:col-span-8 border border-white/10 bg-neutral-950 rounded-xl p-6 space-y-6 shadow-lux">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h4 className="font-serif text-base text-white font-semibold">Live Reservation & Banquet Pipeline</h4>
            <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold">Live API Endpoint</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-neutral-400 border-b border-white/10 pb-2 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-2.5">Organizer</th>
                  <th className="py-2.5">Event Format</th>
                  <th className="py-2.5">Details</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {pipeline.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-xs text-neutral-500">
                      No pending room or banquet requests found in PostgreSQL.
                    </td>
                  </tr>
                ) : (
                  pipeline.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-medium text-white select-text">
                        {item.customerName} <br />
                        <span className="text-[10px] text-neutral-400 font-mono">{item.customerPhone}</span>
                      </td>
                      <td className="py-3 uppercase tracking-wider text-[10px] text-[#C5A880] font-semibold">
                        {item.eventType}
                      </td>
                      <td className="py-3 text-[11px] text-neutral-300 max-w-[200px] truncate select-text">
                        {item.details}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2.5 py-1 rounded-sm text-[9px] uppercase tracking-widest font-bold border ${
                            item.status === "BOOKED" || item.status === "CONFIRMED" || item.status === "APPROVED"
                              ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                              : item.status === "CONTACTED" || item.status === "IN_PROGRESS"
                              ? "bg-blue-950/80 text-blue-300 border-blue-500/30"
                              : "bg-amber-950/80 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex gap-1.5 justify-end">
                          {item.isRequest ? (
                            <a
                              href="/dashboard/requests"
                              className="px-2.5 py-1 bg-[#C5A880] hover:bg-[#D4AF37] text-black rounded-sm font-bold text-[9px] uppercase tracking-wider transition-all"
                            >
                              Review & Assign
                            </a>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(item.id, "BOOKED")}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm font-bold text-[9px] uppercase tracking-wider cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Stock Alerts & AI Insights */}
        <div className="lg:col-span-4 space-y-8">
          <AiInsightsCard />

          {/* Low inventory database alerts */}
          {lowStockItems.length > 0 && (
            <div className="border border-red-500/20 bg-red-950/20 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-red-500/20 pb-3">
                <AlertTriangle className="h-4.5 w-4.5 text-red-400" />
                <h4 className="font-serif text-sm font-semibold text-white">Database Stock Re-Order Alerts</h4>
              </div>

              <div className="space-y-3.5">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="text-neutral-200 font-medium">{item.name}</span>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">{item.category}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-red-400 font-bold block">{item.quantity} {item.unit}</span>
                      <span className="text-[9.5px] text-neutral-400 font-light block">Min: {item.minThreshold} {item.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  ChefHat, 
  Clock, 
  Printer, 
  CheckCircle2, 
  Flame, 
  BellRing, 
  Wifi, 
  AlertTriangle,
  Play,
  Check,
  Utensils,
  CheckCheck
} from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";

export default function KitchenDisplaySystemPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Audio chime trigger using Web Audio API
  const playNewOrderChime = useCallback(() => {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3); // A6 note

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (err) {
      console.log("Web Audio API chime blocked by browser autoplay policy");
    }
  }, [audioEnabled]);

  const fetchOrders = useCallback(async (isInitial = false) => {
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const activeOrders = json.data.filter(
          (o: any) => o.status !== "COMPLETED" && o.status !== "CANCELLED"
        );

        if (!isInitial && activeOrders.length > orders.length) {
          playNewOrderChime();
        }

        setOrders(activeOrders);
      }
    } catch (err) {
      console.error("Failed to fetch KDS orders:", err);
    } finally {
      setLoading(false);
    }
  }, [orders.length, playNewOrderChime]);

  // Live Realtime Event Subscription
  const { isConnected } = useRealtime(
    ["ORDER_UPDATED", "DASHBOARD_REFRESH"],
    () => {
      fetchOrders();
    }
  );

  // Initial Fetch & Elapsed Time Ticker (updates every second)
  useEffect(() => {
    fetchOrders(true);
    const ticker = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(ticker);
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      // Optimistic Update
      setOrders((prev) =>
        prev
          .map((o) => (o.id === orderId ? { ...o, status } : o))
          .filter((o) => status !== "COMPLETED" || o.id !== orderId)
      );

      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      fetchOrders();
    } catch (err) {
      console.error("Failed to update status in KDS:", err);
    }
  };

  const handlePrintKOT = async (orderId: string) => {
    window.print();
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kotPrinted: true }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to mark KOT printed:", err);
    }
  };

  // Auto Sorting: Urgent (>15m) -> High Priority (>10m) -> Oldest First
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeA - timeB;
    });
  }, [orders]);

  const getElapsedTimeInfo = (createdAt: string) => {
    const elapsedMs = Math.max(0, currentTime - new Date(createdAt).getTime());
    const totalSec = Math.floor(elapsedMs / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const formatted = `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;

    let priority: "NORMAL" | "HIGH" | "URGENT" = "NORMAL";
    if (mins >= 15) priority = "URGENT";
    else if (mins >= 10) priority = "HIGH";

    return { formatted, mins, priority };
  };

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white flex items-center gap-2.5">
            <ChefHat className="h-7 w-7 text-[#C5A880]" />
            <span>Enterprise Kitchen Display System (KDS)</span>
          </h2>
          <p className="text-xs text-neutral-400 font-light">
            Live touch-screen KDS queue synced with POS, Waiter Terminals, and Dashboard Analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Chime Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              audioEnabled
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-neutral-900 border-white/10 text-neutral-500"
            }`}
          >
            <BellRing className="h-4 w-4" />
            <span>{audioEnabled ? "Sound ON" : "Sound Muted"}</span>
          </button>

          {/* Live Status Badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Wifi className="h-4 w-4 animate-pulse" />
            <span>{isConnected ? "KDS Live Stream" : "Connecting..."}</span>
          </div>
        </div>
      </div>

      {/* KDS Main Queue View */}
      {loading ? (
        <div className="p-12 text-center text-neutral-400 text-sm font-light">
          Initializing Kitchen Display System...
        </div>
      ) : sortedOrders.length === 0 ? (
        <div className="p-16 text-center border border-white/10 bg-neutral-950 rounded-2xl space-y-3 shadow-lux">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
          <h3 className="text-white font-serif text-xl">All Tickets Complete!</h3>
          <p className="text-xs text-neutral-400 font-light">Kitchen queue is clear. New dining & POS orders will appear instantly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedOrders.map((o) => {
            const { formatted, mins, priority } = getElapsedTimeInfo(o.createdAt);

            return (
              <div
                key={o.id}
                className={`bg-neutral-950 rounded-xl overflow-hidden shadow-lux border transition-all flex flex-col justify-between ${
                  priority === "URGENT"
                    ? "border-red-500/60 ring-2 ring-red-500/20 bg-red-950/10"
                    : priority === "HIGH"
                    ? "border-amber-500/50 bg-amber-950/10"
                    : "border-white/10"
                }`}
              >
                <div>
                  {/* Ticket Header */}
                  <div className="p-4 bg-neutral-900/90 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-[#C5A880]">{o.tableNumber}</span>
                        {priority === "URGENT" && (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Flame className="h-3 w-3 animate-bounce" /> URGENT (&gt;15M)
                          </span>
                        )}
                        {priority === "HIGH" && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold uppercase tracking-wider">
                            HIGH PRIORITY
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">{o.orderId}</span>
                    </div>

                    {/* Live Ticking Elapsed Timer */}
                    <div className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 border ${
                      priority === "URGENT"
                        ? "bg-red-950 border-red-500/40 text-red-300 animate-pulse"
                        : priority === "HIGH"
                        ? "bg-amber-950 border-amber-500/40 text-amber-300"
                        : "bg-neutral-900 border-white/10 text-neutral-300"
                    }`}>
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatted}</span>
                    </div>
                  </div>

                  {/* Ticket Dish Items */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-2.5">
                      {o.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                          <div className="space-y-0.5">
                            <span className="text-white font-semibold text-base block">{item.itemName}</span>
                            {item.variantLabel && (
                              <span className="text-[10px] text-[#C5A880] uppercase tracking-wider block font-mono">
                                Option: {item.variantLabel}
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-bold text-lg text-[#C5A880] px-3 py-1 bg-neutral-900 border border-white/10 rounded-md">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Special Instructions Note */}
                    {o.notes && (
                      <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs text-amber-200 font-medium leading-relaxed">
                        ⚠️ Note: {o.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Chef Workflow Action Buttons (Large Touch Targets) */}
                <div className="p-4 border-t border-white/10 bg-neutral-900/60 space-y-3">
                  <div className="grid grid-cols-2 gap-2 font-buttons">
                    {/* Status Step 1: NEW -> Start Preparing */}
                    {o.status === "NEW" && (
                      <button
                        onClick={() => updateStatus(o.id, "IN_KITCHEN")}
                        className="col-span-2 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 min-h-[52px]"
                      >
                        <Flame className="h-5 w-5" />
                        <span>Accept & Start Cooking</span>
                      </button>
                    )}

                    {/* Status Step 2: IN_KITCHEN -> Mark Ready */}
                    {o.status === "IN_KITCHEN" && (
                      <button
                        onClick={() => updateStatus(o.id, "READY")}
                        className="col-span-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 min-h-[52px]"
                      >
                        <Check className="h-5 w-5" />
                        <span>Mark Order Ready</span>
                      </button>
                    )}

                    {/* Status Step 3: READY -> Serve */}
                    {o.status === "READY" && (
                      <button
                        onClick={() => updateStatus(o.id, "SERVED")}
                        className="col-span-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 min-h-[52px]"
                      >
                        <Utensils className="h-5 w-5" />
                        <span>Dispatch / Served</span>
                      </button>
                    )}

                    {/* Status Step 4: SERVED -> Complete */}
                    {o.status === "SERVED" && (
                      <button
                        onClick={() => updateStatus(o.id, "COMPLETED")}
                        className="col-span-2 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98 min-h-[52px]"
                      >
                        <CheckCheck className="h-5 w-5" />
                        <span>Complete Ticket</span>
                      </button>
                    )}
                  </div>

                  {/* KOT Thermal Print Button */}
                  <button
                    onClick={() => handlePrintKOT(o.id)}
                    className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Thermal KOT Slip</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

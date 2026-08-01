"use client";

import * as React from "react";
import { UtensilsCrossed, Printer, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function ErpOrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<string>("ALL");
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch orders from API:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );

      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const filteredOrders = orders.filter((o) =>
    filterStatus === "ALL" ? true : o.status === filterStatus
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">Live Restaurant POS Orders</h2>
          <p className="text-xs text-neutral-400 font-light">
            Database-backed POS pipeline: live customer orders from QR tables automatically populate here in real-time.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
          {(["ALL", "NEW", "IN_KITCHEN", "READY", "SERVED", "COMPLETED", "CANCELLED"] as const).map((st) => (
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

      {/* Orders Table */}
      <div className="border border-white/10 bg-neutral-950 rounded-xl overflow-hidden shadow-lux">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900/80 text-neutral-400 border-b border-white/10 text-[10px] uppercase tracking-widest font-bold">
                <th className="p-4">Order ID & Table</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Itemized Dishes</th>
                <th className="p-4">Bill & Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Manager Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 font-light">
                    {loading ? "Loading live database orders..." : "No orders found in this category."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 space-y-1">
                      <span className="font-mono text-xs text-[#C5A880] font-bold block">{order.orderId}</span>
                      <span className="inline-block px-2 py-0.5 bg-neutral-900 border border-white/10 rounded-sm font-mono text-white text-[11px] font-bold">
                        Table: {order.tableNumber}
                      </span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <span className="font-medium text-white block">{order.customerName}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{order.customerPhone || "Guest"}</span>
                    </td>
                    <td className="p-4 space-y-1">
                      {order.items?.map((i: any, idx: number) => (
                        <div key={idx} className="text-[11px]">
                          <span className="font-bold text-white">{i.quantity}×</span> {i.itemName || i.name}
                        </div>
                      ))}
                      <span className="text-[9.5px] text-neutral-400 block font-light pt-0.5 font-mono">
                        {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="p-4 space-y-1">
                      <span className="font-mono text-sm text-[#C5A880] font-bold block">₹{order.grandTotal}</span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold block">
                        Method: {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-sm text-[9.5px] uppercase tracking-widest font-bold border inline-block ${
                          order.status === "NEW"
                            ? "bg-amber-950/80 border-amber-500/30 text-amber-300 animate-pulse"
                            : order.status === "IN_KITCHEN" || order.status === "PREPARING"
                            ? "bg-blue-950/80 border-blue-500/30 text-blue-300"
                            : order.status === "READY"
                            ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
                            : order.status === "SERVED" || order.status === "COMPLETED"
                            ? "bg-neutral-900 border-white/10 text-neutral-400"
                            : "bg-red-950/80 border-red-500/30 text-red-300"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-1.5 justify-end flex-wrap">
                        {order.status === "NEW" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "IN_KITCHEN")}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Accept & Prep
                          </button>
                        )}

                        {(order.status === "IN_KITCHEN" || order.status === "NEW") && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "READY")}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Mark Ready
                          </button>
                        )}

                        {order.status === "READY" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "SERVED")}
                            className="px-2.5 py-1.5 bg-neutral-800 hover:bg-[#C5A880] text-white hover:text-black rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer border border-white/10"
                          >
                            Mark Served
                          </button>
                        )}

                        <a
                          href="/dashboard/kot"
                          className="px-2 py-1.5 bg-neutral-900 hover:bg-[#C5A880] text-neutral-300 hover:text-black border border-white/10 rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer inline-flex items-center gap-1"
                          title="Print Kitchen KOT"
                        >
                          <Printer className="h-3 w-3" />
                          <span>KOT</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

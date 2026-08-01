"use client";

import * as React from "react";
import { Receipt, Printer, FileText, Download, Ban } from "lucide-react";
import { ThermalReceiptModal } from "@/components/billing/ThermalReceiptModal";
import { useRealtime } from "@/hooks/useRealtime";

export default function ErpBillingPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

  const fetchBillingOrders = React.useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch billing orders from API:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useRealtime(["PAYMENT_RECORDED", "DASHBOARD_REFRESH"], () => {
    fetchBillingOrders();
  });

  React.useEffect(() => {
    fetchBillingOrders();
  }, [fetchBillingOrders]);

  const handleVoidInvoice = async (id: string) => {
    if (!confirm("Are you sure you want to VOID this invoice? This action is logged for audit compliance.")) {
      return;
    }
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED", paymentStatus: "FAILED" }),
      });
      fetchBillingOrders();
    } catch (err) {
      console.error("Failed to void invoice:", err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Thermal Receipt Print Modal */}
      {selectedOrderId && (
        <ThermalReceiptModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">Payments & GST Invoices Hub</h2>
          <p className="text-xs text-neutral-400 font-light">
            Tax invoices, GST calculations (5%), payment reconciliation, thermal receipts, and reprint tools.
          </p>
        </div>
      </div>

      <div className="border border-white/10 bg-neutral-950 rounded-xl overflow-hidden shadow-lux">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900/80 text-neutral-400 border-b border-white/10 text-[10px] uppercase tracking-widest font-bold">
                <th className="p-4">Invoice # & Order Ref</th>
                <th className="p-4">Customer & Table</th>
                <th className="p-4">Subtotal</th>
                <th className="p-4">GST Tax (5%)</th>
                <th className="p-4">Grand Total</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-neutral-400 font-light">
                    {loading ? "Loading database invoices..." : "No billing records found."}
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 space-y-0.5">
                      <span className="font-mono font-bold text-white block">
                        INV-{new Date(o.createdAt).toISOString().slice(0, 10).replace(/-/g, "")}-{o.orderId.split("-").pop()}
                      </span>
                      <span className="text-[10px] text-[#C5A880] font-mono">{o.orderId}</span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <span className="font-medium text-white block">{o.customerName || "Dine-In Guest"}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{o.tableNumber}</span>
                    </td>
                    <td className="p-4 font-mono">₹{o.subtotal.toFixed(2)}</td>
                    <td className="p-4 font-mono text-amber-300">₹{o.tax.toFixed(2)}</td>
                    <td className="p-4 font-mono font-bold text-white">₹{o.grandTotal.toFixed(2)}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-sm bg-neutral-900 border border-white/10 text-[9px] uppercase font-mono font-bold text-neutral-300">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrderId(o.id)}
                        className="px-2.5 py-1 bg-[#C5A880] hover:bg-[#A37C40] text-black font-bold text-[9px] uppercase rounded-sm inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="Thermal 80mm / A4 Print Receipt"
                      >
                        <Printer className="h-3 w-3" />
                        <span>Print Receipt</span>
                      </button>

                      {o.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleVoidInvoice(o.id)}
                          className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 border border-red-500/30 text-red-300 font-bold text-[9px] uppercase rounded-sm inline-flex items-center gap-1 cursor-pointer transition-colors"
                          title="Void Invoice"
                        >
                          <Ban className="h-3 w-3" />
                          <span>Void</span>
                        </button>
                      )}
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

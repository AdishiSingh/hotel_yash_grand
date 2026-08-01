"use client";

import * as React from "react";
import { Boxes, AlertTriangle, Plus, CheckCircle2 } from "lucide-react";

export default function ErpInventoryPage() {
  const [inventory, setInventory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInventory(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch inventory from API:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInventory();
  }, []);

  const lowStockCount = inventory.filter((i) => i.quantity <= i.minThreshold).length;

  const handleRestock = async (inv: any) => {
    const addQty = prompt(`Add restock quantity for ${inv.name} (${inv.unit}):`, "10");
    if (addQty && !isNaN(Number(addQty))) {
      const newQty = inv.quantity + Number(addQty);
      try {
        setInventory((prev) =>
          prev.map((i) => (i.id === inv.id ? { ...i, quantity: newQty } : i))
        );
        await fetch(`/api/inventory/${inv.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQty }),
        });
        fetchInventory();
      } catch (err) {
        console.error("Failed to restock inventory item:", err);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">Raw Kitchen Inventory & Stock Level Tracking</h2>
          <p className="text-xs text-neutral-400 font-light">
            Ingredient stock tracking, automated re-order thresholds, and supplier logs.
          </p>
        </div>

        {lowStockCount > 0 && (
          <div className="px-3 py-1.5 bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-semibold rounded-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span>{lowStockCount} Items Below Min Re-order Level!</span>
          </div>
        )}
      </div>

      <div className="border border-white/10 bg-neutral-950 rounded-xl overflow-hidden shadow-lux">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-900/80 text-neutral-400 border-b border-white/10 text-[10px] uppercase tracking-widest font-bold">
              <th className="p-4">Item & Category</th>
              <th className="p-4">Current Stock Level</th>
              <th className="p-4">Min Re-order Threshold</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Last Restocked</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-300">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-400 font-light">
                  {loading ? "Loading database inventory items..." : "No inventory items registered."}
                </td>
              </tr>
            ) : (
              inventory.map((inv) => {
                const isLow = inv.quantity <= inv.minThreshold;
                return (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 space-y-0.5">
                      <span className="font-medium text-white block">{inv.name}</span>
                      <span className="text-[10px] text-[#C5A880] font-mono">{inv.category}</span>
                    </td>
                    <td className="p-4 font-mono font-bold">
                      <span className={isLow ? "text-red-400 font-bold" : "text-white"}>
                        {inv.quantity} {inv.unit}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-neutral-400">
                      {inv.minThreshold} {inv.unit}
                    </td>
                    <td className="p-4 text-neutral-300">{inv.supplier || "Local Vendor"}</td>
                    <td className="p-4 font-mono text-neutral-400">
                      {inv.lastRestocked ? new Date(inv.lastRestocked).toLocaleDateString() : "Recent"}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleRestock(inv)}
                        className="px-3 py-1.5 bg-[#C5A880] hover:bg-[#A37C40] text-black font-bold text-[10px] uppercase tracking-wider rounded-sm inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Restock</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

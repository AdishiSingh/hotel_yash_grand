"use client";

import * as React from "react";
import { MENU_ITEMS, MenuItem } from "@/data/menu";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Award, TrendingUp, Sparkles, Image as ImageIcon } from "lucide-react";

export default function ErpMenuPage() {
  const [items, setItems] = React.useState<MenuItem[]>(MENU_ITEMS);
  const [editingItem, setEditingItem] = React.useState<MenuItem | null>(null);
  const [filterCat, setFilterCat] = React.useState<string>("ALL");

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i))
    );
  };

  const toggleChefSpecial = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i))
    );
  };

  const categories = Array.from(new Set(items.map((i) => i.category)));

  const filteredItems = items.filter((i) =>
    filterCat === "ALL" ? true : i.category === filterCat
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">Digital Menu & Pricing Catalog Editor</h2>
          <p className="text-xs text-neutral-400 font-light">
            Real-time dish availability, price management, chef specials, and inventory flags.
          </p>
        </div>

        <button
          onClick={() => {
            alert("New Dish Creator Dialog: Enter name, category, price, and upload photo.");
          }}
          className="px-4 py-2.5 bg-[#C5A880] hover:bg-[#A37C40] text-black font-bold text-xs uppercase tracking-widest rounded-sm flex items-center gap-2 cursor-pointer shadow-md min-h-[40px]"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2">
        <button
          onClick={() => setFilterCat("ALL")}
          className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer ${
            filterCat === "ALL"
              ? "bg-[#C5A880] text-black shadow-md"
              : "bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white"
          }`}
        >
          All Categories ({items.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterCat === cat
                ? "bg-[#C5A880] text-black shadow-md"
                : "bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items Table */}
      <div className="border border-white/10 bg-neutral-950 rounded-xl overflow-hidden shadow-lux">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900/80 text-neutral-400 border-b border-white/10 text-[10px] uppercase tracking-widest font-bold">
                <th className="p-4">Dish & Category</th>
                <th className="p-4">Type</th>
                <th className="p-4">Tariff Price</th>
                <th className="p-4">Flags & Highlights</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-300">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 space-y-1">
                    <span className="font-serif text-sm text-white font-medium block">{item.name}</span>
                    <span className="text-[10px] text-[#C5A880] font-sans font-semibold uppercase">{item.category}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[9px] uppercase tracking-wider font-bold ${
                        item.type === "veg"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-950/80 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-sm font-bold text-white">
                    ₹{item.price}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => toggleChefSpecial(item.id)}
                        className={`px-2 py-0.5 rounded-sm text-[9px] uppercase font-bold border transition-colors cursor-pointer ${
                          item.featured
                            ? "bg-[#C5A880] text-black border-[#C5A880]"
                            : "bg-neutral-900 text-neutral-400 border-white/10 hover:text-white"
                        }`}
                      >
                        ★ Chef Special
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-2.5 py-1 rounded-sm text-[9.5px] uppercase tracking-widest font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        item.available
                          ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
                          : "bg-red-950/80 border-red-500/30 text-red-300"
                      }`}
                    >
                      {item.available ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          <span>Out of Stock</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          const newPrice = prompt(`Enter new tariff price for ${item.name}:`, String(item.price));
                          if (newPrice && !isNaN(Number(newPrice))) {
                            setItems((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, price: Number(newPrice) } : i))
                            );
                          }
                        }}
                        className="px-2.5 py-1 bg-neutral-900 hover:bg-[#C5A880] text-neutral-300 hover:text-black border border-white/10 rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Edit Price
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { MENU_ITEMS, MenuItem } from "@/data/menu";
import { Search, Edit2, Check, X, RefreshCw, Sparkles, Flame, ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PosControlPage() {
  const [items, setItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editName, setEditName] = useState<string>("");

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return ["all", ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "all" || item.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [items, search, selectedCat]);

  const handleToggleAvailable = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, available: !i.available } : i))
    );
  };

  const handleToggleRecommended = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i))
    );
  };

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditPrice(item.price);
    setEditName(item.name);
  };

  const saveEdit = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, price: editPrice, name: editName } : i))
    );
    setEditingId(null);
  };

  return (
    <div className="space-y-8 text-neutral-100 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6 text-left">
        <div>
          <h3 className="font-serif text-2xl text-white">POS Menu Management</h3>
          <p className="text-xs text-neutral-500 font-sans">
            Adjust active catalog prices, toggle kitchen availability, and update recommendation badges.
          </p>
        </div>
      </div>

      {/* Toolbar controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-neutral-900/40 p-4 border border-neutral-800 rounded-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu catalog..."
            className="w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-gold px-10 py-2 rounded-lg text-xs text-white placeholder-neutral-600 outline-none transition-all"
          />
        </div>

        {/* Category list dropdown */}
        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="text-neutral-400 font-medium">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 px-3 py-2 rounded-lg text-white outline-none focus:border-gold"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List items grid */}
      <div className="border border-neutral-800 bg-[#14161C]/20 rounded-xl p-6 overflow-hidden text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800 pb-2">
                <th className="py-2.5 font-medium">Dish Name</th>
                <th className="py-2.5 font-medium">Category</th>
                <th className="py-2.5 font-medium">Price</th>
                <th className="py-2.5 font-medium text-center">Featured</th>
                <th className="py-2.5 font-medium text-center">Available</th>
                <th className="py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 text-neutral-300">
              {filteredItems.slice(0, 15).map((item) => (
                <tr key={item.id} className="hover:bg-neutral-900/10 transition-colors">
                  {/* Name field */}
                  <td className="py-3 font-medium text-white max-w-[200px] truncate select-text">
                    {editingId === item.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-neutral-950 border border-neutral-800 px-2 py-1 rounded text-white text-xs outline-none"
                      />
                    ) : (
                      item.name
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 text-[10px] text-neutral-400 font-mono">
                    {item.category}
                  </td>

                  {/* Price */}
                  <td className="py-3 text-white font-mono font-semibold">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1">
                        <span>₹</span>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-16 bg-neutral-950 border border-neutral-800 px-2 py-1 rounded text-white text-xs outline-none"
                        />
                      </div>
                    ) : (
                      `₹${item.price}`
                    )}
                  </td>

                  {/* Featured */}
                  <td className="py-3 text-center">
                    <button
                      onClick={() => handleToggleRecommended(item.id)}
                      className="cursor-pointer hover:scale-110 transition-transform block mx-auto text-neutral-500"
                    >
                      <Sparkles className={cn("h-4 w-4", item.featured ? "text-gold fill-gold" : "text-neutral-600")} />
                    </button>
                  </td>

                  {/* Available */}
                  <td className="py-3 text-center">
                    <button
                      onClick={() => handleToggleAvailable(item.id)}
                      className="cursor-pointer hover:scale-105 transition-transform block mx-auto"
                    >
                      {item.available ? (
                        <ToggleRight className="h-6 w-6 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-neutral-600" />
                      )}
                    </button>
                  </td>

                  {/* Action */}
                  <td className="py-3 text-right">
                    {editingId === item.id ? (
                      <div className="flex gap-2 justify-end font-buttons">
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="h-7 w-7 bg-emerald-500 text-black rounded flex items-center justify-center cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="h-7 w-7 bg-neutral-800 text-neutral-400 rounded flex items-center justify-center cursor-pointer hover:text-white"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded cursor-pointer transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
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

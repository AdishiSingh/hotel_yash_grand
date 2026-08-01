"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BedDouble, UtensilsCrossed, PartyPopper, User, TrendingUp, Zap, Clock } from "lucide-react";
import Link from "next/link";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery("");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { label: "View Room Inventory Grid", href: "/management/availability", icon: BedDouble, category: "Rooms" },
    { label: "Open POS Dining Terminal", href: "/management/restaurant", icon: UtensilsCrossed, category: "POS" },
    { label: "Open KDS Kitchen Display", href: "/dashboard/kot", icon: Clock, category: "Kitchen" },
    { label: "Manage Banquet Events", href: "/management/banquets", icon: PartyPopper, category: "Events" },
    { label: "View Customer Profiles & CRM", href: "/management/customers", icon: User, category: "CRM" },
    { label: "View Financial BI Reports", href: "/management/reports", icon: TrendingUp, category: "Finance" },
  ];

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          className="w-full max-w-xl bg-[#171E27] rounded-3xl border border-[#D4AF37]/40 shadow-2xl overflow-hidden font-sans text-white"
        >
          {/* SEARCH INPUT HEADER */}
          <div className="p-4 border-b border-[#D4AF37]/20 flex items-center gap-3">
            <Search className="h-5 w-5 text-[#D4AF37]" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command or search (Cmd + K)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
            />
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* QUICK DIRECTIVES LIST */}
          <div className="p-2 space-y-1 max-h-80 overflow-y-auto font-mono text-xs">
            {filteredActions.length === 0 ? (
              <div className="p-6 text-center text-slate-400">No matching command directives found.</div>
            ) : (
              filteredActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={idx}
                    href={action.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#121820] hover:text-[#D4AF37] border border-transparent hover:border-[#D4AF37]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-[#0B0F14] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{action.label}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9.5px] uppercase bg-[#0B0F14] text-slate-400 border border-slate-800">
                      {action.category}
                    </span>
                  </Link>
                );
              })
            )}
          </div>

          <div className="p-3 bg-[#0B0F14] border-t border-[#D4AF37]/15 text-[10px] font-mono text-slate-400 flex justify-between">
            <span>HOTEL YASH GRAND Command Palette</span>
            <span>Press <kbd className="bg-neutral-800 text-slate-200 px-1 py-0.5 rounded">Esc</kbd> to exit</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

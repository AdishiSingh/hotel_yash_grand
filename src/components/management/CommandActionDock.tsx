"use client";

import React from "react";
import Link from "next/link";
import { Zap, BedDouble, UtensilsCrossed, Clock, PartyPopper, User, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommandActionDock() {
  const actions = [
    { label: "Room Matrix", href: "/management/availability", icon: BedDouble, color: "text-[#D4AF37]" },
    { label: "POS Terminal", href: "/management/restaurant", icon: UtensilsCrossed, color: "text-amber-400" },
    { label: "Kitchen KDS", href: "/dashboard/kot", icon: Clock, color: "text-emerald-400" },
    { label: "Banquet Galas", href: "/management/banquets", icon: PartyPopper, color: "text-purple-400" },
    { label: "Guest CRM", href: "/management/customers", icon: User, color: "text-blue-400" },
    { label: "Financial BI", href: "/management/reports", icon: TrendingUp, color: "text-[#D4AF37]" },
  ];

  return (
    <section className="p-6 bg-[#171E27] rounded-3xl border border-[#D4AF37]/30 shadow-xl space-y-4 text-left font-sans">
      <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-3">
        <h2 className="text-xs font-serif font-bold tracking-widest text-[#D4AF37] uppercase flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#D4AF37]" /> Operational Command Dock
        </h2>
        <span className="text-[10px] font-mono text-slate-400">1-CLICK INSTANT DISPATCH</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Link key={idx} href={act.href}>
              <Button
                variant="secondary"
                className="w-full justify-start text-xs font-normal bg-[#121820] hover:bg-[#1C2532] border-[#D4AF37]/20 hover:border-[#D4AF37]"
                startIcon={<Icon className={`h-4 w-4 ${act.color}`} />}
              >
                {act.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

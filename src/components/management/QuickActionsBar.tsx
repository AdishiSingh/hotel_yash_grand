"use client";

import React from "react";
import Link from "next/link";
import { Zap, BedDouble, UtensilsCrossed, Clock, PartyPopper, User, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActionsBar() {
  return (
    <section className="p-6 bg-[#12141A] rounded-2xl border border-[#C8A96A]/20 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-serif font-bold tracking-widest text-[#C8A96A] uppercase flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#C8A96A]" /> 1-Click Operational Directives
        </h2>
        <span className="text-[10px] font-mono text-slate-400">ZERO REDUNDANT CLICKS</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link href="/management/availability">
          <Button variant="secondary" className="w-full justify-start text-xs font-normal" startIcon={<BedDouble className="h-4 w-4 text-[#C8A96A]" />}>
            Room Grid
          </Button>
        </Link>
        <Link href="/management/restaurant">
          <Button variant="secondary" className="w-full justify-start text-xs font-normal" startIcon={<UtensilsCrossed className="h-4 w-4 text-amber-400" />}>
            POS Terminal
          </Button>
        </Link>
        <Link href="/dashboard/kot">
          <Button variant="secondary" className="w-full justify-start text-xs font-normal" startIcon={<Clock className="h-4 w-4 text-emerald-400" />}>
            KDS Kitchen
          </Button>
        </Link>
        <Link href="/management/banquets">
          <Button variant="secondary" className="w-full justify-start text-xs font-normal" startIcon={<PartyPopper className="h-4 w-4 text-purple-400" />}>
            Banquet Galas
          </Button>
        </Link>
        <Link href="/management/customers">
          <Button variant="secondary" className="w-full justify-start text-xs font-normal" startIcon={<User className="h-4 w-4 text-blue-400" />}>
            Guest History
          </Button>
        </Link>
        <Link href="/management/reports">
          <Button variant="secondary" className="w-full justify-start text-xs font-normal" startIcon={<TrendingUp className="h-4 w-4 text-[#C8A96A]" />}>
            BI Financials
          </Button>
        </Link>
      </div>
    </section>
  );
}

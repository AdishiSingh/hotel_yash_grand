"use client";

import React from "react";
import { 
  DollarSign, 
  BedDouble, 
  UtensilsCrossed, 
  PartyPopper, 
  ArrowUpRight, 
  LogIn, 
  LogOut, 
  Clock, 
  CreditCard, 
  CheckCircle2 
} from "lucide-react";
import { DashboardMetrics } from "./types";

interface KpiMetricCardsProps {
  metrics: DashboardMetrics;
}

export function KpiMetricCards({ metrics }: KpiMetricCardsProps) {
  const {
    todayRevenue = 0,
    roomRevenue = 0,
    restaurantRevenue = 0,
    banquetRevenue = 0,
    occupancyRatePercent = 0,
    occupiedRoomsCount = 0,
    availableRoomsCount = 0,
    totalRoomsCount = 24,
    todayCheckInsCount = 0,
    todayCheckOutsCount = 0,
    pendingRequestsCount = 0,
    restaurantOrdersCount = 0,
  } = metrics || {};

  const cards = [
    {
      label: "Today's Total Revenue",
      value: `₹${todayRevenue.toLocaleString()}`,
      trend: "+14.2% vs avg",
      color: "text-[#D4AF37]",
      bgGlow: "from-[#D4AF37]/20 to-black",
      borderColor: "border-[#D4AF37]/30 hover:border-[#D4AF37]",
      icon: DollarSign,
      progress: "85%",
    },
    {
      label: "Dining POS Sales",
      value: `₹${restaurantRevenue.toLocaleString()}`,
      trend: "+8.6% today",
      color: "text-amber-400",
      bgGlow: "from-amber-500/20 to-black",
      borderColor: "border-amber-500/30 hover:border-amber-400",
      icon: UtensilsCrossed,
      progress: "65%",
    },
    {
      label: "Banquet Events Revenue",
      value: `₹${banquetRevenue.toLocaleString()}`,
      trend: "Events active",
      color: "text-purple-400",
      bgGlow: "from-purple-500/20 to-black",
      borderColor: "border-purple-500/30 hover:border-purple-400",
      icon: PartyPopper,
      progress: "78%",
    },
    {
      label: "Live Occupancy Rate",
      value: `${occupancyRatePercent}%`,
      trend: `${occupiedRoomsCount}/${totalRoomsCount} Suites`,
      color: "text-emerald-400",
      bgGlow: "from-emerald-500/20 to-black",
      borderColor: "border-emerald-500/30 hover:border-emerald-400",
      icon: BedDouble,
      progress: `${occupancyRatePercent}%`,
    },
    {
      label: "Available Suites",
      value: `${availableRoomsCount}`,
      trend: "Ready for check-in",
      color: "text-emerald-400",
      bgGlow: "from-emerald-500/20 to-black",
      borderColor: "border-emerald-500/30 hover:border-emerald-400",
      icon: CheckCircle2,
      progress: "100%",
    },
    {
      label: "Today's Check-ins",
      value: `${todayCheckInsCount}`,
      trend: "Scheduled arrivals",
      color: "text-blue-400",
      bgGlow: "from-blue-500/20 to-black",
      borderColor: "border-blue-500/30 hover:border-blue-400",
      icon: LogIn,
      progress: "60%",
    },
    {
      label: "Today's Check-outs",
      value: `${todayCheckOutsCount}`,
      trend: "Folio settlements",
      color: "text-slate-300",
      bgGlow: "from-slate-500/20 to-black",
      borderColor: "border-slate-500/30 hover:border-slate-300",
      icon: LogOut,
      progress: "40%",
    },
    {
      label: "Pending Booking Requests",
      value: `${pendingRequestsCount}`,
      trend: "Approval required",
      color: "text-amber-400",
      bgGlow: "from-amber-500/20 to-black",
      borderColor: "border-amber-500/30 hover:border-amber-400",
      icon: Clock,
      progress: "50%",
    },
    {
      label: "Pending Folio Payments",
      value: `₹${(pendingRequestsCount * 2500).toLocaleString()}`,
      trend: "Pre-payment pending",
      color: "text-[#D4AF37]",
      bgGlow: "from-[#D4AF37]/20 to-black",
      borderColor: "border-[#D4AF37]/30 hover:border-[#D4AF37]",
      icon: CreditCard,
      progress: "30%",
    },
    {
      label: "Active POS Orders",
      value: `${restaurantOrdersCount}`,
      trend: "Kitchen orders active",
      color: "text-amber-400",
      bgGlow: "from-amber-500/20 to-black",
      borderColor: "border-amber-500/30 hover:border-amber-400",
      icon: UtensilsCrossed,
      progress: "75%",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-serif font-bold text-[#D4AF37] uppercase tracking-widest">
          Operational Telemetry KPI Cards
        </h2>
        <span className="text-[10px] font-mono text-slate-400">10 KEY OPERATIONAL METRICS</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;

          return (
            <div
              key={idx}
              className={`p-5 bg-[#171E27] rounded-2xl border ${card.borderColor} transition-all duration-300 shadow-xl group space-y-3 hover:translate-y-[-2px]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider truncate">
                  {card.label}
                </span>
                <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${card.bgGlow} border border-white/10 flex items-center justify-center ${card.color} shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="text-xl font-serif font-bold text-white tracking-wide truncate">
                  {card.value}
                </div>
                <div className={`text-[10px] font-mono ${card.color} font-bold flex items-center gap-0.5`}>
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                  <span className="truncate">{card.trend}</span>
                </div>
              </div>

              <div className="h-1.5 w-full bg-[#0B0F14] rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-500 rounded-full"
                  style={{ width: card.progress }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

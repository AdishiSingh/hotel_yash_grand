"use client";

import React from "react";
import { Activity, Bell, CheckCircle2, Clock, MessageSquare, ShieldAlert } from "lucide-react";
import { NotificationItem } from "./types";

interface OperationsTimelineProps {
  notifications: NotificationItem[];
}

export function OperationsTimeline({ notifications = [] }: OperationsTimelineProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. REALTIME OPERATIONS STREAM */}
      <div className="p-6 bg-[#12141A] rounded-2xl border border-[#C8A96A]/20 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#C8A96A]/15 pb-3">
          <h2 className="text-sm font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#C8A96A]" /> Realtime Operations Stream ({notifications.length})
          </h2>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE TELEMETRY
          </span>
        </div>

        <div className="space-y-2.5 font-mono text-xs max-h-80 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="p-4 bg-[#0B0B0B] rounded-xl text-slate-400 text-center border border-dashed border-[#C8A96A]/15">
              No recent activity logged in stream.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#0B0B0B] rounded-xl border border-[#C8A96A]/15 flex items-start justify-between gap-3 hover:border-[#C8A96A]/30 transition-colors"
              >
                <div>
                  <div className="font-bold text-white text-xs">{item.title}</div>
                  {item.message && <div className="text-[10.5px] text-slate-400 mt-0.5">{item.message}</div>}
                  <div className="text-[9.5px] text-slate-500 mt-1">
                    {new Date(item.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] bg-neutral-800 text-[#C8A96A] font-mono uppercase font-bold border border-[#C8A96A]/20">
                  {item.category || item.type || "EVENT"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. STAFF & EXECUTIVE ALERTS */}
      <div className="p-6 bg-[#12141A] rounded-2xl border border-[#C8A96A]/20 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#C8A96A]/15 pb-3">
          <h2 className="text-sm font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#C8A96A]" /> Staff & Executive Alerts
          </h2>
          <span className="text-[10px] font-mono text-slate-400">SYSTEM PROTECTIONS</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/30 flex items-center justify-between">
            <div>
              <div className="font-bold text-emerald-300">Overbooking Guard Active</div>
              <div className="text-[10.5px] text-slate-400">Zero inventory date collision detected across all 24 suites.</div>
            </div>
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          </div>

          <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="font-bold text-amber-300">Housekeeping Turnaround Alert</div>
              <div className="text-[10.5px] text-slate-400">Evening shift room turnover active for 4 vacant suites.</div>
            </div>
            <Clock className="h-4.5 w-4.5 text-amber-400 shrink-0" />
          </div>

          <div className="p-3 bg-blue-950/20 rounded-xl border border-blue-500/30 flex items-center justify-between">
            <div>
              <div className="font-bold text-blue-300">Omni-Channel Dispatch Active</div>
              <div className="text-[10.5px] text-slate-400">WhatsApp, SMS & Email guest confirmations operating cleanly.</div>
            </div>
            <MessageSquare className="h-4.5 w-4.5 text-blue-400 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

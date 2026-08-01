"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, CheckCheck, Filter, AlertTriangle, CheckCircle2, Info, Flame, X, ExternalLink } from "lucide-react";
import { useRealtime } from "@/hooks/useRealtime";
import Link from "next/link";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [toast, setToast] = useState<any | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setNotifications(json.data);
        setUnreadCount(json.unreadCount || json.data.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, []);

  // Realtime Push Listener
  useRealtime(["NOTIFICATION_NEW", "DASHBOARD_REFRESH"], (payload) => {
    fetchNotifications();

    if (payload.type === "NOTIFICATION_NEW" && payload.data) {
      const newNotif = payload.data;
      setToast(newNotif);
      setTimeout(() => setToast(null), 5000);
    }
  });

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "ALL") return true;
    return n.type === filterType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ALERT":
        return <Flame className="h-4 w-4 text-red-400 shrink-0" />;
      case "WARNING":
        return <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />;
      case "SUCCESS":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-blue-400 shrink-0" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ALERT":
        return "bg-red-500/20 border-red-500/30 text-red-300";
      case "WARNING":
        return "bg-amber-500/20 border-amber-500/30 text-amber-300";
      case "SUCCESS":
        return "bg-emerald-500/20 border-emerald-500/30 text-emerald-300";
      default:
        return "bg-blue-500/20 border-blue-500/30 text-blue-300";
    }
  };

  return (
    <div className="relative font-sans">
      {/* Floating Toast Notification Banner */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-neutral-900 border border-gold/40 p-4 rounded-xl shadow-2xl flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            {getTypeIcon(toast.type)}
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white leading-snug">{toast.title}</h4>
              <p className="text-[11px] text-neutral-300 leading-normal">{toast.message}</p>
            </div>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-neutral-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
        title="Notifications Center"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-amber-500 text-black text-[9.5px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-neutral-950 border border-white/10 rounded-xl shadow-lux z-50 overflow-hidden text-left">
          {/* Header */}
          <div className="p-4 bg-neutral-900/80 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-semibold text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold font-mono">
                  {unreadCount} Unread
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] text-[#C5A880] hover:text-white font-bold flex items-center gap-1 cursor-pointer uppercase tracking-wider"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>

          {/* Priority Filters */}
          <div className="p-2 border-b border-white/10 bg-neutral-900/40 flex items-center gap-1.5 overflow-x-auto text-[10px] uppercase font-bold tracking-wider">
            {["ALL", "INFO", "SUCCESS", "WARNING", "ALERT"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  filterType === type
                    ? "bg-[#C5A880] text-black font-bold"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-xs font-light">
                No notifications in this filter view.
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    !n.isRead ? "bg-white/[0.04] hover:bg-white/[0.07]" : "hover:bg-white/[0.02] opacity-75"
                  }`}
                >
                  <div className="pt-0.5">{getTypeIcon(n.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white leading-tight">{n.title}</span>
                      <span className={`px-1.5 py-0.2 rounded border text-[8px] uppercase tracking-wider font-bold ${getTypeBadge(n.type)}`}>
                        {n.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 font-light leading-relaxed">{n.message}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[9px] text-neutral-500 font-mono">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => setIsOpen(false)}
                          className="text-[9px] text-[#C5A880] hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider"
                        >
                          <span>View</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

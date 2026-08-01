"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  CreditCard, 
  BedDouble, 
  PartyPopper, 
  UserCheck, 
  Check, 
  X,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CustomerNotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/customer/notifications");
      const json = await res.json();
      if (json.success) {
        setNotifications(json.notifications || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch customer notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Auto-poll for new notifications every 15 seconds
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/customer/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemClick = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await fetch("/api/customer/notifications", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId: notif.id }),
        });
        setNotifications(notifications.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }
    setIsOpen(false);
  };

  const getNotifIcon = (type: string, title: string) => {
    const t = (type || "").toUpperCase();
    const ttl = (title || "").toLowerCase();

    if (ttl.includes("confirmed") || ttl.includes("approved")) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    if (ttl.includes("rejected") || ttl.includes("cancelled")) {
      return <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />;
    }
    if (ttl.includes("payment") || ttl.includes("paid")) {
      return <CreditCard className="w-4 h-4 text-blue-400 shrink-0" />;
    }
    if (ttl.includes("check-in") || ttl.includes("stay")) {
      return <BedDouble className="w-4 h-4 text-[#C5A880] shrink-0" />;
    }
    if (ttl.includes("banquet") || ttl.includes("event")) {
      return <PartyPopper className="w-4 h-4 text-purple-400 shrink-0" />;
    }
    return <Info className="w-4 h-4 text-[#C5A880] shrink-0" />;
  };

  return (
    <div className="relative select-none" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white hover:border-[#C5A880]/50 transition-all cursor-pointer"
        title="Notification Center"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-red-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse border border-black">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0F1115] border border-[#C5A880]/30 rounded-2xl shadow-2xl z-50 overflow-hidden text-left"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-neutral-950/80">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#C5A880]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30">
                    {unreadCount} UNREAD
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-[#C5A880] hover:underline font-semibold flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* List Body */}
            <div className="max-h-80 overflow-y-auto divide-y divide-white/5 scrollbar-none">
              {notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Bell className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400 font-medium">No notifications yet</p>
                  <p className="text-[10px] text-neutral-500">Updates regarding your stay and payments will appear here.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-neutral-900/80 ${
                      !n.isRead ? "bg-[#C5A880]/5" : ""
                    }`}
                  >
                    {getNotifIcon(n.type, n.title)}
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${!n.isRead ? "text-white" : "text-neutral-300"}`}>
                          {n.title}
                        </span>
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-[#C5A880] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-tight line-clamp-2">{n.message}</p>
                      <div className="text-[9px] font-mono text-neutral-500 pt-1">
                        {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 bg-neutral-950 text-center">
              <Link
                href="/customer/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-[11px] text-[#C5A880] hover:underline font-semibold inline-flex items-center gap-1"
              >
                <span>Go to Customer Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

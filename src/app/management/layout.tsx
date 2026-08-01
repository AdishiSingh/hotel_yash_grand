"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  BedDouble, 
  PartyPopper, 
  Users, 
  TrendingUp, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Crown,
  Search,
  Clock,
  Sun,
  Key
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CommandPalette } from "@/components/management/CommandPalette";

interface ManagementUserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  roleDescription?: string;
  permissions: string[];
}

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<ManagementUserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Collapsible sidebar group states
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    operations: true,
    reservations: true,
    restaurant: true,
    finance: true,
  });

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  useEffect(() => {
    if (pathname === "/management/login") {
      setLoading(false);
      return;
    }

    fetch("/api/management/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        } else {
          router.push("/management/login");
        }
      })
      .catch(() => {
        router.push("/management/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, router]);

  if (pathname === "/management/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/management/auth/logout", { method: "POST" });
      router.push("/management/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navGroups = [
    {
      key: "operations",
      title: "Operations",
      items: [
        { label: "Dashboard", href: "/management", icon: LayoutDashboard },
        { label: "Room Availability", href: "/management/availability", icon: BedDouble },
      ],
    },
    {
      key: "restaurant",
      title: "Dining & POS",
      items: [
        { label: "Restaurant POS", href: "/management/restaurant", icon: UtensilsCrossed },
      ],
    },
    {
      key: "reservations",
      title: "Reservations",
      items: [
        { label: "Rooms & Stay", href: "/management/rooms", icon: BedDouble },
        { label: "Banquets & Galas", href: "/management/banquets", icon: PartyPopper },
        { label: "Customer CRM", href: "/management/customers", icon: Users },
      ],
    },
    {
      key: "finance",
      title: "Finance & ERP",
      items: [
        { label: "BI Financial Reports", href: "/management/reports", icon: TrendingUp },
        { label: "ERP Settings", href: "/management/settings", icon: Settings },
      ],
    },
  ];

  const getBreadcrumbTitle = () => {
    if (pathname === "/management") return "Overview";
    const segment = pathname.split("/").pop() || "";
    if (segment === "restaurant") return "Restaurant POS";
    if (segment === "rooms") return "Rooms & Stay";
    if (segment === "banquets") return "Banquets & Galas";
    if (segment === "customers") return "Customer CRM";
    if (segment === "reports") return "Financial BI Reports";
    if (segment === "settings") return "ERP Settings";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col font-sans select-none overflow-x-hidden relative">
      {/* AMBIENT LUXURY BACKGROUND GLOWS */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#D4AF37]/5 blur-[180px] rounded-full pointer-events-none z-0" />

      <div className="flex flex-1 min-h-screen relative z-10">
        
        {/* LUXURY ROYAL SIDEBAR */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#121820]/95 border-r border-[#D4AF37]/20 backdrop-blur-2xl flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
          <div className="overflow-y-auto">
            {/* BRANDING HEADER */}
            <div className="p-6 border-b border-[#D4AF37]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-[#D4AF37]/30 to-black border border-[#D4AF37]/50 rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-sm font-bold tracking-widest text-white uppercase">YASH GRAND</h2>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] block font-medium">LUXURY MANAGEMENT</span>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* GROUPED COLLAPSIBLE NAVIGATION LINKS */}
            <nav className="p-4 space-y-4 text-xs font-mono">
              {navGroups.map((group) => {
                const isOpen = openGroups[group.key] ?? true;

                return (
                  <div key={group.key} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(group.key)}
                      className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors"
                    >
                      <span>{group.title}</span>
                      {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>

                    {isOpen && (
                      <div className="space-y-1 pl-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;

                          return (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                isActive
                                  ? "bg-gradient-to-r from-[#D4AF37] via-[#B8902F] to-[#D4AF37] text-black font-serif font-bold shadow-[0_4px_20px_rgba(212,175,55,0.3)] scale-[1.01]"
                                  : "text-slate-300 hover:text-white hover:bg-[#171E27] border border-transparent hover:border-[#D4AF37]/20"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className={`h-4 w-4 ${isActive ? "text-black" : "text-[#D4AF37]"}`} />
                                <span className="tracking-wide">{item.label}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* USER PROFILE & LOGOUT FOOTER */}
          <div className="p-4 border-t border-[#D4AF37]/20 bg-[#0B0F14]/80 space-y-3">
            {user && (
              <div className="p-3 bg-[#171E27] rounded-2xl border border-[#D4AF37]/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] uppercase tracking-widest text-[#D4AF37] font-serif font-bold">
                    {user.role}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-xs text-white font-serif font-bold truncate">{user.name}</div>
                <div className="text-[10px] text-slate-400 font-mono truncate">{user.email}</div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* MAIN BODY */}
        <div className="flex-1 md:ml-64 flex flex-col min-w-0">
          
          {/* TOP NAVIGATION BAR */}
          <header className="sticky top-0 z-40 bg-[#0B0F14]/85 backdrop-blur-xl border-b border-[#D4AF37]/20 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-slate-400 hover:text-white p-1"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* BREADCRUMBS */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-slate-400">HOTEL YASH GRAND</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                <span className="text-[#D4AF37] font-serif font-bold tracking-wider">{getBreadcrumbTitle()}</span>
              </div>
            </div>

            {/* TOP RIGHT CONTROLS (SEARCH, SHIFT, WEATHER, PROFILE) */}
            <div className="flex items-center gap-3">
              {/* CMD+K COMMAND PALETTE TRIGGER BUTTON */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#171E27] border border-[#D4AF37]/30 text-xs font-mono text-slate-300 hover:text-white hover:border-[#D4AF37] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Search className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Search Directives...</span>
                <kbd className="bg-[#0B0F14] border border-slate-700 px-1.5 py-0.5 text-[9.5px] rounded text-slate-400">⌘K</kbd>
              </button>

              {/* SHIFT & WEATHER TELEMETRY */}
              <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-300 bg-[#171E27] px-3 py-1.5 rounded-xl border border-[#D4AF37]/20">
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span>Lucknow 28°C • Day Shift</span>
              </div>

              {/* NOTIFICATION BELL */}
              <div className="relative">
                <button className="p-2 rounded-xl bg-[#171E27] border border-[#D4AF37]/20 text-slate-300 hover:text-white transition-colors cursor-pointer">
                  <Bell className="h-4 w-4 text-[#D4AF37]" />
                </button>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
              </div>

              {user && (
                <div className="flex items-center gap-2.5 pl-2 border-l border-[#D4AF37]/20">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-700 text-black font-serif font-bold text-xs flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-serif font-bold text-white tracking-wide">{user.name}</div>
                    <span className="text-[9px] uppercase font-bold text-[#D4AF37] tracking-widest block">
                      {user.role}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* MAIN PAGE CONTAINER */}
          <main className="flex-1 p-6 sm:p-8 space-y-8">
            {children}
          </main>
        </div>

      </div>

      {/* COMMAND PALETTE SEARCH MODAL */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}

import * as React from "react";
import { Metadata } from "next";
import { AdminSidebar } from "@/shared/components/admin/AdminSidebar";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export const metadata: Metadata = {
  title: "Yash Grand ERP | Hotel & Restaurant Admin",
  description: "Enterprise Hotel ERP, Restaurant POS Control, Booking Calendar, Billing & Analytics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0F1115] text-neutral-100 font-sans selection:bg-[#C5A880] selection:text-black">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main ERP Content Area */}
      <main className="flex-1 flex flex-col bg-[#0B0D10] overflow-y-auto min-h-screen">
        <header className="h-16 border-b border-white/10 px-6 sm:px-8 bg-neutral-950 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-neutral-300 font-bold">
              HOTEL YASH GRAND • Operations Engine
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <span>Shift: <strong className="text-white">Morning / Peak</strong></span>
            <span>•</span>
            <span className="text-[#C5A880] font-semibold">PostgreSQL & Prisma Sync</span>
            <span>•</span>
            <NotificationCenter />
          </div>
        </header>

        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

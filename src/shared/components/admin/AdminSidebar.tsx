"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BedDouble, 
  UtensilsCrossed, 
  ChefHat, 
  BookOpenCheck, 
  PartyPopper, 
  Users, 
  Mail, 
  Receipt, 
  TrendingUp, 
  Boxes, 
  Star, 
  QrCode,
  Calendar,
  Settings, 
  ShieldCheck, 
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { RolePermissionMatrix, Role } from "@/lib/permissions";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard BI", href: "/dashboard", icon: LayoutDashboard },
  { label: "Reservation Center", href: "/dashboard/reservation-center", icon: Calendar, badge: "CRM Center" },
  { label: "Live POS Orders", href: "/dashboard/orders", icon: UtensilsCrossed, badge: "3 Live" },
  { label: "KOT Kitchen Screen", href: "/dashboard/kot", icon: ChefHat },
  { label: "Table QR Codes", href: "/admin/tables", icon: QrCode, badge: "QR Sec" },
  { label: "Menu Catalog Editor", href: "/dashboard/menu", icon: BookOpenCheck },
  { label: "Hotel Rooms & Stay", href: "/dashboard/rooms", icon: BedDouble },
  { label: "Banquet & Events", href: "/dashboard/banquet", icon: PartyPopper, badge: "2 New" },
  { label: "Customer CRM", href: "/dashboard/crm", icon: Users },
  { label: "Contact Enquiries", href: "/dashboard/enquiries", icon: Mail },
  { label: "Payments & Invoices", href: "/dashboard/billing", icon: Receipt },
  { label: "Analytics & Reports", href: "/dashboard/analytics", icon: TrendingUp },
  { label: "Raw Inventory", href: "/dashboard/inventory", icon: Boxes },
  { label: "HRMS & Staff", href: "/dashboard/hrms", icon: Users },
  { label: "Guest Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "ERP Settings", href: "/dashboard/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/dashboard/login" });
  };

  const user = session?.user;
  const userRole = ((user as any)?.role as Role) || "SUPER_ADMIN";

  // Filter NAV_ITEMS according to RBAC Matrix
  const allowedNavItems = NAV_ITEMS.filter((item) =>
    RolePermissionMatrix.canAccessRoute(userRole, item.href)
  );

  return (
    <aside className="w-64 border-r border-[#C5A880]/20 bg-[#0F1115] text-white flex flex-col justify-between select-none shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-lg font-bold text-[#C5A880] tracking-wider">HOTEL YASH GRAND</h1>
            <p className="text-[9.5px] uppercase tracking-[0.25em] text-neutral-400 font-semibold">
              Enterprise Hotel ERP
            </p>
          </div>
        </div>

        {/* Active Auth Session Badge */}
        <div className="p-4 border-b border-white/10 bg-neutral-950/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] uppercase tracking-widest text-[#C5A880] font-bold flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>RBAC Role: {userRole}</span>
            </span>
          </div>
          <div className="text-xs text-white font-mono truncate bg-neutral-900 border border-white/10 p-2 rounded">
            {user?.email || "dharmpal@hotelyashgrand.com"}
          </div>
        </div>

        {/* Navigation List Filtered by Role */}
        <nav className="p-3 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-none font-sans text-xs">
          {allowedNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-sm transition-all duration-200 group font-medium",
                  isActive
                    ? "bg-[#C5A880] text-black font-bold shadow-md"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-black" : "text-[#C5A880] group-hover:text-white")} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider",
                      isActive ? "bg-black text-white" : "bg-[#C5A880]/20 text-[#C5A880]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-white/10 bg-neutral-950 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center font-bold text-xs text-[#C5A880]">
            {(user?.name || "D").charAt(0)}
          </div>
          <div>
            <div className="text-xs font-semibold text-white truncate max-w-[120px]">
              {user?.name || "Dharmpal Singh"}
            </div>
            <div className="text-[9px] uppercase tracking-wider text-[#C5A880]">
              {userRole}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
          title="Logout of Auth Session"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

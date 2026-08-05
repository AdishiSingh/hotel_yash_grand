"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { cn } from "@/lib/utils";
import { 
  User, 
  Calendar, 
  Shield, 
  LayoutDashboard, 
  LogOut, 
  ArrowLeft,
  Crown,
  Menu,
  X
} from "lucide-react";
import { CustomerNotificationCenter } from "@/components/notifications/CustomerNotificationCenter";

interface CustomerNavbarProps {
  customerName?: string;
  customerEmail?: string;
}

export function CustomerNavbar({ customerName = "Valued Guest", customerEmail }: CustomerNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const scrollY = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isScrolled = scrollY > 20;

  const navLinks = [
    { name: "Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    { name: "My Bookings", href: "/customer/bookings", icon: Calendar },
    { name: "My Profile", href: "/customer/profile", icon: User },
    { name: "Account Security", href: "/customer/security", icon: Shield },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      await fetch("/api/customer/auth/logout", { method: "POST" });
      router.push("/customer/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-[#0B0D10]/95 backdrop-blur-xl border-b border-[#C5A880]/30 shadow-[0_12px_36px_rgba(0,0,0,0.35)]"
          : "bg-[#0B0D10]/80 backdrop-blur-md border-b border-[#C5A880]/20 shadow-none"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Return link */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-[#C5A880] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Hotel</span>
            </Link>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <Link href="/customer/dashboard" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#C5A880] to-[#8C6D3F] p-0.5 shadow-lg shadow-[#C5A880]/10 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0F1115] rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[#C5A880]" />
                </div>
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-wider text-[#C5A880] block">
                  HOTEL YASH GRAND
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold block">
                  Guest Privileges Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? "bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30 shadow-sm"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#C5A880]" : "text-neutral-400"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Profile, Notifications & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <CustomerNotificationCenter />

            <div className="text-right">
              <div className="text-xs font-semibold text-white tracking-wide">{customerName}</div>
              <div className="text-[10px] text-[#C5A880] tracking-wider uppercase font-medium">
                Verified Guest
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 hover:border-red-500/30 transition-all cursor-pointer disabled:opacity-50"
              title="Sign Out of Customer Account"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0F1115] px-4 pt-3 pb-6 space-y-2">
          <div className="p-3 bg-neutral-900/80 rounded-lg border border-white/10 mb-4">
            <div className="text-sm font-semibold text-white">{customerName}</div>
            {customerEmail && <div className="text-xs text-neutral-400">{customerEmail}</div>}
            <div className="text-[10px] text-[#C5A880] uppercase tracking-widest font-bold mt-1">Verified Guest</div>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 text-[#C5A880]" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-white/10 mt-2">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

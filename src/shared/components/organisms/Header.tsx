"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useBookingStore } from "@/features/booking/store/use-booking-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIntroStore } from "@/shared/store/use-intro-store";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Phone, User, Crown, LayoutDashboard, Calendar, History, Bell, Settings, LogOut, ChevronDown, Sparkles, PartyPopper } from "lucide-react";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { CustomerNotificationCenter } from "@/components/notifications/CustomerNotificationCenter";

const NAV_LINKS = [
  { id: "home", label: "Home", href: "/" },
  { id: "dining", label: "Dining", href: "/dining" },
  { id: "rooms", label: "Rooms", href: "/rooms" },
  { id: "banquet", label: "Banquet", href: "/banquet" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const scrollY = useScrollPosition();
  const { setDrawerOpen } = useBookingStore();
  const { customer, isAuthenticated, logoutCustomer, openAuthModal, requireAuth } = useBookingGuard();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const phase = useIntroStore((state) => state.phase);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  if (phase !== "landing") return null;

  const isScrolled = scrollY > 20;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500",
          isScrolled
            ? "border-b border-white/[0.12] bg-[#0B0D11]/90 py-3 sm:py-4 shadow-[0_12px_36px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            : "bg-transparent py-4 sm:py-6"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 md:px-12">
          
          {/* Logo Brand Anchor */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-sm border border-[#C5A880]/40 bg-neutral-950 p-0.5 shadow-md transition-colors duration-[250ms] group-hover:border-[#E0C489]">
              <Image
                src={ASSET_MANIFEST.logo.primary}
                alt="Hotel Yash Grand Logo"
                fill
                sizes="48px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-sm sm:text-lg tracking-[0.18em] font-semibold text-white uppercase group-hover:text-[#C5A880] transition-colors duration-300">
                Yash Grand
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.35em] text-[#C5A880] font-sans font-semibold">
                Varanasi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10 font-sans">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={cn(
                    "group relative pb-1.5 text-xs font-medium uppercase tracking-[0.18em] text-neutral-200 transition-colors duration-[250ms] hover:text-[#E0C489] sm:text-[13px]",
                    isActive && "text-[#C5A880] font-semibold"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[#E0C489] transition-transform duration-[250ms] group-hover:scale-x-100",
                      isActive && "scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Call to Action Button OR Customer Profile Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && customer ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <CustomerNotificationCenter />

                {/* Customer Profile Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full bg-neutral-900 border border-[#C5A880]/30 hover:border-[#C5A880] transition-all cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] flex items-center justify-center font-serif text-xs font-bold text-black">
                      {(customer.name || "G").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-[#FFFFFF] group-hover:text-[#C5A880] max-w-[100px] truncate">
                      {customer.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
                  </button>

                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-64 bg-[#0F1115] border border-[#C5A880]/40 rounded-2xl shadow-2xl z-50 overflow-hidden text-left divide-y divide-white/10"
                      >
                        {/* Header info */}
                        <div className="p-4 bg-neutral-950/80">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-[#C5A880]" />
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
                              Guest Privileges
                            </span>
                          </div>
                          <p className="text-xs font-bold text-white mt-1 truncate">{customer.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">{customer.phone}</p>
                        </div>

                        {/* Navigation Links */}
                        <div className="p-2 space-y-1 text-xs">
                          <Link
                            href="/customer/dashboard"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-[#C5A880]/15 transition-all font-semibold"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#C5A880]" />
                            <span>My Dashboard</span>
                          </Link>

                          <Link
                            href="/customer/bookings"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-[#C5A880]/15 transition-all font-semibold"
                          >
                            <Calendar className="w-4 h-4 text-[#C5A880]" />
                            <span>My Bookings</span>
                          </Link>

                          <Link
                            href="/customer/bookings?filter=completed"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-[#C5A880]/15 transition-all font-semibold"
                          >
                            <History className="w-4 h-4 text-[#C5A880]" />
                            <span>Booking History</span>
                          </Link>

                          <Link
                            href="/customer/bookings?filter=past_banquets"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-[#C5A880]/15 transition-all font-semibold"
                          >
                            <PartyPopper className="w-4 h-4 text-purple-400" />
                            <span>My Banquet Requests</span>
                          </Link>

                          <Link
                            href="/customer/profile"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-[#C5A880]/15 transition-all font-semibold"
                          >
                            <User className="w-4 h-4 text-[#C5A880]" />
                            <span>My Profile</span>
                          </Link>

                          <Link
                            href="/customer/security"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-[#C5A880]/15 transition-all font-semibold"
                          >
                            <Settings className="w-4 h-4 text-[#C5A880]" />
                            <span>Settings & Security</span>
                          </Link>
                        </div>

                        {/* Logout Button */}
                        <div className="p-2">
                          <button
                            onClick={logoutCustomer}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Button
                variant="accent"
                size="sm"
                onClick={() => requireAuth(() => setDrawerOpen(true))}
                className="text-[10px] uppercase tracking-[0.22em] font-bold px-7 py-3 min-h-[44px] bg-[#C5A880] hover:bg-[#A37C40] border-none text-black hover:text-white transition-all duration-300 rounded-sm shadow-md cursor-pointer"
              >
                Book Stay
              </Button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center p-3 text-white hover:text-[#C5A880] transition-colors duration-300 z-50 cursor-pointer min-h-[44px] min-w-[44px] rounded-sm bg-neutral-900/40 border border-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-[#C5A880]" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden"
            />

            {/* Mobile Drawer Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[88%] max-w-sm bg-[#0F1115] border-l border-gold/15 p-6 sm:p-8 flex flex-col justify-between md:hidden shadow-2xl overflow-y-auto"
            >
              <div className="space-y-8 mt-14">
                <div className="border-b border-gold/10 pb-4">
                  <span className="font-serif text-2xl tracking-wider text-gold">Yash Grand</span>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-[#C8A97E] mt-1 font-semibold">Varanasi • Luxury Collection</p>
                </div>
                
                <nav className="flex flex-col gap-2 font-buttons">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.id}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "min-h-[48px] px-4 text-xs uppercase tracking-[0.25em] font-semibold text-neutral-200 hover:text-gold transition-colors duration-300 flex items-center justify-between group rounded-sm hover:bg-white/[0.04]",
                          isActive && "text-gold bg-gold/10 border-l-2 border-gold font-bold"
                        )}
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gold" />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <Button
                  variant="accent"
                  size="default"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    requireAuth(() => setDrawerOpen(true));
                  }}
                  className="w-full text-xs uppercase tracking-widest font-bold py-4 min-h-[48px] bg-[#C5A880] hover:bg-[#8B5E3C] border-none text-black hover:text-white transition-all duration-300 rounded-sm font-buttons shadow-md cursor-pointer"
                >
                  Book Stay Now
                </Button>

                <a
                  href="tel:+919151088115"
                  className="w-full text-xs uppercase tracking-widest font-bold py-3.5 min-h-[48px] bg-neutral-900 border border-gold/30 hover:bg-gold/20 text-[#E0C489] hover:text-white transition-all duration-300 rounded-sm font-buttons flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="h-4 w-4 text-gold" />
                  <span>Call Desk: +91 91510 88115</span>
                </a>

                <div className="text-[9px] uppercase tracking-widest text-neutral-400 text-center font-sans pt-1">
                  Near SMS College, Varanasi
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

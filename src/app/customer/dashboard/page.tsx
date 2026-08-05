"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CustomerNavbar } from "../CustomerNavbar";
import { 
  Crown, 
  BedDouble, 
  PartyPopper, 
  UtensilsCrossed, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  User, 
  MapPin, 
  FileCheck, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  PhoneCall, 
  Receipt, 
  Plus, 
  ExternalLink,
  History,
  XCircle,
  CreditCard,
  MessageSquare,
  Gift,
  Star,
  Award,
  Sliders,
  Heart,
  Check,
  Building,
  Briefcase
} from "lucide-react";

export default function CustomerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("overview");

  // Notifications State
  const [markingRead, setMarkingRead] = useState(false);
  const [prefSubmitting, setPrefSubmitting] = useState(false);
  const [prefSuccess, setPrefSuccess] = useState(false);

  // Preference Form Editing State
  const [editPrefs, setEditPrefs] = useState({
    favouriteRoom: "",
    preferredFloor: "",
    preferredCheckInTime: "",
    specialRequests: "",
    favouriteDishes: "",
  });

  // Load dashboard data from PostgreSQL
  async function fetchDashboardData() {
    try {
      const res = await fetch("/api/customer/dashboard");
      const text = await res.text();
      let json: any = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch (e) {
        json = { success: false, error: "Invalid server response format." };
      }

      if (!res.ok || !json.success) {
        setError(json.error || "Failed to load customer dashboard.");
        setLoading(false);
        return;
      }

      setData(json.data);
      if (json.data?.customer) {
        setEditPrefs({
          favouriteRoom: json.data.customer.favouriteRoom || "executive-suite",
          preferredFloor: json.data.customer.preferredFloor || "2nd",
          preferredCheckInTime: json.data.customer.preferredCheckInTime || "12:00 PM",
          specialRequests: json.data.customer.specialRequests || "",
          favouriteDishes: (json.data.customer.favouriteDishes || []).join(", "),
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefSubmitting(true);
    setPrefSuccess(false);

    try {
      const dishesArray = editPrefs.favouriteDishes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          favouriteRoom: editPrefs.favouriteRoom,
          preferredFloor: editPrefs.preferredFloor,
          preferredCheckInTime: editPrefs.preferredCheckInTime,
          specialRequests: editPrefs.specialRequests,
          favouriteDishes: dishesArray,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setPrefSuccess(true);
        fetchDashboardData();
        setTimeout(() => setPrefSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Save preferences error:", err);
    } finally {
      setPrefSubmitting(false);
    }
  };

  const handleMarkNotificationsRead = async () => {
    setMarkingRead(true);
    try {
      await fetch("/api/customer/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Mark notifications error:", err);
    } finally {
      setMarkingRead(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090D] text-white flex flex-col">
        <CustomerNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#C5A880] animate-spin mx-auto" />
            <p className="text-xs font-mono text-neutral-400 tracking-wider">
              FETCHING GUEST PRIVILEGES & PORTAL METRICS FROM POSTGRESQL...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#07090D] text-white flex flex-col">
        <CustomerNavbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-[#0F1115] border border-red-500/30 rounded-2xl p-6 max-w-md w-full text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h2 className="text-lg font-bold text-white">Guest Portal Loading Error</h2>
            <p className="text-xs text-neutral-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[#C5A880] text-black text-xs font-bold uppercase tracking-wider"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  const customer = data?.customer;
  const stats = data?.stats;
  const upcomingStays = data?.upcomingStays || [];
  const pastBookings = data?.pastBookings || [];
  const cancelledBookings = data?.cancelledBookings || [];
  const pendingRequests = data?.pendingRequests || [];
  const banquetRequests = data?.banquetRequests || [];
  const restaurantOrders = data?.restaurantOrders || [];
  const notifications = data?.notifications || [];
  const profileChecklist = data?.profileChecklist || [];
  const missingItems = data?.missingItems || [];

  return (
    <div className="min-h-screen bg-[#07090D] text-white flex flex-col selection:bg-[#C5A880] selection:text-black">
      <CustomerNavbar customerName={customer?.name} customerEmail={customer?.email} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. LUXURY WELCOME CARD & GUEST PRIVILEGE HEADER */}
        <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-r from-[#141820] via-[#0F1115] to-[#0A0C0F] border border-[#C5A880]/30 shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A880]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              {/* Avatar / Initial Badge */}
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#C5A880] via-[#D4AF37] to-[#8C6D3F] p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full bg-[#0F1115] rounded-2xl flex items-center justify-center font-serif text-2xl font-bold text-[#C5A880]">
                  {(customer?.name || "G").charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880] text-[10px] font-bold uppercase tracking-widest">
                    <Crown className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{stats?.loyaltyTier}</span>
                  </span>

                  {customer?.idProofNumber ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ID Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold">
                      <AlertCircle className="w-3 h-3" />
                      <span>ID Verification Pending</span>
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>{stats?.profileCompletionPercent}% Profile Completed</span>
                  </span>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-white">
                  Welcome back, <span className="text-[#C5A880]">{customer?.name}</span>
                </h1>

                <p className="text-xs text-neutral-300 font-sans flex items-center gap-4 flex-wrap">
                  <span>Mobile: <strong className="text-white font-mono">{customer?.phone}</strong></span>
                  {customer?.email && <span>• Email: <strong className="text-white">{customer?.email}</strong></span>}
                  <span>• Member since <strong className="text-[#C5A880]">{new Date(customer?.createdAt).getFullYear()}</strong></span>
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/rooms"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-[#C5A880]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BedDouble className="w-4 h-4" />
                <span>Book Luxury Room</span>
              </Link>
              <Link
                href="/banquet"
                className="px-5 py-3 rounded-xl border border-[#C5A880]/40 bg-neutral-900/60 hover:bg-[#C5A880]/10 text-[#C5A880] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Reserve Banquet</span>
              </Link>
            </div>
          </div>

          {/* PROFILE COMPLETION METER BANNER */}
          {stats?.profileCompletionPercent < 100 && (
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    Guest Profile Completion Score
                  </span>
                  <span className="font-mono text-[#C5A880] font-bold">{stats?.profileCompletionPercent}%</span>
                </div>
                <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-white/10">
                  <div 
                    className="bg-gradient-to-r from-[#C5A880] to-[#D4AF37] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${stats?.profileCompletionPercent}%` }} 
                  />
                </div>
              </div>

              {missingItems.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <span className="text-[11px] text-neutral-400">Next step:</span>
                  <Link
                    href="/customer/profile"
                    className="px-3 py-1.5 rounded-lg bg-[#C5A880]/20 hover:bg-[#C5A880]/30 border border-[#C5A880]/40 text-[#C5A880] font-bold text-[11px] transition-all flex items-center gap-1"
                  >
                    <span>Complete {missingItems[0]?.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. STATS & ANALYTICS CARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Loyalty Points */}
          <div className="bg-[#0F1115] border border-[#C5A880]/30 rounded-2xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold">Loyalty Points</span>
              <Gift className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              {stats?.loyaltyPoints?.toLocaleString()} <span className="text-xs text-[#C5A880] font-sans font-semibold">PTS</span>
            </div>
            <div className="text-[11px] text-neutral-400 flex items-center justify-between">
              <span>Multiplier: <strong>{stats?.tierMultiplier}</strong></span>
              <button onClick={() => setActiveSection("loyalty")} className="text-[#C5A880] hover:underline font-semibold text-[10px] uppercase">
                Perks & Tier
              </button>
            </div>
          </div>

          {/* Card 2: Total Revenue Spent */}
          <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Total Stay Value</span>
              <Receipt className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              ₹{stats?.totalSpentAmount?.toLocaleString()}
            </div>
            <div className="text-[11px] text-neutral-400">
              Across <strong className="text-white">{stats?.totalBookingsCount}</strong> bookings & orders
            </div>
          </div>

          {/* Card 3: Active & Upcoming Stays */}
          <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Upcoming Stays</span>
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              {stats?.upcomingStaysCount}
            </div>
            <div className="text-[11px] text-neutral-400">
              Confirmed room reservations
            </div>
          </div>

          {/* Card 4: Pending Desk Inquiries */}
          <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Desk Inquiries</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              {stats?.pendingRequestsCount}
            </div>
            <div className="text-[11px] text-neutral-400">
              Awaiting manager tariff approval
            </div>
          </div>

        </div>

        {/* 3. NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: Crown },
            { id: "upcoming", label: `Upcoming (${upcomingStays.length})`, icon: Calendar },
            { id: "past", label: `Past Stays (${pastBookings.length})`, icon: History },
            { id: "cancelled", label: `Cancelled (${cancelledBookings.length})`, icon: XCircle },
            { id: "loyalty", label: `Loyalty Rewards`, icon: Gift },
            { id: "preferences", label: `Stay Preferences`, icon: Sliders },
            { id: "favourites", label: `Favourite Rooms`, icon: Heart },
            { id: "notifications", label: `Notifications (${stats?.unreadNotificationsCount || 0})`, icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#C5A880] text-black shadow-lg shadow-[#C5A880]/20"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW / UPCOMING BOOKINGS SECTION */}
        {(activeSection === "overview" || activeSection === "upcoming") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#C5A880]" />
                  <span>Upcoming Room Stays & Reservations</span>
                </h2>
                <p className="text-xs text-neutral-400">Confirmed room bookings with active digital check-in timeline</p>
              </div>
            </div>

            {upcomingStays.length === 0 ? (
              <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-8 text-center space-y-3">
                <BedDouble className="w-10 h-10 text-neutral-600 mx-auto" />
                <h3 className="text-sm font-semibold text-white">No Active Upcoming Room Reservations</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  You don't have any active room stays scheduled. Reserve your stay at Hotel Yash Grand.
                </p>
                <Link
                  href="/rooms"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5A880] text-black text-xs font-bold hover:opacity-90 mt-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Reserve a Room Now</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingStays.map((stay: any) => (
                  <div
                    key={stay.id}
                    className="bg-[#0F1115] border border-[#C5A880]/40 hover:border-[#C5A880] rounded-2xl p-6 transition-all space-y-4 shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold">Booking Token #{stay.bookingId}</span>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          Room {stay.room?.roomNumber} • {stay.room?.type}
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {stay.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-neutral-400 block text-[11px] mb-0.5">Check-In</span>
                        <span className="text-white font-medium">
                          {new Date(stay.checkIn).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[11px] mb-0.5">Check-Out</span>
                        <span className="text-white font-medium">
                          {new Date(stay.checkOut).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[11px] mb-0.5">Occupancy</span>
                        <span className="text-white font-medium">{stay.guests} Guest(s)</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block text-[11px] mb-0.5">Total Stay Tariff</span>
                        <span className="text-[#C5A880] font-mono font-bold text-sm">₹{stay.totalAmount?.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* BOOKING TIMELINE COMPONENT */}
                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/10 space-y-2">
                      <div className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
                        <span>Stay Progress Timeline</span>
                        <span className="text-emerald-400 text-[10px] font-mono">STEP 3 OF 4</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                        <div className="space-y-1">
                          <div className="h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-neutral-300 block">Requested</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-neutral-300 block">Approved</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-emerald-400 font-bold block">Confirmed</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 rounded-full bg-neutral-800" />
                          <span className="text-neutral-500 block">Check-in</span>
                        </div>
                      </div>
                    </div>

                    {stay.specialRequests && (
                      <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 text-xs text-neutral-300">
                        <span className="font-semibold text-[#C5A880]">Special Request: </span>
                        {stay.specialRequests}
                      </div>
                    )}

                    <div className="pt-2 flex justify-between items-center text-xs">
                      <span className="text-neutral-400 text-[11px]">Advance Paid: ₹{stay.advancePaid || 0}</span>
                      <Link
                        href={`/customer/bookings`}
                        className="text-[#C5A880] font-semibold hover:underline flex items-center gap-1 text-xs"
                      >
                        <span>Manage & Token Invoice</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: PAST STAYS ARCHIVE */}
        {(activeSection === "overview" || activeSection === "past") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-neutral-400" />
                  <span>Past Room Stays & Reservation History</span>
                </h2>
                <p className="text-xs text-neutral-400">Completed luxury stays with one-click re-booking</p>
              </div>
            </div>

            {pastBookings.length === 0 ? (
              <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-6 text-center text-xs text-neutral-400">
                No completed past stays recorded yet.
              </div>
            ) : (
              <div className="bg-[#0F1115] border border-white/10 rounded-2xl divide-y divide-white/10 overflow-hidden">
                {pastBookings.map((pb: any) => (
                  <div key={pb.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-neutral-900 text-[#C5A880]">
                        <BedDouble className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-wider">
                          Room {pb.room?.roomNumber} • {pb.room?.type}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {new Date(pb.checkIn).toLocaleDateString()} to {new Date(pb.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#C5A880] font-bold">₹{pb.totalAmount?.toLocaleString()}</span>
                      <Link
                        href="/rooms"
                        className="px-3.5 py-2 rounded-xl bg-[#C5A880] text-black text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Re-book Stay</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: CANCELLED BOOKINGS ARCHIVE */}
        {(activeSection === "overview" || activeSection === "cancelled") && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span>Cancelled & Declined Inquiries</span>
                </h2>
                <p className="text-xs text-neutral-400">Archived record of cancelled requests and refund status</p>
              </div>
            </div>

            {cancelledBookings.length === 0 ? (
              <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-6 text-center text-xs text-neutral-400">
                You have no cancelled or declined booking requests.
              </div>
            ) : (
              <div className="space-y-3">
                {cancelledBookings.map((cb: any) => (
                  <div key={cb.id} className="bg-[#0F1115] border border-red-500/25 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">
                          #{cb.bookingId} • {cb.roomType} ({cb.type})
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          Reason: <span className="text-red-300">{cb.reason}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40">
                        {cb.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 4: LOYALTY REWARDS & PRIVILEGES PORTAL */}
        {activeSection === "loyalty" && (
          <section className="space-y-6">
            <div className="bg-gradient-to-r from-[#1A1E29] via-[#0F1115] to-[#141820] border border-[#C5A880]/40 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold flex items-center gap-1.5">
                    <Crown className="w-4 h-4" /> Hotel Yash Grand Guest Club
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-white mt-1">
                    Loyalty Tier: <span className="text-[#C5A880]">{stats?.loyaltyTier}</span>
                  </h2>
                </div>

                <div className="text-left sm:text-right font-mono">
                  <div className="text-3xl font-bold text-white">{stats?.loyaltyPoints?.toLocaleString()}</div>
                  <div className="text-xs text-[#C5A880]">TOTAL ACCUMULATED POINTS</div>
                </div>
              </div>

              {/* TIER PROGRESS METER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300">Progress to <strong className="text-[#C5A880]">{stats?.nextTier}</strong></span>
                  <span className="font-mono text-[#C5A880] font-bold">{stats?.loyaltyPoints} / {stats?.targetPoints} PTS ({stats?.tierProgressPercent}%)</span>
                </div>
                <div className="w-full bg-neutral-950 rounded-full h-3 overflow-hidden border border-white/10 p-0.5">
                  <div 
                    className="bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#8C6D3F] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${stats?.tierProgressPercent}%` }} 
                  />
                </div>
              </div>

              {/* TIER PRIVILEGES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className={`p-5 rounded-2xl border ${stats?.loyaltyTier === "VALUED GUEST" ? "bg-[#C5A880]/10 border-[#C5A880]" : "bg-neutral-950 border-white/10"}`}>
                  <div className="text-xs font-bold text-[#C5A880] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-[#C5A880]" /> Valued Guest Tier
                  </div>
                  <ul className="text-xs text-neutral-300 space-y-2">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Welcome Drink upon Arrival</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> High-Speed Wi-Fi Access</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 1.0x Loyalty Points Multiplier</li>
                  </ul>
                </div>

                <div className={`p-5 rounded-2xl border ${stats?.loyaltyTier === "GOLD PATRON" ? "bg-[#C5A880]/10 border-[#C5A880]" : "bg-neutral-950 border-white/10"}`}>
                  <div className="text-xs font-bold text-[#C5A880] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#C5A880]" /> Gold Patron (3,000+ PTS)
                  </div>
                  <ul className="text-xs text-neutral-300 space-y-2">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Free Room Upgrade (Subject to availability)</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 2:00 PM Late Check-out</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 1.2x Loyalty Points Multiplier</li>
                  </ul>
                </div>

                <div className={`p-5 rounded-2xl border ${stats?.loyaltyTier === "ROYAL PLATINUM VIP" ? "bg-[#C5A880]/15 border-[#C5A880]" : "bg-neutral-950 border-white/10"}`}>
                  <div className="text-xs font-bold text-[#C5A880] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-[#C5A880]" /> Royal Platinum VIP (10,000+ PTS)
                  </div>
                  <ul className="text-xs text-neutral-300 space-y-2">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Complimentary Airport Pickup & Drop</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Guaranteed Late Check-out (4:00 PM)</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 1.5x Loyalty Points Multiplier</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 5: SAVED PREFERENCES */}
        {activeSection === "preferences" && (
          <section className="space-y-4">
            <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#C5A880]" />
                    <span>Saved Stay & Dietary Preferences</span>
                  </h3>
                  <p className="text-xs text-neutral-400">Custom room choices automatically populated into every booking</p>
                </div>
              </div>

              {prefSuccess && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Preferences saved successfully to your customer profile!</span>
                </div>
              )}

              <form onSubmit={handleSavePreferences} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                      Preferred Room Category
                    </label>
                    <select
                      value={editPrefs.favouriteRoom}
                      onChange={(e) => setEditPrefs({ ...editPrefs, favouriteRoom: e.target.value })}
                      className="w-full bg-[#07090D] border border-white/15 focus:border-[#C5A880] px-3.5 py-3 rounded-xl text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="single-deluxe">Single Deluxe Room</option>
                      <option value="family-room">Family Room</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                      Preferred Floor
                    </label>
                    <select
                      value={editPrefs.preferredFloor}
                      onChange={(e) => setEditPrefs({ ...editPrefs, preferredFloor: e.target.value })}
                      className="w-full bg-[#07090D] border border-white/15 focus:border-[#C5A880] px-3.5 py-3 rounded-xl text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="any">Any Available Floor</option>
                      <option value="ground">Ground Floor</option>
                      <option value="1st">1st Floor</option>
                      <option value="2nd">2nd Floor (High View)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                      Preferred Check-in Time
                    </label>
                    <select
                      value={editPrefs.preferredCheckInTime}
                      onChange={(e) => setEditPrefs({ ...editPrefs, preferredCheckInTime: e.target.value })}
                      className="w-full bg-[#07090D] border border-white/15 focus:border-[#C5A880] px-3.5 py-3 rounded-xl text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="12:00 PM">12:00 PM (Standard Check-in)</option>
                      <option value="10:00 AM">10:00 AM (Early Request)</option>
                      <option value="04:00 PM">04:00 PM (Afternoon)</option>
                      <option value="08:00 PM">08:00 PM (Night Arrival)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                    Special Requests & Stay Preferences
                  </label>
                  <textarea
                    rows={2}
                    value={editPrefs.specialRequests}
                    onChange={(e) => setEditPrefs({ ...editPrefs, specialRequests: e.target.value })}
                    placeholder="e.g., Quiet room away from elevator, extra bed, feather pillows"
                    className="w-full bg-[#07090D] border border-white/15 focus:border-[#C5A880] px-4 py-3 rounded-xl text-xs text-white placeholder-neutral-600 outline-none resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                    Dietary & Culinary Preferences (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editPrefs.favouriteDishes}
                    onChange={(e) => setEditPrefs({ ...editPrefs, favouriteDishes: e.target.value })}
                    placeholder="e.g., Pure Veg Awadhi, Jain Thali, Eggless Bakery, Less Spicy"
                    className="w-full bg-[#07090D] border border-white/15 focus:border-[#C5A880] px-4 py-3 rounded-xl text-xs text-white placeholder-neutral-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={prefSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-[#C5A880]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{prefSubmitting ? "Saving..." : "Save Preferences to Profile"}</span>
                </button>
              </form>
            </div>
          </section>
        )}

        {/* TAB 6: FAVOURITE ROOMS */}
        {activeSection === "favourites" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <span>Saved Favourite Room Suite Catalog</span>
                </h2>
                <p className="text-xs text-neutral-400">Quickly re-book your preferred room configurations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { type: "Single Deluxe Room", roomCode: "single-deluxe", price: 2500, max: 2, desc: "A modern and comfortable room with attached balcony, highway view, 24x7 Wi-Fi, LED Smart TV, and restaurant food delivery." },
                { type: "Family Room", roomCode: "family-room", price: 4000, max: 4, desc: "A spacious family accommodation consisting of two connected rooms suitable for families." },
              ].map((rm) => (
                <div key={rm.roomCode} className="bg-[#0F1115] border border-white/10 hover:border-[#C5A880] rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A880]">FAVOURITE SUITE</span>
                      <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-white">{rm.type}</h3>
                    <p className="text-xs text-neutral-400">{rm.desc}</p>
                    <div className="text-xs text-neutral-300 flex items-center gap-3">
                      <span>Max: <strong className="text-white">{rm.max} Guests</strong></span>
                      <span>• Tariff: <strong className="text-[#C5A880] font-mono font-bold">₹{rm.price.toLocaleString()}/night</strong></span>
                    </div>
                  </div>

                  <Link
                    href={`/rooms`}
                    className="w-full py-3 rounded-xl bg-[#C5A880] text-black text-xs font-bold uppercase tracking-wider text-center block hover:opacity-90 transition-all cursor-pointer"
                  >
                    Instant Re-book Room
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 7: NOTIFICATIONS */}
        {activeSection === "notifications" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#C5A880]" />
                  <span>Guest Portal Notifications</span>
                </h2>
                <p className="text-xs text-neutral-400">Updates regarding room stays, banquet quotes, and payment verifications</p>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={handleMarkNotificationsRead}
                  disabled={markingRead}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs text-[#C5A880] font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  {markingRead ? "Updating..." : "Mark All as Read"}
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-6 text-center text-xs text-neutral-400">
                You have no notifications at this time.
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className={`border rounded-xl p-4 flex items-start gap-3 text-xs transition-all ${
                      n.isRead ? "bg-[#0F1115] border-white/10 text-neutral-400" : "bg-[#141820] border-[#C5A880]/40 text-white"
                    }`}
                  >
                    <Bell className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{n.title}</span>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                        )}
                      </div>
                      <div className="text-neutral-300 mt-0.5">{n.message}</div>
                      <div className="text-[10px] text-neutral-500 mt-1 font-mono">
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 8. PROFILE PREVIEW & QUICK CONCIERGE ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* PROFILE SUMMARY CARD */}
          <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-6 space-y-4 md:col-span-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#C5A880]" />
                <span>Guest Identity & Profile</span>
              </h3>
              <Link href="/customer/profile" className="text-xs text-[#C5A880] hover:underline font-semibold">
                Edit Profile
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px]">Name</span>
                <span className="text-white font-medium">{customer?.name}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Mobile</span>
                <span className="text-white font-mono">{customer?.phone}</span>
              </div>
              {customer?.email && (
                <div>
                  <span className="text-neutral-500 block text-[10px]">Email</span>
                  <span className="text-white">{customer?.email}</span>
                </div>
              )}
              {customer?.address && (
                <div>
                  <span className="text-neutral-500 block text-[10px]">Address</span>
                  <span className="text-neutral-300">{customer?.address}, {customer?.city}</span>
                </div>
              )}
              <div>
                <span className="text-neutral-500 block text-[10px]">Identity Proof</span>
                <span className="text-[#C5A880] font-semibold">
                  {customer?.idProofNumber ? `${customer?.idProofType} (${customer?.idProofNumber})` : "Identity verification at front desk"}
                </span>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS GRID */}
          <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-6 space-y-4 md:col-span-2">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                <span>Quick Concierge Actions</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link
                href="/rooms"
                className="p-3.5 rounded-xl bg-neutral-950 border border-white/10 hover:border-[#C5A880]/50 text-left transition-all group"
              >
                <BedDouble className="w-5 h-5 text-[#C5A880] group-hover:scale-110 transition-transform mb-2" />
                <div className="text-xs font-bold text-white">Book Room</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Explore luxury rooms</div>
              </Link>

              <Link
                href="/banquet"
                className="p-3.5 rounded-xl bg-neutral-950 border border-white/10 hover:border-[#C5A880]/50 text-left transition-all group"
              >
                <PartyPopper className="w-5 h-5 text-[#C5A880] group-hover:scale-110 transition-transform mb-2" />
                <div className="text-xs font-bold text-white">Inquire Banquet</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Weddings & events</div>
              </Link>

              <Link
                href="/menu"
                className="p-3.5 rounded-xl bg-neutral-950 border border-white/10 hover:border-[#C5A880]/50 text-left transition-all group"
              >
                <UtensilsCrossed className="w-5 h-5 text-[#C5A880] group-hover:scale-110 transition-transform mb-2" />
                <div className="text-xs font-bold text-white">Digital Menu</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Browse dishes</div>
              </Link>

              <Link
                href="/contact"
                className="p-3.5 rounded-xl bg-neutral-950 border border-white/10 hover:border-[#C5A880]/50 text-left transition-all group"
              >
                <PhoneCall className="w-5 h-5 text-[#C5A880] group-hover:scale-110 transition-transform mb-2" />
                <div className="text-xs font-bold text-white">Front Desk</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Contact Concierge</div>
              </Link>

              <Link
                href="/customer/profile"
                className="p-3.5 rounded-xl bg-neutral-950 border border-white/10 hover:border-[#C5A880]/50 text-left transition-all group"
              >
                <FileCheck className="w-5 h-5 text-[#C5A880] group-hover:scale-110 transition-transform mb-2" />
                <div className="text-xs font-bold text-white">Update Profile</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Complete ID & Address</div>
              </Link>

              <Link
                href="/customer/security"
                className="p-3.5 rounded-xl bg-neutral-950 border border-white/10 hover:border-[#C5A880]/50 text-left transition-all group"
              >
                <ShieldCheck className="w-5 h-5 text-[#C5A880] group-hover:scale-110 transition-transform mb-2" />
                <div className="text-xs font-bold text-white">Account Security</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Update Password</div>
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

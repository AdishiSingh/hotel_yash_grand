"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { CustomerNavbar } from "../CustomerNavbar";
import { CustomerBookingTimeline } from "@/components/booking/CustomerBookingTimeline";
import { 
  BedDouble, 
  PartyPopper, 
  UtensilsCrossed, 
  Calendar, 
  Clock, 
  Receipt, 
  MapPin, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  FileText,
  CheckCircle2,
  XCircle,
  Plus,
  Printer,
  PhoneCall,
  MessageSquare,
  X,
  ShieldCheck,
  CreditCard,
  Building2,
  User,
  Sparkles,
  Info,
  Search,
  Filter
} from "lucide-react";

export default function CustomerBookingsPage() {
  const [customer, setCustomer] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "pending" | "confirmed" | "completed" | "cancelled" | "past_stays" | "past_banquets">("all");

  // Selected Booking Modal State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const fetchCustomerBookings = async () => {
    try {
      const res = await fetch("/api/customer/bookings");
      const json = await res.json();

      if (json.success && json.data) {
        setCustomer(json.data.customer);
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090D] text-white flex flex-col">
        <CustomerNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin mx-auto" />
            <p className="text-xs font-mono text-neutral-400">Loading Reservations from PostgreSQL...</p>
          </div>
        </div>
      </div>
    );
  }

  const roomBookings = data?.roomBookings || [];
  const bookingRequests = data?.bookingRequests || [];
  const banquetBookings = data?.banquetBookings || [];
  const restaurantOrders = data?.restaurantOrders || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Normalizing all items into a unified reservation array for filtering
  const allReservations = [
    ...roomBookings.map((b: any) => ({
      id: b.id,
      bookingId: b.bookingId,
      category: "ROOM_STAY",
      title: `Room ${b.room?.roomNumber || "Assigned"} • ${b.room?.type || "Deluxe Suite"}`,
      status: b.status,
      date: new Date(b.checkIn),
      endDate: new Date(b.checkOut),
      totalAmount: b.totalAmount,
      advancePaid: b.advancePaid || 0,
      paymentStatus: b.advancePaid >= b.totalAmount ? "PAID" : b.advancePaid > 0 ? "PARTIAL" : "PENDING",
      raw: b,
      isUpcoming: new Date(b.checkOut) >= today && b.status !== "CANCELLED",
      isPending: b.status === "PENDING" || b.status === "PAYMENT_PENDING",
      isConfirmed: b.status === "CONFIRMED" || b.status === "CHECKED_IN",
      isCompleted: b.status === "CHECKED_OUT",
      isCancelled: b.status === "CANCELLED",
    })),
    ...bookingRequests.map((r: any) => ({
      id: r.id,
      bookingId: r.requestId,
      category: r.type === "ROOM" ? "ROOM_REQUEST" : r.type === "BANQUET" ? "BANQUET_REQUEST" : "RESTAURANT_REQUEST",
      title: r.type === "RESTAURANT" ? `Table Reservation • ${r.eventType || "Dining"}` : `${r.type} Request • ${r.roomType || r.eventType || "Standard"}`,
      status: r.status,
      date: r.checkIn ? new Date(r.checkIn) : r.eventDate ? new Date(r.eventDate) : new Date(r.createdAt),
      endDate: r.checkOut ? new Date(r.checkOut) : null,
      totalAmount: r.totalAmount || 0,
      advancePaid: r.advanceAmount || 0,
      paymentStatus: r.paymentStatus || "PENDING",
      raw: r,
      isUpcoming: (r.status === "CONFIRMED" || r.status === "APPROVED") && (r.checkIn ? new Date(r.checkIn) >= today : r.eventDate ? new Date(r.eventDate) >= today : true),
      isPending: r.status === "PENDING" || r.status === "IN_PROGRESS" || r.status === "CONTACTED" || r.status === "PAYMENT_PENDING",
      isConfirmed: r.status === "CONFIRMED" || r.status === "APPROVED" || r.status === "PAYMENT_VERIFIED",
      isCompleted: r.status === "CHECKED_OUT" || r.status === "COMPLETED",
      isCancelled: r.status === "REJECTED" || r.status === "CANCELLED",
    })),
    ...banquetBookings.map((bq: any) => ({
      id: bq.id,
      bookingId: bq.enquiryId,
      category: "BANQUET_EVENT",
      title: `${bq.eventType} Celebration (${bq.guestsCount} Guests)`,
      status: bq.status,
      date: new Date(bq.eventDate),
      endDate: null,
      totalAmount: bq.budget || 0,
      advancePaid: 0,
      paymentStatus: "PENDING",
      raw: bq,
      isUpcoming: new Date(bq.eventDate) >= today && bq.status !== "CANCELLED",
      isPending: bq.status === "NEW" || bq.status === "CONTACTED" || bq.status === "SITE_VISIT",
      isConfirmed: bq.status === "BOOKED",
      isCompleted: bq.status === "COMPLETED",
      isCancelled: bq.status === "CANCELLED",
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Filter reservations based on active tab and search query
  const filteredReservations = allReservations.filter((item) => {
    // Status Filter
    if (statusFilter === "upcoming" && !item.isUpcoming) return false;
    if (statusFilter === "pending" && !item.isPending) return false;
    if (statusFilter === "confirmed" && !item.isConfirmed) return false;
    if (statusFilter === "completed" && !item.isCompleted) return false;
    if (statusFilter === "cancelled" && !item.isCancelled) return false;
    if (statusFilter === "past_stays" && (!item.category.includes("ROOM") || (!item.isCompleted && item.date >= today))) return false;
    if (statusFilter === "past_banquets" && (!item.category.includes("BANQUET") || (!item.isCompleted && item.date >= today))) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = item.bookingId.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchStatus = item.status.toLowerCase().includes(q);
      const matchYear = item.date.getFullYear().toString().includes(q);
      return matchId || matchTitle || matchStatus || matchYear;
    }

    return true;
  });

  // Group reservations by year for Phase 6 History View
  const groupedByYear = filteredReservations.reduce((acc: Record<number, typeof filteredReservations>, item) => {
    const year = item.date.getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const handlePrintConfirmation = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#07090D] text-[#FFFFFF] flex flex-col selection:bg-[#C5A880] selection:text-black">
      <CustomerNavbar customerName={customer?.name} customerEmail={customer?.email} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#C5A880]">
              Booking History & Reservations
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Complete historical stays, past banquet events, active tracking, and printable confirmation receipts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Search className="w-4 h-4 text-[#C5A880]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, Room, Year..."
                className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:border-[#C5A880] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <Link
              href="/rooms"
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#C5A880]/20 transition-all rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Room</span>
            </Link>
          </div>
        </div>

        {/* STATUS & CATEGORY FILTER TABS */}
        <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "all", label: `All (${allReservations.length})` },
            { id: "upcoming", label: `Upcoming (${allReservations.filter((i) => i.isUpcoming).length})` },
            { id: "pending", label: `Pending (${allReservations.filter((i) => i.isPending).length})` },
            { id: "confirmed", label: `Confirmed (${allReservations.filter((i) => i.isConfirmed).length})` },
            { id: "completed", label: `Completed (${allReservations.filter((i) => i.isCompleted).length})` },
            { id: "cancelled", label: `Cancelled (${allReservations.filter((i) => i.isCancelled).length})` },
            { id: "past_stays", label: `Past Stays` },
            { id: "past_banquets", label: `Past Banquets` },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#C5A880] text-black shadow-lg shadow-[#C5A880]/20"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* RESERVATIONS GRID */}
        {filteredReservations.length === 0 ? (
          <div className="bg-[#0F1115] border border-white/10 rounded-3xl p-12 text-center space-y-4">
            <Calendar className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Reservations Found in this Section</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              There are no bookings matching the selected status filter.
            </p>
            <button
              onClick={() => setStatusFilter("all")}
              className="px-4 py-2 bg-neutral-900 border border-white/10 text-[#C5A880] text-xs font-semibold rounded-xl hover:bg-[#C5A880]/10"
            >
              Show All Bookings
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {sortedYears.map((year) => (
              <div key={year} className="space-y-4">
                {/* YEAR DIVIDER HEADER */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-2">
                  <span className="font-serif text-xl font-bold text-[#C5A880] tracking-wider">
                    {year} History
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30">
                    {groupedByYear[year].length} {groupedByYear[year].length === 1 ? "Reservation" : "Reservations"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedByYear[year].map((item) => {
                    const isRoom = item.category.includes("ROOM");

                    return (
                      <div
                        key={item.id}
                        className="bg-[#0F1115] border border-white/10 hover:border-[#C5A880]/50 rounded-2xl p-6 transition-all space-y-5 shadow-xl relative group"
                      >
                        {/* Top Bar ID & Badges */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${isRoom ? "bg-[#C5A880]/10 text-[#C5A880]" : "bg-purple-500/10 text-purple-400"}`}>
                              {isRoom ? <BedDouble className="w-5 h-5" /> : <PartyPopper className="w-5 h-5" />}
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold font-mono">
                                #{item.bookingId}
                              </span>
                              <h3 className="text-base font-bold text-white">{item.title}</h3>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              item.status === "CONFIRMED" || item.status === "APPROVED" || item.status === "BOOKED"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : item.status === "PENDING" || item.status === "PAYMENT_PENDING"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : item.status === "CHECKED_OUT" || item.status === "COMPLETED"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                : "bg-red-500/20 text-red-300 border-red-500/40"
                            }`}>
                              {item.status}
                            </span>

                            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">
                              Payment: <strong className="text-white">{item.paymentStatus}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Body Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-neutral-400 block text-[10px]">Check-In / Event</span>
                            <span className="text-white font-medium">
                              {item.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>

                          <div>
                            <span className="text-neutral-400 block text-[10px]">Check-Out Date</span>
                            <span className="text-white font-medium">
                              {item.endDate ? item.endDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Same Day"}
                            </span>
                          </div>

                          <div>
                            <span className="text-neutral-400 block text-[10px]">Guests</span>
                            <span className="text-white font-medium">
                              {item.raw?.guestsCount || (item.raw?.adults ? `${item.raw.adults} Adults, ${item.raw.children || 0} Child` : "Standard Occupancy")}
                            </span>
                          </div>

                          <div>
                            <span className="text-neutral-400 block text-[10px]">Requested Date</span>
                            <span className="text-neutral-300 font-mono text-[11px]">
                              {item.raw?.createdAt ? new Date(item.raw.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Recent"}
                            </span>
                          </div>
                        </div>

                        {/* Manager remarks preview if available */}
                        {item.raw?.managerRemarks && (
                          <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 text-xs text-neutral-300 flex items-start gap-2">
                            <Info className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-[#C5A880]">Desk Note: </strong>
                              <span>{item.raw.managerRemarks}</span>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="px-4 py-2 rounded-xl bg-[#C5A880]/15 hover:bg-[#C5A880] text-[#C5A880] hover:text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border border-[#C5A880]/30"
                          >
                            <span>View Details & Timeline</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/919151088115?text=${encodeURIComponent(`Hello Hotel Yash Grand Desk, I am inquiring about my Booking ID ${item.bookingId}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
                              title="Contact Front Desk via WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>

                            <button
                              onClick={() => { setSelectedItem(item); setTimeout(() => window.print(), 300); }}
                              className="p-2 rounded-xl bg-neutral-900 text-neutral-300 hover:text-white border border-white/10 text-xs"
                              title="Print Confirmation Sheet"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOOKING DETAILS & TIMELINE MODAL */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setSelectedItem(null)} />

            <div className="relative w-full max-w-3xl bg-[#0F1115] border border-[#C5A880]/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto print:border-none print:shadow-none print:max-h-none print:p-0 print:bg-white print:text-black">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 print:border-black">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold font-mono print:text-black">
                    BOOKING REFERENCE #{selectedItem.bookingId}
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-white print:text-black">
                    {selectedItem.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 print:hidden">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {selectedItem.status}
                  </span>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* REAL-TIME LUXURY TIMELINE DISPLAY */}
              <CustomerBookingTimeline booking={selectedItem.raw || selectedItem} onRefresh={fetchCustomerBookings} />

              {/* RESERVATION DETAILS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-2 print:bg-white print:border-black">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block print:text-black">
                    Guest Information
                  </span>
                  <div><strong className="text-white print:text-black">Name:</strong> {customer?.name || selectedItem.raw?.guestName}</div>
                  <div><strong className="text-white print:text-black">Mobile:</strong> {customer?.phone || selectedItem.raw?.mobile}</div>
                  <div><strong className="text-white print:text-black">Email:</strong> {customer?.email || selectedItem.raw?.email || "Not provided"}</div>
                </div>

                <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-2 print:bg-white print:border-black">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block print:text-black">
                    Payment & Billing Breakdown
                  </span>
                  <div><strong className="text-white print:text-black">Total Bill:</strong> ₹{selectedItem.totalAmount?.toLocaleString()}</div>
                  <div><strong className="text-white print:text-black">Advance Paid:</strong> ₹{selectedItem.advancePaid || 0}</div>
                  <div><strong className="text-white print:text-black">Balance Due:</strong> ₹{(selectedItem.totalAmount - (selectedItem.advancePaid || 0))?.toLocaleString()}</div>
                </div>
              </div>

              {/* PUBLIC-SAFE MANAGER NOTES */}
              {selectedItem.raw?.managerRemarks && (
                <div className="p-4 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-xl text-xs text-[#C5A880] print:text-black">
                  <strong className="block font-semibold mb-1">Front Desk Manager Guidance:</strong>
                  <p>{selectedItem.raw.managerRemarks}</p>
                </div>
              )}

              {/* ACTION FOOTER */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                <button
                  onClick={handlePrintConfirmation}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#C5A880] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download / Print Confirmation</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <a
                    href={`https://wa.me/919151088115?text=${encodeURIComponent(`Hello, I need assistance regarding my Booking ${selectedItem.bookingId}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 rounded-xl bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Concierge</span>
                  </a>

                  <a
                    href="tel:+919151088115"
                    className="px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4 text-[#C5A880]" />
                    <span>Call Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

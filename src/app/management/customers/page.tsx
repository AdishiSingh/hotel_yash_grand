"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  RefreshCw, 
  Crown, 
  DollarSign, 
  BedDouble, 
  UtensilsCrossed, 
  PartyPopper, 
  Phone, 
  Send, 
  Eye, 
  ShieldCheck, 
  Calendar, 
  History, 
  MessageSquare, 
  Tag, 
  Edit3, 
  Save, 
  UserCheck
} from "lucide-react";
import { motion } from "framer-motion";

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  totalSpent: number;
  visitCount: number;
  lastVisit: string;
  favouriteDishes: string[];
  isReturning: boolean;
  notes?: string | null;
  orders: any[];
  roomBookings: any[];
  banquetBookings: any[];
  bookingRequests: any[];
}

export default function CustomerCrmPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [statistics, setStatistics] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [crmFilter, setCrmFilter] = useState<string>("ALL"); // ALL, VIP, RETURNING, NEW

  // Selected Profile Drawer
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [profileTab, setProfileTab] = useState<"OVERVIEW" | "ROOMS" | "RESTAURANT" | "BANQUET" | "COMMUNICATION">("OVERVIEW");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [savingNotes, setSavingNotes] = useState<boolean>(false);

  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.set("search", searchQuery);
      if (crmFilter !== "ALL") queryParams.set("filter", crmFilter);

      const res = await fetch(`/api/management/customers?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success) {
        setCustomers(json.customers);
        setStatistics(json.statistics);
      }
    } catch (err) {
      console.error("Failed to fetch customer CRM data:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, crmFilter]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  // Handle Save Notes
  const handleSaveNotes = async (customerId: string) => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/management/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: customerNotes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        fetchCustomerData();
        setSelectedCustomer((prev) => prev ? { ...prev, notes: customerNotes } : null);
        alert("Customer preferences & notes saved to PostgreSQL!");
      }
    } catch (err) {
      console.error("Save notes error:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="space-y-8 select-none text-left font-sans">
      
      {/* HEADER & BRANDING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Customer CRM & Guest Intelligence
            </h1>
            <span className="bg-[#DFBA73]/15 text-[#DFBA73] border border-[#DFBA73]/30 text-[9.5px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Phase 6 Module</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Consolidated guest profiles, Lifetime Value (LTV) tracking, stay history, POS dining records, and VIP preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCustomerData}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#DFBA73]" />
            <span>Sync CRM Data</span>
          </button>
        </div>
      </div>

      {/* LIVE CRM STATISTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-neutral-950 border border-white/10 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Total Customers</span>
            <Users className="h-4 w-4 text-[#DFBA73]" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.totalCustomers || 0}</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">Unique guest profiles</div>
        </div>

        <div className="bg-neutral-950 border border-[#DFBA73]/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[#DFBA73]">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">VIP Guests</span>
            <Crown className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.vipCustomersCount || 0}</div>
          <div className="text-[9.5px] text-[#DFBA73]/80 font-sans">High LTV / 3+ Visits</div>
        </div>

        <div className="bg-neutral-950 border border-emerald-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Total Guest LTV</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="text-xl font-mono font-bold text-white">₹{(statistics?.totalLtv || 0).toLocaleString()}</div>
          <div className="text-[9.5px] text-emerald-300/80 font-sans">Lifetime guest spending</div>
        </div>

        <div className="bg-neutral-950 border border-blue-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Average Spend</span>
            <UserCheck className="h-4 w-4" />
          </div>
          <div className="text-xl font-mono font-bold text-white">₹{(statistics?.avgLtv || 0).toLocaleString()}</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">Per guest profile</div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-neutral-950 p-4 border border-white/10 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Phone, Booking ID, Order ID..."
            className="w-full bg-neutral-900 border border-white/10 focus:border-[#DFBA73] pl-9 pr-3 py-2 text-xs text-white outline-none rounded"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs font-mono">
          <span className="text-neutral-400">Segment:</span>
          <select
            value={crmFilter}
            onChange={(e) => setCrmFilter(e.target.value)}
            className="bg-neutral-900 border border-white/15 rounded px-3 py-1.5 text-xs text-white outline-none cursor-pointer"
          >
            <option value="ALL">All Customers</option>
            <option value="VIP">👑 VIP Guests Only</option>
            <option value="RETURNING">Returning Guests</option>
            <option value="NEW">First Time Guests</option>
          </select>
        </div>
      </div>

      {/* CUSTOMERS DIRECTORY GRID */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-neutral-500 animate-pulse">
          Loading customer CRM directory from PostgreSQL...
        </div>
      ) : customers.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-xl space-y-3">
          <Users className="h-10 w-10 text-neutral-600 mx-auto" />
          <p className="text-xs text-neutral-400 font-sans">No customer profiles match selected criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {customers.map((c) => {
            const isVip = c.visitCount >= 3 || c.totalSpent >= 20000;

            return (
              <motion.div
                key={c.id}
                whileHover={{ y: -2 }}
                className={`bg-neutral-950 border rounded-2xl p-5 space-y-4 shadow-lux transition-all text-left ${
                  isVip ? "border-[#DFBA73]/50 bg-[#DFBA73]/[0.03]" : "border-white/10"
                }`}
              >
                {/* PROFILE CARD HEADER */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border ${
                      isVip ? "bg-[#DFBA73]/20 text-[#DFBA73] border-[#DFBA73]/40" : "bg-neutral-900 text-white border-white/15"
                    }`}>
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-white">{c.name}</h3>
                        {isVip && (
                          <span className="bg-[#DFBA73]/20 text-[#DFBA73] border border-[#DFBA73]/30 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                            <Crown className="h-3 w-3" /> VIP
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-neutral-400">{c.phone}</div>
                    </div>
                  </div>
                </div>

                {/* STATS METRICS */}
                <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center bg-neutral-900/60 p-3 rounded-lg border border-white/5">
                  <div>
                    <span className="text-[9.5px] text-neutral-500 uppercase block">Lifetime LTV</span>
                    <strong className="text-[#DFBA73]">₹{c.totalSpent.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-neutral-500 uppercase block">Visits</span>
                    <strong className="text-white">{c.visitCount}</strong>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-neutral-500 uppercase block">Stays / Orders</span>
                    <strong className="text-emerald-400">{c.roomBookings.length + c.orders.length}</strong>
                  </div>
                </div>

                {/* ACTIONS & PROFILE BUTTON */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${c.phone}`}
                      className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-emerald-400 rounded"
                      title="Call Customer"
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${c.name}, greeting from Hotel Yash Grand...`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] rounded"
                      title="WhatsApp Chat"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCustomer(c);
                      setCustomerNotes(c.notes || "");
                    }}
                    className="px-4 py-2 bg-[#DFBA73]/15 hover:bg-[#DFBA73]/30 text-[#DFBA73] border border-[#DFBA73]/40 rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Profile</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* FULL CUSTOMER CRM PROFILE DRAWER MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-3xl bg-neutral-950 border border-[#DFBA73]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lux max-h-[90vh] overflow-y-auto text-left"
          >
            {/* DRAWER HEADER */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#DFBA73]/20 border border-[#DFBA73]/40 flex items-center justify-center text-[#DFBA73] font-bold text-lg">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold text-white">
                      {selectedCustomer.name}
                    </h2>
                    {(selectedCustomer.visitCount >= 3 || selectedCustomer.totalSpent >= 20000) && (
                      <span className="bg-[#DFBA73]/20 text-[#DFBA73] border border-[#DFBA73]/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <Crown className="h-3.5 w-3.5" /> VIP GUEST
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">
                    Phone: <strong>{selectedCustomer.phone}</strong> • Email: <strong>{selectedCustomer.email || "N/A"}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Close Profile [Esc]
              </button>
            </div>

            {/* PROFILE TABS */}
            <div className="flex border-b border-white/15 gap-2 font-mono text-xs overflow-x-auto">
              {[
                { id: "OVERVIEW", label: "Overview & LTV", icon: Crown },
                { id: "ROOMS", label: `Room Stays (${selectedCustomer.roomBookings.length})`, icon: BedDouble },
                { id: "RESTAURANT", label: `Restaurant POS (${selectedCustomer.orders.length})`, icon: UtensilsCrossed },
                { id: "BANQUET", label: `Banquets (${selectedCustomer.banquetBookings.length})`, icon: PartyPopper },
                { id: "COMMUNICATION", label: "Communications & Notes", icon: MessageSquare },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setProfileTab(t.id as any)}
                  className={`px-3 py-2 border-b-2 font-semibold uppercase transition-all cursor-pointer whitespace-nowrap ${
                    profileTab === t.id
                      ? "border-[#DFBA73] text-[#DFBA73] bg-neutral-900/60"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: OVERVIEW & LTV */}
            {profileTab === "OVERVIEW" && (
              <div className="space-y-6 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                  <div className="bg-neutral-900 p-4 rounded-xl border border-white/10 space-y-1">
                    <span className="text-neutral-500 text-[10px] uppercase block">Lifetime LTV</span>
                    <div className="text-2xl font-bold text-[#DFBA73]">
                      ₹{selectedCustomer.totalSpent.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-neutral-900 p-4 rounded-xl border border-white/10 space-y-1">
                    <span className="text-neutral-500 text-[10px] uppercase block">Total Visit Count</span>
                    <div className="text-2xl font-bold text-white">
                      {selectedCustomer.visitCount} Visits
                    </div>
                  </div>

                  <div className="bg-neutral-900 p-4 rounded-xl border border-white/10 space-y-1">
                    <span className="text-neutral-500 text-[10px] uppercase block">Last Visit Timestamp</span>
                    <div className="text-sm font-bold text-neutral-300">
                      {new Date(selectedCustomer.lastVisit).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* NOTES & PREFERENCES EDITOR */}
                <div className="bg-neutral-900 p-5 rounded-xl border border-white/10 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#DFBA73] flex items-center gap-1.5">
                    <Edit3 className="h-4 w-4" />
                    <span>Customer Preferences & Manager Notes</span>
                  </h4>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={3}
                    placeholder="e.g. VIP guest prefer high floor rooms, vegetarian Awadhi meals only, airport pickup requested."
                    className="w-full bg-neutral-950 border border-white/15 p-3 rounded-lg text-xs text-white outline-none resize-none"
                  />
                  <button
                    disabled={savingNotes}
                    onClick={() => handleSaveNotes(selectedCustomer.id)}
                    className="px-4 py-2 bg-[#DFBA73] hover:bg-[#c5a880] text-black font-bold text-xs uppercase tracking-wider rounded cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{savingNotes ? "Saving to DB..." : "Save Preferences"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ROOM STAYS */}
            {profileTab === "ROOMS" && (
              <div className="space-y-3 font-mono text-xs">
                {selectedCustomer.roomBookings.length === 0 ? (
                  <p className="text-neutral-500 text-xs py-6 text-center font-sans">No room stay history for this guest.</p>
                ) : (
                  selectedCustomer.roomBookings.map((bk) => (
                    <div key={bk.id} className="p-4 bg-neutral-900 rounded-xl border border-white/10 flex justify-between items-center">
                      <div>
                        <div className="text-[#DFBA73] font-bold">{bk.bookingId} • Room {bk.room?.roomNumber || "101"}</div>
                        <div className="text-neutral-400 text-[11.5px]">
                          {new Date(bk.checkIn).toLocaleDateString()} → {new Date(bk.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">₹{bk.totalAmount}</div>
                        <span className="text-[9.5px] uppercase font-bold text-emerald-400">{bk.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT: RESTAURANT ORDERS */}
            {profileTab === "RESTAURANT" && (
              <div className="space-y-3 font-mono text-xs">
                {selectedCustomer.orders.length === 0 ? (
                  <p className="text-neutral-500 text-xs py-6 text-center font-sans">No dining POS orders for this guest.</p>
                ) : (
                  selectedCustomer.orders.map((ord) => (
                    <div key={ord.id} className="p-4 bg-neutral-900 rounded-xl border border-white/10 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#DFBA73] font-bold">{ord.orderId} (Table {ord.tableNumber || "POS"})</span>
                        <span className="text-emerald-400 font-bold">₹{ord.grandTotal}</span>
                      </div>
                      <div className="text-neutral-400 text-[11px]">
                        Dishes: {ord.items.map((i: any) => `${i.itemName} (x${i.quantity})`).join(", ")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </motion.div>
        </div>
      )}

    </div>
  );
}

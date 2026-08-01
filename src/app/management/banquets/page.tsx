"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  PartyPopper, 
  Calendar, 
  User, 
  Phone, 
  Send, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  RefreshCw, 
  Eye, 
  ShieldCheck, 
  DollarSign, 
  Building, 
  Sparkles, 
  FileText, 
  History,
  Check
} from "lucide-react";
import { motion } from "framer-motion";

export default function BanquetManagementPage() {
  const [activeTab, setActiveTab] = useState<"NEW" | "CONFIRMED" | "UPCOMING" | "COMPLETED">("NEW");
  const [requests, setRequests] = useState<any[]>([]);
  const [confirmedEvents, setConfirmedEvents] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [completedEvents, setCompletedEvents] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Profile Drawer
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [assignedManagerName, setAssignedManagerName] = useState<string>("Manager B - Banquet Desk");

  const fetchBanquetData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.set("search", searchQuery);

      const res = await fetch(`/api/management/banquets?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRequests(json.requests);
        setConfirmedEvents(json.confirmedEvents);
        setUpcomingEvents(json.upcomingEvents);
        setCompletedEvents(json.completedEvents);
        setStatistics(json.statistics);
      }
    } catch (err) {
      console.error("Failed to fetch banquet management data:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchBanquetData();
  }, [fetchBanquetData]);

  // Handle Event Status Update
  const handleUpdateStatus = async (eventId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/management/banquets/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-banquet-status",
          status: newStatus,
        }),
      });

      const json = await res.json();
      if (json.success) {
        fetchBanquetData();
        setSelectedEvent(null);
      } else {
        alert(json.error || "Failed to update event status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Handle Manager Assignment
  const handleAssignManager = async (eventId: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/management/banquets/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assign-banquet-manager",
          managerName: assignedManagerName,
        }),
      });

      const json = await res.json();
      if (json.success) {
        fetchBanquetData();
        alert("Manager assigned successfully!");
      }
    } catch (err) {
      console.error("Manager assignment error:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8 select-none text-left font-sans">
      
      {/* HEADER & BRANDING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Banquet & Ceremonial Event Operations
            </h1>
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9.5px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Phase 5 Module</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Complete management for Weddings, Receptions, Corporate Galas, Catering packages, and Manager assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBanquetData}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-purple-400" />
            <span>Sync Banquet Data</span>
          </button>
        </div>
      </div>

      {/* LIVE BANQUET STATISTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-neutral-950 border border-purple-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Total Inquiries</span>
            <PartyPopper className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.totalRequests || 0}</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">All recorded events</div>
        </div>

        <div className="bg-neutral-950 border border-amber-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Pending Approval</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.pendingRequestsCount || 0}</div>
          <div className="text-[9.5px] text-amber-300/80 font-sans">Inquiries awaiting review</div>
        </div>

        <div className="bg-neutral-950 border border-emerald-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Confirmed Events</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.confirmedCount || 0}</div>
          <div className="text-[9.5px] text-emerald-300/80 font-sans">Booked & approved</div>
        </div>

        <div className="bg-neutral-950 border border-blue-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Completed Events</span>
            <Calendar className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.completedCount || 0}</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">Successfully hosted</div>
        </div>

        <div className="bg-neutral-950 border border-[#DFBA73]/30 p-4 rounded-xl space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#DFBA73]">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Event Revenue</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="text-xl font-mono font-bold text-white">₹{(statistics?.totalRevenue || 0).toLocaleString()}</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">Pipeline & confirmed value</div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex border-b border-white/15 gap-2 font-mono text-xs overflow-x-auto">
        {[
          { id: "NEW", label: "New Requests", icon: Clock, badge: requests.filter((r) => r.status === "PENDING").length },
          { id: "CONFIRMED", label: "Confirmed Events", icon: CheckCircle2, badge: confirmedEvents.length },
          { id: "UPCOMING", label: "Upcoming Schedule", icon: Calendar, badge: upcomingEvents.length },
          { id: "COMPLETED", label: "Completed Events", icon: Sparkles, badge: completedEvents.length },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-3 border-b-2 font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-[#DFBA73] text-[#DFBA73] bg-neutral-900/60"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{t.label}</span>
              {Boolean(t.badge) && (
                <span className="bg-neutral-900 border border-white/15 text-neutral-300 text-[9.5px] px-1.5 py-0.2 rounded-full">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-neutral-950 p-4 border border-white/10 rounded-xl flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Organizer, Mobile, Event Category..."
            className="w-full bg-neutral-900 border border-white/10 focus:border-[#DFBA73] pl-9 pr-3 py-2 text-xs text-white outline-none rounded"
          />
        </div>
      </div>

      {/* TAB CONTENT: NEW REQUESTS TABLE */}
      {activeTab === "NEW" && (
        <div className="overflow-x-auto bg-neutral-950 border border-white/10 rounded-xl shadow-lux">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-neutral-900/90 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Organizer Name</th>
                <th className="py-3.5 px-4">Mobile / WhatsApp</th>
                <th className="py-3.5 px-4">Event Category</th>
                <th className="py-3.5 px-4">Event Date</th>
                <th className="py-3.5 px-4">Guests</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-200 font-mono">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500 font-sans">
                    No new banquet inquiries found.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3.5 px-4 text-[#DFBA73] font-bold">{r.requestId}</td>
                    <td className="py-3.5 px-4 font-sans font-medium text-white">{r.guestName}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span>{r.mobile}</span>
                        <a
                          href={`https://wa.me/${r.mobile.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${r.guestName}, regarding your Banquet Event request (${r.requestId}) at Hotel Yash Grand...`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 bg-[#25D366]/20 text-[#25D366] rounded"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-purple-300">{r.eventType || "Grand Event"}</td>
                    <td className="py-3.5 px-4 text-[#DFBA73]">
                      {r.eventDate ? new Date(r.eventDate).toLocaleDateString() : "TBD"}
                    </td>
                    <td className="py-3.5 px-4">{r.guestsCount || 100} Guests</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[9.5px] uppercase font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedEvent(r)}
                        className="px-3 py-1.5 bg-[#DFBA73]/15 text-[#DFBA73] border border-[#DFBA73]/40 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer ml-auto"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Event Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: CONFIRMED EVENTS TABLE */}
      {activeTab === "CONFIRMED" && (
        <div className="overflow-x-auto bg-neutral-950 border border-white/10 rounded-xl shadow-lux">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-neutral-900/90 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
              <tr>
                <th className="py-3.5 px-4">Enquiry ID</th>
                <th className="py-3.5 px-4">Organizer</th>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Event Date</th>
                <th className="py-3.5 px-4">Guests</th>
                <th className="py-3.5 px-4">Budget Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-200 font-mono">
              {confirmedEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3.5 px-4 text-[#DFBA73] font-bold">{evt.enquiryId}</td>
                  <td className="py-3.5 px-4 font-sans font-medium text-white">{evt.customerName}</td>
                  <td className="py-3.5 px-4 font-sans text-purple-300">{evt.eventType}</td>
                  <td className="py-3.5 px-4 text-[#DFBA73]">{new Date(evt.eventDate).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4">{evt.guestsCount} Guests</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">₹{evt.budget}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[9.5px] uppercase font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {evt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleUpdateStatus(evt.id, "COMPLETED")}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-[11px] cursor-pointer ml-auto flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Mark Completed</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EVENT PROFILE MODAL DRAWER */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-2xl bg-neutral-950 border border-purple-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lux max-h-[90vh] overflow-y-auto text-left"
          >
            {/* DRAWER HEADER */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-[#DFBA73] font-bold">
                    {selectedEvent.requestId || selectedEvent.enquiryId}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {selectedEvent.eventType || "Banquet Gala"}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-bold text-white mt-1">
                  Organizer: {selectedEvent.guestName || selectedEvent.customerName} ({selectedEvent.mobile || selectedEvent.customerPhone})
                </h2>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Close [Esc]
              </button>
            </div>

            {/* STATUS & MANAGER ASSIGNMENT TOOLBAR */}
            <div className="bg-neutral-900 p-4 rounded-xl border border-white/10 space-y-3 text-xs font-sans">
              <span className="text-[10px] uppercase tracking-wider text-purple-300 font-bold block">
                Update Status & Manager Assignment
              </span>

              <div className="flex flex-wrap gap-2">
                {[
                  { status: "PENDING", label: "Pending" },
                  { status: "CONTACTED", label: "Contacted" },
                  { status: "BOOKED", label: "Confirmed / Booked" },
                  { status: "COMPLETED", label: "Completed" },
                  { status: "CANCELLED", label: "Cancelled" },
                ].map((s) => (
                  <button
                    key={s.status}
                    disabled={updating}
                    onClick={() => handleUpdateStatus(selectedEvent.id, s.status)}
                    className={`px-3 py-1.5 rounded font-mono text-[11px] font-bold transition-all cursor-pointer ${
                      selectedEvent.status === s.status
                        ? "bg-purple-500 text-white shadow-md"
                        : "bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-white/15"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <select
                  value={assignedManagerName}
                  onChange={(e) => setAssignedManagerName(e.target.value)}
                  className="bg-neutral-950 border border-white/20 text-xs text-white rounded p-1.5 outline-none font-mono"
                >
                  <option value="Manager B - Banquet Desk">Manager B - Banquet Desk</option>
                  <option value="Manager C - Special Events Lead">Manager C - Special Events Lead</option>
                </select>
                <button
                  onClick={() => handleAssignManager(selectedEvent.id)}
                  className="px-3 py-1.5 bg-[#DFBA73] text-black font-bold text-[11px] rounded cursor-pointer"
                >
                  Assign Manager
                </button>
              </div>
            </div>

            {/* EVENT SPECIFICATIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-neutral-900 p-4 rounded-lg border border-white/5 space-y-1">
                <span className="text-neutral-500 text-[10px] uppercase">Preferred Ballroom / Hall</span>
                <div className="text-white font-bold text-sm">{selectedEvent.hallName || "Grand Yash Ballroom"}</div>
                <div className="text-neutral-400">Capacity: {selectedEvent.guestsCount || 200} Guests</div>
              </div>

              <div className="bg-neutral-900 p-4 rounded-lg border border-white/5 space-y-1">
                <span className="text-neutral-500 text-[10px] uppercase">Financial Summary</span>
                <div className="text-[#DFBA73] font-bold text-sm">Total Budget: ₹{selectedEvent.totalAmount || selectedEvent.budget || 50000}</div>
                <div className="text-neutral-400">Advance Paid: ₹{selectedEvent.advanceAmount || 0}</div>
              </div>
            </div>

            {/* SPECIAL REQUIREMENTS */}
            {selectedEvent.specialRequest && (
              <div className="bg-neutral-900/60 p-4 rounded-lg border border-white/5 text-xs text-neutral-300 font-sans">
                <span className="text-purple-300 font-bold">Decoration & Catering Requirements: </span>
                <span>{selectedEvent.specialRequest}</span>
              </div>
            )}

          </motion.div>
        </div>
      )}

    </div>
  );
}

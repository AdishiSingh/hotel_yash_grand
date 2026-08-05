"use client";

import * as React from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Send, 
  AlertTriangle, 
  Calendar, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Clock,
  BedDouble,
  PartyPopper,
  DollarSign,
  UserCheck,
  Building,
  Filter,
  Eye,
  FileText,
  MessageSquare,
  Mail,
  MapPin,
  Receipt,
  User,
  History,
  Tag,
  Share2,
  Copy,
  PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookingRequestRecord {
  id: string;
  requestId: string;
  type: "ROOM" | "BANQUET";
  guestName: string;
  mobile: string;
  email?: string | null;
  roomType?: string | null;
  eventType?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  eventDate?: string | null;
  adults: number;
  children: number;
  guestsCount?: number | null;
  preferredFloor?: string | null;
  arrivalTime?: string | null;
  celebrationType?: string | null;
  specialRequest?: string | null;
  status: string;
  requestedAt: string;
  approvedAt?: string | null;
  approvedBy?: string | null;
  managerRemarks?: string | null;
  rejectionReason?: string | null;
  paymentStatus: string;
  advanceAmount: number;
  totalAmount: number;
  assignedRoomNumber?: string | null;
  assignedManager?: string | null;
  assignedManagerRole?: string | null;
  isFollowUpRequired?: boolean;
  followUpAt?: string | null;
  guestPortalToken?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  customer?: any;
  communicationLogs?: any[];
  managerNotes?: any[];
}

export default function ReservationCenterPage() {
  const [activeTab, setActiveTab] = React.useState<"DASHBOARD" | "ROOM" | "BANQUET" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "CRM">("DASHBOARD");
  const [requests, setRequests] = React.useState<BookingRequestRecord[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [occupancyStats, setOccupancyStats] = React.useState<any | null>(null);

  // Selected Booking for Full Profile Drawer / Modal
  const [selectedBookingId, setSelectedBookingId] = React.useState<string | null>(null);
  const [bookingProfile, setBookingProfile] = React.useState<any | null>(null);
  const [profileLoading, setProfileLoading] = React.useState<boolean>(false);
  const [modalTab, setModalTab] = React.useState<"OVERVIEW" | "COMMUNICATION" | "NOTES" | "AI_ASSIST" | "PAYMENT">("OVERVIEW");

  // Interactive Form Inputs inside Profile Drawer
  const [newCommChannel, setNewCommChannel] = React.useState<string>("CALL");
  const [newCommNotes, setNewCommNotes] = React.useState<string>("");
  const [newCommDuration, setNewCommDuration] = React.useState<number>(3);
  const [newCommStatus, setNewCommStatus] = React.useState<string>("Interested");

  const [newNoteContent, setNewNoteContent] = React.useState<string>("");
  const [newNoteCategory, setNewNoteCategory] = React.useState<string>("GENERAL");

  const [assignedManagerName, setAssignedManagerName] = React.useState<string>("Manager A - Front Desk");
  const [assignedManagerRole, setAssignedManagerRole] = React.useState<string>("RECEPTION");

  // Approval / Rejection Action States
  const [approvingReq, setApprovingReq] = React.useState<BookingRequestRecord | null>(null);
  const [assignedRoomNumber, setAssignedRoomNumber] = React.useState<string>("101");
  const [advanceAmount, setAdvanceAmount] = React.useState<number>(2000);
  const [totalAmount, setTotalAmount] = React.useState<number>(5000);
  const [managerRemarks, setManagerRemarks] = React.useState<string>("");
  const [approvalResult, setApprovalResult] = React.useState<any | null>(null);

  const [rejectingReq, setRejectingReq] = React.useState<BookingRequestRecord | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState<string>("Rooms unavailable for requested dates");

  const fetchRequests = React.useCallback(async () => {
    try {
      setLoading(true);
      const url = `/api/booking-requests?search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const text = await res.text();
      let json: any = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch (e) {
        json = { success: false, error: "Invalid server response format." };
      }
      if (res.ok && json.success) {
        setRequests(json.requests);
        setOccupancyStats(json.occupancyStats);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  React.useEffect(() => {
    fetchRequests();

    // Subscribe to realtime database event bus
    const handleRealtimeEvent = (payload: any) => {
      if (
        payload.type === "BOOKING_REQUEST_UPDATED" ||
        payload.type === "BOOKING_UPDATED" ||
        payload.type === "DASHBOARD_REFRESH"
      ) {
        fetchRequests();
      }
    };

    const { realtimeBus } = require("@/lib/events");
    realtimeBus.on("event", handleRealtimeEvent);

    // Periodic 15-second revalidation timer
    const interval = setInterval(fetchRequests, 15000);

    return () => {
      realtimeBus.off("event", handleRealtimeEvent);
      clearInterval(interval);
    };
  }, [fetchRequests]);

  // Load Detailed Booking Profile
  const loadBookingProfile = async (id: string) => {
    try {
      setSelectedBookingId(id);
      setProfileLoading(true);
      const res = await fetch(`/api/booking-requests/${id}`);
      const json = await res.json();
      if (json.success) {
        setBookingProfile(json);
        setAssignedManagerName(json.request.assignedManager || "Manager A - Front Desk");
        setAssignedManagerRole(json.request.assignedManagerRole || "RECEPTION");
      }
    } catch (err) {
      console.error("Failed to load booking profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Submit Communication Log
  const handleAddCommLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !newCommNotes.trim()) return;

    try {
      const res = await fetch(`/api/booking-requests/${selectedBookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "log-comm",
          managerName: assignedManagerName,
          channel: newCommChannel,
          duration: Number(newCommDuration),
          status: newCommStatus,
          notes: newCommNotes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setNewCommNotes("");
        loadBookingProfile(selectedBookingId);
      }
    } catch (err) {
      console.error("Comm log error:", err);
    }
  };

  // Submit Manager Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !newNoteContent.trim()) return;

    try {
      const res = await fetch(`/api/booking-requests/${selectedBookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-note",
          author: assignedManagerName,
          category: newNoteCategory,
          content: newNoteContent,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setNewNoteContent("");
        loadBookingProfile(selectedBookingId);
      }
    } catch (err) {
      console.error("Add note error:", err);
    }
  };

  // Update Assigned Manager
  const handleAssignManager = async () => {
    if (!selectedBookingId) return;

    try {
      await fetch(`/api/booking-requests/${selectedBookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assign-manager",
          managerName: assignedManagerName,
          managerRole: assignedManagerRole,
        }),
      });
      loadBookingProfile(selectedBookingId);
      fetchRequests();
    } catch (err) {
      console.error("Assign manager error:", err);
    }
  };

  // Submit Approval
  const handleConfirmApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingReq) return;

    try {
      const res = await fetch(`/api/booking-requests/${approvingReq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          assignedRoomNumber,
          advanceAmount: Number(advanceAmount),
          totalAmount: Number(totalAmount),
          managerRemarks,
          managerName: assignedManagerName,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setApprovalResult(json);
        setApprovingReq(null);
        fetchRequests();
        if (selectedBookingId === approvingReq.id) {
          loadBookingProfile(approvingReq.id);
        }
      } else {
        alert(json.error || "Approval failed");
      }
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  // Submit Rejection
  const handleConfirmRejection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingReq) return;

    try {
      const res = await fetch(`/api/booking-requests/${rejectingReq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          rejectionReason,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setRejectingReq(null);
        fetchRequests();
        if (selectedBookingId === rejectingReq.id) {
          loadBookingProfile(rejectingReq.id);
        }
      }
    } catch (err) {
      console.error("Rejection error:", err);
    }
  };

  // Filter requests based on tab & search
  const filteredRequests = requests.filter((r) => {
    if (activeTab === "ROOM" && r.type !== "ROOM") return false;
    if (activeTab === "BANQUET" && r.type !== "BANQUET") return false;
    if (activeTab === "CONFIRMED" && r.status !== "APPROVED" && r.status !== "CONFIRMED") return false;
    if (activeTab === "CANCELLED" && r.status !== "REJECTED" && r.status !== "CANCELLED") return false;
    if (activeTab === "COMPLETED" && r.status !== "CHECKED_OUT" && r.status !== "COMPLETED") return false;
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    return true;
  });

  // KPI Computations
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const contactedCount = requests.filter((r) => r.status === "CONTACTED").length;
  const negotiationCount = requests.filter((r) => r.status === "NEGOTIATION").length;
  const awaitingPaymentCount = requests.filter((r) => r.status === "PAYMENT_PENDING").length;
  const confirmedTodayCount = requests.filter((r) => (r.status === "APPROVED" || r.status === "CONFIRMED") && new Date(r.updatedAt || r.requestedAt || Date.now()).toDateString() === new Date().toDateString()).length;
  const expectedRevenue = requests.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  return (
    <div className="space-y-8 select-none text-left font-sans">
      
      {/* BRAND & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Central Reservation Center
            </h1>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Hotel ERP CRM</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Single operational command center for Room Stay Reservations, Banquet Events, Customer CRM, and Multi-Manager Approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-200 text-xs font-semibold rounded transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#DFBA73]" />
            <span>Sync DB</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS BAR */}
      <div className="flex border-b border-white/15 overflow-x-auto gap-2 pb-0 font-mono text-xs">
        {[
          { id: "DASHBOARD", label: "Dashboard KPIs", icon: Calendar },
          { id: "ROOM", label: "Room Requests", icon: BedDouble, badge: requests.filter((r) => r.type === "ROOM" && r.status === "PENDING").length },
          { id: "BANQUET", label: "Banquet Requests", icon: PartyPopper, badge: requests.filter((r) => r.type === "BANQUET" && r.status === "PENDING").length },
          { id: "CONFIRMED", label: "Confirmed Bookings", icon: CheckCircle2, badge: requests.filter((r) => r.status === "APPROVED" || r.status === "CONFIRMED").length },
          { id: "CANCELLED", label: "Cancelled / Rejected", icon: XCircle },
          { id: "COMPLETED", label: "Completed Stays", icon: UserCheck },
          { id: "CRM", label: "Customer CRM", icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 border-b-2 font-semibold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-[#DFBA73] text-[#DFBA73] bg-neutral-900/60"
                  : "border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/30"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {Boolean(tab.badge) && (
                <span className="bg-amber-500 text-black text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: RESERVATION DASHBOARD KPIS */}
      {activeTab === "DASHBOARD" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-neutral-950 border border-amber-500/30 p-4 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-[9.5px] uppercase tracking-widest font-bold">Pending Approval</span>
                <Clock className="h-4 w-4" />
              </div>
              <div className="text-2xl font-mono font-bold text-white">{pendingCount}</div>
              <div className="text-[9.5px] text-amber-300/80 font-sans">Requires manager action</div>
            </div>

            <div className="bg-neutral-950 border border-blue-500/30 p-4 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-blue-400">
                <span className="text-[9.5px] uppercase tracking-widest font-bold">Contacted Guests</span>
                <Phone className="h-4 w-4" />
              </div>
              <div className="text-2xl font-mono font-bold text-white">{contactedCount}</div>
              <div className="text-[9.5px] text-neutral-400 font-sans">Calls & WhatsApp active</div>
            </div>

            <div className="bg-neutral-950 border border-purple-500/30 p-4 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-purple-400">
                <span className="text-[9.5px] uppercase tracking-widest font-bold">Negotiation</span>
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="text-2xl font-mono font-bold text-white">{negotiationCount}</div>
              <div className="text-[9.5px] text-neutral-400 font-sans">Pricing & terms discussion</div>
            </div>

            <div className="bg-neutral-950 border border-yellow-500/30 p-4 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-yellow-400">
                <span className="text-[9.5px] uppercase tracking-widest font-bold">Awaiting Payment</span>
                <DollarSign className="h-4 w-4" />
              </div>
              <div className="text-2xl font-mono font-bold text-white">{awaitingPaymentCount}</div>
              <div className="text-[9.5px] text-neutral-400 font-sans">Advance link dispatched</div>
            </div>

            <div className="bg-neutral-950 border border-emerald-500/30 p-4 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-[9.5px] uppercase tracking-widest font-bold">Confirmed Today</span>
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="text-2xl font-mono font-bold text-white">{confirmedTodayCount}</div>
              <div className="text-[9.5px] text-emerald-300/80 font-sans">Approved & booked</div>
            </div>

            <div className="bg-neutral-950 border border-[#DFBA73]/30 p-4 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-[#DFBA73]">
                <span className="text-[9.5px] uppercase tracking-widest font-bold">Expected Revenue</span>
                <Receipt className="h-4 w-4" />
              </div>
              <div className="text-xl font-mono font-bold text-white">₹{expectedRevenue.toLocaleString()}</div>
              <div className="text-[9.5px] text-neutral-400 font-sans">Pipeline value</div>
            </div>
          </div>

          {/* ROOM AVAILABILITY & OCCUPANCY HIGHLIGHT */}
          <div className="bg-neutral-950 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-widest text-[#DFBA73] font-bold block">
                ROOM OCCUPANCY & AVAILABILITY ENGINE
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                Live Hotel Occupancy: {occupancyStats?.occupancyRate || 0}%
              </h3>
              <p className="text-xs text-neutral-400 font-sans max-w-lg">
                Total Rooms: <strong>{occupancyStats?.totalRooms || 0}</strong> • Occupied: <strong className="text-amber-400">{occupancyStats?.occupiedRooms || 0}</strong> • Available: <strong className="text-emerald-400">{occupancyStats?.availableRooms || 0}</strong>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab("ROOM")}
                className="px-5 py-3 bg-[#DFBA73] hover:bg-[#c5a880] text-black font-bold text-xs uppercase tracking-wider rounded shadow-lux transition-all cursor-pointer"
              >
                Manage Room Requests →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-neutral-950 p-4 border border-white/10 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Guest Name, Phone, Request ID..."
            className="w-full bg-neutral-900 border border-white/10 focus:border-[#DFBA73] pl-9 pr-3 py-2 text-xs text-white outline-none rounded"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs font-mono">
          <span className="text-neutral-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-900 border border-white/15 rounded px-3 py-1.5 text-xs text-white outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="CONTACTED">Contacted</option>
            <option value="NEGOTIATION">Negotiation</option>
            <option value="APPROVED">Approved</option>
            <option value="PAYMENT_PENDING">Payment Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* BOOKING REQUEST TABLE */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-neutral-500 animate-pulse">
          Loading reservation dataset from PostgreSQL...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-xl space-y-3">
          <Calendar className="h-10 w-10 text-neutral-600 mx-auto" />
          <p className="text-xs text-neutral-400 font-sans">No reservation requests match selected filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-neutral-950 border border-white/10 rounded-xl shadow-lux">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-neutral-900/90 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
              <tr>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Phone / WhatsApp</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Check-in / Event Date</th>
                <th className="py-3.5 px-4">Guests</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Manager</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-neutral-200 font-mono">
              {filteredRequests.map((r) => {
                const isPending = r.status === "PENDING";
                const isApproved = r.status === "APPROVED" || r.status === "CONFIRMED";
                const isRejected = r.status === "REJECTED";

                return (
                  <tr key={r.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3.5 px-4 text-[#DFBA73] font-bold">
                      {r.requestId}
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-white">
                      {r.guestName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span>{r.mobile}</span>
                        <a
                          href={`https://wa.me/${r.mobile.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${r.guestName}, regarding request #${r.requestId} at Hotel Yash Grand...`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 bg-[#25D366]/20 hover:bg-[#25D366]/40 text-[#25D366] rounded cursor-pointer"
                          title="WhatsApp Chat"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      {r.type === "ROOM" ? (r.roomType || "Single Deluxe") : (r.eventType || "Grand Event")}
                    </td>
                    <td className="py-3.5 px-4 text-[#DFBA73]">
                      {r.type === "ROOM" 
                        ? `${r.checkIn ? new Date(r.checkIn).toLocaleDateString() : "N/A"}`
                        : (r.eventDate ? new Date(r.eventDate).toLocaleDateString() : "N/A")}
                    </td>
                    <td className="py-3.5 px-4">
                      {r.type === "ROOM" ? `${r.adults} Adults` : `${r.guestsCount || 100} Guests`}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                        isPending
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                          : isApproved
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : isRejected
                          ? "bg-red-500/20 text-red-300 border-red-500/40"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      }`}>
                        {r.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-xs text-neutral-400">
                      {r.assignedManager || "Manager A - Front Desk"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => loadBookingProfile(r.id)}
                          className="px-3 py-1.5 bg-[#DFBA73]/15 hover:bg-[#DFBA73]/30 text-[#DFBA73] border border-[#DFBA73]/40 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Profile</span>
                        </button>
                        {!isApproved && !isRejected && (
                          <button
                            onClick={() => {
                              setApprovingReq(r);
                              setTotalAmount(r.type === "ROOM" ? 5000 : 50000);
                              setAdvanceAmount(2000);
                            }}
                            className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded text-[11px] cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* FULL BOOKING DETAILS PROFILE MODAL DRAWER */}
      {selectedBookingId && bookingProfile && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-4xl bg-neutral-950 border border-[#DFBA73]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lux max-h-[90vh] overflow-y-auto text-left"
          >
            {/* DRAWER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-[#DFBA73] font-bold">
                    {bookingProfile.request.requestId}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {bookingProfile.request.status.replace("_", " ")}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-white mt-1">
                  {bookingProfile.request.guestName}
                </h2>
                <p className="text-xs text-neutral-400 font-sans">
                  Mobile: <strong>{bookingProfile.request.mobile}</strong> • Category: <strong>{bookingProfile.request.type}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedBookingId(null)}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded cursor-pointer"
                >
                  Close Profile [Esc]
                </button>
              </div>
            </div>

            {/* PROFILE TABS */}
            <div className="flex border-b border-white/15 gap-2 font-mono text-xs">
              {[
                { id: "OVERVIEW", label: "Overview & CRM", icon: User },
                { id: "COMMUNICATION", label: "Communication Center", icon: MessageSquare },
                { id: "NOTES", label: "Manager Notes", icon: FileText },
                { id: "AI_ASSIST", label: "SADYA AI Brief", icon: Sparkles },
                { id: "PAYMENT", label: "Payment & Portal", icon: DollarSign },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setModalTab(t.id as any)}
                  className={`px-3 py-2 border-b-2 font-semibold uppercase transition-all cursor-pointer ${
                    modalTab === t.id
                      ? "border-[#DFBA73] text-[#DFBA73] bg-neutral-900/60"
                      : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: OVERVIEW & CRM */}
            {modalTab === "OVERVIEW" && (
              <div className="space-y-6 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                  <div className="bg-neutral-900 p-4 rounded-lg border border-white/5 space-y-1">
                    <span className="text-neutral-500 text-[10px] uppercase">Dates & Schedule</span>
                    <div className="text-[#DFBA73] font-bold text-sm">
                      {bookingProfile.request.type === "ROOM"
                        ? `${new Date(bookingProfile.request.checkIn).toLocaleDateString()} → ${new Date(bookingProfile.request.checkOut).toLocaleDateString()}`
                        : new Date(bookingProfile.request.eventDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="bg-neutral-900 p-4 rounded-lg border border-white/5 space-y-1">
                    <span className="text-neutral-500 text-[10px] uppercase">Guests & Special Request</span>
                    <div className="text-white font-bold text-sm">
                      {bookingProfile.request.adults} Adults, {bookingProfile.request.children} Children
                    </div>
                    <div className="text-neutral-400 font-sans text-xs">{bookingProfile.request.specialRequest || "No special requests"}</div>
                  </div>

                  <div className="bg-neutral-900 p-4 rounded-lg border border-white/5 space-y-1">
                    <span className="text-neutral-500 text-[10px] uppercase">Manager Assignment</span>
                    <div className="flex items-center gap-2 mt-1">
                      <select
                        value={assignedManagerName}
                        onChange={(e) => setAssignedManagerName(e.target.value)}
                        className="bg-neutral-950 border border-white/20 text-xs text-white rounded p-1 outline-none"
                      >
                        <option value="Manager A - Front Desk">Manager A - Front Desk</option>
                        <option value="Manager B - Banquet Desk">Manager B - Banquet Desk</option>
                        <option value="Manager C - Restaurant VIP">Manager C - Restaurant VIP</option>
                        <option value="Manager D - Accounts">Manager D - Accounts</option>
                      </select>
                      <button
                        onClick={handleAssignManager}
                        className="px-2 py-1 bg-[#DFBA73] text-black font-bold text-[10px] rounded cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                {/* TIMELINE LIFECYCLE AUDIT */}
                <div className="space-y-3">
                  <h4 className="font-serif text-sm font-bold text-[#DFBA73] border-b border-white/10 pb-1.5 flex items-center gap-1.5">
                    <History className="h-4 w-4" />
                    <span>Booking Lifecycle Timeline</span>
                  </h4>
                  <div className="space-y-2 font-mono text-[11px]">
                    {bookingProfile.request.communicationLogs?.map((log: any, i: number) => (
                      <div key={log.id} className="p-3 bg-neutral-900/60 rounded border border-white/5 flex justify-between items-center">
                        <div>
                          <span className="text-[#DFBA73] font-bold">[{log.channel}] </span>
                          <span className="text-white">{log.notes} </span>
                          <span className="text-neutral-500">by {log.managerName}</span>
                        </div>
                        <span className="text-neutral-500 text-[10px]">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: COMMUNICATION CENTER */}
            {modalTab === "COMMUNICATION" && (
              <div className="space-y-6 text-xs font-sans">
                {/* Communication Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <a
                    href={`tel:${bookingProfile.request.mobile}`}
                    className="p-3 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-white rounded font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="h-4 w-4 text-emerald-400" />
                    <span>📞 Call Guest</span>
                  </a>

                  <a
                    href={`https://wa.me/${bookingProfile.request.mobile.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${bookingProfile.request.guestName}, regarding request #${bookingProfile.request.requestId} at Hotel Yash Grand...`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] rounded font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>💬 WhatsApp Guest</span>
                  </a>

                  <a
                    href={`mailto:${bookingProfile.request.email || "guest@email.com"}`}
                    className="p-3 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-white rounded font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mail className="h-4 w-4 text-blue-400" />
                    <span>📧 Email Guest</span>
                  </a>
                </div>

                {/* Log New Communication */}
                <form onSubmit={handleAddCommLog} className="bg-neutral-900 p-4 rounded-xl space-y-3 border border-white/10">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#DFBA73]">
                    Log Guest Interaction
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-neutral-400 block">Channel</label>
                      <select
                        value={newCommChannel}
                        onChange={(e) => setNewCommChannel(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/15 p-2 rounded text-xs text-white outline-none"
                      >
                        <option value="CALL">Phone Call</option>
                        <option value="WHATSAPP">WhatsApp Chat</option>
                        <option value="EMAIL">Email Sent</option>
                        <option value="QUOTATION">Quotation Dispatched</option>
                        <option value="INVOICE">Invoice Dispatched</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 block">Call Outcome / Status</label>
                      <select
                        value={newCommStatus}
                        onChange={(e) => setNewCommStatus(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/15 p-2 rounded text-xs text-white outline-none"
                      >
                        <option value="Interested">Interested / Follow up</option>
                        <option value="No Answer">No Answer / Call back later</option>
                        <option value="Quotation Sent">Quotation Sent</option>
                        <option value="Payment Link Sent">Payment Link Dispatched</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-400 block">Duration (Mins)</label>
                      <input
                        type="number"
                        value={newCommDuration}
                        onChange={(e) => setNewCommDuration(Number(e.target.value))}
                        className="w-full bg-neutral-950 border border-white/15 p-2 rounded text-xs text-white outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 block">Interaction Notes</label>
                    <textarea
                      value={newCommNotes}
                      onChange={(e) => setNewCommNotes(e.target.value)}
                      rows={2}
                      placeholder="e.g. Guest inquired about early check-in and breakfast inclusions."
                      className="w-full bg-neutral-950 border border-white/15 p-2 rounded text-xs text-white outline-none resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded cursor-pointer"
                  >
                    Save Interaction Log
                  </button>
                </form>
              </div>
            )}

            {/* TAB CONTENT: MANAGER NOTES */}
            {modalTab === "NOTES" && (
              <div className="space-y-6 text-xs font-sans">
                <form onSubmit={handleAddNote} className="bg-neutral-900 p-4 rounded-xl space-y-3 border border-white/10">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#DFBA73]">
                    Add Private Manager Note
                  </h4>

                  <div className="flex gap-3">
                    <div className="w-48">
                      <label className="text-[10px] text-neutral-400 block">Category</label>
                      <select
                        value={newNoteCategory}
                        onChange={(e) => setNewNoteCategory(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/15 p-2 rounded text-xs text-white outline-none"
                      >
                        <option value="GENERAL">General Note</option>
                        <option value="VIP">VIP Guest Request</option>
                        <option value="LATE_ARRIVAL">Late Arrival</option>
                        <option value="DIETARY">Dietary Preference</option>
                        <option value="PICKUP">Airport / Railway Pickup</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="text-[10px] text-neutral-400 block">Private Note Content</label>
                      <input
                        type="text"
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="e.g. Arriving late by train at 10 PM. Prepare room key in advance."
                        className="w-full bg-neutral-950 border border-white/15 p-2 rounded text-xs text-white outline-none"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#DFBA73] hover:bg-[#c5a880] text-black font-bold text-xs uppercase tracking-wider rounded cursor-pointer"
                  >
                    Add Private Note
                  </button>
                </form>

                <div className="space-y-2">
                  <h4 className="font-serif text-xs uppercase tracking-wider font-bold text-white">
                    Manager Notes Feed
                  </h4>
                  {bookingProfile.request.managerNotes?.map((note: any) => (
                    <div key={note.id} className="p-3 bg-neutral-900 rounded border border-white/10 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-[#DFBA73] font-bold">[{note.category}] {note.author}</span>
                        <span className="text-neutral-500">{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-white text-xs">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: SADYA AI BRIEF */}
            {modalTab === "AI_ASSIST" && (
              <div className="space-y-4 text-xs font-sans">
                <div className="p-4 bg-neutral-900 border border-[#DFBA73]/30 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-[#DFBA73]">
                    <Sparkles className="h-5 w-5" />
                    <h4 className="font-serif text-base font-bold text-white">
                      SADYA AI Hospitality Intelligence
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
                    <div className="bg-neutral-950 p-3 rounded border border-white/5">
                      <span className="text-neutral-500 text-[10px] block">Repeat Customer</span>
                      <strong className="text-emerald-400">{bookingProfile.aiAnalytics?.isRepeat ? "YES (VIP)" : "First Time"}</strong>
                    </div>
                    <div className="bg-neutral-950 p-3 rounded border border-white/5">
                      <span className="text-neutral-500 text-[10px] block">Lifetime Value</span>
                      <strong className="text-white">₹{bookingProfile.aiAnalytics?.lifetimeVal || 0}</strong>
                    </div>
                    <div className="bg-neutral-950 p-3 rounded border border-white/5">
                      <span className="text-neutral-500 text-[10px] block">Cancellation Prob</span>
                      <strong className="text-amber-400">{bookingProfile.aiAnalytics?.cancellationProb}%</strong>
                    </div>
                    <div className="bg-neutral-950 p-3 rounded border border-white/5">
                      <span className="text-neutral-500 text-[10px] block">Likely Upsell</span>
                      <strong className="text-[#DFBA73]">{bookingProfile.aiAnalytics?.suggestedUpsell}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-950 rounded border border-white/10 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#DFBA73]">Suggested Manager Call Script</span>
                    <p className="text-neutral-200 text-xs italic">
                      "{bookingProfile.aiAnalytics?.conversationScript}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PAYMENT & GUEST PORTAL */}
            {modalTab === "PAYMENT" && (
              <div className="space-y-6 text-xs font-sans">
                <div className="bg-neutral-900 p-5 rounded-xl border border-white/10 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#DFBA73] flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    <span>Guest Self-Service Portal Link</span>
                  </h4>

                  <div className="flex items-center gap-2 font-mono">
                    <input
                      type="text"
                      readOnly
                      value={`https://hotelyashgrand.com/guest/booking/${bookingProfile.request.guestPortalToken}`}
                      className="w-full bg-neutral-950 border border-white/15 p-2.5 rounded text-xs text-white outline-none"
                    />
                    <a
                      href={`/guest/booking/${bookingProfile.request.guestPortalToken}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-[#DFBA73] text-black font-bold text-xs uppercase tracking-wider rounded block shrink-0"
                    >
                      Open Portal
                    </a>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      )}

      {/* APPROVAL MODAL */}
      {approvingReq && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-lg bg-neutral-950 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lux text-left"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Approve {approvingReq.type} Request
                </h3>
                <p className="text-xs text-emerald-400 font-mono">
                  {approvingReq.requestId} • {approvingReq.guestName}
                </p>
              </div>
              <button onClick={() => setApprovingReq(null)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmApproval} className="space-y-4 text-xs font-sans">
              {approvingReq.type === "ROOM" && (
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold uppercase tracking-wider block">
                    Assign Room Number
                  </label>
                  <input
                    type="text"
                    value={assignedRoomNumber}
                    onChange={(e) => setAssignedRoomNumber(e.target.value)}
                    placeholder="e.g. 101, 102, 201"
                    required
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 rounded text-sm text-white font-mono outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold uppercase tracking-wider block">
                    Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    required
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 rounded text-sm text-white font-mono outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-bold uppercase tracking-wider block">
                    Advance Payment Required (₹)
                  </label>
                  <input
                    type="number"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 rounded text-sm text-white font-mono outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest rounded cursor-pointer shadow-md"
                >
                  Confirm & Create Booking
                </button>
                <button
                  type="button"
                  onClick={() => setApprovingReq(null)}
                  className="px-5 py-3.5 bg-neutral-900 text-neutral-300 text-xs uppercase tracking-wider rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* APPROVAL RESULT POPUP WITH WHATSAPP LINK */}
      {approvalResult && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-emerald-500/40 p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-lux">
            <div className="h-16 w-16 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400 font-bold block">
                BOOKING CONFIRMED & PERSISTED IN DB
              </span>
              <h4 className="font-serif text-2xl text-white">
                Booking ID #{approvalResult.bookingNumber}
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                The booking request has been approved and saved to PostgreSQL. Automatically generated confirmation text ready to dispatch to customer.
              </p>
            </div>

            <a
              href={approvalResult.customerWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] text-black font-bold text-xs uppercase tracking-widest transition-all rounded shadow-lux flex items-center justify-center gap-2.5 cursor-pointer block"
            >
              <Send className="h-4 w-4" />
              <span>Send Customer WhatsApp Confirmation →</span>
            </a>

            <button
              onClick={() => setApprovalResult(null)}
              className="w-full py-3 bg-neutral-900 text-neutral-300 text-xs font-bold uppercase tracking-wider rounded"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

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
  Eye
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
}

export default function BookingRequestsDashboardPage() {
  const [requests, setRequests] = React.useState<BookingRequestRecord[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [typeFilter, setTypeFilter] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [occupancyStats, setOccupancyStats] = React.useState<any | null>(null);

  // Approval Modal state
  const [approvingReq, setApprovingReq] = React.useState<BookingRequestRecord | null>(null);
  const [assignedRoomNumber, setAssignedRoomNumber] = React.useState<string>("101");
  const [advanceAmount, setAdvanceAmount] = React.useState<number>(2000);
  const [totalAmount, setTotalAmount] = React.useState<number>(5000);
  const [managerRemarks, setManagerRemarks] = React.useState<string>("");
  const [expectedCheckInTime, setExpectedCheckInTime] = React.useState<string>("12:00 PM");
  const [approvalResult, setApprovalResult] = React.useState<any | null>(null);

  // Rejection Modal state
  const [rejectingReq, setRejectingReq] = React.useState<BookingRequestRecord | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState<string>("Rooms unavailable for requested dates");
  const [rejectionRemarks, setRejectionRemarks] = React.useState<string>("");
  const [rejectionResult, setRejectionResult] = React.useState<any | null>(null);

  // SADYA AI Brief Modal state
  const [aiBriefReq, setAiBriefReq] = React.useState<BookingRequestRecord | null>(null);

  const fetchRequests = React.useCallback(async () => {
    try {
      setLoading(true);
      const url = `/api/booking-requests?status=${statusFilter}&type=${typeFilter}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setRequests(json.requests);
        setOccupancyStats(json.occupancyStats);
      }
    } catch (err) {
      console.error("Failed to fetch booking requests:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, searchQuery]);

  React.useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Handle Approval Submission
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
          expectedCheckInTime,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setApprovalResult(json);
        setApprovingReq(null);
        fetchRequests();
      } else {
        alert(json.error || "Approval failed");
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  // Handle Rejection Submission
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
          managerRemarks: rejectionRemarks,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setRejectionResult(json);
        setRejectingReq(null);
        fetchRequests();
      } else {
        alert(json.error || "Rejection failed");
      }
    } catch (err) {
      console.error("Rejection error:", err);
    }
  };

  // Update Status to CONTACTED
  const handleMarkContacted = async (req: BookingRequestRecord) => {
    try {
      await fetch(`/api/booking-requests/${req.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-status",
          status: "CONTACTED",
          managerRemarks: "Contacted guest via phone / WhatsApp",
        }),
      });
      fetchRequests();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // KPI Calculations
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const todayCount = requests.filter((r) => new Date(r.requestedAt).toDateString() === new Date().toDateString()).length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED" || r.status === "CONFIRMED").length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;
  const paymentPendingCount = requests.filter((r) => r.status === "PAYMENT_PENDING").length;

  return (
    <div className="space-y-8 select-none text-left font-sans">
      {/* HEADER & BRANDING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Manager Booking Approval Hub
            </h1>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Manual Approval Required</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Zero auto-confirmations. Every room & banquet request is reviewed, verified, and approved by Hotel Management to eliminate double bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-200 text-xs font-semibold rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#DFBA73]" />
            <span>Refresh Requests</span>
          </button>
        </div>
      </div>

      {/* KPI DASHBOARD CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-neutral-950 border border-amber-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[10px] uppercase tracking-widest font-bold">Pending Approval</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{pendingCount}</div>
          <div className="text-[10px] text-amber-300/80 font-sans">Requires manager action</div>
        </div>

        <div className="bg-neutral-950 border border-white/10 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-[10px] uppercase tracking-widest font-bold">Today's Requests</span>
            <Calendar className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{todayCount}</div>
          <div className="text-[10px] text-neutral-400 font-sans">New incoming submissions</div>
        </div>

        <div className="bg-neutral-950 border border-emerald-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] uppercase tracking-widest font-bold">Approved</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{approvedCount}</div>
          <div className="text-[10px] text-emerald-300/80 font-sans">Confirmed room & banquet</div>
        </div>

        <div className="bg-neutral-950 border border-red-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-red-400">
            <span className="text-[10px] uppercase tracking-widest font-bold">Rejected</span>
            <XCircle className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{rejectedCount}</div>
          <div className="text-[10px] text-red-300/80 font-sans">Declined or unavailable</div>
        </div>

        <div className="bg-neutral-950 border border-gold/30 p-4 rounded-xl space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#DFBA73]">
            <span className="text-[10px] uppercase tracking-widest font-bold">Room Occupancy</span>
            <BedDouble className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {occupancyStats?.occupancyRate || 0}%
          </div>
          <div className="text-[10px] text-neutral-400 font-sans">
            {occupancyStats?.occupiedRooms || 0} occupied / {occupancyStats?.availableRooms || 0} available
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-neutral-950 p-4 border border-white/10 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, request ID..."
            className="w-full bg-neutral-900 border border-white/10 focus:border-[#DFBA73] pl-9 pr-3 py-2 text-xs text-white outline-none rounded-md"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Domain Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-neutral-400">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-neutral-900 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="ROOM">Room Bookings</option>
              <option value="BANQUET">Banquet Events</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-neutral-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-900 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Approval</option>
              <option value="CONTACTED">Contacted</option>
              <option value="APPROVED">Approved</option>
              <option value="PAYMENT_PENDING">Payment Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* REQUESTS LIST / CARDS */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-neutral-500 animate-pulse">
          Loading booking requests from PostgreSQL...
        </div>
      ) : requests.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-xl space-y-3">
          <Calendar className="h-10 w-10 text-neutral-600 mx-auto" />
          <p className="text-xs text-neutral-400 font-sans">No booking requests found matching selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => {
            const isPending = r.status === "PENDING";
            const isApproved = r.status === "APPROVED" || r.status === "CONFIRMED";
            const isRejected = r.status === "REJECTED";

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-neutral-950 border rounded-xl p-5 sm:p-6 transition-all space-y-4 shadow-lux ${
                  isPending
                    ? "border-amber-500/40 bg-amber-950/[0.04]"
                    : isApproved
                    ? "border-emerald-500/30"
                    : isRejected
                    ? "border-red-500/30 opacity-80"
                    : "border-white/15"
                }`}
              >
                {/* Request Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      r.type === "ROOM" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    }`}>
                      {r.type === "ROOM" ? <BedDouble className="h-4.5 w-4.5" /> : <PartyPopper className="h-4.5 w-4.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#DFBA73] font-bold">
                          {r.requestId}
                        </span>
                        <span className={`text-[9.5px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
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
                      </div>
                      <h3 className="font-serif text-lg font-bold text-white mt-0.5">
                        {r.guestName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <Clock className="h-3.5 w-3.5 text-neutral-500" />
                    <span>Submitted: {new Date(r.requestedAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Body Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-neutral-900/60 p-4 rounded-lg border border-white/5 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Category / Type</span>
                    <strong className="text-white block mt-0.5">
                      {r.type === "ROOM" ? (r.roomType || "Single Deluxe Room") : (r.eventType || "Grand Event")}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Dates</span>
                    <strong className="text-[#DFBA73] block mt-0.5">
                      {r.type === "ROOM" 
                        ? `${r.checkIn ? new Date(r.checkIn).toLocaleDateString() : "N/A"} → ${r.checkOut ? new Date(r.checkOut).toLocaleDateString() : "N/A"}`
                        : (r.eventDate ? new Date(r.eventDate).toLocaleDateString() : "N/A")}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Guests & Details</span>
                    <strong className="text-white block mt-0.5">
                      {r.type === "ROOM" 
                        ? `${r.adults} Adults${r.children ? `, ${r.children} Children` : ""}`
                        : `${r.guestsCount || 100} Expected Guests`}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Contact Mobile</span>
                    <strong className="text-white block mt-0.5 select-text">
                      {r.mobile}
                    </strong>
                  </div>
                </div>

                {/* Special Requests & Remarks */}
                {r.specialRequest && (
                  <div className="text-xs text-neutral-300 bg-neutral-900/40 p-3 rounded border border-white/5 font-sans">
                    <span className="text-[#DFBA73] font-bold">Special Requests: </span>
                    <span>{r.specialRequest}</span>
                  </div>
                )}

                {r.rejectionReason && (
                  <div className="text-xs text-red-300 bg-red-950/40 p-3 rounded border border-red-500/20 font-sans">
                    <span className="font-bold">Rejection Reason: </span>
                    <span>{r.rejectionReason}</span>
                  </div>
                )}

                {/* MANAGER COMMUNICATION & APPROVAL TOOLBAR */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* SADYA AI Brief Button */}
                    <button
                      onClick={() => setAiBriefReq(r)}
                      className="px-3 py-1.5 bg-[#DFBA73]/15 border border-[#DFBA73]/40 hover:bg-[#DFBA73]/25 text-[#DFBA73] text-[11px] font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>SADYA AI Brief</span>
                    </button>

                    {/* Click-to-call */}
                    <a
                      href={`tel:${r.mobile}`}
                      onClick={() => handleMarkContacted(r)}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-white text-[11px] font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Phone className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Call {r.mobile}</span>
                    </a>

                    {/* WhatsApp Chat */}
                    <a
                      href={`https://wa.me/${r.mobile.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${r.guestName}, regarding your ${r.type} booking request (${r.requestId}) at HOTEL YASH GRAND...`)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleMarkContacted(r)}
                      className="px-3 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-[11px] font-semibold rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>WhatsApp Chat</span>
                    </a>
                  </div>

                  {/* APPROVE & REJECT ACTIONS */}
                  <div className="flex items-center gap-3">
                    {isPending && (
                      <button
                        onClick={() => handleMarkContacted(r)}
                        className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
                      >
                        Mark Contacted
                      </button>
                    )}

                    {!isRejected && (
                      <button
                        onClick={() => setRejectingReq(r)}
                        className="px-4 py-2 bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-200 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    )}

                    {!isApproved && (
                      <button
                        onClick={() => {
                          setApprovingReq(r);
                          setTotalAmount(r.type === "ROOM" ? 5000 : 50000);
                          setAdvanceAmount(2000);
                        }}
                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Approve Request</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
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

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase tracking-wider block">
                  Manager Remarks / Notes
                </label>
                <textarea
                  value={managerRemarks}
                  onChange={(e) => setManagerRemarks(e.target.value)}
                  rows={2}
                  placeholder="e.g., High floor room assigned, early check-in approved."
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2 rounded text-xs text-white outline-none resize-none focus:border-emerald-400"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest rounded transition-colors cursor-pointer shadow-md"
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

      {/* REJECTION MODAL */}
      {rejectingReq && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md bg-neutral-950 border border-red-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lux text-left"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Reject {rejectingReq.type} Request
                </h3>
                <p className="text-xs text-red-400 font-mono">
                  {rejectingReq.requestId} • {rejectingReq.guestName}
                </p>
              </div>
              <button onClick={() => setRejectingReq(null)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmRejection} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase tracking-wider block">
                  Select Rejection Reason
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 rounded text-xs text-white outline-none cursor-pointer focus:border-red-400"
                >
                  <option value="Rooms unavailable for requested dates">Rooms / Hall unavailable for requested dates</option>
                  <option value="Scheduled maintenance or renovation">Scheduled maintenance or renovation</option>
                  <option value="Pricing / Tariff policy mismatch">Pricing or Tariff policy mismatch</option>
                  <option value="Guest requested cancellation">Guest requested cancellation</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase tracking-wider block">
                  Manager Note for Guest
                </label>
                <textarea
                  value={rejectionRemarks}
                  onChange={(e) => setRejectionRemarks(e.target.value)}
                  rows={3}
                  placeholder="e.g. Fully booked due to wedding group. Please suggest alternative dates."
                  className="w-full bg-neutral-900 border border-white/15 px-3 py-2.5 rounded text-xs text-white outline-none resize-none focus:border-red-400"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded transition-colors cursor-pointer shadow-md"
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  onClick={() => setRejectingReq(null)}
                  className="px-5 py-3.5 bg-neutral-900 text-neutral-300 text-xs uppercase tracking-wider rounded font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* REJECTION RESULT POPUP */}
      {rejectionResult && (
        <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-red-500/40 p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-lux">
            <div className="h-16 w-16 bg-red-500/20 border border-red-400/40 rounded-full flex items-center justify-center mx-auto text-red-400">
              <XCircle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-red-400 font-bold block">
                STATUS UPDATED TO REJECTED
              </span>
              <h4 className="font-serif text-xl text-white">
                Request Rejection Recorded
              </h4>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                The booking request has been marked as REJECTED in PostgreSQL. Click below to notify guest via WhatsApp.
              </p>
            </div>

            <a
              href={rejectionResult.customerWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest transition-all rounded shadow-lux flex items-center justify-center gap-2.5 cursor-pointer block"
            >
              <Send className="h-4 w-4" />
              <span>Send Rejection Message on WhatsApp →</span>
            </a>

            <button
              onClick={() => setRejectionResult(null)}
              className="w-full py-3 bg-neutral-900 text-neutral-300 text-xs font-bold uppercase tracking-wider rounded"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* SADYA AI GUEST BRIEF MODAL */}
      {aiBriefReq && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-[#DFBA73]/40 p-6 sm:p-8 rounded-2xl max-w-lg w-full text-left space-y-6 shadow-lux">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#DFBA73]" />
                <h3 className="font-serif text-lg font-bold text-white">
                  SADYA AI Guest Intelligence Brief
                </h3>
              </div>
              <button onClick={() => setAiBriefReq(null)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="bg-neutral-900 p-4 rounded-lg border border-white/5 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#DFBA73] font-bold block">
                  Guest Profile & History
                </span>
                <div className="text-white font-medium text-sm">
                  {aiBriefReq.guestName} ({aiBriefReq.mobile})
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  Requested a <strong>{aiBriefReq.type}</strong> booking for {aiBriefReq.type === "ROOM" ? `${aiBriefReq.adults} Adults` : `${aiBriefReq.guestsCount} Banquet Guests`}.
                </p>
              </div>

              <div className="bg-[#DFBA73]/10 border border-[#DFBA73]/30 p-4 rounded-lg space-y-2 text-neutral-200">
                <span className="text-[10px] uppercase tracking-widest text-[#DFBA73] font-bold block">
                  AI Recommendation for Manager Call
                </span>
                <ul className="list-disc list-inside space-y-1.5 text-[11.5px] leading-relaxed">
                  <li>Recommend <strong>Family Room (Two Connected Rooms)</strong> for family stay preference.</li>
                  <li>Confirm arrival time ({aiBriefReq.arrivalTime || "12:00 PM"}) to pre-assign room cleaning.</li>
                  <li>Propose a <strong>₹2,000 advance payment</strong> via UPI link to block room.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <a
                href={`tel:${aiBriefReq.mobile}`}
                className="flex-1 py-3 bg-emerald-500 text-black font-bold text-xs uppercase tracking-widest rounded text-center block"
              >
                Call Guest Now
              </a>
              <button
                onClick={() => setAiBriefReq(null)}
                className="px-5 py-3 bg-neutral-900 text-neutral-300 text-xs uppercase tracking-wider rounded font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

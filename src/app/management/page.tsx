"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { RefreshCw, LayoutDashboard, BedDouble, ShieldCheck, BarChart3, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import { DashboardData, BookingRequest, Room } from "@/components/management/types";
import { ExecutiveDashboardSkeleton } from "@/components/management/DashboardSkeletons";
import { CommandCenterHeader } from "@/components/management/CommandCenterHeader";
import { ExecutiveHudGauges } from "@/components/management/ExecutiveHudGauges";
import { PriorityApprovalFeed } from "@/components/management/PriorityApprovalFeed";
import { InteractiveRoomMap } from "@/components/management/InteractiveRoomMap";
import { HourlyRevenueChart } from "@/components/management/HourlyRevenueChart";
import { HotelAiAdvisor } from "@/components/management/HotelAiAdvisor";
import { CommandActionDock } from "@/components/management/CommandActionDock";
import { GuestMovementsCard } from "@/components/management/GuestMovementsCard";
import { OperationsTimeline } from "@/components/management/OperationsTimeline";
import { ApprovalModal } from "@/components/management/ApprovalModal";
import { RoomDetailModal } from "@/components/management/RoomDetailModal";
import { CommandPalette } from "@/components/management/CommandPalette";
import { ToastNotification, ToastMessage } from "@/components/management/ToastNotification";

export default function ManagementDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "approvals" | "analytics">("overview");

  // Auto-refresh & Modals
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: "success" | "error", title: string, message?: string) => {
    setToast({ id: Date.now().toString(), type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDashboardData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      setError(null);
      const res = await fetch("/api/management/dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || "Failed to load management telemetry.");
      }
    } catch (err: any) {
      console.error("Dashboard data fetch error:", err);
      setError("Network or server connection failed. Please check internet connection.");
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // 30s Realtime Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchDashboardData]);

  // CSV Export Handler
  const handleExportCSV = useCallback(() => {
    if (!data) return;
    const rows = [
      ["Booking ID / Type", "Guest Name", "Contact Mobile", "Status", "Date / Room"],
      ...(data.todayCheckIns || []).map((b) => [
        b.bookingId,
        b.customer?.name || "Guest Patron",
        b.customer?.phone || "",
        b.status,
        `Room ${b.room?.roomNumber || "N/A"}`,
      ]),
      ...(data.pendingBookingRequests || []).map((r) => [
        r.id,
        r.guestName,
        r.mobile,
        r.status,
        r.roomType || r.eventType || r.type,
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `yash_grand_executive_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("success", "Report Exported", "Executive CSV summary successfully generated.");
  }, [data]);

  // Printable Report Handler
  const handlePrintReport = useCallback(() => {
    window.print();
  }, []);

  // Process Manager Approval / Rejection
  const handleProcessApproval = useCallback(
    async (status: "APPROVED" | "REJECTED", remarks: string) => {
      if (!selectedRequest) return;
      try {
        const res = await fetch(`/api/booking-requests/${selectedRequest.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: status === "APPROVED" ? "approve" : "reject",
            status,
            managerRemarks: remarks,
          }),
        });

        const json = await res.json();
        if (json.success) {
          setSelectedRequest(null);
          showToast(
            "success",
            status === "APPROVED" ? "Booking Approved" : "Booking Request Declined",
            `Guest ${selectedRequest.guestName} request updated cleanly.`
          );
          fetchDashboardData(true);
        } else {
          showToast("error", "Update Failed", json.error || "Failed to update booking status.");
        }
      } catch (err) {
        console.error("Error processing approval:", err);
        showToast("error", "Unexpected Error", "Could not reach server to update request.");
      }
    },
    [selectedRequest, fetchDashboardData]
  );

  // 1-Click Quick Approval from Feed
  const handleQuickApprove = useCallback(
    async (req: BookingRequest) => {
      try {
        const res = await fetch(`/api/booking-requests/${req.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "approve",
            status: "APPROVED",
            managerRemarks: "Approved by Executive Desk (1-Click)",
          }),
        });

        const json = await res.json();
        if (json.success) {
          showToast("success", "Booking Approved", `Guest ${req.guestName} request approved.`);
          fetchDashboardData(true);
        } else {
          showToast("error", "Approval Failed", json.error || "Failed to approve booking.");
        }
      } catch (err) {
        console.error("Error quick approving request:", err);
        showToast("error", "Unexpected Error", "Could not reach server.");
      }
    },
    [fetchDashboardData]
  );

  // Loading state
  if (loading) {
    return <ExecutiveDashboardSkeleton />;
  }

  // Error state UI
  if (error || !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center p-6 font-mono text-white">
        <div className="h-14 w-14 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-white">Executive Operations Sync Error</h2>
        <p className="text-xs text-slate-400 max-w-md">{error || "Telemetry data is currently unavailable."}</p>
        <Button variant="primary" onClick={() => fetchDashboardData()} startIcon={<RefreshCw className="h-4 w-4" />}>
          Retry Telemetry Sync
        </Button>
      </div>
    );
  }

  const {
    metrics,
    allRooms = [],
    todayCheckIns = [],
    todayCheckOuts = [],
    pendingBookingRequests = [],
    recentNotifications = [],
    hourlyRevenueData = [],
  } = data;

  return (
    <div className="space-y-8 pb-12 font-sans text-white text-left">
      {/* EXECUTIVE TOP BAR NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D4AF37]/20 pb-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-bold transition-all ${
              activeTab === "overview"
                ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.35)]"
                : "bg-[#171E27] text-slate-300 border-[#D4AF37]/20 hover:text-white hover:border-[#D4AF37]"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Executive Command Center</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-bold transition-all ${
              activeTab === "inventory"
                ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.35)]"
                : "bg-[#171E27] text-slate-300 border-[#D4AF37]/20 hover:text-white hover:border-[#D4AF37]"
            }`}
          >
            <BedDouble className="h-4 w-4" />
            <span>Spatial Suite Map ({allRooms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("approvals")}
            className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-bold transition-all relative ${
              activeTab === "approvals"
                ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.35)]"
                : "bg-[#171E27] text-slate-300 border-[#D4AF37]/20 hover:text-white hover:border-[#D4AF37]"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Approval Feed ({pendingBookingRequests.length})</span>
            {pendingBookingRequests.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-2xl border flex items-center gap-2 font-bold transition-all ${
              activeTab === "analytics"
                ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.35)]"
                : "bg-[#171E27] text-slate-300 border-[#D4AF37]/20 hover:text-white hover:border-[#D4AF37]"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Revenue Flow Analytics</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: GLASSMORPHIC COMMAND CENTER HEADER */}
      <CommandCenterHeader
        metrics={metrics}
        onExportCSV={handleExportCSV}
        onPrintReport={handlePrintReport}
        onRefresh={() => fetchDashboardData()}
        autoRefreshEnabled={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* OVERVIEW OR SPECIFIC TAB CONTENT */}
      {(activeTab === "overview" || activeTab === "analytics") && (
        <>
          {/* SECTION 2: EXECUTIVE RADIAL HUD & REVENUE STREAM GAUGE */}
          <ExecutiveHudGauges metrics={metrics} />

          {/* SECTION 3: VISUAL HOURLY REVENUE CHART & SEGMENT SPLIT */}
          <HourlyRevenueChart data={hourlyRevenueData} metrics={metrics} />

          {/* SECTION 4: INTEGRATED HOTEL AI OPERATIONS ADVISOR */}
          <HotelAiAdvisor />
        </>
      )}

      {/* SECTION 5: OPERATIONAL COMMAND ACTION DOCK */}
      {activeTab === "overview" && <CommandActionDock />}

      {/* SECTION 6: PRIORITY APPROVAL FEED & GUEST MOVEMENTS */}
      {(activeTab === "overview" || activeTab === "approvals") && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PriorityApprovalFeed
              requests={pendingBookingRequests}
              onSelectRequest={(req) => setSelectedRequest(req)}
              onQuickApprove={handleQuickApprove}
            />
          </div>

          <GuestMovementsCard checkIns={todayCheckIns} checkOuts={todayCheckOuts} />
        </section>
      )}

      {/* SECTION 7: SPATIAL SUITE INVENTORY MAP */}
      {(activeTab === "overview" || activeTab === "inventory") && (
        <InteractiveRoomMap
          rooms={allRooms}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onSelectRoom={(room) => setSelectedRoom(room)}
        />
      )}

      {/* SECTION 8: OPERATIONS STREAM TIMELINE */}
      {activeTab === "overview" && <OperationsTimeline notifications={recentNotifications} />}

      {/* MODAL 1: APPROVAL REVIEW DIALOG */}
      <ApprovalModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onSuccess={handleProcessApproval}
      />

      {/* MODAL 2: ROOM DETAIL INSPECTOR */}
      <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />

      {/* MODAL 3: COMMAND PALETTE */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      {/* TOAST FEEDBACK NOTIFICATIONS */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  UtensilsCrossed, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  RefreshCw, 
  DollarSign, 
  QrCode, 
  Eye, 
  ChefHat, 
  Receipt, 
  Calendar,
  Send,
  Phone,
  ShieldCheck,
  TrendingUp,
  History,
  FileText,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastNotification } from "@/components/management/ToastNotification";

interface OrderItemRecord {
  id: string;
  itemName: string;
  quantity: number;
  price: number;
  variantLabel?: string | null;
  specialInstructions?: string | null;
}

interface RestaurantOrderRecord {
  id: string;
  orderId: string;
  tableNumber: string;
  customerName?: string | null;
  customerPhone?: string | null;
  totalItems: number;
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemRecord[];
  bill?: any;
}

export default function RestaurantManagementPage() {
  const [activeTab, setActiveTab] = useState<"ORDERS" | "TABLES" | "SALES">("ORDERS");
  const [orders, setOrders] = useState<RestaurantOrderRecord[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any | null>(null);
  const [paymentBreakdown, setPaymentBreakdown] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [tableFilter, setTableFilter] = useState<string>("ALL");
  const [paymentFilter, setPaymentFilter] = useState<string>("ALL");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Order Details Drawer Modal
  const [selectedOrder, setSelectedOrder] = useState<RestaurantOrderRecord | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  const fetchRestaurantData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.set("search", searchQuery);
      if (statusFilter !== "ALL") queryParams.set("status", statusFilter);
      if (tableFilter !== "ALL") queryParams.set("tableNumber", tableFilter);
      if (paymentFilter !== "ALL") queryParams.set("paymentStatus", paymentFilter);
      if (selectedDate) queryParams.set("date", selectedDate);

      const res = await fetch(`/api/management/restaurant?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.orders);
        setTables(json.tables);
        setStatistics(json.statistics);
        setPaymentBreakdown(json.paymentBreakdown);
        setAuditLogs(json.auditLogs);
      }
    } catch (err) {
      console.error("Failed to fetch restaurant management data:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, tableFilter, paymentFilter, selectedDate]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  const [toast, setToast] = useState<{ id: string; type: "success" | "error"; title: string; message?: string } | null>(null);

  const showToast = (type: "success" | "error", title: string, message?: string) => {
    setToast({ id: Date.now().toString(), type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle Order Status Update (Stores directly in PostgreSQL via Order API)
  const handleUpdateOrderStatus = async (newStatus: string, newPaymentStatus?: string) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...(newPaymentStatus && { paymentStatus: newPaymentStatus }),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSelectedOrder((prev) => prev ? { ...prev, status: newStatus, ...(newPaymentStatus && { paymentStatus: newPaymentStatus }) } : null);
        showToast("success", "Order Status Updated", `Order ${selectedOrder.orderId} status set to ${newStatus.replace("_", " ")}.`);
        fetchRestaurantData();
      } else {
        showToast("error", "Update Failed", json.error || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      showToast("error", "Error", "An unexpected error occurred.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-8 select-none text-left font-sans">
      
      {/* HEADER & BRANDING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Restaurant Operations & POS Management
            </h1>
            <span className="bg-[#DFBA73]/15 text-[#DFBA73] border border-[#DFBA73]/30 text-[9.5px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Phase 3 Module</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Real-time management for dining table orders, kitchen statuses, table QR codes, and daily sales metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRestaurantData}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#DFBA73]" />
            <span>Sync Orders</span>
          </button>
        </div>
      </div>

      {/* LIVE ORDER STATISTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-neutral-950 border border-[#DFBA73]/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[#DFBA73]">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Total Orders Today</span>
            <UtensilsCrossed className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.totalOrdersToday || 0}</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">Today's POS volume</div>
        </div>

        <div className="bg-neutral-950 border border-emerald-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Total Sales</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="text-xl font-mono font-bold text-white">₹{(statistics?.totalSalesToday || 0).toLocaleString()}</div>
          <div className="text-[9.5px] text-emerald-300/80 font-sans">Paid & Completed</div>
        </div>

        <div className="bg-neutral-950 border border-amber-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Kitchen Active</span>
            <ChefHat className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.activeKitchenOrders || 0}</div>
          <div className="text-[9.5px] text-amber-300/80 font-sans">Preparing in Kitchen</div>
        </div>

        <div className="bg-neutral-950 border border-blue-500/30 p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-blue-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Served & Paid</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">{statistics?.servedAndPaidCount || 0}</div>
          <div className="text-[9.5px] text-neutral-400 font-sans">Fulfilled orders</div>
        </div>

        <div className="bg-neutral-950 border border-purple-500/30 p-4 rounded-xl space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-[9.5px] uppercase tracking-widest font-bold">Active Tables</span>
            <QrCode className="h-4 w-4" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {statistics?.activeTablesCount || 0} / {statistics?.totalTablesCount || 10}
          </div>
          <div className="text-[9.5px] text-neutral-400 font-sans">Dining room occupancy</div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex border-b border-white/15 gap-2 font-mono text-xs">
        {[
          { id: "ORDERS", label: "Restaurant Orders", icon: UtensilsCrossed, badge: orders.length },
          { id: "TABLES", label: "Tables Management", icon: QrCode, badge: `${statistics?.activeTablesCount || 0} Active` },
          { id: "SALES", label: "Daily Sales Report", icon: TrendingUp },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-3 border-b-2 font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
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

      {/* TAB 1: RESTAURANT ORDERS VIEW */}
      {activeTab === "ORDERS" && (
        <div className="space-y-6">
          {/* SEARCH & FILTERS BAR */}
          <div className="bg-neutral-950 p-4 border border-white/10 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Guest, Table..."
                className="w-full bg-neutral-900 border border-white/10 focus:border-[#DFBA73] pl-9 pr-3 py-2 text-xs text-white outline-none rounded"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-xs font-mono">
              {/* Table Number Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Table:</span>
                <select
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  className="bg-neutral-900 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="ALL">All Tables</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tNum) => (
                    <option key={tNum} value={tNum.toString()}>Table {tNum}</option>
                  ))}
                  <option value="T-01">T-01</option>
                  <option value="T-05">T-05</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-neutral-900 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">New / Pending</option>
                  <option value="IN_KITCHEN">In Kitchen / Preparing</option>
                  <option value="READY">Ready</option>
                  <option value="SERVED">Served</option>
                  <option value="PAID">Paid / Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Payment Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Payment:</span>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-neutral-900 border border-white/15 rounded px-2.5 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="ALL">All Payment</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* ORDERS TABLE */}
          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-neutral-500 animate-pulse">
              Loading POS orders from PostgreSQL...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-white/10 rounded-xl space-y-3">
              <UtensilsCrossed className="h-10 w-10 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400 font-sans">No restaurant orders match selected filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-neutral-950 border border-white/10 rounded-xl shadow-lux">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-neutral-900/90 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Table</th>
                    <th className="py-3.5 px-4">Guest Name</th>
                    <th className="py-3.5 px-4">Dishes Count</th>
                    <th className="py-3.5 px-4">Grand Total</th>
                    <th className="py-3.5 px-4">Order Status</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Order Time</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-neutral-200 font-mono">
                  {orders.map((ord) => {
                    const isKitchen = ord.status === "NEW" || ord.status === "IN_KITCHEN" || ord.status === "PREPARING";
                    const isServed = ord.status === "SERVED" || ord.status === "PAID" || ord.status === "COMPLETED";

                    return (
                      <tr key={ord.id} className="hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3.5 px-4 text-[#DFBA73] font-bold">
                          {ord.orderId}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          Table {ord.tableNumber || "POS"}
                        </td>
                        <td className="py-3.5 px-4 font-sans font-medium text-neutral-200">
                          {ord.customerName || "Guest"}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-300">
                          {ord.totalItems} Items
                        </td>
                        <td className="py-3.5 px-4 text-white font-bold">
                          ₹{ord.grandTotal}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[9.5px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${
                            isKitchen
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                              : isServed
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-red-500/20 text-red-300 border-red-500/40"
                          }`}>
                            {ord.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[9.5px] uppercase font-bold px-2 py-0.5 rounded ${
                            ord.paymentStatus === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1.5 bg-[#DFBA73]/15 hover:bg-[#DFBA73]/30 text-[#DFBA73] border border-[#DFBA73]/40 rounded font-semibold text-[11px] flex items-center gap-1 cursor-pointer ml-auto"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Order Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TABLES MANAGEMENT VIEW */}
      {activeTab === "TABLES" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {tables.map((t) => {
              const hasActiveOrder = t.orders && t.orders.length > 0;
              const activeOrder = hasActiveOrder ? t.orders[0] : null;

              return (
                <div
                  key={t.id || t.tableNumber}
                  className={`bg-neutral-950 border rounded-xl p-5 space-y-3 transition-all ${
                    hasActiveOrder
                      ? "border-amber-500/50 bg-amber-950/[0.04] shadow-lux"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <div className="font-serif text-lg font-bold text-white">
                      Table {t.tableNumber}
                    </div>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                      hasActiveOrder ? "bg-amber-500 text-black animate-pulse" : "bg-neutral-800 text-neutral-400"
                    }`}>
                      {hasActiveOrder ? "OCCUPIED" : "AVAILABLE"}
                    </span>
                  </div>

                  {activeOrder ? (
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="text-[#DFBA73] font-bold">{activeOrder.orderId}</div>
                      <div className="text-white">{activeOrder.customerName || "Guest"}</div>
                      <div className="text-emerald-400 font-bold">₹{activeOrder.grandTotal}</div>
                      <div className="text-[10px] text-neutral-400">Status: {activeOrder.status}</div>
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-neutral-500 py-2">
                      Ready for next customer scan
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span>QR Sec: Active</span>
                    <span className="text-neutral-400">Token: {t.token?.slice(0, 8)}...</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DAILY SALES REPORT VIEW */}
      {activeTab === "SALES" && (
        <div className="space-y-6">
          <div className="bg-neutral-950 border border-white/10 p-6 rounded-2xl space-y-6 shadow-lux">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#DFBA73] font-bold block">
                DAILY FINANCIAL BREAKDOWN
              </span>
              <h3 className="font-serif text-xl font-bold text-white">
                Sales by Payment Method & Category
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
              {paymentBreakdown.map((pb) => (
                <div key={pb.paymentMethod} className="p-4 bg-neutral-900 rounded-xl border border-white/10 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                    {pb.paymentMethod} Payment
                  </span>
                  <div className="text-2xl font-bold text-[#DFBA73]">
                    ₹{(pb._sum?.grandTotal || 0).toLocaleString()}
                  </div>
                  <div className="text-neutral-400 text-[11px]">
                    {pb._count?.id || 0} Transactions
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORDER DETAILS DRAWER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-2xl bg-neutral-950 border border-[#DFBA73]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-lux max-h-[90vh] overflow-y-auto text-left"
          >
            {/* DRAWER HEADER */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-[#DFBA73] font-bold">
                    {selectedOrder.orderId}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Table {selectedOrder.tableNumber || "POS"}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-bold text-white mt-1">
                  {selectedOrder.customerName || "Guest"} ({selectedOrder.customerPhone || "N/A"})
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Close [Esc]
              </button>
            </div>

            {/* ORDER STATUS LIFECYCLE UPDATE TOOLBAR */}
            <div className="bg-neutral-900 p-4 rounded-xl border border-white/10 space-y-3 text-xs font-sans">
              <span className="text-[10px] uppercase tracking-wider text-[#DFBA73] font-bold block">
                Update Order Status (Stores in PostgreSQL)
              </span>

              <div className="flex flex-wrap gap-2">
                {[
                  { status: "NEW", label: "Pending" },
                  { status: "IN_KITCHEN", label: "Accepted / Kitchen" },
                  { status: "PREPARING", label: "Preparing" },
                  { status: "READY", label: "Ready" },
                  { status: "SERVED", label: "Served" },
                  { status: "PAID", label: "Paid" },
                  { status: "CANCELLED", label: "Cancelled" },
                ].map((s) => {
                  const isActive = selectedOrder.status === s.status;
                  return (
                    <button
                      key={s.status}
                      disabled={updatingStatus}
                      onClick={() => handleUpdateOrderStatus(s.status, s.status === "PAID" ? "COMPLETED" : undefined)}
                      className={`px-3 py-1.5 rounded font-mono text-[11px] font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#DFBA73] text-black shadow-md"
                          : "bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-white/15"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DISSECTED DISHES LIST */}
            <div className="space-y-3 text-xs font-sans">
              <h4 className="font-serif text-sm font-bold text-white border-b border-white/10 pb-1.5 flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-[#DFBA73]" />
                <span>Ordered Dishes Breakdown ({selectedOrder.items.length} Dishes)</span>
              </h4>

              <div className="divide-y divide-white/5 font-mono">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <div className="text-white font-bold">
                        {item.itemName} {item.variantLabel ? `(${item.variantLabel})` : ""}
                      </div>
                      <div className="text-neutral-400 text-[11px]">
                        Qty: {item.quantity} x ₹{item.price}
                      </div>
                    </div>
                    <div className="text-[#DFBA73] font-bold">
                      ₹{item.quantity * item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FINANCIAL SUMMARY */}
            <div className="bg-neutral-900/60 p-4 rounded-xl border border-white/10 space-y-2 text-xs font-mono text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{selectedOrder.tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>- ₹{selectedOrder.discount}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-sm text-white">
                <span>Grand Total</span>
                <span className="text-[#DFBA73]">₹{selectedOrder.grandTotal}</span>
              </div>
            </div>

            {/* AUDIT LOG TIMELINE */}
            <div className="space-y-2 text-xs font-sans">
              <h4 className="font-serif text-xs font-bold text-[#DFBA73] border-b border-white/10 pb-1 flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                <span>PostgreSQL Order Audit Trail</span>
              </h4>
              <div className="space-y-1 font-mono text-[10.5px]">
                {auditLogs.filter((log) => log.details.includes(selectedOrder.orderId)).map((log) => (
                  <div key={log.id} className="p-2 bg-neutral-900/40 rounded border border-white/5 flex justify-between">
                    <span className="text-neutral-300">{log.details}</span>
                    <span className="text-neutral-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      )}

      {/* TOAST FEEDBACK NOTIFICATIONS */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

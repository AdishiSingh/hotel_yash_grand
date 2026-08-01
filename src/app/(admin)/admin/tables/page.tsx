"use client";

import * as React from "react";
import { 
  QrCode, 
  Plus, 
  RefreshCw, 
  Download, 
  Printer, 
  Power, 
  ShieldCheck, 
  Trash2, 
  Search,
  CheckCircle2,
  X,
  ExternalLink,
  Table as TableIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface TableRecord {
  id: string;
  tableNumber: number;
  token: string;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  ordersCount: number;
  qrUrl: string;
  qrDataUrl: string;
}

export default function AdminTablesPage() {
  const [tables, setTables] = React.useState<TableRecord[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [newTableNum, setNewTableNum] = React.useState<string>("");
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  // Print Modal state
  const [printableTable, setPrintableTable] = React.useState<TableRecord | null>(null);

  // Fetch Tables on mount
  const fetchTables = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/tables");
      const json = await res.json();
      if (json.success && Array.isArray(json.tables)) {
        setTables(json.tables);
      }
    } catch (err: any) {
      console.error("Failed to fetch tables:", err);
      setError("Failed to load restaurant tables from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Create Table
  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNum) return;

    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber: parseInt(newTableNum, 10) }),
      });
      const json = await res.json();
      if (json.success) {
        setNewTableNum("");
        showNotification(`Table ${json.table.tableNumber} created with secure token.`);
        fetchTables();
      } else {
        setError(json.error || "Failed to create table.");
      }
    } catch (err: any) {
      setError("Network error creating table.");
    } finally {
      setIsCreating(false);
    }
  };

  // Regenerate Token
  const handleRegenerateToken = async (id: string, tableNumber: number) => {
    if (!confirm(`Regenerate QR token for Table ${tableNumber}? Old QR codes will become invalid.`)) return;

    try {
      const res = await fetch(`/api/admin/tables/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "regenerate" }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`Regenerated new QR token for Table ${tableNumber}.`);
        fetchTables();
      } else {
        setError(json.error || "Failed to regenerate token.");
      }
    } catch (err) {
      setError("Error regenerating token.");
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (id: string, currentActive: boolean, tableNumber: number) => {
    try {
      const res = await fetch(`/api/admin/tables/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`Table ${tableNumber} is now ${!currentActive ? "ACTIVE" : "DEACTIVATED"}.`);
        fetchTables();
      } else {
        setError(json.error || "Failed to update table status.");
      }
    } catch (err) {
      setError("Error updating table status.");
    }
  };

  // Download QR PNG
  const handleDownloadQR = (qrDataUrl: string, tableNumber: number) => {
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `Hotel_Yash_Grand_Table_${tableNumber}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(`Downloaded QR PNG for Table ${tableNumber}`);
  };

  // Trigger Print
  const handlePrintQR = (table: TableRecord) => {
    setPrintableTable(table);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const filteredTables = tables.filter((t) =>
    String(t.tableNumber).includes(searchQuery) ||
    t.token.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Table QR Security Engine
            </h1>
            <span className="bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
              PostgreSQL Sync
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Manage table QR tokens, generate PNG printables, and enforce secure digital ordering for HOTEL YASH GRAND.
          </p>
        </div>

        {/* Add New Table Form */}
        <form onSubmit={handleCreateTable} className="flex items-center gap-3">
          <div className="relative">
            <input
              type="number"
              value={newTableNum}
              onChange={(e) => setNewTableNum(e.target.value)}
              placeholder="Table Number (e.g. 11)"
              min={1}
              required
              className="bg-neutral-900 border border-white/15 focus:border-[#C5A880] px-3.5 py-2 rounded-sm text-xs text-white placeholder-neutral-500 outline-none w-44 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="px-4 py-2 bg-[#C5A880] hover:bg-[#A37C40] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{isCreating ? "Creating..." : "Add Table"}</span>
          </button>
        </form>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-xs rounded-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-950/80 border border-red-500/30 text-red-200 text-xs rounded-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Table List / Grid Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-neutral-950 p-4 border border-white/10 rounded-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search table number or token..."
            className="w-full bg-neutral-900 border border-white/10 focus:border-[#C5A880] pl-9 pr-3 py-2 text-xs text-white outline-none rounded-sm"
          />
        </div>

        <div className="text-xs text-neutral-400 font-mono flex items-center gap-4">
          <span>Total Tables: <strong className="text-white">{tables.length}</strong></span>
          <span>•</span>
          <span>Active QRs: <strong className="text-emerald-400">{tables.filter(t => t.isActive).length}</strong></span>
        </div>
      </div>

      {/* Table Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-neutral-500 animate-pulse">
          Loading tables from database...
        </div>
      ) : filteredTables.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-sm space-y-3">
          <TableIcon className="h-10 w-10 text-neutral-600 mx-auto" />
          <p className="text-xs text-neutral-400">No tables found matching filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTables.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-neutral-950 border rounded-lg p-5 flex flex-col justify-between space-y-5 shadow-lux transition-all ${
                t.isActive ? "border-white/15 hover:border-[#C5A880]/50" : "border-red-500/30 opacity-75"
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-2xl font-bold text-white">
                      Table {t.tableNumber}
                    </h3>
                    <span
                      className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${
                        t.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-red-500/10 text-red-400 border-red-500/30"
                      }`}
                    >
                      {t.isActive ? "Active" : "Deactivated"}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono block mt-1">
                    Orders Processed: {t.ordersCount}
                  </span>
                </div>

                {/* QR Code Thumbnail Preview */}
                {t.qrDataUrl && (
                  <div className="p-1.5 bg-white rounded-md shrink-0 shadow-md">
                    <img
                      src={t.qrDataUrl}
                      alt={`Table ${t.tableNumber} QR`}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Secure Token & URL Info */}
              <div className="space-y-2 bg-neutral-900/80 p-3 rounded border border-white/5 text-[11px] font-mono">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Security Token:</span>
                  <span className="text-xs text-[#C5A880] truncate max-w-[150px]" title={t.token}>
                    {t.token.slice(0, 14)}...
                  </span>
                </div>
                <div className="flex justify-between items-center text-neutral-400 pt-1 border-t border-white/5">
                  <span>Target Menu URL:</span>
                  <a
                    href={t.qrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-neutral-300 hover:text-white flex items-center gap-1 font-sans"
                  >
                    <span>/menu?table={t.tableNumber}</span>
                    <ExternalLink className="h-3 w-3 text-[#C5A880]" />
                  </a>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-semibold">
                <button
                  onClick={() => handleDownloadQR(t.qrDataUrl, t.tableNumber)}
                  className="py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-200 hover:text-white rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>Download PNG</span>
                </button>

                <button
                  onClick={() => handlePrintQR(t)}
                  className="py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-200 hover:text-white rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>Print Standee</span>
                </button>

                <button
                  onClick={() => handleRegenerateToken(t.id, t.tableNumber)}
                  className="py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-300 hover:text-white rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
                  <span>Regenerate QR</span>
                </button>

                <button
                  onClick={() => handleToggleActive(t.id, t.isActive, t.tableNumber)}
                  className={`py-2 border rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    t.isActive
                      ? "bg-red-950/40 hover:bg-red-900/60 border-red-500/30 text-red-300"
                      : "bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/30 text-emerald-300"
                  }`}
                >
                  <Power className="h-3.5 w-3.5" />
                  <span>{t.isActive ? "Deactivate" : "Activate"}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* PRINT STANDEE MODAL / OVERLAY */}
      {printableTable && (
        <div className="fixed inset-0 bg-white text-black z-[999] p-8 flex flex-col items-center justify-center font-serif text-center print:block">
          <div className="max-w-md w-full border-4 border-black p-8 rounded-2xl space-y-6 shadow-2xl bg-white">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.4em] font-sans font-bold text-neutral-600 block">
                HOTEL YASH GRAND
              </span>
              <h2 className="text-3xl font-extrabold tracking-wide uppercase">
                Restaurant Fine Dining
              </h2>
              <p className="text-xs font-sans text-neutral-600 uppercase tracking-widest">
                Varanasi • Digital Ordering
              </p>
            </div>

            <div className="h-0.5 bg-black w-24 mx-auto" />

            <div className="py-2">
              <span className="text-lg font-bold uppercase tracking-wider block font-sans">
                TABLE NUMBER
              </span>
              <span className="text-6xl font-black font-mono">
                {printableTable.tableNumber}
              </span>
            </div>

            <div className="p-4 bg-neutral-50 border-2 border-black inline-block rounded-xl">
              <img
                src={printableTable.qrDataUrl}
                alt={`Table ${printableTable.tableNumber} Printable QR`}
                className="w-56 h-56 mx-auto object-contain"
              />
            </div>

            <div className="space-y-2 font-sans">
              <h4 className="text-base font-bold uppercase tracking-wider">
                Scan to View Menu & Order
              </h4>
              <p className="text-xs text-neutral-700 leading-relaxed max-w-xs mx-auto">
                Point your phone camera at the QR code above to immediately browse dishes and confirm your order.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-300 text-[10px] font-sans uppercase tracking-widest text-neutral-500">
              Powered by Yash Grand QR Engine
            </div>
          </div>

          <div className="mt-8 flex gap-4 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-widest rounded shadow cursor-pointer"
            >
              Print Sheet
            </button>
            <button
              onClick={() => setPrintableTable(null)}
              className="px-6 py-2.5 bg-neutral-200 text-black font-bold text-xs uppercase tracking-widest rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  Settings, 
  Building, 
  Users, 
  ShieldCheck, 
  QrCode, 
  FileText, 
  Lock, 
  RefreshCw, 
  Save, 
  CheckCircle2, 
  Plus, 
  Key, 
  Eye, 
  History, 
  Copy, 
  ExternalLink,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Send,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function ManagementSettingsPage() {
  const [activeTab, setActiveTab] = useState<"HOTEL" | "STAFF" | "PERMISSIONS" | "QR" | "LOGS">("HOTEL");
  const [settings, setSettings] = useState<any | null>(null);
  const [staffAccounts, setStaffAccounts] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loginSessions, setLoginSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Hotel Info Form State
  const [hotelName, setHotelName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [officialPhone, setOfficialPhone] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [address, setAddress] = useState("");
  const [taxPercentage, setTaxPercentage] = useState("5.0");
  const [currency, setCurrency] = useState("INR");

  // Staff Account Modal State
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    roleName: "MANAGER",
    password: "",
    isActive: true,
  });

  const fetchSettingsData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/management/settings");
      const json = await res.json();
      if (json.success) {
        setSettings(json.settings);
        setStaffAccounts(json.staffAccounts);
        setRoles(json.roles);
        setPermissions(json.permissions);
        setTables(json.tables);
        setAuditLogs(json.auditLogs);
        setLoginSessions(json.loginSessions);

        if (json.settings) {
          setHotelName(json.settings.hotelName || "");
          setGstNumber(json.settings.gstNumber || "");
          setOfficialPhone(json.settings.officialPhone || "");
          setOfficialEmail(json.settings.officialEmail || "");
          setAddress(json.settings.address || "");
          setTaxPercentage(json.settings.taxPercentage?.toString() || "5.0");
          setCurrency(json.settings.currency || "INR");
        }
      }
    } catch (err) {
      console.error("Failed to fetch management settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettingsData();
  }, [fetchSettingsData]);

  // Save Hotel Info & Taxes
  const handleSaveHotelInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/management/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-hotel-info",
          hotelName,
          gstNumber,
          officialPhone,
          officialEmail,
          address,
          taxPercentage,
          currency,
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert("Hotel Information & Tax settings saved to PostgreSQL!");
        fetchSettingsData();
      } else {
        alert(json.error || "Failed to save settings.");
      }
    } catch (err) {
      console.error("Save hotel info error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Save Staff Account
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/management/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-staff-account",
          ...staffForm,
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert("Staff account saved successfully in PostgreSQL!");
        setIsStaffModalOpen(false);
        fetchSettingsData();
      } else {
        alert(json.error || "Failed to save staff account.");
      }
    } catch (err) {
      console.error("Save staff error:", err);
    } finally {
      setSaving(false);
    }
  };

  // Regenerate Table QR Token
  const handleRegenerateQrToken = async (tableId: string) => {
    if (!confirm("Are you sure you want to regenerate the QR security token for this table?")) return;
    try {
      const res = await fetch("/api/management/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "regenerate-qr-token",
          tableId,
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert("QR token regenerated!");
        fetchSettingsData();
      }
    } catch (err) {
      console.error("Regenerate QR token error:", err);
    }
  };

  return (
    <div className="space-y-8 select-none text-left font-sans">
      
      {/* HEADER & BRANDING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              ERP Settings & Security Controls
            </h1>
            <span className="bg-[#DFBA73]/15 text-[#DFBA73] border border-[#DFBA73]/30 text-[9.5px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>Phase 8 Module</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Enterprise system configuration, staff accounts, RBAC permissions matrix, restaurant table QR management, and PostgreSQL audit trail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettingsData}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#DFBA73]" />
            <span>Sync Settings</span>
          </button>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex border-b border-white/15 gap-2 font-mono text-xs overflow-x-auto">
        {[
          { id: "HOTEL", label: "Hotel Info & Taxes", icon: Building },
          { id: "STAFF", label: "Staff Accounts", icon: Users, badge: staffAccounts.length },
          { id: "PERMISSIONS", label: "RBAC Permissions Matrix", icon: ShieldCheck, badge: roles.length },
          { id: "QR", label: "Table QR Tokens", icon: QrCode, badge: tables.length },
          { id: "LOGS", label: "Audit & Security Logs", icon: History, badge: auditLogs.length },
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

      {/* TAB 1: HOTEL INFO & TAXES FORM */}
      {activeTab === "HOTEL" && (
        <form onSubmit={handleSaveHotelInfo} className="bg-neutral-950 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-6 shadow-lux">
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#DFBA73] font-bold block">
                ENTERPRISE IDENTITY & TAXES
              </span>
              <h3 className="font-serif text-xl font-bold text-white">
                Hotel Information & Policy Settings
              </h3>
            </div>
            <Building className="h-6 w-6 text-[#DFBA73]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
            <div className="space-y-2">
              <label className="text-[10.5px] uppercase tracking-wider text-neutral-300 font-semibold block">
                Official Hotel Name
              </label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-white/15 focus:border-[#DFBA73] p-3 rounded-lg text-xs text-white outline-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10.5px] uppercase tracking-wider text-neutral-300 font-semibold block">
                GSTIN / Tax Identification Number
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-white/15 focus:border-[#DFBA73] p-3 rounded-lg text-xs text-white outline-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10.5px] uppercase tracking-wider text-neutral-300 font-semibold block">
                Official Contact Phone / WhatsApp Business
              </label>
              <input
                type="text"
                value={officialPhone}
                onChange={(e) => setOfficialPhone(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-white/15 focus:border-[#DFBA73] p-3 rounded-lg text-xs text-white outline-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10.5px] uppercase tracking-wider text-neutral-300 font-semibold block">
                Official Contact Email
              </label>
              <input
                type="email"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-white/15 focus:border-[#DFBA73] p-3 rounded-lg text-xs text-white outline-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10.5px] uppercase tracking-wider text-neutral-300 font-semibold block">
                Tax GST Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-white/15 focus:border-[#DFBA73] p-3 rounded-lg text-xs text-white outline-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10.5px] uppercase tracking-wider text-neutral-300 font-semibold block">
                Currency Code
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
                className="w-full bg-neutral-900 border border-white/15 focus:border-[#DFBA73] p-3 rounded-lg text-xs text-white outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-[10.5px] uppercase tracking-wider text-neutral-300 font-semibold block">
                Property Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                required
                className="w-full bg-neutral-900 border border-white/15 focus:border-[#DFBA73] p-3 rounded-lg text-xs text-white outline-none font-sans resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#DFBA73] hover:bg-[#c5a880] text-black font-bold text-xs uppercase tracking-widest rounded-lg shadow-lux transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving to PostgreSQL..." : "Save Hotel Settings"}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: STAFF ACCOUNTS MANAGEMENT */}
      {activeTab === "STAFF" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-neutral-950 p-4 border border-white/10 rounded-xl">
            <h3 className="font-serif text-lg font-bold text-white">Staff Management Accounts</h3>
            <button
              onClick={() => {
                setStaffForm({
                  userId: "",
                  name: "",
                  email: "",
                  phone: "",
                  roleName: "MANAGER",
                  password: "",
                  isActive: true,
                });
                setIsStaffModalOpen(true);
              }}
              className="px-4 py-2 bg-[#DFBA73] text-black font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Staff Account</span>
            </button>
          </div>

          <div className="overflow-x-auto bg-neutral-950 border border-white/10 rounded-xl shadow-lux">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-neutral-900/90 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
                <tr>
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-200 font-mono">
                {staffAccounts.map((staff) => (
                  <tr key={staff.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white font-sans">{staff.name}</td>
                    <td className="py-3.5 px-4">{staff.email}</td>
                    <td className="py-3.5 px-4 text-[#DFBA73] font-bold">{staff.role?.name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[9.5px] uppercase font-bold px-2 py-0.5 rounded ${
                        staff.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                      }`}>
                        {staff.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">{new Date(staff.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setStaffForm({
                            userId: staff.id,
                            name: staff.name,
                            email: staff.email,
                            phone: staff.phone || "",
                            roleName: staff.role?.name || "MANAGER",
                            password: "",
                            isActive: staff.isActive,
                          });
                          setIsStaffModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/15 rounded text-[11px] font-mono cursor-pointer"
                      >
                        Edit Account
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TABLES & QR CODE MANAGEMENT */}
      {activeTab === "QR" && (
        <div className="space-y-6">
          <div className="bg-neutral-950 border border-white/10 p-6 rounded-2xl space-y-4 shadow-lux">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#DFBA73] font-bold block">
                QR SECURITY TOKENS & DINING TABLES
              </span>
              <h3 className="font-serif text-xl font-bold text-white">
                Restaurant Tables QR Management (Table 1 to 10)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
              {tables.map((t) => {
                const qrUrl = `https://hotelyashgrand.com/menu?table=${t.tableNumber}&token=${t.token}`;

                return (
                  <div key={t.id} className="p-4 bg-neutral-900 rounded-xl border border-white/10 space-y-3">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="font-serif text-base font-bold text-white">Table {t.tableNumber}</span>
                      <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    </div>

                    <div className="text-[10px] text-neutral-400 truncate">
                      Token: <span className="text-neutral-300">{t.token?.slice(0, 12)}...</span>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(qrUrl);
                          alert(`Copied QR URL for Table ${t.tableNumber}!`);
                        }}
                        className="w-full py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-white/15 text-neutral-200 text-[10.5px] rounded flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Copy className="h-3 w-3 text-[#DFBA73]" />
                        <span>Copy QR URL</span>
                      </button>

                      <button
                        onClick={() => handleRegenerateQrToken(t.id)}
                        className="w-full py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-[10.5px] rounded flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Regenerate Token</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT & SECURITY LOGS */}
      {activeTab === "LOGS" && (
        <div className="space-y-6">
          <div className="bg-neutral-950 border border-white/10 p-6 rounded-2xl space-y-4 shadow-lux">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#DFBA73] font-bold block">
                SECURITY & AUDIT TRAIL
              </span>
              <h3 className="font-serif text-xl font-bold text-white">
                PostgreSQL Operational Audit Log
              </h3>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-neutral-900/60 rounded-lg border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-[#DFBA73] font-bold uppercase text-[10.5px] block">{log.action}</span>
                    <span className="text-white text-xs">{log.details}</span>
                  </div>
                  <span className="text-neutral-500 text-[11px] shrink-0">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAFF ACCOUNT EDIT/CREATE MODAL */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md bg-neutral-950 border border-[#DFBA73]/40 rounded-2xl p-6 space-y-6 shadow-lux text-left"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">
                {staffForm.userId ? "Edit Staff Account" : "Add Staff Account"}
              </h3>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Close [Esc]
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold block">Full Name</label>
                <input
                  type="text"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  required
                  className="w-full bg-neutral-900 border border-white/15 p-2.5 rounded text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold block">Staff Email</label>
                <input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  required
                  className="w-full bg-neutral-900 border border-white/15 p-2.5 rounded text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold block">Assigned Role</label>
                <select
                  value={staffForm.roleName}
                  onChange={(e) => setStaffForm({ ...staffForm, roleName: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/15 p-2.5 rounded text-white outline-none font-mono cursor-pointer"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="RECEPTION">RECEPTION</option>
                  <option value="RESTAURANT_MANAGER">RESTAURANT_MANAGER</option>
                  <option value="ACCOUNTS">ACCOUNTS</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-semibold block">
                  Password {staffForm.userId && "(Leave blank to keep current password)"}
                </label>
                <input
                  type="password"
                  value={staffForm.password}
                  onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                  placeholder="••••••••••••"
                  required={!staffForm.userId}
                  className="w-full bg-neutral-900 border border-white/15 p-2.5 rounded text-white outline-none font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-300 rounded font-mono text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#DFBA73] text-black font-bold rounded font-mono text-xs cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}

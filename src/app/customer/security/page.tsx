"use client";

import React, { useEffect, useState } from "react";
import { CustomerNavbar } from "../CustomerNavbar";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Smartphone, 
  Laptop, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Save 
} from "lucide-react";

export default function CustomerSecurityPage() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    async function loadCustomer() {
      try {
        const res = await fetch("/api/customer/auth/me");
        const data = await res.json();
        if (data.success) setCustomer(data.customer);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomer();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/customer/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to update password.");
        setSaving(false);
        return;
      }

      setSuccessMsg("Security password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090D] text-white flex flex-col">
        <CustomerNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090D] text-white flex flex-col selection:bg-[#C5A880] selection:text-black">
      <CustomerNavbar customerName={customer?.name} customerEmail={customer?.email} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-white/10 pb-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#C5A880]">
            Account Security & Credentials
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your login password, active sessions, and multi-factor verification settings.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Password Update Form */}
        <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-[#C5A880]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Change Password</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs text-[#C5A880] hover:underline flex items-center gap-1 font-medium"
            >
              {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPasswords ? "Hide Passwords" : "Show Passwords"}</span>
            </button>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Current Password *
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                New Password *
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Confirm New Password *
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-lg shadow-[#C5A880]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Overview */}
        <div className="bg-[#0F1115] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Protection Details</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-neutral-950/80 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Laptop className="w-4 h-4 text-[#C5A880]" />
                <div>
                  <div className="font-semibold text-white">HTTP-Only Encrypted Cookies</div>
                  <div className="text-[11px] text-neutral-400">Protects against XSS and token hijacking</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-neutral-950/80 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-[#C5A880]" />
                <div>
                  <div className="font-semibold text-white">Bcrypt Salt Hashing</div>
                  <div className="text-[11px] text-neutral-400">Passwords stored with 12 rounds of cryptographic salt</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ENFORCED
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

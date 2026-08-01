"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Crown, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle 
} from "lucide-react";
import { motion } from "framer-motion";

function ManagementLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/management";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/management/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setErrorMessage(json.error || "Invalid email or password.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Password@123");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-[#12141A]/90 border border-[#C8A96A]/30 backdrop-blur-2xl rounded-2xl p-8 sm:p-10 space-y-8 shadow-[0_16px_50px_rgba(0,0,0,0.8)] relative z-10 text-left"
    >
      {/* BRANDING HEADER */}
      <div className="text-center space-y-3">
        <div className="h-16 w-16 bg-gradient-to-br from-[#C8A96A]/25 to-black border border-[#C8A96A]/50 rounded-2xl flex items-center justify-center mx-auto text-[#C8A96A] shadow-[0_0_25px_rgba(200,169,106,0.3)]">
          <Crown className="h-9 w-9" />
        </div>

        <div>
          <span className="text-[9px] uppercase tracking-[0.35em] text-[#C8A96A] font-serif font-bold block">
            LUXURY ERP MANAGEMENT PORTAL
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-white mt-1">
            HOTEL YASH GRAND
          </h1>
          <p className="text-xs text-neutral-400 font-sans mt-1">
            Authenticated Staff Access Only • Encrypted PostgreSQL Session
          </p>
        </div>
      </div>

      {/* ERROR ALERT */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-red-950/80 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-center gap-2.5 font-sans"
        >
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {/* FORM */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-neutral-300 font-semibold block font-mono">
            Staff Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-[#C8A96A]/70" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@hotelyashgrand.com"
              required
              className="w-full bg-[#0B0B0B] border border-[#C8A96A]/20 focus:border-[#C8A96A] pl-10 pr-4 py-3 rounded-xl text-xs text-white placeholder-neutral-600 outline-none transition-all font-mono"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-neutral-300 font-semibold block font-mono">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-[#C8A96A]/70" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#0B0B0B] border border-[#C8A96A]/20 focus:border-[#C8A96A] pl-10 pr-4 py-3 rounded-xl text-xs text-white placeholder-neutral-600 outline-none transition-all font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-gradient-to-r from-[#C8A96A] via-[#DFBA73] to-[#C8A96A] hover:opacity-95 text-black font-serif font-bold text-xs uppercase tracking-widest transition-all rounded-xl shadow-[0_4px_20px_rgba(200,169,106,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
        >
          <span>{submitting ? "Authenticating..." : "Sign In to Management Portal"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* QUICK ROLE DEMO SELECTOR */}
      <div className="border-t border-[#C8A96A]/15 pt-6 space-y-3">
        <span className="text-[9.5px] uppercase tracking-widest text-neutral-400 font-serif font-bold block text-center">
          Quick Access (Pre-seeded PostgreSQL Accounts)
        </span>

        <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
          <button
            type="button"
            onClick={() => fillQuickLogin("admin@hotelyashgrand.com")}
            className="p-2.5 bg-[#0B0B0B] hover:bg-neutral-900 border border-[#C8A96A]/20 text-[#C8A96A] rounded-xl text-left transition-colors cursor-pointer"
          >
            👑 Super Admin
          </button>

          <button
            type="button"
            onClick={() => fillQuickLogin("manager@hotelyashgrand.com")}
            className="p-2.5 bg-[#0B0B0B] hover:bg-neutral-900 border border-emerald-500/20 text-emerald-300 rounded-xl text-left transition-colors cursor-pointer"
          >
            👔 Hotel Manager
          </button>

          <button
            type="button"
            onClick={() => fillQuickLogin("reception@hotelyashgrand.com")}
            className="p-2.5 bg-[#0B0B0B] hover:bg-neutral-900 border border-blue-500/20 text-blue-300 rounded-xl text-left transition-colors cursor-pointer"
          >
            🏨 Receptionist
          </button>

          <button
            type="button"
            onClick={() => fillQuickLogin("restaurant@hotelyashgrand.com")}
            className="p-2.5 bg-[#0B0B0B] hover:bg-neutral-900 border border-purple-500/20 text-purple-300 rounded-xl text-left transition-colors cursor-pointer"
          >
            🍽️ Restaurant Lead
          </button>
        </div>
      </div>

      <p className="text-[10px] text-neutral-500 text-center font-sans">
        Hotel Yash Grand Encrypted Security Engine • Protected by RBAC Middleware
      </p>
    </motion.div>
  );
}

export default function ManagementLoginPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col justify-center items-center p-4 sm:p-6 font-sans select-none relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C8A96A]/10 blur-[140px] rounded-full pointer-events-none" />
      <Suspense fallback={<div className="text-xs font-mono text-[#C8A96A] animate-pulse">Loading Management Portal...</div>}>
        <ManagementLoginForm />
      </Suspense>
    </div>
  );
}

"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Crown, Lock, Mail, Phone, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/customer/dashboard";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/customer/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred while signing in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090D] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#8C6D3F]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Crest Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#C5A880] via-[#E6C687] to-[#8C6D3F] p-0.5 shadow-xl shadow-[#C5A880]/20 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-[#0F1115] rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-[#C5A880]" />
              </div>
            </div>
            <h1 className="mt-4 font-serif text-2xl font-bold tracking-widest text-[#C5A880]">
              HOTEL YASH GRAND
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold mt-1">
              Varanasi • Luxury Guest Portal
            </p>
          </Link>

          <h2 className="mt-6 text-xl font-semibold tracking-wide text-white font-sans">
            Welcome Back, Valued Guest
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Sign in to access your room bookings, banquet requests, and exclusive privileges.
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-8 bg-[#0F1115]/90 border border-[#C5A880]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative shadow-black/80">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-300 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                Mobile Number or Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4 text-[#C5A880]/70" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. +91 9876543210 or guest@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Password
                </label>
                <Link
                  href="/customer/forgot-password"
                  className="text-xs text-[#C5A880] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4 text-[#C5A880]/70" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="w-full pl-10 pr-10 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-lg shadow-[#C5A880]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating Guest...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
              New Guest?
            </span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <Link
            href="/customer/register"
            className="w-full py-3 px-4 rounded-xl border border-[#C5A880]/40 bg-neutral-900/50 hover:bg-[#C5A880]/10 text-[#C5A880] font-semibold text-xs text-center block transition-all"
          >
            Create Customer Account
          </Link>
        </div>

        {/* Security badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
          <span>Encrypted Session • HTTP-Only Cookie Security</span>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
      </div>
    }>
      <CustomerLoginForm />
    </Suspense>
  );
}

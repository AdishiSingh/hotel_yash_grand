"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { Crown, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const { isAuthenticated, customer } = useBookingGuard();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (nextAuthStatus === "authenticated" || isAuthenticated || customer) {
      router.replace("/customer/dashboard");
    }
  }, [nextAuthStatus, isAuthenticated, customer, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/customer/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/customer/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during registration.");
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLoading(true);
    setError(null);

    try {
      await signIn("google", { callbackUrl: "/customer/dashboard" });
    } catch (err: any) {
      console.error("Google OAuth error:", err);
      setError(err?.message || "Failed to launch Google Sign-In.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090D] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Crest */}
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#C5A880] via-[#E6C687] to-[#8C6D3F] p-0.5 shadow-xl shadow-[#C5A880]/20 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#0F1115] rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-[#C5A880]" />
              </div>
            </div>
            <h1 className="mt-4 font-serif text-2xl font-bold tracking-widest text-[#C5A880]">
              HOTEL YASH GRAND
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold mt-1">
              Varanasi • Registration
            </p>
          </Link>

          <h2 className="mt-6 text-xl font-semibold tracking-wide text-white">
            Register Guest Account
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Create your account to seamlessly book rooms, reserve banquets, and track reservations.
          </p>
        </div>

        {/* Form Container */}
        <div className="mt-8 bg-[#0F1115]/90 border border-[#C5A880]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative shadow-black/80">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-300">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* PROMINENT GOOGLE REGISTRATION BUTTON */}
          <div className="mb-6">
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleAuth}
              className="w-full py-3.5 px-4 bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer border border-gray-300 min-h-[48px]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? "Connecting to Google..." : "Continue with Google"}</span>
            </button>

            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0F1115] px-3 text-[10px] uppercase font-bold tracking-widest text-neutral-400 shrink-0">
                OR REGISTER WITH EMAIL
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4 text-[#C5A880]/70" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Phone className="w-4 h-4 text-[#C5A880]/70" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Email Address (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4 text-[#C5A880]/70" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. guest@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Create Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4 text-[#C5A880]/70" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4 text-[#C5A880]/70" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-lg shadow-[#C5A880]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Customer Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Account Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-400">
              Already registered as a guest?{" "}
              <Link href="/customer/login" className="text-[#C5A880] font-semibold hover:underline">
                Sign In Here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
          <span>Your data is protected under strict privacy standards.</span>
        </div>
      </div>
    </div>
  );
}

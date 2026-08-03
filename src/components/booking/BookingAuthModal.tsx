"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { 
  Crown, 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Clock,
  Edit,
  History,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookingAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer: any) => void;
  initialGuestName?: string;
  initialGuestPhone?: string;
  initialGuestEmail?: string;
}

export function BookingAuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialGuestName = "",
  initialGuestPhone = "",
  initialGuestEmail = "",
}: BookingAuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState(initialGuestPhone || initialGuestEmail || "");
  const [loginPassword, setLoginPassword] = useState("");

  // Register Form State
  const [regName, setRegName] = useState(initialGuestName);
  const [regPhone, setRegPhone] = useState(initialGuestPhone);
  const [regEmail, setRegEmail] = useState(initialGuestEmail);
  const [regPassword, setRegPassword] = useState("");

  // Forgot Password Form State
  const [forgotEmail, setForgotEmail] = useState(initialGuestEmail || "");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLoading(true);
    setError(null);

    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setError(err?.message || "Google authentication service error.");
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/customer/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      onSuccess(data.customer);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/customer/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          phone: regPhone,
          email: regEmail,
          password: regPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Registration failed. Please check your details.");
        setLoading(false);
        return;
      }

      onSuccess(data.customer);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotSuccess(false);

    if (!forgotEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/customer/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to process password reset request.");
      } else {
        setForgotSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Password reset request error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-4xl bg-[#0F1115] border border-[#C5A880]/40 rounded-3xl shadow-2xl overflow-hidden z-10 grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto"
        >
          {/* Left Column: Brand & Benefits Banner */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#161922] via-[#0F1115] to-[#07090D] p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#C5A880]/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#C5A880] to-[#8C6D3F] p-0.5 shadow-lg">
                  <div className="w-full h-full bg-[#0F1115] rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-[#C5A880]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#C5A880] tracking-wider">HOTEL YASH GRAND</h3>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-semibold block">Guest Privilege Portal</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                  Continue Your Booking
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Sign in to securely continue your reservation.
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-bold block">
                  Guest Account Benefits
                </span>

                <div className="space-y-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-950/80 border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span className="text-white font-medium">Track your booking</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-950/80 border border-white/5">
                    <History className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span className="text-white font-medium">View booking history</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-950/80 border border-white/5">
                    <Sparkles className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span className="text-white font-medium">Manage future reservations</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-950/80 border border-white/5">
                    <Zap className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span className="text-white font-medium">Receive instant booking updates</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-950/80 border border-white/5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span className="text-white font-medium">Secure your reservation</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-[10px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span>Encrypted Session • HTTP-Only Cookie Protection</span>
            </div>
          </div>

          {/* Right Column: Auth Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 pt-2">
              {/* PROMINENT GOOGLE AUTHENTICATION BUTTON */}
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleAuth}
                className="w-full py-3.5 px-4 bg-white text-gray-900 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer border border-gray-300 min-h-[48px]"
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

              {/* OR DIVIDER */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0F1115] px-3 text-[10px] uppercase font-bold tracking-widest text-neutral-400 shrink-0">
                  OR
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>
            </div>

            {/* Mode Toggle Tabs */}
            {mode !== "forgot" && (
              <div className="flex items-center gap-2 bg-neutral-950 p-1.5 rounded-xl border border-white/10 w-fit">
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(null); }}
                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    mode === "login"
                      ? "bg-[#C5A880] text-black shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("register"); setError(null); }}
                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    mode === "register"
                      ? "bg-[#C5A880] text-black shadow-md"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {mode === "login" && (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Mobile Number or Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4 text-[#C5A880]/70" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. +91 9876543210 or guest@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => { setMode("forgot"); setError(null); }}
                      className="text-[11px] text-[#C5A880] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Lock className="w-4 h-4 text-[#C5A880]/70" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter security password"
                      className="w-full pl-10 pr-10 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880]"
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
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-lg shadow-[#C5A880]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating & Proceeding...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In & Complete Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {mode === "register" && (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <User className="w-4 h-4 text-[#C5A880]/70" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Phone className="w-4 h-4 text-[#C5A880]/70" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4 text-[#C5A880]/70" />
                    </div>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="guest@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Create Security Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Lock className="w-4 h-4 text-[#C5A880]/70" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880]"
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
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-lg shadow-[#C5A880]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account & Booking...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account & Complete Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {mode === "forgot" && (
              /* FORGOT PASSWORD FORM */
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  Enter your registered email address below. We will send password reset instructions to your inbox.
                </p>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Registered Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4 text-[#C5A880]/70" />
                    </div>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="guest@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                {forgotSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300">
                    Password reset link generated. Check instructions or click the generated link.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Instructions...</span>
                    </>
                  ) : (
                    <span>Request Password Reset</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(null); }}
                  className="w-full text-center text-[11px] uppercase font-bold tracking-wider text-neutral-400 hover:text-white pt-1 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

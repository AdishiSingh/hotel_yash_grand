"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Crown, Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = searchParams.get("token");

  // Step 1: Forgot Password Request (Identifier: Email or Phone)
  const [identifier, setIdentifier] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccessMsg, setRequestSuccessMsg] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  // Step 2: Reset Password (using Token)
  const [resetToken, setResetToken] = useState(tokenFromUrl || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRequestSuccessMsg(null);
    setRequestLoading(true);

    try {
      const res = await fetch("/api/customer/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to process request.");
        setRequestLoading(false);
        return;
      }

      setRequestSuccessMsg(data.message);
      if (data.resetToken) {
        setGeneratedToken(data.resetToken);
        setResetToken(data.resetToken);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setResetLoading(true);

    try {
      const res = await fetch("/api/customer/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to reset password.");
        setResetLoading(false);
        return;
      }

      setResetSuccess(true);
      setTimeout(() => {
        router.push("/customer/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "An error occurred while resetting password.");
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090D] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A880]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
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
              Varanasi • Security Recovery
            </p>
          </Link>

          <h2 className="mt-6 text-xl font-semibold tracking-wide text-white">
            Account Password Recovery
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Recover access to your HOTEL YASH GRAND guest account safely.
          </p>
        </div>

        <div className="mt-8 bg-[#0F1115]/90 border border-[#C5A880]/25 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative shadow-black/80">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-300">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resetSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Password Reset Successful</h3>
              <p className="text-xs text-neutral-400">
                Your password has been updated securely. Redirecting to sign in page...
              </p>
              <Loader2 className="w-5 h-5 text-[#C5A880] animate-spin mx-auto mt-2" />
            </div>
          ) : resetToken ? (
            /* Step 2: Set New Password Form */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-xl text-xs text-[#C5A880] flex items-center gap-2">
                <KeyRound className="w-4 h-4 shrink-0" />
                <span>Verification token loaded. Enter your new password below.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4 text-[#C5A880]/70" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
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
                  Confirm New Password
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
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-lg shadow-[#C5A880]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 1: Request Reset Link Form */
            <form onSubmit={handleRequestReset} className="space-y-5">
              {requestSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Request Processed</span>
                  </div>
                  <p>{requestSuccessMsg}</p>
                  {generatedToken && (
                    <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-mono text-white">
                      Token for testing: <span className="bg-black/50 px-2 py-0.5 rounded text-[#C5A880]">{generatedToken}</span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Registered Mobile Number or Email
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
                    placeholder="Enter email or mobile number"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={requestLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-lg shadow-[#C5A880]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {requestLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Security Token...</span>
                  </>
                ) : (
                  <>
                    <span>Request Password Reset</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link
              href="/customer/login"
              className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-[#C5A880] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Guest Sign In</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
          <span>Security Tokens expire in 60 minutes for safety.</span>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090D] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}

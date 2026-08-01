"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Crown, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setErrorMsg("No verification token provided in URL.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/customer/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          setErrorMsg(json.error || "Email verification failed.");
        } else {
          setSuccessMsg(json.message || "Email address verified successfully!");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Verification request failed.");
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#07090D] text-white flex flex-col items-center justify-center p-4 selection:bg-[#C5A880] selection:text-black">
      <div className="w-full max-w-md bg-[#0F1115] border border-[#C5A880]/30 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#C5A880] to-[#8C6D3F] p-0.5 flex items-center justify-center shadow-xl shadow-[#C5A880]/10">
          <div className="w-full h-full bg-[#0F1115] rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-[#C5A880]" />
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block">
            HOTEL YASH GRAND
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#C5A880] mt-1">
            Email Verification
          </h1>
        </div>

        {loading ? (
          <div className="py-6 space-y-3">
            <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin mx-auto" />
            <p className="text-xs text-neutral-400 font-mono">Verifying email credentials in PostgreSQL...</p>
          </div>
        ) : successMsg ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>

            <Link
              href="/customer/dashboard"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#C5A880]/20 hover:opacity-95 transition-all"
            >
              <span>Go to Customer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 justify-center">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>

            <Link
              href="/customer/login"
              className="w-full py-3.5 rounded-xl bg-neutral-900 border border-white/10 text-[#C5A880] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#C5A880]/10 transition-all"
            >
              <span>Return to Customer Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CustomerVerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090D] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

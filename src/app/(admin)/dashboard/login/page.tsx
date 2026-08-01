"use client";

import * as React from "react";
import { ShieldCheck, Lock, User, Key, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("dharmpal@hotelyashgrand.com");
  const [password, setPassword] = React.useState("password123");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials or unauthorized account.");
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      }
    } catch (err: any) {
      setError("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6 font-sans">
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mx-auto text-[#C5A880]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-white tracking-wide">
          Hotel Yash Grand Authentication
        </h2>
        <p className="text-xs text-neutral-400 font-light">
          Secure NextAuth login for duty managers, cashiers, and receptionists.
        </p>
      </div>

      <div className="bg-neutral-950 border border-white/10 p-6 rounded-xl shadow-lux space-y-5">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Email Address</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="dharmpal@hotelyashgrand.com"
                className="w-full bg-neutral-900 border border-white/10 focus:border-[#C5A880] py-2.5 pl-10 pr-4 rounded-sm text-xs text-white outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Security Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-neutral-900 border border-white/10 focus:border-[#C5A880] py-2.5 pl-10 pr-4 rounded-sm text-xs text-white outline-none font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500/30 rounded-sm text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/30 rounded-sm text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Authentication Granted! Redirecting...</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C5A880] hover:bg-[#A37C40] text-black font-bold text-xs uppercase tracking-widest transition-all rounded-sm shadow-md cursor-pointer min-h-[44px]"
            >
              {loading ? "Verifying Credentials..." : "Log Into ERP System →"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

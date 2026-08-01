import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full border border-red-500/20 bg-red-950/10 p-8 rounded-2xl text-center space-y-6 shadow-lux">
        <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">403 — Access Forbidden</h1>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Your current operation role does not have security permissions to access this page or resource in Hotel Yash Grand ERP.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3 font-buttons">
          <Link
            href="/dashboard"
            className="w-full py-3.5 bg-[#C5A880] hover:bg-[#A37C40] text-black font-bold text-xs uppercase tracking-widest rounded-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/dashboard/login"
            className="text-xs text-neutral-400 hover:text-white pt-2 inline-block font-mono"
          >
            Switch Account Role →
          </Link>
        </div>
      </div>
    </div>
  );
}

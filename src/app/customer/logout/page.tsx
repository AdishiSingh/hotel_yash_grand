"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CustomerLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      try {
        await fetch("/api/customer/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        router.push("/customer/login");
        router.refresh();
      }
    }
    logout();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#07090D] flex flex-col items-center justify-center text-white space-y-3">
      <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
      <p className="text-xs font-mono text-neutral-400">Signing out of HOTEL YASH GRAND Customer Portal...</p>
    </div>
  );
}

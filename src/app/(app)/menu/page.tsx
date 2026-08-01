import * as React from "react";
import { Metadata } from "next";
import { MenuContainer } from "@/components/menu/MenuContainer";

export const metadata: Metadata = {
  title: "Digital Menu & Table QR Ordering | HOTEL YASH GRAND",
  description: "Browse the multi-cuisine fine dining menu of HOTEL YASH GRAND, Varanasi. Scan your table QR code to place instant orders via WhatsApp.",
};

export default function MenuPage() {
  return (
    <React.Suspense
      fallback={
        <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 border border-[#DFBA73]/25 flex items-center justify-center rounded-full bg-[#DFBA73]/[0.02]">
            <span className="font-serif text-[#DFBA73] text-xl">YG</span>
          </div>
          <span className="text-xs font-mono text-[#DFBA73] uppercase tracking-widest animate-pulse">
            Loading Menu & Table Session...
          </span>
        </div>
      }
    >
      <MenuContainer />
    </React.Suspense>
  );
}

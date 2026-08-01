import * as React from "react";
import { MenuContainer } from "@/components/menu/MenuContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "HOTEL YASH GRAND | Restaurant & Digital Menu | Varanasi",
  description: "Experience premium multi-cuisine fine dining at HOTEL YASH GRAND, Varanasi. Scan your table QR code to browse our menu and place orders.",
};

export default function DiningPage() {
  return (
    <div className="min-h-screen pt-16 bg-background">
      <React.Suspense
        fallback={
          <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 border border-[#DFBA73]/25 flex items-center justify-center rounded-full bg-[#DFBA73]/[0.02]">
              <span className="font-serif text-[#DFBA73] text-xl">YG</span>
            </div>
            <span className="text-xs font-mono text-[#DFBA73] uppercase tracking-widest animate-pulse">
              Loading Digital Dining Catalog...
            </span>
          </div>
        }
      >
        <MenuContainer />
      </React.Suspense>
    </div>
  );
}

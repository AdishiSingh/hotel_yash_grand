import * as React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yash Grand POS Terminal",
  description: "High-performance restaurant point of sale interface.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function POSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0A] text-white font-sans select-none">
      {/* POS Terminal Frame */}
      <div className="flex flex-col flex-1 h-full w-full">
        {/* Quick Header */}
        <header className="h-14 border-b border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-serif font-bold text-gold text-base tracking-wide">Yash Grand POS</span>
            <div className="h-4 w-px bg-zinc-800" />
            <span className="text-xs text-zinc-400">Terminal #01</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1">
              Table Order Mode
            </div>
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
          </div>
        </header>

        {/* Content Shell */}
        <div className="flex-1 flex overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

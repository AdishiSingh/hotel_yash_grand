import React from "react";
import { LucideIcon } from "lucide-react";

interface RoomBadgeProps {
  icon: LucideIcon;
  label: string;
}

export function RoomBadge({ icon: Icon, label }: RoomBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-[2px] backdrop-blur-sm shadow-sm select-none">
      <Icon className="h-3 w-3 text-gold/80" />
      <span className="text-[8.5px] uppercase tracking-widest text-neutral-400 font-semibold font-sans">
        {label}
      </span>
    </div>
  );
}

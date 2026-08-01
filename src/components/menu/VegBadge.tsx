import React from "react";
import { cn } from "@/lib/utils";

interface VegBadgeProps {
  type: "veg" | "non-veg";
  className?: string;
}

export function VegBadge({ type, className }: VegBadgeProps) {
  const isVeg = type === "veg";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-0.5 border backdrop-blur-md rounded-sm select-none",
        isVeg
          ? "border-emerald-500/25 bg-emerald-500/5 text-emerald-400"
          : "border-red-500/25 bg-red-500/5 text-red-400",
        className
      )}
    >
      {/* Outer Square */}
      <span
        className={cn(
          "h-3 w-3 border flex items-center justify-center rounded-[2px]",
          isVeg ? "border-emerald-500" : "border-red-500"
        )}
      >
        {/* Inner Dot */}
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            isVeg ? "bg-emerald-500" : "bg-red-500"
          )}
        />
      </span>
      <span className="text-[8px] font-bold uppercase tracking-widest font-sans">
        {isVeg ? "Veg" : "Non-Veg"}
      </span>
    </div>
  );
}

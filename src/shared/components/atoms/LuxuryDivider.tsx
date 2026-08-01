import * as React from "react";
import { cn } from "@/lib/utils";

interface LuxuryDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  withDiamond?: boolean;
}

/**
 * Editorial Luxury Divider
 * Removes obvious divider dashes. Exposes a single, ultra-thin gold hairline fading at the margins.
 */
export function LuxuryDivider({ className, withDiamond = false, ...props }: LuxuryDividerProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center w-full my-16 sm:my-28", className)}
      {...props}
    >
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold/15 to-transparent" aria-hidden="true" />
    </div>
  );
}

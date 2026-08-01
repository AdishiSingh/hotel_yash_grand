import React from "react";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  displayPrice?: string;
  selectedVariant?: { label: string; price: number };
  className?: string;
}

export function PriceTag({ price, displayPrice, selectedVariant, className }: PriceTagProps) {
  const finalPrice = selectedVariant ? selectedVariant.price : price;
  const hasDisplayPrice = !!displayPrice && !selectedVariant;

  return (
    <div className={cn("flex flex-col justify-center leading-none", className)}>
      <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A880]/70 font-sans font-medium mb-0.5">
        Tariff
      </span>
      <span className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
        {hasDisplayPrice ? displayPrice : `₹${finalPrice}`}
      </span>
    </div>
  );
}

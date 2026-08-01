import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LuxuryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "room" | "culinary" | "event";
  title: string;
  description: string;
  imageUrl: string;
  metaTags?: string[];
  priceTag?: string;
  detailsLink?: string;
}

/**
 * Redesigned Editorial Luxury Card
 * Completely removes blocky cards and borders. Relies on elegant whitespace,
 * full bleed imagery, and custom typographic reveals.
 */
export function LuxuryCard({
  variant = "room",
  title,
  description,
  imageUrl,
  metaTags = [],
  priceTag,
  detailsLink = "#",
  className,
  ...props
}: LuxuryCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden bg-transparent transition-all duration-1000 ease-expo-out",
        className
      )}
      {...props}
    >
      {/* Immersive Image Container */}
      <div className="relative w-full overflow-hidden aspect-[4/5] bg-neutral-900">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-1000 ease-expo-out group-hover:scale-105"
        />
        {/* Soft, barely visible dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent opacity-80" />

        {/* Dynamic price indicator */}
        {priceTag && (
          <div className="absolute bottom-6 left-6 text-sm font-serif text-white tracking-wide">
            {priceTag}
          </div>
        )}
      </div>

      {/* Editorial Descriptive Content */}
      <div className="flex flex-col pt-6 space-y-3">
        {/* Category tags / metadata */}
        {metaTags.length > 0 && (
          <div className="flex gap-4 text-[8px] uppercase tracking-[0.25em] text-gold font-semibold">
            {metaTags.map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        )}

        <h3 className="text-2xl font-serif font-light text-foreground tracking-wide group-hover:text-gold transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans font-light max-w-sm">
          {description}
        </p>

        {/* Minimal Underlined CTA */}
        <div className="pt-2">
          <a
            href={detailsLink}
            className="text-[9px] uppercase tracking-[0.25em] font-bold text-foreground btn-underline-expand pb-0.5 inline-block"
          >
            Explore Suite
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LuxuryInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * Custom Floating Label Input Element
 * Discards template boxes in favor of a minimal bottom line,
 * highlighting active focus with champagne gold gradients.
 */
export const LuxuryInput = React.forwardRef<HTMLInputElement, LuxuryInputProps>(
  ({ className, type = "text", label, error, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
    };

    return (
      <div className="relative w-full mb-6 group">
        {/* Floating Label */}
        <label
          className={cn(
            "absolute left-0 bottom-3 text-sm text-neutral-400 font-sans tracking-wide transition-all duration-300 pointer-events-none origin-left ease-expo-out",
            (isFocused || hasValue || props.value) &&
              "transform -translate-y-6 scale-90 text-gold font-medium"
          )}
        >
          {label}
        </label>

        {/* Input Control */}
        <div className="relative flex items-center">
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full bg-transparent border-b border-neutral-300 dark:border-neutral-800 py-2.5 text-base font-sans focus:outline-none transition-colors duration-300 ease-expo-out",
              isFocused && "border-gold",
              error && "border-red-500",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => {
              setHasValue(e.target.value.length > 0);
              props.onChange?.(e);
            }}
            {...props}
          />
          {icon && (
            <span className="absolute right-0 bottom-3 text-neutral-400 group-focus-within:text-gold transition-colors duration-300">
              {icon}
            </span>
          )}
        </div>

        {/* Dynamic bottom line slide-in indicator */}
        <div
          className={cn(
            "absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 origin-center transition-transform duration-500 ease-expo-out",
            isFocused && "scale-x-100"
          )}
        />

        {/* Error messaging */}
        {error && (
          <p className="mt-1 text-xs text-red-500 font-sans tracking-wide">
            {error}
          </p>
        )}
      </div>
    );
  }
);

LuxuryInput.displayName = "LuxuryInput";

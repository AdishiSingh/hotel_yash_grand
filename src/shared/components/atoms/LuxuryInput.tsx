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
 * Automatically floats label for pre-filled, autofilled, session-hydrated, or typed values.
 */
export const LuxuryInput = React.forwardRef<HTMLInputElement, LuxuryInputProps>(
  ({ className, type = "text", label, error, icon, placeholder = " ", id, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    // Unique ID for label htmlFor association
    const reactId = React.useId();
    const inputId = id || reactId;

    // Merge forwarded ref (from React Hook Form) with local inputRef
    const setRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      },
      [ref]
    );

    // Function to check if input currently has a value in DOM or props
    const checkValue = React.useCallback(() => {
      const domValue = inputRef.current?.value;
      const propValue = props.value;
      const defaultVal = props.defaultValue;

      const currentHasVal = Boolean(
        (domValue !== undefined && domValue !== null && domValue !== "") ||
        (propValue !== undefined && propValue !== null && propValue !== "") ||
        (defaultVal !== undefined && defaultVal !== null && defaultVal !== "")
      );

      setHasValue(currentHasVal);
    }, [props.value, props.defaultValue]);

    // Check value on mount, prop updates, and session hydration
    React.useEffect(() => {
      checkValue();
    }, [checkValue, props.value, props.defaultValue]);

    // Additional periodic checks after mount to catch async autofill & hydration
    React.useEffect(() => {
      const timer1 = setTimeout(checkValue, 50);
      const timer2 = setTimeout(checkValue, 300);
      const timer3 = setTimeout(checkValue, 1000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }, [checkValue]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      checkValue();
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      checkValue();
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      checkValue();
      props.onChange?.(e);
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      checkValue();
      props.onInput?.(e as any);
    };

    const isFloated = isFocused || hasValue || Boolean(props.value) || Boolean(props.defaultValue);

    return (
      <div className="relative w-full pt-5 pb-1 mb-5 group">
        <div className="relative flex items-center w-full">
          <input
            id={inputId}
            type={type}
            ref={setRef}
            placeholder={placeholder || " "}
            className={cn(
              "peer w-full bg-transparent border-b border-neutral-700 py-1.5 text-base font-sans text-white focus:outline-none transition-colors duration-300 ease-expo-out placeholder-transparent",
              isFocused && "border-gold",
              error && "border-red-500",
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onInput={handleInput}
            {...props}
          />

          {/* Floating Label with both CSS Peer selectors and JS state fallbacks */}
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-0 top-1 text-sm text-neutral-400 font-sans tracking-wide transition-all duration-300 pointer-events-none origin-left ease-out select-none",
              // Pure CSS Peer Floating Triggers (Instant browser rendering for pre-fill, autofill, & focus)
              "peer-focus:-translate-y-5 peer-focus:scale-85 peer-focus:text-gold peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-[11px]",
              "peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-85 peer-[:not(:placeholder-shown)]:text-gold peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:text-[11px]",
              "peer-autofill:-translate-y-5 peer-autofill:scale-85 peer-autofill:text-gold peer-autofill:font-semibold peer-autofill:uppercase peer-autofill:tracking-wider peer-autofill:text-[11px]",
              "peer-[-webkit-autofill]:-translate-y-5 peer-[-webkit-autofill]:scale-85 peer-[-webkit-autofill]:text-gold peer-[-webkit-autofill]:font-semibold peer-[-webkit-autofill]:uppercase peer-[-webkit-autofill]:tracking-wider peer-[-webkit-autofill]:text-[11px]",
              // JS State Fallback
              isFloated && "-translate-y-5 scale-85 text-gold font-semibold uppercase tracking-wider text-[11px]"
            )}
          >
            {label}
          </label>

          {icon && (
            <span className="absolute right-0 bottom-2 text-neutral-400 group-focus-within:text-gold transition-colors duration-300 pointer-events-none">
              {icon}
            </span>
          )}
        </div>

        {/* Champagne gold focus underline animation */}
        <div
          className={cn(
            "absolute bottom-1 left-0 w-full h-[1.5px] bg-gold scale-x-0 origin-center transition-transform duration-300 ease-out",
            isFocused && "scale-x-100"
          )}
        />

        {/* Error message */}
        {error && (
          <p className="mt-1 text-[11px] text-red-400 font-sans tracking-wide">
            {error}
          </p>
        )}
      </div>
    );
  }
);

LuxuryInput.displayName = "LuxuryInput";

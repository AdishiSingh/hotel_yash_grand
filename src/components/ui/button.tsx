import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A96A] disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer rounded-xl active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-[#C8A96A] via-[#DFBA73] to-[#C8A96A] text-black font-serif font-bold shadow-[0_4px_20px_rgba(200,169,106,0.3)] hover:shadow-[0_6px_25px_rgba(200,169,106,0.45)] hover:scale-[1.01]",
        accent:
          "bg-[#C8A96A] text-black font-bold hover:bg-[#DFBA73] shadow-md",
        secondary:
          "bg-[#12141A] text-white border border-[#C8A96A]/30 hover:border-[#C8A96A]/60 hover:bg-[#1A1D24] shadow-sm",
        outline:
          "bg-transparent border border-[#C8A96A] text-[#C8A96A] hover:bg-[#C8A96A]/10 hover:text-[#DFBA73]",
        ghost:
          "bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent",
        danger:
          "bg-red-950/40 border border-red-500/30 text-red-200 hover:bg-red-900/60 shadow-sm",
        success:
          "bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/60 shadow-sm",
        glass:
          "bg-[#12141A]/80 backdrop-blur-md border border-white/10 text-white hover:bg-[#12141A]/95 hover:border-[#C8A96A]/40",
        link:
          "bg-transparent text-[#C8A96A] underline-offset-4 hover:underline normal-case tracking-normal p-0 h-auto",
      },
      size: {
        xs: "h-7 px-2.5 text-[10px]",
        sm: "h-9 px-4 text-[11px]",
        default: "h-11 px-6 text-xs",
        md: "h-11 px-6 text-xs",
        lg: "h-13 px-8 text-sm",
        xl: "h-15 px-10 text-base",
        icon: "h-10 w-10 p-0 flex items-center justify-center rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      startIcon,
      endIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current mr-2" />
        ) : (
          startIcon && <span className="mr-2 inline-flex items-center">{startIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && endIcon && (
          <span className="ml-2 inline-flex items-center">{endIcon}</span>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

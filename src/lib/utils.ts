import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names safely, combining clsx and tailwind-merge.
 * Essential for custom style overrides in shadcn/ui primitives.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

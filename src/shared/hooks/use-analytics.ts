"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Global Conversions Analytics Hook
 * Tracks path shifts, WhatsApp redirections, and booking drawer interactions.
 */
export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route change
  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "page_view",
        page: pathname,
        query: searchParams.toString(),
      });
    }
  }, [pathname, searchParams]);

  const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  };

  return { trackEvent };
}

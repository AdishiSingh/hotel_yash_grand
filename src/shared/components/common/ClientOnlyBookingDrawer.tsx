"use client";

import * as React from "react";
import dynamic from "next/dynamic";

// Dynamic import with SSR disabled to isolate React Hook Form and Zod bundle bytes
const ReservationDrawer = dynamic(
  () => import("@/features/booking/components/ReservationDrawer").then((mod) => mod.ReservationDrawer),
  { ssr: false }
);

/**
 * Client-Side Only Booking Drawer Wrapper
 * Solves Next.js RSC restriction on loading dynamic components inside server layouts.
 */
export function ClientOnlyBookingDrawer() {
  return <ReservationDrawer />;
}

import * as React from "react";
import { Header } from "@/shared/components/organisms/Header";
import { Footer } from "@/shared/components/organisms/Footer";
import { ClientOnlyBookingDrawer } from "@/shared/components/common/ClientOnlyBookingDrawer";
import { AiConcierge } from "@/components/assistant/AiConcierge";

/**
 * Custom layout wrapper for public consumer-facing application pages.
 * Isolates navigation headers and booking flows from back-office admin and POS shells.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Consumer Header */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Consumer Footer */}
      <Footer />

      {/* Global Booking Workflow Drawer */}
      <ClientOnlyBookingDrawer />

      {/* AI Concierge Chatbot */}
      <AiConcierge />
    </div>
  );
}

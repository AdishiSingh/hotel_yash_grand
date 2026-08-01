"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BookingAuthModal } from "@/components/booking/BookingAuthModal";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  avatar?: string | null;
  [key: string]: any;
}

interface PendingBooking {
  action: (customer: Customer, formData?: any) => void | Promise<void>;
  formData?: any;
}

interface BookingGuardContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  loading: boolean;
  pendingFormData: any | null;
  requireAuth: (action: (customer: Customer, formData?: any) => void | Promise<void>, formData?: any) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  refreshSession: () => Promise<Customer | null>;
  logoutCustomer: () => Promise<void>;
  setPendingFormData: (data: any) => void;
}

const BookingGuardContext = createContext<BookingGuardContextType | undefined>(undefined);

export function BookingGuardProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
  const [pendingFormData, setPendingFormData] = useState<any | null>(null);

  // Fetch current session from PostgreSQL via cookie
  const refreshSession = async (): Promise<Customer | null> => {
    try {
      const res = await fetch("/api/customer/auth/me");
      const json = await res.json();
      if (res.ok && json.success && json.authenticated) {
        setCustomer(json.customer);
        return json.customer;
      } else {
        setCustomer(null);
        return null;
      }
    } catch (err) {
      console.error("Session refresh error:", err);
      setCustomer(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const logoutCustomer = async () => {
    try {
      await fetch("/api/customer/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setCustomer(null);
      setPendingBooking(null);
      setPendingFormData(null);
      window.location.href = "/";
    }
  };

  /**
   * Central Booking Guard method:
   * If customer is logged in -> executes action immediately.
   * If customer is NOT logged in -> stores action & form inputs, opens luxury Auth Modal.
   */
  const requireAuth = (
    action: (customer: Customer, formData?: any) => void | Promise<void>,
    formData?: any
  ) => {
    if (formData) {
      setPendingFormData(formData);
    }

    if (customer) {
      action(customer, formData || pendingFormData);
    } else {
      setPendingBooking({ action, formData: formData || pendingFormData });
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = async (authenticatedCustomer: Customer) => {
    setCustomer(authenticatedCustomer);
    setIsAuthModalOpen(false);

    // Resume original booking action seamlessly without re-filling forms
    if (pendingBooking && pendingBooking.action) {
      const targetFormData = pendingBooking.formData || pendingFormData;
      await pendingBooking.action(authenticatedCustomer, targetFormData);
      setPendingBooking(null);
    }
  };

  return (
    <BookingGuardContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        loading,
        pendingFormData,
        requireAuth,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        refreshSession,
        logoutCustomer,
        setPendingFormData,
      }}
    >
      {children}

      {/* Global Centralized Authentication Modal */}
      <BookingAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialGuestName={pendingFormData?.guestName || pendingFormData?.name || ""}
        initialGuestPhone={pendingFormData?.guestPhone || pendingFormData?.phone || pendingFormData?.mobile || ""}
        initialGuestEmail={pendingFormData?.guestEmail || pendingFormData?.email || ""}
      />
    </BookingGuardContext.Provider>
  );
}

export function useBookingGuard() {
  const context = useContext(BookingGuardContext);
  if (!context) {
    throw new Error("useBookingGuard must be used within a BookingGuardProvider");
  }
  return context;
}

export function useProtectedAction() {
  const { requireAuth, isAuthenticated, customer } = useBookingGuard();
  return { requireAuth, isAuthenticated, customer };
}

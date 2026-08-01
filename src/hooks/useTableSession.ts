"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getStoredTableSession, saveTableSession, clearTableSession, TableSession } from "@/lib/table-session";

export interface UseTableSessionReturn {
  isVerifying: boolean;
  isVerified: boolean;
  tableNumber: number | null;
  token: string | null;
  expiresAt: string | null;
  error: string | null;
  verifySession: (table: number, token: string) => Promise<boolean>;
  logoutSession: () => void;
}

export function useTableSession(): UseTableSessionReturn {
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifySession = useCallback(async (tNum: number, tToken: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch(`/api/table/verify?table=${tNum}&token=${encodeURIComponent(tToken)}`);
      const data = await res.json();

      if (data.success && data.verified) {
        const session: TableSession = {
          table: data.table,
          token: data.token,
          verified: true,
          expiresAt: data.expiresAt || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        };

        saveTableSession(session);
        setIsVerified(true);
        setTableNumber(session.table);
        setToken(session.token);
        setExpiresAt(session.expiresAt);
        setIsVerifying(false);
        return true;
      } else {
        clearTableSession();
        setIsVerified(false);
        setTableNumber(null);
        setToken(null);
        setExpiresAt(null);
        setError(data.message || "Invalid or expired table QR code.");
        setIsVerifying(false);
        return false;
      }
    } catch (err: any) {
      console.error("Verification fetch error:", err);
      clearTableSession();
      setIsVerified(false);
      setError("Network error validating table QR code.");
      setIsVerifying(false);
      return false;
    }
  }, []);

  const logoutSession = useCallback(() => {
    clearTableSession();
    setIsVerified(false);
    setTableNumber(null);
    setToken(null);
    setExpiresAt(null);
    setError(null);
  }, []);

  useEffect(() => {
    const urlTable = searchParams?.get("table");
    const urlToken = searchParams?.get("token");

    if (urlTable && urlToken) {
      const cleanNum = parseInt(urlTable.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(cleanNum)) {
        verifySession(cleanNum, urlToken);
        return;
      }
    }

    // Fallback: check stored local/session storage
    const stored = getStoredTableSession();
    if (stored) {
      setIsVerified(true);
      setTableNumber(stored.table);
      setToken(stored.token);
      setExpiresAt(stored.expiresAt);
      setIsVerifying(false);
    } else {
      setIsVerified(false);
      setTableNumber(null);
      setToken(null);
      setExpiresAt(null);
      setIsVerifying(false);
    }
  }, [searchParams, verifySession]);

  return {
    isVerifying,
    isVerified,
    tableNumber,
    token,
    expiresAt,
    error,
    verifySession,
    logoutSession,
  };
}

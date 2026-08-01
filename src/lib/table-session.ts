export interface TableSession {
  table: number;
  token: string;
  verified: boolean;
  expiresAt: string;
}

const SESSION_KEY = "yash_qr_table_session";

/**
 * Retrieves valid table session from sessionStorage or localStorage.
 * Checks expiry date (2 hours). Returns null if expired or invalid.
 */
export function getStoredTableSession(): TableSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed: TableSession = JSON.parse(raw);

    if (!parsed || !parsed.verified || !parsed.table || !parsed.token || !parsed.expiresAt) {
      clearTableSession();
      return null;
    }

    // Check 2 hour expiration timestamp
    const expiryTime = new Date(parsed.expiresAt).getTime();
    if (isNaN(expiryTime) || Date.now() > expiryTime) {
      clearTableSession();
      return null;
    }

    return parsed;
  } catch (err) {
    console.error("Error reading stored table session:", err);
    clearTableSession();
    return null;
  }
}

/**
 * Saves verified table session into both sessionStorage and localStorage
 */
export function saveTableSession(session: TableSession): void {
  if (typeof window === "undefined") return;

  try {
    const payload = JSON.stringify(session);
    sessionStorage.setItem(SESSION_KEY, payload);
    localStorage.setItem(SESSION_KEY, payload);
    localStorage.setItem("yash_table_number", `T-${String(session.table).padStart(2, "0")}`);
  } catch (err) {
    console.error("Error saving table session:", err);
  }
}

/**
 * Clears table session
 */
export function clearTableSession(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error("Error clearing table session:", err);
  }
}

import crypto from "crypto";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

export interface TableSessionData {
  table: number;
  token: string;
  verified: boolean;
  expiresAt: string;
}

/**
 * Generates a cryptographically secure random hex token for table QR code
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

/**
 * Generates a Data URL (PNG base64) for a given table QR code URL
 */
export async function generateTableQRCodeDataUrl(
  tableNumber: number,
  token: string,
  baseUrl?: string
): Promise<string> {
  const host = baseUrl || process.env.NEXT_PUBLIC_APP_URL || "https://hotelyashgrand.com";
  const qrUrl = `${host}/menu?table=${tableNumber}&token=${token}`;

  try {
    const dataUrl = await QRCode.toDataURL(qrUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#0F1115",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    });
    return dataUrl;
  } catch (err) {
    console.error("Failed to generate QR Code Data URL:", err);
    throw new Error("QR Code generation failed");
  }
}

/**
 * Validates table existence, active status, token match, and expiration in PostgreSQL DB
 */
export async function validateTableToken(
  tableNumber: number,
  token: string
): Promise<{
  valid: boolean;
  message?: string;
  table?: { id: string; tableNumber: number; token: string };
  expiresAt?: string;
}> {
  if (!tableNumber || !token || typeof token !== "string") {
    return { valid: false, message: "Missing table number or token parameter" };
  }

  try {
    const tableRecord = await prisma.restaurantTable.findUnique({
      where: { tableNumber },
    });

    if (!tableRecord) {
      return { valid: false, message: `Table ${tableNumber} does not exist.` };
    }

    if (!tableRecord.isActive) {
      return { valid: false, message: `Table ${tableNumber} QR code is currently inactive.` };
    }

    if (tableRecord.token !== token) {
      return { valid: false, message: "Invalid or expired QR code token." };
    }

    if (tableRecord.expiresAt && new Date() > new Date(tableRecord.expiresAt)) {
      return { valid: false, message: "This QR code session has expired. Please ask staff to refresh." };
    }

    // Default session validity is 2 hours from validation
    const expiresAtDate = new Date(Date.now() + 2 * 60 * 60 * 1000);

    return {
      valid: true,
      table: {
        id: tableRecord.id,
        tableNumber: tableRecord.tableNumber,
        token: tableRecord.token,
      },
      expiresAt: expiresAtDate.toISOString(),
    };
  } catch (error: any) {
    console.error("Error validating table token:", error);
    return { valid: false, message: "Database verification error" };
  }
}

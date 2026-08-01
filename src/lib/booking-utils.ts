/**
 * HOTEL YASH GRAND — Centralized Hospitality & Booking Utility Library
 * Core pure functions for pricing calculations, date validations, booking ID generation,
 * status timeline mapping, and input sanitization.
 */

export type RoomCategory = "DELUXE" | "EXECUTIVE" | "FAMILY" | "SUITE" | "PRESIDENTIAL";
export type BanquetPackage = "SILVER" | "GOLD" | "ROYAL_PLATINUM";

export interface PricingResult {
  baseRatePerNight: number;
  totalNights: number;
  subtotal: number;
  extraGuestFee: number;
  gstAmount: number; // 18% GST for luxury hospitality in India
  discountAmount: number;
  grandTotal: number;
}

export interface BanquetPricingResult {
  perPlateRate: number;
  guestsCount: number;
  hallRentalFee: number;
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
}

/**
 * 1. Booking ID Generator
 * Generates unique, enterprise-formatted booking IDs (e.g. YG-REQ-2026-9812).
 */
export function generateBookingId(type: "ROOM" | "BANQUET" | "TABLE" = "ROOM", timestamp = Date.now()): string {
  const year = new Date(timestamp).getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const prefix = type === "ROOM" ? "YG-REQ" : type === "BANQUET" ? "YG-BQ" : "YG-[#]";
  return `${prefix}-${year}-${randomSuffix}`;
}

/**
 * 2. Date Range Validation & Stay Duration
 * Validates check-in and check-out dates and calculates night count.
 */
export function validateBookingDates(checkInStr: string, checkOutStr: string): {
  isValid: boolean;
  nights: number;
  error?: string;
} {
  if (!checkInStr || !checkOutStr) {
    return { isValid: false, nights: 0, error: "Check-in and check-out dates are required." };
  }

  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return { isValid: false, nights: 0, error: "Invalid date format." };
  }

  // Clear time component for pure date comparison
  checkIn.setHours(0, 0, 0, 0);
  checkOut.setHours(0, 0, 0, 0);

  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return { isValid: false, nights: 0, error: "Check-out date must be after check-in date." };
  }

  if (diffDays > 30) {
    return { isValid: false, nights: diffDays, error: "Maximum stay duration is 30 nights." };
  }

  return { isValid: true, nights: diffDays };
}

/**
 * 3. Room Tariff & Pricing Calculations
 * Calculates room base rates, extra guest surcharges, 18% GST, discounts, and total bill.
 */
export function calculateStayPricing(
  roomType: string,
  nights: number,
  adults: number = 1,
  children: number = 0,
  promoCode?: string
): PricingResult {
  const normType = (roomType || "").toUpperCase();

  let baseRate = 3500; // Single Deluxe default
  if (normType.includes("EXECUTIVE")) baseRate = 5500;
  if (normType.includes("FAMILY")) baseRate = 7500;
  if (normType.includes("ROYAL") || normType.includes("SUITE")) baseRate = 9500;
  if (normType.includes("PRESIDENTIAL")) baseRate = 18000;

  const validNights = Math.max(1, Math.floor(Number.isFinite(nights) ? nights : 1));
  const validAdults = Math.max(1, Math.floor(Number.isFinite(adults) ? adults : 1));

  // Extra guest fee for > 2 adults (₹1,000 per extra adult per night)
  const extraAdults = Math.max(0, validAdults - 2);
  const extraGuestFee = extraAdults * 1000 * validNights;

  const subtotal = (baseRate * validNights) + extraGuestFee;

  // Promo code discount evaluation
  let discountAmount = 0;
  const cleanPromo = (promoCode || "").trim().toUpperCase();
  if (cleanPromo === "YASH10") {
    discountAmount = Math.round(subtotal * 0.10); // 10% discount
  } else if (cleanPromo === "LUXURYVIP") {
    discountAmount = Math.round(subtotal * 0.20); // 20% discount
  }

  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const gstAmount = Math.round(taxableSubtotal * 0.18); // 18% GST
  const grandTotal = taxableSubtotal + gstAmount;

  return {
    baseRatePerNight: baseRate,
    totalNights: validNights,
    subtotal,
    extraGuestFee,
    gstAmount,
    discountAmount,
    grandTotal,
  };
}

/**
 * 4. Banquet Celebration Pricing Calculations
 * Calculates catering per-plate rates, hall rental, 18% GST, and grand total.
 */
export function calculateBanquetPricing(
  packageType: BanquetPackage = "GOLD",
  guestsCount: number = 100
): BanquetPricingResult {
  const validGuests = Math.max(50, guestsCount);

  let perPlateRate = 1200; // Gold default
  let hallRentalFee = 25000;

  if (packageType === "SILVER") {
    perPlateRate = 950;
    hallRentalFee = 20000;
  } else if (packageType === "ROYAL_PLATINUM") {
    perPlateRate = 1800;
    hallRentalFee = 50000;
  }

  const cateringTotal = perPlateRate * validGuests;
  const subtotal = cateringTotal + hallRentalFee;
  const gstAmount = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gstAmount;

  return {
    perPlateRate,
    guestsCount: validGuests,
    hallRentalFee,
    subtotal,
    gstAmount,
    grandTotal,
  };
}

/**
 * 5. Indian Phone Number Sanitizer & Validator
 * Standardizes phone numbers to clean 10-digit formats.
 */
export function sanitizePhoneNumber(phone: string): { isValid: boolean; cleanPhone: string } {
  if (!phone) return { isValid: false, cleanPhone: "" };

  const digits = phone.replace(/\D/g, "");

  // Handles +91, 91, or 0 prefixes
  let cleanPhone = digits;
  if (digits.length === 12 && digits.startsWith("91")) {
    cleanPhone = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    cleanPhone = digits.slice(1);
  }

  const isValid = cleanPhone.length === 10 && /^[6-9]\d{9}$/.test(cleanPhone);

  return { isValid, cleanPhone };
}

/**
 * 6. Timeline Progress Step Calculation (1-9)
 * Maps stay status and communication logs to timeline progress step index.
 */
export function computeTimelineStep(status: string, logsCount: number = 0): number {
  const s = (status || "").toUpperCase();

  if (s === "CHECKED_OUT" || s === "COMPLETED") return 9;
  if (s === "CHECKED_IN") return 8;
  if (s === "ROOM_READY" || s === "READY") return 7;
  if (s === "PAID" || s === "PAYMENT_VERIFIED") return 6;
  if (s === "PAYMENT_PENDING") return 5;
  if (s === "CONFIRMED" || s === "APPROVED" || s === "BOOKED") return 4;
  if (s === "CONTACTED" || logsCount > 0) return 3;
  if (s === "IN_PROGRESS" || s === "ASSIGNED") return 2;
  return 1; // Default SUBMITTED
}

/**
 * Shared Enterprise Test Fixtures & Constants for Vitest Unit Testing
 */

export const TEST_FIXTURES = {
  PHONE: {
    STANDARD_10_DIGIT: "9151088115",
    WITH_PLUS_91: "+91 91510 88115",
    WITH_ZERO_PREFIX: "09151088115",
    WITH_SYMBOLS: "+91 (91510)-88115",
    INVALID_SHORT: "98765",
    INVALID_PREFIX: "1234567890",
  },
  GUEST: {
    NAME: "Autonomous Test Guest",
    EMAIL: "guest@yashgrand.com",
    PASSWORD: "RoyalGuestPassword123!",
    WRONG_PASSWORD: "WrongPassword999!",
  },
  DATES: {
    CHECK_IN: "2026-08-10",
    CHECK_OUT: "2026-08-15",
    ISO_CHECK_IN: "2026-08-10T12:00:00Z",
    ISO_CHECK_OUT: "2026-08-15T10:00:00Z",
  },
  ORDER_PAYLOAD: {
    tableNumber: "T-04",
    customerName: "Royal Guest",
    customerPhone: "9151088115",
    items: [
      {
        menuItemId: "item-1",
        itemName: "Paneer Tikka Grand",
        quantity: 2,
        price: 350,
      },
    ],
    paymentMethod: "CASH" as const,
  },
  ROOM_BOOKING_PAYLOAD: {
    roomId: "room-101",
    customerName: "Adishi Singh",
    customerPhone: "9151088115",
    customerEmail: "adishi@yashgrand.com",
    checkIn: "2026-08-10T12:00:00Z",
    checkOut: "2026-08-15T10:00:00Z",
    guests: 2,
    totalAmount: 17500,
  },
};

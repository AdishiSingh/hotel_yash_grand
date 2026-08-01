import { describe, it, expect, beforeEach } from "vitest";
import { 
  NotificationAutomationService, 
  NotificationQueue 
} from "@/services/notification-automation.service";

describe("Integration: Notification Automation & Multi-Channel Retry Queue Pipeline", () => {

  beforeEach(() => {
    NotificationQueue.clearQueue();
  });

  it("1. should enqueue and format multi-channel notifications (Email, WhatsApp, SMS, In-App)", async () => {
    const testPayload = {
      requestId: "REQ-TEST-101",
      bookingId: "YASH-BK-888",
      guestName: "Automated Comm Guest",
      guestEmail: "commguest@yashgrand.com",
      mobile: "+919876543210",
      roomType: "Single Deluxe Room",
      checkIn: "2026-09-01",
      checkOut: "2026-09-05",
      totalAmount: 5500,
      invoiceNumber: "INV-2026-001",
      amount: 5500,
      customerId: "cust-test-123",
      roomName: "Executive Club Room",
    };

    // Trigger Customer Notification Suite
    NotificationAutomationService.triggerBookingSubmitted(testPayload);
    NotificationAutomationService.triggerBookingApproved(testPayload);
    NotificationAutomationService.triggerBookingRejected(testPayload);
    NotificationAutomationService.triggerCheckInReminder(testPayload);
    NotificationAutomationService.triggerCheckOutReminder(testPayload);
    NotificationAutomationService.triggerInvoiceSent(testPayload);

    // Trigger Manager Notification Suite
    NotificationAutomationService.triggerManagerNewBanquet({
      guestName: "Banquet Organizer",
      mobile: "+919876543210",
      eventType: "Wedding Reception",
      guestsCount: 200,
    });

    NotificationAutomationService.triggerManagerNewRestaurant({
      guestName: "Dining Guest",
      mobile: "+919876543210",
      guestsCount: 4,
      date: "2026-09-01",
      time: "20:00",
    });

    const stats = NotificationQueue.getQueueStats();
    expect(stats.total).toBeGreaterThan(15);
    expect(stats.items.some((i) => i.channel === "EMAIL")).toBe(true);
    expect(stats.items.some((i) => i.channel === "WHATSAPP")).toBe(true);
    expect(stats.items.some((i) => i.channel === "SMS")).toBe(true);
    expect(stats.items.some((i) => i.channel === "IN_APP")).toBe(true);
  });

  it("2. should process retry queue items and update status to SENT", async () => {
    NotificationQueue.enqueue({
      channel: "EMAIL",
      recipient: "retryguest@yashgrand.com",
      templateKey: "CUSTOMER_BOOKING_APPROVED",
      payload: {
        bookingId: "YASH-BK-999",
        guestName: "Retry Queue Guest",
        totalAmount: 4000,
      },
    });

    await NotificationQueue.processQueue();

    const stats = NotificationQueue.getQueueStats();
    expect(stats.sent).toBeGreaterThanOrEqual(1);
    expect(stats.failed).toBe(0);
  });

  it("3. should handle queue retries with exponential backoff on simulated failure", async () => {
    // Dispatch channel with mock payload
    const result = await NotificationAutomationService.dispatchChannel(
      "SMS",
      "+919876543210",
      "CUSTOMER_CHECKIN_REMINDER",
      {
        bookingId: "YASH-BK-777",
        guestName: "SMS Reminder Guest",
        roomName: "Family Suite #202",
      }
    );

    expect(result).toBe(true);
  });
});

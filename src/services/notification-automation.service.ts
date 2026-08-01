import prisma from "@/lib/prisma";
import { EmailService } from "./email.service";
import { NotificationService } from "./notification.service";
import { NotificationType } from "@prisma/client";

export type NotificationChannel = "EMAIL" | "WHATSAPP" | "SMS" | "IN_APP";

export interface QueueItem {
  id: string;
  channel: NotificationChannel;
  recipient: string;
  templateKey: string;
  payload: any;
  retries: number;
  maxRetries: number;
  status: "PENDING" | "PROCESSING" | "SENT" | "FAILED";
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationQueue {
  private static queue: QueueItem[] = [];
  private static isProcessing = false;

  public static enqueue(item: Omit<QueueItem, "id" | "retries" | "maxRetries" | "status" | "createdAt" | "updatedAt">): QueueItem {
    const queueItem: QueueItem = {
      ...item,
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      retries: 0,
      maxRetries: 3,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.queue.push(queueItem);
    this.processQueue();
    return queueItem;
  }

  private static currentProcessPromise: Promise<void> | null = null;

  public static async processQueue(): Promise<void> {
    if (this.currentProcessPromise) {
      return this.currentProcessPromise;
    }

    this.isProcessing = true;
    this.currentProcessPromise = (async () => {
      try {
        while (this.queue.some((i) => i.status === "PENDING" || (i.status === "FAILED" && i.retries < i.maxRetries))) {
          const item = this.queue.find((i) => i.status === "PENDING" || (i.status === "FAILED" && i.retries < i.maxRetries));
          if (!item) break;

          item.status = "PROCESSING";
          item.updatedAt = new Date();

          try {
            const success = await NotificationAutomationService.dispatchChannel(item.channel, item.recipient, item.templateKey, item.payload);

            if (success) {
              item.status = "SENT";
            } else {
              item.retries += 1;
              item.lastError = "Delivery failure returned by channel handler.";
              item.status = item.retries >= item.maxRetries ? "FAILED" : "PENDING";
            }
          } catch (err: any) {
            item.retries += 1;
            item.lastError = err.message || "Execution exception thrown.";
            item.status = item.retries >= item.maxRetries ? "FAILED" : "PENDING";
          }

          item.updatedAt = new Date();
        }
      } finally {
        this.isProcessing = false;
        this.currentProcessPromise = null;
      }
    })();

    return this.currentProcessPromise;
  }

  public static getQueueStats() {
    return {
      total: this.queue.length,
      pending: this.queue.filter((i) => i.status === "PENDING").length,
      sent: this.queue.filter((i) => i.status === "SENT").length,
      failed: this.queue.filter((i) => i.status === "FAILED").length,
      items: [...this.queue],
    };
  }

  public static clearQueue() {
    this.queue = [];
  }
}

export class NotificationAutomationService {
  /**
   * Channel dispatcher routing requests to specific templates & delivery providers
   */
  public static async dispatchChannel(
    channel: NotificationChannel,
    recipient: string,
    templateKey: string,
    payload: any
  ): Promise<boolean> {
    switch (channel) {
      case "EMAIL":
        return await this.sendEmailNotification(recipient, templateKey, payload);

      case "WHATSAPP":
        return await this.sendWhatsAppNotification(recipient, templateKey, payload);

      case "SMS":
        return await this.sendSMSNotification(recipient, templateKey, payload);

      case "IN_APP":
        return await this.sendInAppNotification(recipient, templateKey, payload);

      default:
        return false;
    }
  }

  /**
   * 1. EMAIL Notification Templates Handler
   */
  private static async sendEmailNotification(to: string, templateKey: string, payload: any): Promise<boolean> {
    let subject = "Hotel Yash Grand Notification";
    let htmlContent = "";

    switch (templateKey) {
      case "CUSTOMER_BOOKING_SUBMITTED":
        subject = `Booking Request Submitted — ${payload.requestId || payload.bookingId}`;
        htmlContent = `<p>Dear <strong>${payload.guestName}</strong>,</p>
          <p>Your room booking request <strong>#${payload.requestId || payload.bookingId}</strong> has been received and saved under your verified customer profile.</p>
          <p>Details: ${payload.roomType || "Deluxe Stay"} (${payload.checkIn} to ${payload.checkOut}). Our Front Desk Manager is currently reviewing your tariff.</p>`;
        break;

      case "CUSTOMER_BOOKING_APPROVED":
        subject = `Booking Approved & Confirmed — ${payload.bookingId || payload.requestId}`;
        htmlContent = `<p>Dear <strong>${payload.guestName}</strong>,</p>
          <p>Great news! Your booking request <strong>#${payload.bookingId || payload.requestId}</strong> has been approved by Duty Manager.</p>
          <p>Room: ${payload.roomName || "Executive Room"} | Total Tariff: ₹${payload.totalAmount}</p>
          <p>Remarks: ${payload.managerRemarks || "Room confirmed."}</p>`;
        break;

      case "CUSTOMER_BOOKING_REJECTED":
        subject = `Booking Request Update — ${payload.requestId}`;
        htmlContent = `<p>Dear <strong>${payload.guestName}</strong>,</p>
          <p>Regrettably, your booking request <strong>#${payload.requestId}</strong> could not be accommodated for your selected stay dates.</p>
          <p>Reason: ${payload.rejectionReason || "Selected dates or rooms are unavailable."}</p>`;
        break;

      case "CUSTOMER_CHECKIN_REMINDER":
        subject = `Check-in Reminder — Hotel Yash Grand Stay Today!`;
        htmlContent = `<p>Dear <strong>${payload.guestName}</strong>,</p>
          <p>We are delighted to welcome you today! Your check-in is scheduled for 12:00 PM at Hotel Yash Grand.</p>
          <p>Booking Token: <strong>#${payload.bookingId}</strong> | Room: ${payload.roomName}</p>`;
        break;

      case "CUSTOMER_CHECKOUT_REMINDER":
        subject = `Check-out Reminder & Express Folio — Hotel Yash Grand`;
        htmlContent = `<p>Dear <strong>${payload.guestName}</strong>,</p>
          <p>We hope you enjoyed your stay! Reminder that check-out is scheduled for 11:00 AM today.</p>
          <p>Please settle any room service orders at Front Desk or online portal.</p>`;
        break;

      case "CUSTOMER_INVOICE_SENT":
        subject = `Official GST Tax Invoice — ${payload.invoiceNumber}`;
        htmlContent = `<p>Dear <strong>${payload.guestName}</strong>,</p>
          <p>Thank you for staying at Hotel Yash Grand. Please find your digital GST invoice tax summary attached below.</p>
          <p>Invoice #: <strong>${payload.invoiceNumber}</strong> | Amount Paid: ₹${payload.amount}</p>`;
        break;

      case "MANAGER_NEW_BOOKING":
        subject = `[Manager Alert] New Room Booking Request — ${payload.guestName}`;
        htmlContent = `<p>A new online room booking request was submitted:</p>
          <p>Guest: ${payload.guestName} (${payload.mobile}) | Type: ${payload.roomType} | Dates: ${payload.checkIn} to ${payload.checkOut}</p>`;
        break;

      case "MANAGER_NEW_BANQUET":
        subject = `[Manager Alert] New Banquet Event Inquiry — ${payload.guestName}`;
        htmlContent = `<p>A new banquet event inquiry was submitted:</p>
          <p>Organizer: ${payload.guestName} (${payload.mobile}) | Event: ${payload.eventType} | Guests: ${payload.guestsCount}</p>`;
        break;

      case "MANAGER_NEW_RESTAURANT":
        subject = `[Manager Alert] New Table Reservation — ${payload.guestName}`;
        htmlContent = `<p>A new restaurant table reservation was submitted:</p>
          <p>Guest: ${payload.guestName} (${payload.mobile}) | Guests: ${payload.guestsCount} | Date/Time: ${payload.date} at ${payload.time}</p>`;
        break;

      default:
        htmlContent = `<p>${payload.message || "Notification from Hotel Yash Grand."}</p>`;
    }

    return await EmailService.sendEmail({ to, subject, html: htmlContent });
  }

  /**
   * 2. WHATSAPP Message Formatter & Deep Link Generator
   */
  private static async sendWhatsAppNotification(to: string, templateKey: string, payload: any): Promise<boolean> {
    let messageText = "";

    switch (templateKey) {
      case "CUSTOMER_BOOKING_SUBMITTED":
        messageText = `🏨 *HOTEL YASH GRAND*\nHello ${payload.guestName}, your room booking request *#${payload.requestId || payload.bookingId}* has been received! Our Front Desk Manager is currently processing your tariff.`;
        break;

      case "CUSTOMER_BOOKING_APPROVED":
        messageText = `🎉 *BOOKING APPROVED*\nHello ${payload.guestName}, your room booking *#${payload.bookingId || payload.requestId}* is CONFIRMED! Tariff: ₹${payload.totalAmount}. We look forward to welcoming you!`;
        break;

      case "CUSTOMER_BOOKING_REJECTED":
        messageText = `ℹ️ *BOOKING UPDATE*\nHello ${payload.guestName}, your request *#${payload.requestId}* could not be confirmed. Reason: ${payload.rejectionReason || "Dates unavailable"}.`;
        break;

      case "CUSTOMER_CHECKIN_REMINDER":
        messageText = `🔑 *CHECK-IN REMINDER*\nHello ${payload.guestName}, we are excited to welcome you today! Your Room *${payload.roomName}* is ready for check-in at 12:00 PM. Token: *#${payload.bookingId}*.`;
        break;

      case "CUSTOMER_CHECKOUT_REMINDER":
        messageText = `🛎️ *CHECK-OUT REMINDER*\nHello ${payload.guestName}, reminder that check-out is scheduled for 11:00 AM today. Thank you for staying with Hotel Yash Grand!`;
        break;

      case "CUSTOMER_INVOICE_SENT":
        messageText = `📄 *GST TAX INVOICE*\nHello ${payload.guestName}, your digital tax invoice *#${payload.invoiceNumber}* for ₹${payload.amount} is ready in your customer portal.`;
        break;

      case "MANAGER_NEW_BANQUET":
        messageText = `👑 *NEW BANQUET INQUIRY*\nOrganizer: ${payload.guestName} (${payload.mobile})\nEvent: ${payload.eventType}\nGuests: ${payload.guestsCount}`;
        break;

      case "MANAGER_NEW_RESTAURANT":
        messageText = `🍽️ *TABLE RESERVATION*\nGuest: ${payload.guestName} (${payload.mobile})\nGuests: ${payload.guestsCount}\nTime: ${payload.date} at ${payload.time}`;
        break;

      default:
        messageText = `🏨 *HOTEL YASH GRAND*: ${payload.message || "Notification update."}`;
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[WhatsAppService] Simulated WhatsApp message to ${to}: "${messageText.replace(/\n/g, " ")}"`);
    }

    return true;
  }

  /**
   * 3. SMS-Ready DLT Formatter Architecture
   */
  private static async sendSMSNotification(to: string, templateKey: string, payload: any): Promise<boolean> {
    let smsText = "";

    switch (templateKey) {
      case "CUSTOMER_BOOKING_SUBMITTED":
        smsText = `Hotel Yash Grand: Request #${payload.requestId} received for ${payload.guestName}. Desk is processing your stay.`;
        break;

      case "CUSTOMER_BOOKING_APPROVED":
        smsText = `Hotel Yash Grand: Booking #${payload.bookingId} CONFIRMED for ${payload.guestName}. Tariff: Rs.${payload.totalAmount}.`;
        break;

      case "CUSTOMER_BOOKING_REJECTED":
        smsText = `Hotel Yash Grand: Request #${payload.requestId} declined. Reason: ${payload.rejectionReason || "Unavailable"}.`;
        break;

      case "CUSTOMER_CHECKIN_REMINDER":
        smsText = `Hotel Yash Grand: Welcome ${payload.guestName}! Check-in today at 12 PM. Token: #${payload.bookingId}.`;
        break;

      case "CUSTOMER_CHECKOUT_REMINDER":
        smsText = `Hotel Yash Grand: Check-out reminder for ${payload.guestName} today at 11 AM. Thank you!`;
        break;

      case "CUSTOMER_INVOICE_SENT":
        smsText = `Hotel Yash Grand: GST Invoice #${payload.invoiceNumber} generated for Rs.${payload.amount}.`;
        break;

      default:
        smsText = `Hotel Yash Grand: ${payload.message || "Notification"}`;
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[SMSService] Simulated DLT SMS to ${to}: "${smsText}"`);
    }

    return true;
  }

  /**
   * 4. IN_APP Customer Portal Notification Handler
   */
  private static async sendInAppNotification(customerId: string, templateKey: string, payload: any): Promise<boolean> {
    try {
      let title = "Stay Notification";
      let message = payload.message || "Notification update from Hotel Yash Grand.";
      let type: NotificationType = NotificationType.INFO;

      if (templateKey === "CUSTOMER_BOOKING_SUBMITTED") {
        title = "Booking Request Submitted";
        message = `Your room booking request #${payload.requestId} has been submitted for manager review.`;
      } else if (templateKey === "CUSTOMER_BOOKING_APPROVED") {
        title = "Booking Approved & Confirmed";
        message = `Your room booking #${payload.bookingId} has been approved! Tariff: ₹${payload.totalAmount}.`;
        type = NotificationType.SUCCESS;
      } else if (templateKey === "CUSTOMER_BOOKING_REJECTED") {
        title = "Booking Request Update";
        message = `Your booking request #${payload.requestId} was declined. Reason: ${payload.rejectionReason}`;
        type = NotificationType.WARNING;
      } else if (templateKey === "CUSTOMER_CHECKIN_REMINDER") {
        title = "Check-in Scheduled Today";
        message = `Your check-in at Hotel Yash Grand is today at 12:00 PM. Token: #${payload.bookingId}.`;
        type = NotificationType.INFO;
      } else if (templateKey === "CUSTOMER_CHECKOUT_REMINDER") {
        title = "Check-out Scheduled Today";
        message = `Reminder that check-out is scheduled for 11:00 AM today.`;
        type = NotificationType.INFO;
      } else if (templateKey === "CUSTOMER_INVOICE_SENT") {
        title = "GST Invoice Available";
        message = `Digital tax invoice #${payload.invoiceNumber} has been generated.`;
        type = NotificationType.SUCCESS;
      }

      if (customerId) {
        await prisma.notification.create({
          data: {
            customerId,
            title,
            message,
            type,
            link: "/customer/dashboard",
          },
        }).catch(() => {});
      } else {
        await NotificationService.createNotification({
          title,
          message,
          type,
          link: "/customer/dashboard",
        });
      }

      return true;
    } catch (err) {
      console.error("[InAppNotification] Failure:", err);
      return false;
    }
  }

  // =======================================================
  // AUTOMATED EVENT TRIGGER SUITE
  // =======================================================

  public static triggerBookingSubmitted(payload: {
    requestId: string;
    guestName: string;
    guestEmail?: string;
    mobile: string;
    roomType?: string;
    checkIn?: string;
    checkOut?: string;
    customerId?: string;
  }) {
    if (payload.guestEmail) {
      NotificationQueue.enqueue({ channel: "EMAIL", recipient: payload.guestEmail, templateKey: "CUSTOMER_BOOKING_SUBMITTED", payload });
    }
    NotificationQueue.enqueue({ channel: "WHATSAPP", recipient: payload.mobile, templateKey: "CUSTOMER_BOOKING_SUBMITTED", payload });
    NotificationQueue.enqueue({ channel: "SMS", recipient: payload.mobile, templateKey: "CUSTOMER_BOOKING_SUBMITTED", payload });
    if (payload.customerId) {
      NotificationQueue.enqueue({ channel: "IN_APP", recipient: payload.customerId, templateKey: "CUSTOMER_BOOKING_SUBMITTED", payload });
    }

    // Manager Alert
    NotificationQueue.enqueue({ channel: "EMAIL", recipient: "yashgrand03nov@gmail.com", templateKey: "MANAGER_NEW_BOOKING", payload });
  }

  public static triggerBookingApproved(payload: {
    requestId: string;
    bookingId?: string;
    guestName: string;
    guestEmail?: string;
    mobile: string;
    roomName?: string;
    totalAmount: number;
    managerRemarks?: string;
    customerId?: string;
  }) {
    if (payload.guestEmail) {
      NotificationQueue.enqueue({ channel: "EMAIL", recipient: payload.guestEmail, templateKey: "CUSTOMER_BOOKING_APPROVED", payload });
    }
    NotificationQueue.enqueue({ channel: "WHATSAPP", recipient: payload.mobile, templateKey: "CUSTOMER_BOOKING_APPROVED", payload });
    NotificationQueue.enqueue({ channel: "SMS", recipient: payload.mobile, templateKey: "CUSTOMER_BOOKING_APPROVED", payload });
    if (payload.customerId) {
      NotificationQueue.enqueue({ channel: "IN_APP", recipient: payload.customerId, templateKey: "CUSTOMER_BOOKING_APPROVED", payload });
    }
    NotificationQueue.processQueue();
  }

  public static triggerBookingRejected(payload: {
    requestId: string;
    guestName: string;
    guestEmail?: string;
    mobile: string;
    rejectionReason?: string;
    customerId?: string;
  }) {
    if (payload.guestEmail) {
      NotificationQueue.enqueue({ channel: "EMAIL", recipient: payload.guestEmail, templateKey: "CUSTOMER_BOOKING_REJECTED", payload });
    }
    NotificationQueue.enqueue({ channel: "WHATSAPP", recipient: payload.mobile, templateKey: "CUSTOMER_BOOKING_REJECTED", payload });
    NotificationQueue.enqueue({ channel: "SMS", recipient: payload.mobile, templateKey: "CUSTOMER_BOOKING_REJECTED", payload });
    if (payload.customerId) {
      NotificationQueue.enqueue({ channel: "IN_APP", recipient: payload.customerId, templateKey: "CUSTOMER_BOOKING_REJECTED", payload });
    }
  }

  public static triggerCheckInReminder(payload: {
    bookingId: string;
    guestName: string;
    guestEmail?: string;
    mobile: string;
    roomName: string;
    customerId?: string;
  }) {
    if (payload.guestEmail) {
      NotificationQueue.enqueue({ channel: "EMAIL", recipient: payload.guestEmail, templateKey: "CUSTOMER_CHECKIN_REMINDER", payload });
    }
    NotificationQueue.enqueue({ channel: "WHATSAPP", recipient: payload.mobile, templateKey: "CUSTOMER_CHECKIN_REMINDER", payload });
    NotificationQueue.enqueue({ channel: "SMS", recipient: payload.mobile, templateKey: "CUSTOMER_CHECKIN_REMINDER", payload });
    if (payload.customerId) {
      NotificationQueue.enqueue({ channel: "IN_APP", recipient: payload.customerId, templateKey: "CUSTOMER_CHECKIN_REMINDER", payload });
    }
  }

  public static triggerCheckOutReminder(payload: {
    bookingId: string;
    guestName: string;
    guestEmail?: string;
    mobile: string;
    customerId?: string;
  }) {
    if (payload.guestEmail) {
      NotificationQueue.enqueue({ channel: "EMAIL", recipient: payload.guestEmail, templateKey: "CUSTOMER_CHECKOUT_REMINDER", payload });
    }
    NotificationQueue.enqueue({ channel: "WHATSAPP", recipient: payload.mobile, templateKey: "CUSTOMER_CHECKOUT_REMINDER", payload });
    NotificationQueue.enqueue({ channel: "SMS", recipient: payload.mobile, templateKey: "CUSTOMER_CHECKOUT_REMINDER", payload });
    if (payload.customerId) {
      NotificationQueue.enqueue({ channel: "IN_APP", recipient: payload.customerId, templateKey: "CUSTOMER_CHECKOUT_REMINDER", payload });
    }
  }

  public static triggerInvoiceSent(payload: {
    invoiceNumber: string;
    guestName: string;
    guestEmail?: string;
    mobile: string;
    amount: number;
    customerId?: string;
  }) {
    if (payload.guestEmail) {
      NotificationQueue.enqueue({ channel: "EMAIL", recipient: payload.guestEmail, templateKey: "CUSTOMER_INVOICE_SENT", payload });
    }
    NotificationQueue.enqueue({ channel: "WHATSAPP", recipient: payload.mobile, templateKey: "CUSTOMER_INVOICE_SENT", payload });
    NotificationQueue.enqueue({ channel: "SMS", recipient: payload.mobile, templateKey: "CUSTOMER_INVOICE_SENT", payload });
    if (payload.customerId) {
      NotificationQueue.enqueue({ channel: "IN_APP", recipient: payload.customerId, templateKey: "CUSTOMER_INVOICE_SENT", payload });
    }
  }

  public static triggerManagerNewBanquet(payload: {
    guestName: string;
    mobile: string;
    eventType: string;
    guestsCount: number;
  }) {
    NotificationQueue.enqueue({ channel: "EMAIL", recipient: "yashgrand03nov@gmail.com", templateKey: "MANAGER_NEW_BANQUET", payload });
    NotificationQueue.enqueue({ channel: "WHATSAPP", recipient: "919151088115", templateKey: "MANAGER_NEW_BANQUET", payload });
  }

  public static triggerManagerNewRestaurant(payload: {
    guestName: string;
    mobile: string;
    guestsCount: number;
    date: string;
    time: string;
  }) {
    NotificationQueue.enqueue({ channel: "EMAIL", recipient: "yashgrand03nov@gmail.com", templateKey: "MANAGER_NEW_RESTAURANT", payload });
    NotificationQueue.enqueue({ channel: "WHATSAPP", recipient: "919151088115", templateKey: "MANAGER_NEW_RESTAURANT", payload });
  }
}

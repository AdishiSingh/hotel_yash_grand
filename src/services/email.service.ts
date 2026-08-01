import nodemailer from "nodemailer";
import { AuditLogService } from "@/services/audit.service";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "yashgrand03nov@gmail.com",
      pass: process.env.SMTP_PASS || "mock-app-password-2026",
    },
  });

  /**
   * Helper to send HTML emails with luxury Hotel Yash Grand branding
   */
  public static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[EmailService] Simulating email delivery to ${options.to}: "${options.subject}"`);
        await AuditLogService.log({
          action: "EMAIL_SENT_SIMULATED",
          details: `Sent email '${options.subject}' to ${options.to}`,
        });
        return true;
      }

      await this.transporter.sendMail({
        from: '"Hotel Yash Grand" <yashgrand03nov@gmail.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      await AuditLogService.log({
        action: "EMAIL_SENT_SUCCESS",
        details: `Sent email '${options.subject}' to ${options.to}`,
      });

      return true;
    } catch (err: any) {
      console.error("[EmailService] Failed to send email:", err);
      await AuditLogService.log({
        action: "EMAIL_SENT_FAILED",
        details: `Failed sending email to ${options.to}: ${err.message}`,
      });
      return false;
    }
  }

  /**
   * Generate luxury HTML Email Wrapper layout
   */
  private static getEmailTemplateWrapper(title: string, bodyContent: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0B0D10; color: #E5E5E5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #0F1115; border: 1px solid rgba(197, 168, 128, 0.3); border-radius: 12px; overflow: hidden; }
            .header { background-color: #050608; border-b: 1px solid rgba(197, 168, 128, 0.2); padding: 24px; text-align: center; }
            .header h1 { font-family: Georgia, serif; color: #C5A880; margin: 0; font-size: 22px; letter-spacing: 2px; }
            .header p { color: #888888; font-size: 10px; text-transform: uppercase; tracking: 3px; margin-top: 4px; }
            .content { padding: 32px 24px; }
            .footer { background-color: #050608; padding: 20px; text-align: center; border-t: 1px solid rgba(255, 255, 255, 0.05); font-size: 11px; color: #777777; }
            .gold-btn { display: inline-block; background-color: #C5A880; color: #000000; font-weight: bold; text-transform: uppercase; font-size: 11px; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 16px; }
            .badge { display: inline-block; background: rgba(197, 168, 128, 0.15); border: 1px solid rgba(197, 168, 128, 0.4); color: #C5A880; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { text-align: left; padding: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px; }
            th { color: #C5A880; text-transform: uppercase; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>HOTEL YASH GRAND</h1>
              <p>Luxury Stay • Awadhi Dining • Banquet</p>
            </div>
            <div class="content">
              <h2 style="font-family: Georgia, serif; color: #FFFFFF; font-size: 18px; margin-top: 0;">${title}</h2>
              ${bodyContent}
            </div>
            <div class="footer">
              <p style="margin: 0 0 8px 0;">Hotel Yash Grand • Bypass Road, Adjacent to SMS College, Varanasi, UP 221011</p>
              <p style="margin: 0;">Contact: +91 91510 88115 | Email: yashgrand03nov@gmail.com</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * 1. Room Booking Confirmation Email
   */
  public static async sendRoomBookingEmail(data: {
    guestName: string;
    guestEmail: string;
    bookingId: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    advancePaid: number;
  }) {
    const body = `
      <p>Dear <strong>${data.guestName}</strong>,</p>
      <p>Thank you for choosing Hotel Yash Grand. Your room reservation request has been confirmed with booking reference <span class="badge">${data.bookingId}</span>.</p>
      
      <table>
        <tr><th>Reservation Detail</th><th>Information</th></tr>
        <tr><td>Guest Name</td><td>${data.guestName}</td></tr>
        <tr><td>Room Category</td><td>${data.roomName}</td></tr>
        <tr><td>Check-in Date</td><td>${data.checkIn}</td></tr>
        <tr><td>Check-out Date</td><td>${data.checkOut}</td></tr>
        <tr><td>Total Tariff</td><td>₹${data.totalAmount}</td></tr>
        <tr><td>Advance Paid</td><td>₹${data.advancePaid}</td></tr>
      </table>

      <div style="text-align: center; margin-top: 24px;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${data.bookingId}" alt="Check-in QR Code" style="border: 4px solid #C5A880; border-radius: 8px;"/>
        <p style="font-size: 11px; color: #888888; margin-top: 8px;">Scan at reception front desk for express check-in</p>
      </div>
    `;

    return this.sendEmail({
      to: data.guestEmail,
      subject: `Room Reservation Confirmed — ${data.bookingId}`,
      html: this.getEmailTemplateWrapper("Room Booking Confirmation", body),
    });
  }

  /**
   * 2. Payment Receipt Email
   */
  public static async sendPaymentReceiptEmail(data: {
    guestName: string;
    guestEmail: string;
    paymentId: string;
    invoiceNumber: string;
    amount: number;
    paymentMethod: string;
  }) {
    const body = `
      <p>Dear <strong>${data.guestName}</strong>,</p>
      <p>We have successfully received your payment. Please find your official GST payment receipt summary below.</p>
      
      <table>
        <tr><th>Receipt Field</th><th>Details</th></tr>
        <tr><td>Payment ID</td><td>${data.paymentId}</td></tr>
        <tr><td>GST Invoice No.</td><td>${data.invoiceNumber}</td></tr>
        <tr><td>Payment Method</td><td>${data.paymentMethod}</td></tr>
        <tr><td>Amount Paid</td><td><strong>₹${data.amount}</strong></td></tr>
        <tr><td>Status</td><td><span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #10B981; border-color: rgba(16, 185, 129, 0.4);">SUCCESS</span></td></tr>
      </table>
    `;

    return this.sendEmail({
      to: data.guestEmail,
      subject: `Official Payment Receipt — ${data.invoiceNumber}`,
      html: this.getEmailTemplateWrapper("Payment Receipt & GST Tax Invoice", body),
    });
  }

  /**
   * 3. Contact Enquiry Manager Alert Email
   */
  public static async sendContactNotificationToManager(data: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message: string;
  }) {
    const body = `
      <p>A new website contact enquiry was submitted by a potential guest:</p>
      
      <table>
        <tr><th>Field</th><th>Submitted Value</th></tr>
        <tr><td>Sender Name</td><td>${data.name}</td></tr>
        <tr><td>Phone Number</td><td>${data.phone}</td></tr>
        <tr><td>Email Address</td><td>${data.email || "N/A"}</td></tr>
        <tr><td>Subject</td><td>${data.subject || "General Inquiry"}</td></tr>
        <tr><td>Message Body</td><td>${data.message}</td></tr>
      </table>

      <a href="https://hotelyashgrand.com/dashboard/enquiries" class="gold-btn">Open Admin Inbox →</a>
    `;

    return this.sendEmail({
      to: "yashgrand03nov@gmail.com",
      subject: `[Urgant] New Website Inquiry — ${data.name}`,
      html: this.getEmailTemplateWrapper("Inbound Customer Enquiry Alert", body),
    });
  }
}

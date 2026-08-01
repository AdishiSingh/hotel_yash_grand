import { AuditLogService } from "@/services/audit.service";

export interface WhatsAppMessagePayload {
  to: string;
  templateName: string;
  parameters: string[];
}

export class WhatsAppService {
  private static API_TOKEN = process.env.WHATSAPP_API_TOKEN || "mock_whatsapp_token_2026";
  private static PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "mock_phone_number_id";

  /**
   * Helper to send WhatsApp Cloud API Template Messages
   */
  public static async sendWhatsAppMessage(payload: WhatsAppMessagePayload): Promise<boolean> {
    try {
      const cleanPhone = payload.to.replace(/[^0-9]/g, "");

      if (process.env.NODE_ENV !== "production") {
        console.log(`[WhatsAppService] Simulating WhatsApp message to +${cleanPhone} using template '${payload.templateName}'`);
        await AuditLogService.log({
          action: "WHATSAPP_SENT_SIMULATED",
          details: `Sent WhatsApp template '${payload.templateName}' to +${cleanPhone}`,
        });
        return true;
      }

      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: cleanPhone,
            type: "template",
            template: {
              name: payload.templateName,
              language: { code: "en_US" },
              components: [
                {
                  type: "body",
                  parameters: payload.parameters.map((param) => ({ type: "text", text: param })),
                },
              ],
            },
          }),
        }
      );

      if (response.ok) {
        await AuditLogService.log({
          action: "WHATSAPP_SENT_SUCCESS",
          details: `Sent WhatsApp template '${payload.templateName}' to +${cleanPhone}`,
        });
        return true;
      }

      throw new Error(`WhatsApp API responded with status ${response.status}`);
    } catch (err: any) {
      console.error("[WhatsAppService] Failed to send WhatsApp message:", err);
      await AuditLogService.log({
        action: "WHATSAPP_SENT_FAILED",
        details: `Failed sending WhatsApp to ${payload.to}: ${err.message}`,
      });
      return false;
    }
  }

  /**
   * 1. Booking Confirmation WhatsApp
   */
  public static async sendBookingConfirmation(data: {
    phone: string;
    guestName: string;
    bookingId: string;
    roomName: string;
    checkIn: string;
  }) {
    return this.sendWhatsAppMessage({
      to: data.phone,
      templateName: "booking_confirmation_yash_grand",
      parameters: [data.guestName, data.bookingId, data.roomName, data.checkIn],
    });
  }

  /**
   * 2. Payment Receipt WhatsApp
   */
  public static async sendPaymentConfirmation(data: {
    phone: string;
    guestName: string;
    paymentId: string;
    amount: number;
  }) {
    return this.sendWhatsAppMessage({
      to: data.phone,
      templateName: "payment_receipt_yash_grand",
      parameters: [data.guestName, data.paymentId, `₹${data.amount}`],
    });
  }

  /**
   * 3. Check-in Reminder WhatsApp
   */
  public static async sendCheckInReminder(data: {
    phone: string;
    guestName: string;
    checkInDate: string;
  }) {
    return this.sendWhatsAppMessage({
      to: data.phone,
      templateName: "checkin_reminder_yash_grand",
      parameters: [data.guestName, data.checkInDate],
    });
  }

  /**
   * 4. Banquet Booking WhatsApp
   */
  public static async sendBanquetConfirmation(data: {
    phone: string;
    guestName: string;
    eventType: string;
    eventDate: string;
  }) {
    return this.sendWhatsAppMessage({
      to: data.phone,
      templateName: "banquet_confirmation_yash_grand",
      parameters: [data.guestName, data.eventType, data.eventDate],
    });
  }
}

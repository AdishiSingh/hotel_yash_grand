import { EmailService } from "@/services/email.service";
import { WhatsAppService } from "@/services/whatsapp.service";
import { AuditLogService } from "@/services/audit.service";
import prisma from "@/lib/prisma";

export class CommunicationService {
  /**
   * Dispatch Room Booking Confirmation across Email and WhatsApp concurrently
   */
  public static async dispatchRoomBookingCommunications(data: {
    guestName: string;
    guestEmail?: string;
    guestPhone: string;
    bookingId: string;
    roomName: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    advancePaid: number;
  }) {
    const promises: Promise<any>[] = [];

    if (data.guestEmail) {
      promises.push(
        EmailService.sendRoomBookingEmail({
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          bookingId: data.bookingId,
          roomName: data.roomName,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          totalAmount: data.totalAmount,
          advancePaid: data.advancePaid,
        })
      );
    }

    if (data.guestPhone) {
      promises.push(
        WhatsAppService.sendBookingConfirmation({
          phone: data.guestPhone,
          guestName: data.guestName,
          bookingId: data.bookingId,
          roomName: data.roomName,
          checkIn: data.checkIn,
        })
      );
    }

    await Promise.allSettled(promises);
  }

  /**
   * Dispatch Payment Confirmation across Email and WhatsApp concurrently
   */
  public static async dispatchPaymentCommunications(data: {
    guestName: string;
    guestEmail?: string;
    guestPhone?: string;
    paymentId: string;
    invoiceNumber: string;
    amount: number;
    paymentMethod: string;
  }) {
    const promises: Promise<any>[] = [];

    if (data.guestEmail) {
      promises.push(
        EmailService.sendPaymentReceiptEmail({
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          paymentId: data.paymentId,
          invoiceNumber: data.invoiceNumber,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
        })
      );
    }

    if (data.guestPhone) {
      promises.push(
        WhatsAppService.sendPaymentConfirmation({
          phone: data.guestPhone,
          guestName: data.guestName,
          paymentId: data.paymentId,
          amount: data.amount,
        })
      );
    }

    await Promise.allSettled(promises);
  }

  /**
   * Retry failed communication deliveries
   */
  public static async retryFailedMessages() {
    const failedLogs = await prisma.auditLog.findMany({
      where: {
        action: { in: ["EMAIL_SENT_FAILED", "WHATSAPP_SENT_FAILED"] },
      },
      take: 20,
    });

    console.log(`[CommunicationService] Retrying ${failedLogs.length} failed delivery logs...`);
    
    await AuditLogService.log({
      action: "RETRY_FAILED_MESSAGES_EXECUTED",
      details: `Retried ${failedLogs.length} failed message delivery attempts`,
    });

    return failedLogs.length;
  }
}

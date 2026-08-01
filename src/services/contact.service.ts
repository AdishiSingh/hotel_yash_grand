import prisma from "@/lib/prisma";
import { EnquiryStatus } from "@prisma/client";
import { z } from "zod";
import { createContactEnquirySchema } from "@/lib/validations";
import { EmailService } from "@/services/email.service";
import { NotificationService } from "@/services/notification.service";
import { realtimeBus } from "@/lib/events";

export type CreateContactEnquiryInput = z.infer<typeof createContactEnquirySchema>;

export class ContactService {
  static async createEnquiry(data: CreateContactEnquiryInput) {
    const validated = createContactEnquirySchema.parse(data);

    const enquiry = await prisma.contactEnquiry.create({
      data: {
        name: validated.name,
        phone: validated.phone,
        email: validated.email,
        subject: validated.subject,
        message: validated.message,
        status: EnquiryStatus.UNREAD,
      },
    });

    // Notify Hotel Manager immediately via Email & ERP System Notification
    await EmailService.sendContactNotificationToManager({
      name: validated.name,
      phone: validated.phone,
      email: validated.email || undefined,
      subject: validated.subject || undefined,
      message: validated.message,
    });

    await NotificationService.createNotification({
      title: "New Website Contact Enquiry",
      message: `Enquiry from ${validated.name} (${validated.phone}): ${validated.subject || "General Inquire"}`,
      type: "INFO",
      link: "/dashboard/enquiries",
    });

    realtimeBus.broadcast("DASHBOARD_REFRESH", "ENQUIRY_NEW");

    return enquiry;
  }

  static async getEnquiries(status?: EnquiryStatus) {
    const where = status ? { status } : {};
    return await prisma.contactEnquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateEnquiryStatus(id: string, status: EnquiryStatus) {
    return await prisma.contactEnquiry.update({
      where: { id },
      data: { status },
    });
  }
}

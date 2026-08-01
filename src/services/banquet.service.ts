import prisma from "@/lib/prisma";
import { BanquetStatus } from "@prisma/client";
import { z } from "zod";
import { createBanquetBookingSchema } from "@/lib/validations";

export type CreateBanquetBookingInput = z.infer<typeof createBanquetBookingSchema>;

export class BanquetService {
  static async createBanquetBooking(data: CreateBanquetBookingInput) {
    const validated = createBanquetBookingSchema.parse(data);

    const enquirySeq = Math.floor(100 + Math.random() * 900);
    const enquiryId = `YG-BQ-${new Date().getFullYear()}-${enquirySeq}`;

    return await prisma.$transaction(async (tx) => {
      // Upsert Customer
      const customer = await tx.customer.upsert({
        where: { phone: validated.customerPhone },
        update: {
          name: validated.customerName,
          email: validated.customerEmail || undefined,
        },
        create: {
          name: validated.customerName,
          phone: validated.customerPhone,
          email: validated.customerEmail || undefined,
        },
      });

      return await tx.banquetBooking.create({
        data: {
          enquiryId,
          customerId: customer.id,
          customerName: validated.customerName,
          customerPhone: validated.customerPhone,
          customerEmail: validated.customerEmail,
          eventType: validated.eventType,
          guestsCount: validated.guestsCount,
          eventDate: new Date(validated.eventDate),
          budget: validated.budget,
          specialRequirements: validated.specialRequirements,
          status: BanquetStatus.NEW,
        },
        include: { customer: true },
      });
    });
  }

  static async getBanquetBookings(status?: BanquetStatus) {
    const where = status ? { status } : {};
    return await prisma.banquetBooking.findMany({
      where,
      include: { customer: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateBanquetStatus(id: string, status: BanquetStatus) {
    return await prisma.banquetBooking.update({
      where: { id },
      data: { status },
    });
  }
}

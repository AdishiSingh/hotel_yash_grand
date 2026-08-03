import prisma from "@/lib/prisma";
import { BanquetStatus } from "@prisma/client";
import { z } from "zod";
import { createBanquetBookingSchema } from "@/lib/validations";

export type CreateBanquetBookingInput = z.infer<typeof createBanquetBookingSchema>;

export class BanquetService {
  static async createBanquetBooking(data: any) {
    const customerName = data.customerName || data.guestName || data.name;
    const customerPhone = data.customerPhone || data.mobile || data.phone;
    const customerEmail = data.customerEmail || data.email || undefined;
    const eventType = data.eventType || "Grand Banquet Event";
    const guestCapacity = data.guestCapacity || String(data.guestsCount || "100-150");
    const guestsCount = Number(data.guestsCount) || parseInt(String(guestCapacity).split("-")[0] || "50", 10);
    const eventDateStr = data.eventDate || data.date;
    const budget = data.budget ? Number(data.budget) : undefined;
    const notes = data.notes || data.specialRequirements || data.specialRequest || undefined;

    if (!customerName || String(customerName).trim() === "") {
      throw new Error("Customer name is required.");
    }
    if (!customerPhone || String(customerPhone).trim() === "") {
      throw new Error("Phone number is required.");
    }
    if (!eventDateStr) {
      throw new Error("Event date is required.");
    }

    const year = new Date().getFullYear();
    const count = await prisma.banquetBooking.count();
    const seq = String(count + 1).padStart(3, "0");
    const referenceNumber = `YG-BQ-${year}-${seq}`;

    return await prisma.$transaction(async (tx) => {
      // 1. Upsert Customer Record
      const customer = await tx.customer.upsert({
        where: { phone: customerPhone },
        update: {
          name: customerName,
          ...(customerEmail && { email: customerEmail }),
        },
        create: {
          name: customerName,
          phone: customerPhone,
          ...(customerEmail && { email: customerEmail }),
        },
      });

      // 2. Create BanquetBooking record
      const banquet = await tx.banquetBooking.create({
        data: {
          enquiryId: referenceNumber,
          referenceNumber,
          customerId: customer.id,
          customerName,
          customerPhone,
          customerEmail,
          eventType,
          guestsCount,
          guestCapacity,
          eventDate: new Date(eventDateStr),
          budget,
          notes,
          specialRequirements: notes,
          status: BanquetStatus.PENDING,
        },
        include: { customer: true },
      });

      // 3. Create BookingRequest record for unified booking request management
      await tx.bookingRequest.create({
        data: {
          requestId: referenceNumber,
          type: "BANQUET",
          customerId: customer.id,
          guestName: customerName,
          mobile: customerPhone,
          email: customerEmail,
          eventType,
          eventDate: new Date(eventDateStr),
          guestsCount,
          totalAmount: budget || 0,
          specialRequest: notes,
          status: "PENDING",
        },
      });

      const phoneSanitized = "919151088115";
      const message = `Hello, I have submitted a banquet inquiry (Ref: ${referenceNumber}) for a ${eventType} at Hotel Yash Grand on ${eventDateStr} for ${guestCapacity} guests. My name is ${customerName}.`;
      const whatsappUrl = `https://wa.me/${phoneSanitized}?text=${encodeURIComponent(message)}`;

      return {
        ...banquet,
        referenceNumber,
        whatsappUrl,
        whatsappMessage: message,
      };
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

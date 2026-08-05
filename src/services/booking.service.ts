import prisma from "@/lib/prisma";
import { BookingStatus, RoomStatus } from "@prisma/client";
import { z } from "zod";
import { createRoomBookingSchema, updateBookingStatusSchema } from "@/lib/validations";
import { AuditLogService } from "@/services/audit.service";
import { RoomAvailabilityService } from "@/services/room-availability.service";
import { realtimeBus } from "@/lib/events";
import { NotificationService } from "@/services/notification.service";

export type CreateRoomBookingInput = z.infer<typeof createRoomBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;

export class BookingService {
  static async createBooking(data: CreateRoomBookingInput) {
    const validated = createRoomBookingSchema.parse(data);

    const checkInDate = new Date(validated.checkIn);
    const checkOutDate = new Date(validated.checkOut);

    if (checkOutDate <= checkInDate) {
      throw new Error("Check-out date must be after Check-in date");
    }

    // 1. Perform Overbooking Check
    const overbooking = await RoomAvailabilityService.checkOverbooking(
      validated.roomId,
      checkInDate,
      checkOutDate
    );
    if (overbooking.isOverbooked) {
      const conflict = overbooking.conflictingBookings[0];
      throw new Error(
        `Overbooking conflict: Room is already reserved for stay dates (${conflict.bookingId}). Please select another room or modify stay dates.`
      );
    }

    // 2. Collision-proof Booking ID generator
    let bookingId = "";
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      attempts++;
      const bookingSeq = Math.floor(100000 + Math.random() * 900000);
      bookingId = `YG-BK-${new Date().getFullYear()}-${bookingSeq}`;
      const existing = await prisma.roomBooking.findUnique({ where: { bookingId } });
      if (!existing) isUnique = true;
    }

    const booking = await prisma.$transaction(async (tx) => {
      const room = await tx.room.findUnique({
        where: { id: validated.roomId },
      });

      if (!room) {
        throw new Error("Room not found");
      }

      const customer = await tx.customer.upsert({
        where: { phone: validated.customerPhone },
        update: {
          name: validated.customerName,
          email: validated.customerEmail || undefined,
          totalSpent: { increment: validated.totalAmount },
          visitCount: { increment: 1 },
          lastVisit: new Date(),
          isReturning: true,
        },
        create: {
          name: validated.customerName,
          phone: validated.customerPhone,
          email: validated.customerEmail || undefined,
          totalSpent: validated.totalAmount,
          visitCount: 1,
          lastVisit: new Date(),
        },
      });

      const res = await tx.roomBooking.create({
        data: {
          bookingId,
          roomId: validated.roomId,
          customerId: customer.id,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: validated.guests,
          totalAmount: validated.totalAmount,
          advancePaid: validated.advancePaid,
          status: BookingStatus.CONFIRMED,
          specialRequests: validated.specialRequests,
        },
        include: {
          room: true,
          customer: true,
          payments: true,
        },
      });

      const isTodayCheckIn = checkInDate.toDateString() === new Date().toDateString();
      await tx.room.update({
        where: { id: validated.roomId },
        data: { status: isTodayCheckIn ? RoomStatus.OCCUPIED : RoomStatus.RESERVED },
      });

      return res;
    }, { maxWait: 10000, timeout: 20000 });

    try {
      await AuditLogService.log({
        action: "BOOKING_CREATED",
        details: `Created room booking ${bookingId} for guest ${validated.customerName} (Room ID: ${validated.roomId})`,
      });
    } catch (e) {
      console.warn("Audit log error:", e);
    }

    // Realtime Event Broadcast & Notification
    try {
      realtimeBus.broadcast("BOOKING_UPDATED", "CREATED", booking);
      realtimeBus.broadcast("DASHBOARD_REFRESH", "OCCUPANCY_CHANGE");
    } catch (e) {
      console.warn("Realtime broadcast error:", e);
    }

    try {
      await NotificationService.createNotification({
        title: "New Room Reservation",
        message: `Booking ${bookingId} reserved for ${validated.customerName} (₹${validated.totalAmount})`,
        type: "INFO",
        link: "/dashboard/rooms",
      });
    } catch (e) {
      console.warn("Notification error:", e);
    }

    return booking;
  }

  static async getBookings(params?: { status?: BookingStatus; roomId?: string }) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.roomId) where.roomId = params.roomId;

    return await prisma.roomBooking.findMany({
      where,
      include: {
        room: true,
        customer: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getBookingById(id: string) {
    return await prisma.roomBooking.findFirst({
      where: {
        OR: [{ id }, { bookingId: id }],
      },
      include: {
        room: true,
        customer: true,
        payments: true,
      },
    });
  }

  static async updateBookingStatus(id: string, data: UpdateBookingStatusInput) {
    const validated = updateBookingStatusSchema.parse(data);

    const booking = await prisma.$transaction(async (tx) => {
      const res = await tx.roomBooking.update({
        where: { id },
        data: { status: validated.status as BookingStatus },
        include: { room: true },
      });

      if (validated.status === BookingStatus.CHECKED_OUT || validated.status === BookingStatus.CANCELLED) {
        await tx.room.update({
          where: { id: res.roomId },
          data: { status: RoomStatus.AVAILABLE },
        });
      } else if (validated.status === BookingStatus.CHECKED_IN) {
        await tx.room.update({
          where: { id: res.roomId },
          data: { status: RoomStatus.OCCUPIED },
        });
      }

      return res;
    });

    await AuditLogService.log({
      action: "BOOKING_UPDATED",
      details: `Updated booking ${booking.bookingId} status to '${booking.status}'`,
    });

    // Realtime Event Broadcast
    realtimeBus.broadcast("BOOKING_UPDATED", "STATUS_CHANGE", booking);
    realtimeBus.broadcast("DASHBOARD_REFRESH", "OCCUPANCY_CHANGE");

    if (booking.status === "CHECKED_IN") {
      await NotificationService.createNotification({
        title: "Guest Checked In",
        message: `Booking ${booking.bookingId} checked into room!`,
        type: "SUCCESS",
        link: "/dashboard/rooms",
      });
    } else if (booking.status === "CHECKED_OUT") {
      await NotificationService.createNotification({
        title: "Guest Checked Out",
        message: `Booking ${booking.bookingId} checked out. Room is now available.`,
        type: "INFO",
        link: "/dashboard/rooms",
      });
    }

    return booking;
  }

  static async deleteBooking(id: string) {
    const res = await prisma.roomBooking.delete({
      where: { id },
    });

    await AuditLogService.log({
      action: "BOOKING_DELETED",
      details: `Deleted room booking record '${id}'`,
    });

    realtimeBus.broadcast("BOOKING_UPDATED", "DELETED", { id });
    realtimeBus.broadcast("DASHBOARD_REFRESH", "OCCUPANCY_CHANGE");

    return res;
  }
}

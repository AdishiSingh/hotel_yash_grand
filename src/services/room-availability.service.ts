import prisma from "@/lib/prisma";
import { AuditLogService } from "@/services/audit.service";
import { NotificationService } from "@/services/notification.service";
import { realtimeBus } from "@/lib/events";
import { RoomStatus } from "@prisma/client";

export interface DateAvailabilityMap {
  date: string; // YYYY-MM-DD
  status: RoomStatus;
  bookingRef?: string;
  guestName?: string;
}

export interface RoomAvailabilityResult {
  roomId: string;
  roomNumber: string;
  type: string;
  floor: number;
  pricePerNight: number;
  capacity: number;
  currentStatus: RoomStatus;
  dateMatrix: DateAvailabilityMap[];
  hasConflict: boolean;
}

export class RoomAvailabilityService {
  /**
   * 1. Check strict date-overlap overbooking collision for a target room
   */
  public static async checkOverbooking(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    excludeBookingId?: string
  ): Promise<{ isOverbooked: boolean; conflictingBookings: any[] }> {
    const cIn = new Date(checkIn);
    const cOut = new Date(checkOut);

    const whereClause: any = {
      roomId,
      status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
      AND: [
        { checkIn: { lt: cOut } },
        { checkOut: { gt: cIn } },
      ],
    };

    if (excludeBookingId) {
      whereClause.id = { not: excludeBookingId };
    }

    const conflictingBookings = await prisma.roomBooking.findMany({
      where: whereClause,
      include: { customer: true },
    });

    return {
      isOverbooked: conflictingBookings.length > 0,
      conflictingBookings,
    };
  }

  /**
   * 2. Real-time Room Availability Matrix across Date Range (Defaults to 14 days)
   */
  public static async getRealTimeAvailabilityMatrix(
    startDateInput?: Date | string,
    daysCount = 14
  ): Promise<{
    rooms: RoomAvailabilityResult[];
    summary: {
      totalRooms: number;
      available: number;
      reserved: number;
      occupied: number;
      maintenance: number;
      blocked: number;
      occupancyPercent: number;
    };
  }> {
    const start = startDateInput ? new Date(startDateInput) : new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + daysCount);

    const datesList: string[] = [];
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      datesList.push(d.toISOString().slice(0, 10));
    }

    const allRooms = await prisma.room.findMany({
      orderBy: [{ floor: "asc" }, { roomNumber: "asc" }],
      include: {
        bookings: {
          where: {
            status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
            checkIn: { lt: end },
            checkOut: { gt: start },
          },
          include: { customer: true },
        },
      },
    });

    let availableCount = 0;
    let reservedCount = 0;
    let occupiedCount = 0;
    let maintenanceCount = 0;
    let blockedCount = 0;

    const roomsMatrix: RoomAvailabilityResult[] = allRooms.map((room) => {
      const dateMatrix: DateAvailabilityMap[] = datesList.map((dateStr) => {
        const currentDate = new Date(dateStr);
        currentDate.setHours(12, 0, 0, 0);

        const activeBooking = room.bookings.find((b) => {
          const bIn = new Date(b.checkIn);
          const bOut = new Date(b.checkOut);
          return currentDate >= bIn && currentDate < bOut;
        });

        let status: RoomStatus = room.status;

        if (activeBooking) {
          status = activeBooking.status === "CHECKED_IN" ? "OCCUPIED" : "RESERVED";
        }

        return {
          date: dateStr,
          status,
          bookingRef: activeBooking?.bookingId,
          guestName: activeBooking?.customer?.name,
        };
      });

      // Update counters based on today's status
      const todayStatus = dateMatrix[0]?.status || room.status;
      if (todayStatus === "AVAILABLE") availableCount++;
      else if (todayStatus === "RESERVED") reservedCount++;
      else if (todayStatus === "OCCUPIED") occupiedCount++;
      else if (todayStatus === "MAINTENANCE" || todayStatus === "CLEANING") maintenanceCount++;
      else if (todayStatus === "BLOCKED") blockedCount++;

      return {
        roomId: room.id,
        roomNumber: room.roomNumber,
        type: room.type,
        floor: room.floor,
        pricePerNight: room.pricePerNight,
        capacity: room.capacity,
        currentStatus: todayStatus,
        dateMatrix,
        hasConflict: false,
      };
    });

    const totalRooms = allRooms.length || 1;
    const activeOccupied = occupiedCount + reservedCount;
    const occupancyPercent = Math.min(100, Math.round((activeOccupied / totalRooms) * 100));

    return {
      rooms: roomsMatrix,
      summary: {
        totalRooms,
        available: availableCount,
        reserved: reservedCount,
        occupied: occupiedCount,
        maintenance: maintenanceCount,
        blocked: blockedCount,
        occupancyPercent,
      },
    };
  }

  /**
   * 3. Sync Manager Approval & Prevent Overbooking
   */
  public static async validateAndLockRoomApproval(data: {
    roomId: string;
    checkIn: Date;
    checkOut: Date;
    requestId: string;
    managerName: string;
  }) {
    const { isOverbooked, conflictingBookings } = await this.checkOverbooking(data.roomId, data.checkIn, data.checkOut);

    if (isOverbooked) {
      const conflictMsg = `Overbooking Prevented: Room is already reserved for stay dates (${conflictingBookings[0]?.bookingId}).`;
      await AuditLogService.log({
        action: "OVERBOOKING_PREVENTED",
        details: `Manager ${data.managerName} attempted approval on room ${data.roomId} for request ${data.requestId}, but overbooking was blocked.`,
      });
      throw new Error(conflictMsg);
    }

    // Update room status to RESERVED
    await prisma.room.update({
      where: { id: data.roomId },
      data: { status: "RESERVED" },
    });

    realtimeBus.broadcast("BOOKING_UPDATED", "APPROVED_RESERVED", { roomId: data.roomId, checkIn: data.checkIn, checkOut: data.checkOut });

    return true;
  }

  /**
   * 4. Block Room for Maintenance / Administrative Hold
   */
  public static async blockRoom(roomId: string, reason: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        bookings: {
          where: { status: "CHECKED_IN" },
        },
      },
    });

    if (!room) throw new Error("Target room not found.");

    if (room.bookings.length > 0) {
      throw new Error(`Cannot block Room ${room.roomNumber} while currently occupied by active guest stay.`);
    }

    const updated = await prisma.room.update({
      where: { id: roomId },
      data: { status: "MAINTENANCE" },
    });

    await AuditLogService.log({
      action: "ROOM_BLOCKED",
      details: `Room ${room.roomNumber} set to BLOCKED status. Reason: ${reason}`,
    });

    await NotificationService.createNotification({
      title: `Room ${room.roomNumber} Blocked`,
      message: `Room ${room.roomNumber} has been blocked for maintenance. Reason: ${reason}`,
      type: "WARNING",
      link: "/management/rooms",
    });

    realtimeBus.broadcast("BOOKING_UPDATED", "BLOCKED", { roomId });
    return updated;
  }

  /**
   * 5. Unblock Room back to Available
   */
  public static async unblockRoom(roomId: string) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) throw new Error("Room not found.");

    const updated = await prisma.room.update({
      where: { id: roomId },
      data: { status: "AVAILABLE" },
    });

    await AuditLogService.log({
      action: "ROOM_UNBLOCKED",
      details: `Room ${room.roomNumber} unblocked and restored to AVAILABLE status.`,
    });

    realtimeBus.broadcast("BOOKING_UPDATED", "UNBLOCKED", { roomId });
    return updated;
  }
}

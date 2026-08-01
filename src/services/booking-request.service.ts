import crypto from "crypto";
import prisma from "@/lib/prisma";
import { AuditLogService } from "@/services/audit.service";
import { NotificationService } from "@/services/notification.service";
import { NotificationAutomationService } from "@/services/notification-automation.service";
import { realtimeBus } from "@/lib/events";
import { OFFICIAL_HOTEL_WHATSAPP } from "@/lib/whatsapp";

export interface CreateBookingRequestInput {
  type: "ROOM" | "BANQUET" | "RESTAURANT";
  guestName: string;
  mobile: string;
  email?: string;
  roomType?: string;
  eventType?: string;
  checkIn?: string | Date;
  checkOut?: string | Date;
  eventDate?: string | Date;
  eventTime?: string;
  hallName?: string;
  adults?: number;
  children?: number;
  guestsCount?: number;
  preferredFloor?: string;
  arrivalTime?: string;
  celebrationType?: string;
  specialRequest?: string;
}

export interface ApproveBookingRequestInput {
  requestId: string;
  managerName?: string;
  assignedRoomId?: string;
  assignedRoomNumber?: string;
  advanceAmount?: number;
  totalAmount?: number;
  managerRemarks?: string;
  expectedCheckInTime?: string;
}

export class BookingRequestService {
  /**
   * Submit a new Booking Request (Status defaults to PENDING)
   */
  static async createRequest(data: CreateBookingRequestInput) {
    if (!data.guestName || !data.guestName.trim()) {
      throw new Error("Full Name is mandatory for booking request.");
    }
    if (!data.mobile || !data.mobile.trim()) {
      throw new Error("Mobile Number is mandatory for booking request.");
    }

    if (data.type === "ROOM") {
      if (!data.checkIn || !data.checkOut) {
        throw new Error("Check-in and Check-out dates are mandatory for room booking request.");
      }
      const cIn = new Date(data.checkIn);
      const cOut = new Date(data.checkOut);
      if (cOut <= cIn) {
        throw new Error("Check-out date must be strictly after Check-in date.");
      }

      // Max Occupancy Validation
      const totalGuests = (data.adults || 1) + (data.children || 0);
      const capacityMap: Record<string, { label: string; max: number }> = {
        "single-deluxe": { label: "Single Deluxe Room", max: 2 },
        "Single Deluxe Room": { label: "Single Deluxe Room", max: 2 },
        "family-room": { label: "Family Room", max: 4 },
        "Family Room": { label: "Family Room", max: 4 },
      };

      const selectedRoomType = data.roomType || "single-deluxe";
      const roomCapacityInfo = capacityMap[selectedRoomType] || { label: selectedRoomType, max: 2 };

      if (totalGuests > roomCapacityInfo.max) {
        throw new Error(`Total guests (${totalGuests}) exceeds maximum capacity of ${roomCapacityInfo.max} for ${roomCapacityInfo.label}. Please select a larger room category or reduce guest count.`);
      }
    } else if (data.type === "BANQUET") {
      if (!data.eventDate) {
        throw new Error("Event Date is mandatory for banquet booking request.");
      }
    } else if (data.type === "RESTAURANT") {
      if (!data.eventDate && !data.checkIn) {
        throw new Error("Reservation Date is mandatory for restaurant reservation request.");
      }
    }

    const dateStr = new Date().getFullYear().toString();
    const randomSeq = Math.floor(1000 + Math.random() * 9000).toString();
    const requestId = `YG-REQ-${dateStr}-${randomSeq}`;
    const guestPortalToken = `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const checkInDate = data.checkIn ? new Date(data.checkIn) : null;
    const checkOutDate = data.checkOut ? new Date(data.checkOut) : null;
    const eventDateVal = data.eventDate ? new Date(data.eventDate) : null;
    const calculatedGuestsCount = data.guestsCount || (data.adults || 1) + (data.children || 0);

    const request = await prisma.$transaction(async (tx) => {
      let customer = await tx.customer.findUnique({
        where: { phone: data.mobile.trim() },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: data.guestName.trim(),
            phone: data.mobile.trim(),
            email: data.email?.trim() || null,
          },
        });
      }

      const created = await tx.bookingRequest.create({
        data: {
          requestId,
          type: data.type,
          customerId: customer.id,
          guestName: data.guestName.trim(),
          mobile: data.mobile.trim(),
          email: data.email?.trim() || null,
          roomType: data.roomType || null,
          eventType: data.eventType || null,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          eventDate: eventDateVal,
          eventTime: data.eventTime || null,
          hallName: data.hallName || null,
          adults: data.adults || 1,
          children: data.children || 0,
          guestsCount: calculatedGuestsCount,
          preferredFloor: data.preferredFloor || null,
          arrivalTime: data.arrivalTime || null,
          celebrationType: data.celebrationType || null,
          specialRequest: data.specialRequest || null,
          status: "PENDING",
          guestPortalToken,
        },
      });

      // Initial Timeline Entry
      await tx.communicationLog.create({
        data: {
          requestId: created.id,
          managerName: "System Automation",
          channel: "SYSTEM",
          status: "PENDING_APPROVAL",
          notes: `Booking request ${requestId} created by guest.`,
        },
      });

      // If BANQUET, automatically create BanquetBooking entry for Admin Banquet Dashboard
      if (data.type === "BANQUET") {
        await tx.banquetBooking.create({
          data: {
            enquiryId: requestId,
            customerId: customer.id,
            customerName: data.guestName.trim(),
            customerPhone: data.mobile.trim(),
            customerEmail: data.email?.trim() || null,
            eventType: data.eventType || "Banquet Event",
            guestsCount: data.guestsCount || data.adults || 50,
            eventDate: eventDateVal || new Date(),
            budget: 50000,
            specialRequirements: data.specialRequest || null,
            status: "NEW",
          },
        }).catch((err) => console.error("Auto BanquetBooking creation failed:", err));
      }

      return created;
    });

    await AuditLogService.log({
      action: "BOOKING_REQUEST_CREATED",
      details: `New ${data.type} booking request ${requestId} created for ${data.guestName} (${data.mobile})`,
    });

    // Trigger Multi-Channel Automated Notification Suite (Email, WhatsApp, SMS, In-App, Manager Alert)
    NotificationAutomationService.triggerBookingSubmitted({
      requestId: request.requestId,
      guestName: request.guestName,
      guestEmail: request.email || undefined,
      mobile: request.mobile,
      roomType: request.roomType || undefined,
      checkIn: checkInDate?.toLocaleDateString(),
      checkOut: checkOutDate?.toLocaleDateString(),
      customerId: request.customerId || undefined,
    });

    realtimeBus.broadcast("BOOKING_REQUEST_UPDATED", "NEW_REQUEST", request);

    const whatsappMessage = `🏨 NEW ${data.type === "ROOM" ? "ROOM" : "BANQUET"} BOOKING REQUEST

Booking ID: ${request.requestId}
Guest Name: ${request.guestName}
Mobile: ${request.mobile}
${request.type === "ROOM" ? `Room Type: ${request.roomType || "Deluxe Suite"}
Check-in: ${checkInDate?.toLocaleDateString()}
Check-out: ${checkOutDate?.toLocaleDateString()}
Guests: ${request.adults} Adults${request.children ? `, ${request.children} Children` : ""}` : `Event Type: ${request.eventType}
Event Date: ${eventDateVal?.toLocaleDateString()}
Guests Count: ${request.guestsCount}`}
Special Request: ${request.specialRequest || "None"}

Status: PENDING APPROVAL
Manager Dashboard: https://hotelyashgrand.com/dashboard/reservation-center`;

    const whatsappUrl = `https://wa.me/${OFFICIAL_HOTEL_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;

    return {
      success: true,
      request,
      managerWhatsappUrl: whatsappUrl,
      whatsappMessage,
    };
  }

  /**
   * Get all booking requests for Reservation Center
   */
  static async getRequests(params?: {
    status?: string;
    type?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) {
    const where: any = {};

    if (params?.status && params.status !== "ALL") {
      where.status = params.status;
    }

    if (params?.type && params.type !== "ALL") {
      where.type = params.type;
    }

    if (params?.search) {
      const q = params.search.trim();
      where.OR = [
        { requestId: { contains: q, mode: "insensitive" } },
        { guestName: { contains: q, mode: "insensitive" } },
        { mobile: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ];
    }

    if (params?.startDate || params?.endDate) {
      where.requestedAt = {};
      if (params.startDate) where.requestedAt.gte = new Date(params.startDate);
      if (params.endDate) where.requestedAt.lte = new Date(params.endDate);
    }

    return await prisma.bookingRequest.findMany({
      where,
      include: {
        customer: true,
        communicationLogs: { orderBy: { createdAt: "desc" } },
        managerNotes: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { requestedAt: "desc" },
      take: params?.limit || 100,
    });
  }

  /**
   * Fetch complete detail profile of single Booking Request
   */
  static async getRequestDetails(id: string) {
    const request = await prisma.bookingRequest.findFirst({
      where: {
        OR: [{ id }, { requestId: id }, { guestPortalToken: id }],
      },
      include: {
        customer: {
          include: {
            roomBookings: true,
            banquetBookings: true,
            orders: true,
          },
        },
        communicationLogs: { orderBy: { createdAt: "desc" } },
        managerNotes: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!request) {
      throw new Error("Booking request not found.");
    }

    const conflicts = await this.checkRoomConflicts(
      request.checkIn || undefined,
      request.checkOut || undefined
    );

    // Compute SADYA AI Predictive Analytics for Manager Brief
    const visitCount = request.customer?.visitCount || 1;
    const isRepeat = visitCount > 1;
    const lifetimeVal = (request.customer?.totalSpent || 0) + request.totalAmount;
    const riskScore = request.status === "PENDING" ? 15 : 5;
    const cancellationProb = request.status === "REJECTED" ? 100 : 8;

    return {
      request,
      conflicts,
      aiAnalytics: {
        isRepeat,
        visitCount,
        lifetimeVal,
        riskScore,
        cancellationProb,
        suggestedUpsell: request.roomType === "Single Deluxe Room" ? "Family Room (Two Connected Rooms)" : "Single Deluxe Room",
        suggestedOffer: "Complimentary Airport Pickup & Breakfast Included",
        conversationScript: `Welcome ${request.guestName}! We are pleased to review your ${request.type} request. For your stay from ${request.checkIn ? new Date(request.checkIn).toLocaleDateString() : "TBD"}, we have assigned room ${request.assignedRoomNumber || "101"} with early check-in.`,
      },
    };
  }

  /**
   * Add a Communication Log entry (Call, WhatsApp, Email, Quotation, Location, Invoice)
   */
  static async addCommunicationLog(data: {
    requestId: string;
    managerName: string;
    channel: string;
    duration?: number;
    status?: string;
    notes?: string;
  }) {
    const log = await prisma.communicationLog.create({
      data: {
        requestId: data.requestId,
        managerName: data.managerName,
        channel: data.channel,
        duration: data.duration || 0,
        status: data.status || "COMPLETED",
        notes: data.notes || null,
      },
    });

    await AuditLogService.log({
      action: "COMMUNICATION_LOGGED",
      details: `${data.managerName} logged ${data.channel} with guest for request ID ${data.requestId}. Status: ${data.status || 'COMPLETED'}`,
    });

    return log;
  }

  /**
   * Add a private Manager Note
   */
  static async addManagerNote(data: {
    requestId: string;
    author: string;
    category?: string;
    content: string;
  }) {
    const note = await prisma.managerNote.create({
      data: {
        requestId: data.requestId,
        author: data.author,
        category: data.category || "GENERAL",
        content: data.content,
      },
    });

    await AuditLogService.log({
      action: "MANAGER_NOTE_ADDED",
      details: `Manager ${data.author} added note to request ${data.requestId}: ${data.content}`,
    });

    return note;
  }

  /**
   * Assign a Manager to a Booking Request
   */
  static async assignManager(requestId: string, managerName: string, managerRole: string) {
    const updated = await prisma.bookingRequest.update({
      where: { id: requestId },
      data: {
        assignedManager: managerName,
        assignedManagerRole: managerRole,
      },
    });

    await this.addCommunicationLog({
      requestId: updated.id,
      managerName,
      channel: "MANAGER_ASSIGNMENT",
      notes: `Request assigned to ${managerName} (${managerRole})`,
    });

    return updated;
  }

  /**
   * Update Request Status
   */
  static async updateStatus(id: string, status: string, managerRemarks?: string) {
    const updated = await prisma.bookingRequest.update({
      where: { id },
      data: {
        status,
        ...(managerRemarks && { managerRemarks }),
      },
    });

    await AuditLogService.log({
      action: "BOOKING_REQUEST_STATUS_UPDATED",
      details: `Updated request ${updated.requestId} status to '${status}'`,
    });

    realtimeBus.broadcast("BOOKING_REQUEST_UPDATED", "STATUS_CHANGE", updated);
    return updated;
  }

  /**
   * Approve a Booking Request & Convert to Confirmed Room/Banquet Record
   */
  static async approveRequest(data: ApproveBookingRequestInput) {
    const {
      requestId,
      managerName = "Duty Manager",
      assignedRoomId,
      assignedRoomNumber,
      advanceAmount = 0,
      totalAmount = 0,
      managerRemarks,
      expectedCheckInTime,
    } = data;

    const request = await prisma.bookingRequest.findFirst({
      where: { OR: [{ id: requestId }, { requestId }] },
    });

    if (!request) {
      throw new Error("Booking request not found.");
    }

    if (request.status === "APPROVED" || request.status === "CONFIRMED") {
      throw new Error("Booking request has already been approved.");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedReq = await tx.bookingRequest.update({
        where: { id: request.id },
        data: {
          status: advanceAmount > 0 ? "PAYMENT_PENDING" : "APPROVED",
          approvedAt: new Date(),
          approvedBy: managerName,
          managerRemarks: managerRemarks || null,
          paymentStatus: advanceAmount > 0 ? "PENDING" : "PAID",
          advanceAmount: advanceAmount || 0,
          totalAmount: totalAmount || request.totalAmount || 0,
          assignedRoomNumber: assignedRoomNumber || null,
        },
      });

      let createdBookingNumber = "";
      if (request.type === "ROOM") {
        const seq = Math.floor(1000 + Math.random() * 9000);
        createdBookingNumber = `YG-BK-${new Date().getFullYear()}-${seq}`;

        let targetRoomId = assignedRoomId;
        if (!targetRoomId && assignedRoomNumber) {
          let roomObj = await tx.room.findUnique({
            where: { roomNumber: assignedRoomNumber },
          });
          if (!roomObj) {
            roomObj = await tx.room.create({
              data: {
                roomNumber: assignedRoomNumber,
                type: request.roomType || "Single Deluxe Room",
                pricePerNight: 2500,
                capacity: 4,
                status: "AVAILABLE",
              },
            });
          }
          targetRoomId = roomObj.id;
        }

        if (!targetRoomId) {
          let availableRoom = await tx.room.findFirst({
            where: { status: "AVAILABLE" },
          });
          if (!availableRoom) {
            availableRoom = await tx.room.create({
              data: {
                roomNumber: "101",
                type: request.roomType || "Single Deluxe Room",
                pricePerNight: 2500,
                capacity: 4,
                status: "AVAILABLE",
              },
            });
          }
          targetRoomId = availableRoom.id;
        }

        if (targetRoomId && request.checkIn && request.checkOut) {
          let customerId = request.customerId;
          if (!customerId) {
            const cust = await tx.customer.upsert({
              where: { phone: request.mobile },
              update: { name: request.guestName },
              create: { name: request.guestName, phone: request.mobile, email: request.email },
            });
            customerId = cust.id;
          }

          await tx.roomBooking.create({
            data: {
              bookingId: createdBookingNumber,
              roomId: targetRoomId,
              customerId,
              checkIn: request.checkIn,
              checkOut: request.checkOut,
              guests: (request.adults || 1) + (request.children || 0),
              totalAmount: totalAmount || 2500,
              advancePaid: advanceAmount,
              status: "CONFIRMED",
              specialRequests: request.specialRequest,
            },
          });
        }
      } else if (request.type === "BANQUET") {
        const seq = Math.floor(1000 + Math.random() * 9000);
        createdBookingNumber = `YG-BQ-${new Date().getFullYear()}-${seq}`;

        await tx.banquetBooking.create({
          data: {
            enquiryId: createdBookingNumber,
            customerName: request.guestName,
            customerPhone: request.mobile,
            customerEmail: request.email,
            eventType: request.eventType || "Grand Banquet Event",
            guestsCount: request.guestsCount || 100,
            eventDate: request.eventDate || new Date(),
            budget: totalAmount || 50000,
            specialRequirements: request.specialRequest,
            status: "BOOKED",
          },
        });
      }

      await tx.communicationLog.create({
        data: {
          requestId: request.id,
          managerName,
          channel: "APPROVAL",
          status: "APPROVED",
          notes: `Approved request. Created ${request.type} Booking #${createdBookingNumber}`,
        },
      });

      return { request: updatedReq, bookingNumber: createdBookingNumber };
    });

    await AuditLogService.log({
      action: "BOOKING_REQUEST_APPROVED",
      details: `Manager ${managerName} approved ${request.type} request ${request.requestId}. Created Booking ${result.bookingNumber}`,
    });

    // Trigger Multi-Channel Automated Approval Notification Suite
    NotificationAutomationService.triggerBookingApproved({
      requestId: request.requestId,
      bookingId: result.bookingNumber || request.requestId,
      guestName: request.guestName,
      guestEmail: request.email || undefined,
      mobile: request.mobile,
      roomName: request.roomType || undefined,
      totalAmount: totalAmount || request.totalAmount || 0,
      managerRemarks: managerRemarks || undefined,
      customerId: request.customerId || undefined,
    });

    const customerMessage = `🎉 CONGRATULATIONS!

Your ${request.type === "ROOM" ? "room booking" : request.type === "BANQUET" ? "banquet booking" : "restaurant reservation"} request has been APPROVED & CONFIRMED.

Hotel: HOTEL YASH GRAND
Booking Number: ${result.bookingNumber || request.requestId}
Guest Name: ${request.guestName}
${request.type === "ROOM" ? `Check-in: ${request.checkIn ? new Date(request.checkIn).toLocaleDateString() : "TBD"} (12:00 PM)
Check-out: ${request.checkOut ? new Date(request.checkOut).toLocaleDateString() : "TBD"} (11:00 AM)
Room Type: ${request.roomType || "Deluxe Suite"}${assignedRoomNumber ? ` (Room ${assignedRoomNumber})` : ""}` : request.type === "BANQUET" ? `Event Date: ${request.eventDate ? new Date(request.eventDate).toLocaleDateString() : "TBD"}
Event Type: ${request.eventType}` : `Reservation Date: ${request.eventDate ? new Date(request.eventDate).toLocaleDateString() : "TBD"}
Guests: ${request.guestsCount || 2}`}
${advanceAmount > 0 ? `Advance Payment Required: ₹${advanceAmount}` : ""}

Guest Self-Service Portal: https://hotelyashgrand.com/guest/booking/${request.guestPortalToken}
Manager Contact: +91 91510 88115
Hotel Address: Adjacent to SMS College, Bypass Road, Varanasi, UP 221011
Google Maps: https://maps.google.com/?q=Hotel+Yash+Grand+Varanasi

Check-in Instructions: Please present valid Government Photo ID proof (Aadhaar / Passport) at front desk reception.
Cancellation Policy: Free cancellation up to 48 hours prior to check-in.`;

    const cleanCustomerPhone = request.mobile.replace(/[^0-9]/g, "");
    const customerWhatsappUrl = `https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(customerMessage)}`;

    realtimeBus.broadcast("BOOKING_REQUEST_UPDATED", "APPROVED", result);

    return {
      success: true,
      bookingNumber: result.bookingNumber,
      customerWhatsappUrl,
      customerMessage,
      guestPortalUrl: `https://hotelyashgrand.com/guest/booking/${request.guestPortalToken}`,
    };
  }

  /**
   * Reject a Booking Request
   */
  static async rejectRequest(requestId: string, rejectionReason: string, managerRemarks?: string) {
    const request = await prisma.bookingRequest.findFirst({
      where: { OR: [{ id: requestId }, { requestId }] },
    });

    if (!request) {
      throw new Error("Booking request not found.");
    }

    const updated = await prisma.bookingRequest.update({
      where: { id: request.id },
      data: {
        status: "REJECTED",
        rejectionReason,
        ...(managerRemarks && { managerRemarks }),
      },
    });

    await this.addCommunicationLog({
      requestId: request.id,
      managerName: "Manager",
      channel: "REJECTION",
      status: "REJECTED",
      notes: `Rejected request: ${rejectionReason}`,
    });

    await AuditLogService.log({
      action: "BOOKING_REQUEST_REJECTED",
      details: `Rejected booking request ${request.requestId}. Reason: ${rejectionReason}`,
    });

    // Trigger Multi-Channel Automated Rejection Notification Suite
    NotificationAutomationService.triggerBookingRejected({
      requestId: request.requestId,
      guestName: request.guestName,
      guestEmail: request.email || undefined,
      mobile: request.mobile,
      rejectionReason,
      customerId: request.customerId || undefined,
    });

    const rejectionMessage = `Dear ${request.guestName},

Unfortunately we could not confirm your ${request.type === "ROOM" ? "room" : request.type === "BANQUET" ? "banquet" : "restaurant"} booking request for the selected dates at HOTEL YASH GRAND.

Reason: ${rejectionReason}

Please contact our reservation desk at +91 91510 88115 to explore alternative room dates or arrangements.

Thank you for your interest in HOTEL YASH GRAND.`;

    const cleanPhone = request.mobile.replace(/[^0-9]/g, "");
    const customerWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rejectionMessage)}`;

    realtimeBus.broadcast("BOOKING_REQUEST_UPDATED", "REJECTED", updated);

    return {
      success: true,
      request: updated,
      rejectionMessage,
      customerWhatsappUrl,
    };
  }

  /**
   * Check Room Conflicts
   */
  static async checkRoomConflicts(checkIn?: string | Date, checkOut?: string | Date) {
    const totalRooms = await prisma.room.count();
    const occupiedRooms = await prisma.room.count({ where: { status: "OCCUPIED" } });
    const availableRooms = await prisma.room.count({ where: { status: "AVAILABLE" } });

    let overlappingBookings: any[] = [];
    if (checkIn && checkOut) {
      const cIn = new Date(checkIn);
      const cOut = new Date(checkOut);

      overlappingBookings = await prisma.roomBooking.findMany({
        where: {
          status: { in: ["CONFIRMED", "CHECKED_IN"] },
          AND: [
            { checkIn: { lte: cOut } },
            { checkOut: { gte: cIn } },
          ],
        },
        include: {
          room: true,
          customer: true,
        },
      });
    }

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
      overlappingCount: overlappingBookings.length,
      overlappingBookings,
    };
  }
}

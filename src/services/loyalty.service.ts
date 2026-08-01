import prisma from "@/lib/prisma";
import { AuditLogService } from "@/services/audit.service";
import { NotificationService } from "@/services/notification.service";

export type MembershipTier = "Silver" | "Gold" | "Platinum" | "Diamond";

export interface LoyaltyTierConfig {
  name: MembershipTier;
  badge: string;
  color: string;
  minPoints: number;
  minVisits: number;
  minNights: number;
  perks: string[];
}

export const LOYALTY_TIERS: Record<MembershipTier, LoyaltyTierConfig> = {
  Silver: {
    name: "Silver",
    badge: "🥈 SILVER PATRON",
    color: "#A0AEC0",
    minPoints: 0,
    minVisits: 1,
    minNights: 1,
    perks: [
      "Welcome Drink & Awadhi Sweets upon arrival",
      "Complimentary High-Speed Wi-Fi (100 Mbps)",
      "5% Reward Points on all Room & Dining spend",
    ],
  },
  Gold: {
    name: "Gold",
    badge: "🥇 GOLD PATRON",
    color: "#DFBA73",
    minPoints: 5000,
    minVisits: 3,
    minNights: 5,
    perks: [
      "Priority Front Desk Check-in & Express Check-out",
      "10% Discount on Room Tariff & Restaurant Dining",
      "Complimentary Gourmet Buffet Breakfast",
      "Early Check-in at 10:00 AM (upon availability)",
    ],
  },
  Platinum: {
    name: "Platinum",
    badge: "💎 PLATINUM VIP",
    color: "#E2E8F0",
    minPoints: 15000,
    minVisits: 7,
    minNights: 12,
    perks: [
      "Guaranteed Executive Suite Upgrade (subject to space)",
      "15% Discount on Room Tariff & Banquet Bookings",
      "Late Check-out until 02:00 PM",
      "Complimentary Airport / Railway Station Transfer",
      "Dedicated Front Desk Concierge Support",
    ],
  },
  Diamond: {
    name: "Diamond",
    badge: "👑 DIAMOND ROYAL VIP",
    color: "#38BDF8",
    minPoints: 30000,
    minVisits: 12,
    minNights: 25,
    perks: [
      "Presidential Suite Upgrade Privilege",
      "25% VIP Discount across all Hotel Outlets & Services",
      "24/7 Dedicated Personal Butler Service",
      "Free Banquet Hall Venue Rental (1 Event/Year)",
      "Exclusive Access to Private Executive Lounge",
    ],
  },
};

export class LoyaltyService {
  /**
   * Determine Membership Tier based on points, total visits, or total nights
   */
  public static calculateTier(points: number, visits: number, nights: number): MembershipTier {
    if (points >= 30000 || visits >= 12 || nights >= 25) return "Diamond";
    if (points >= 15000 || visits >= 7 || nights >= 12) return "Platinum";
    if (points >= 5000 || visits >= 3 || nights >= 5) return "Gold";
    return "Silver";
  }

  /**
   * Get complete Loyalty Profile for a customer
   */
  public static async getGuestLoyaltyProfile(customerId: string) {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        roomBookings: {
          where: { status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] } },
        },
        orders: {
          where: { status: { in: ["PAID", "SERVED", "COMPLETED"] } },
        },
        banquetBookings: {
          where: { status: { in: ["BOOKED", "COMPLETED"] } },
        },
      },
    });

    if (!customer) {
      throw new Error("Customer not found.");
    }

    // 1. Calculate Total Nights stayed
    let totalNights = 0;
    customer.roomBookings.forEach((b) => {
      if (b.checkIn && b.checkOut) {
        const diffMs = new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime();
        const nights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        totalNights += nights;
      }
    });
    totalNights = Math.max(customer.totalNights || 0, totalNights);

    // 2. Calculate Total Spend across Room Stays, Restaurant Orders & Banquets
    const roomSpend = customer.roomBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const posSpend = customer.orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const banquetSpend = customer.banquetBookings.reduce((sum, b) => sum + (b.budget || 0), 0);
    const totalSpend = (customer.totalSpent || 0) + roomSpend + posSpend + banquetSpend;

    // 3. Calculate Total Visits
    const totalVisits = Math.max(customer.visitCount || 1, customer.roomBookings.length || 1);

    // 4. Calculate Total Reward Points (1 Pt / ₹100 + 500 Pts / Visit + Manual Points)
    const pointsFromSpend = Math.floor(totalSpend / 100);
    const pointsFromVisits = totalVisits * 500;
    let manualPoints = (customer as any).loyaltyPoints || 0;

    try {
      const parsedNotes = JSON.parse(customer.notes || "{}");
      if (parsedNotes.bonusLoyaltyPoints) {
        manualPoints += Number(parsedNotes.bonusLoyaltyPoints);
      }
    } catch (e) {}

    const rewardPoints = pointsFromSpend + pointsFromVisits + manualPoints;

    // 5. Determine Current Tier & Next Tier Progress
    const currentTierName = this.calculateTier(rewardPoints, totalVisits, totalNights);
    const currentTierConfig = LOYALTY_TIERS[currentTierName];

    let nextTierName: MembershipTier | null = null;
    let targetPoints = 0;
    let pointsNeeded = 0;
    let progressPercent = 100;

    if (currentTierName === "Silver") {
      nextTierName = "Gold";
      targetPoints = 5000;
      pointsNeeded = Math.max(0, targetPoints - rewardPoints);
      progressPercent = Math.min(100, Math.round((rewardPoints / targetPoints) * 100));
    } else if (currentTierName === "Gold") {
      nextTierName = "Platinum";
      targetPoints = 15000;
      pointsNeeded = Math.max(0, targetPoints - rewardPoints);
      progressPercent = Math.min(100, Math.round((rewardPoints / targetPoints) * 100));
    } else if (currentTierName === "Platinum") {
      nextTierName = "Diamond";
      targetPoints = 30000;
      pointsNeeded = Math.max(0, targetPoints - rewardPoints);
      progressPercent = Math.min(100, Math.round((rewardPoints / targetPoints) * 100));
    }

    return {
      customerId: customer.id,
      guestName: customer.name,
      phone: customer.phone,
      email: customer.email,
      totalVisits,
      totalNights,
      totalSpend,
      rewardPoints,
      currentTier: currentTierConfig,
      nextTierName,
      targetPoints,
      pointsNeeded,
      progressPercent,
      perks: currentTierConfig.perks,
    };
  }

  /**
   * Manager Award Bonus Points to Customer
   */
  public static async awardManagerBonusPoints(data: {
    customerId: string;
    points: number;
    reason: string;
    managerName: string;
  }) {
    if (!data.points || data.points <= 0) {
      throw new Error("Bonus points must be a positive integer.");
    }

    const targetCustomer = await prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!targetCustomer) {
      throw new Error("Target customer profile not found.");
    }

    let currentBonus = 0;
    try {
      const parsedNotes = JSON.parse(targetCustomer.notes || "{}");
      currentBonus = Number(parsedNotes.bonusLoyaltyPoints || 0);
    } catch (e) {}

    const newBonus = currentBonus + data.points;
    const newNotesObj = {
      bonusLoyaltyPoints: newBonus,
      lastAwardedBy: data.managerName,
      lastAwardReason: data.reason,
      awardedAt: new Date().toISOString(),
    };

    const updatedCustomer = await prisma.customer.update({
      where: { id: data.customerId },
      data: {
        notes: JSON.stringify(newNotesObj),
      },
    });

    await AuditLogService.log({
      action: "LOYALTY_POINTS_AWARDED",
      details: `Manager ${data.managerName} awarded ${data.points} bonus points to ${updatedCustomer.name}. Reason: ${data.reason}`,
    });

    await NotificationService.createNotification({
      title: `🎉 Bonus Reward Points Awarded!`,
      message: `You earned ${data.points} bonus loyalty points! Reason: ${data.reason}`,
      type: "SUCCESS",
      link: "/customer/dashboard",
    });

    return updatedCustomer;
  }
}

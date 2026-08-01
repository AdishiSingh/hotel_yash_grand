import prisma from "@/lib/prisma";
import { LoyaltyService } from "./loyalty.service";

export interface RoomRecommendation {
  preferredRoom: string;
  recommendedCategory: string;
  suggestedRoomNumber?: string;
  reason: string;
}

export interface FoodRecommendation {
  favouriteCuisine: string;
  recommendedDishes: Array<{ name: string; category: string; price: number }>;
  reason: string;
}

export interface BanquetRecommendation {
  recommendedPackage: string;
  hallName: string;
  suggestedCapacity: number;
  reason: string;
}

export interface PersonalizedOfferRecommendation {
  offerTitle: string;
  discountPercent: number;
  promoCode: string;
  perks: string[];
  reason: string;
}

export interface CustomerRecommendationProfile {
  customerId: string;
  guestName: string;
  visitCount: number;
  isReturningGuest: boolean;
  tierBadge: string;
  roomRecommendation: RoomRecommendation;
  foodRecommendation: FoodRecommendation;
  banquetRecommendation: BanquetRecommendation;
  offerRecommendation: PersonalizedOfferRecommendation;
}

export class RecommendationService {
  /**
   * Analyze customer history to generate personalized recommendations with transparent explainability
   */
  public static async getPersonalizedRecommendations(customerId: string): Promise<CustomerRecommendationProfile> {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        roomBookings: {
          include: { room: true },
          orderBy: { createdAt: "desc" },
        },
        orders: {
          include: { items: true },
          orderBy: { createdAt: "desc" },
        },
        banquetBookings: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      throw new Error("Customer profile not found.");
    }

    const visitCount = Math.max(customer.visitCount || 1, customer.roomBookings.length);
    const isReturningGuest = visitCount > 1;

    // Get loyalty profile for discount tier calculation
    const loyaltyProfile = await LoyaltyService.getGuestLoyaltyProfile(customer.id);
    const tierName = loyaltyProfile.currentTier.name;
    const tierBadge = loyaltyProfile.currentTier.badge;

    // 1. Room Recommendation & Preferred Room
    const pastRoomTypes = customer.roomBookings.map((b) => b.room?.type || "Executive Suite");
    const preferredRoomCategory = customer.favouriteRoom || pastRoomTypes[0] || "Executive Suite";
    const lastRoomNumber = customer.roomBookings[0]?.room?.roomNumber || "201";

    let recommendedCategory = preferredRoomCategory;
    let roomReason = `Recommended because you previously stayed ${visitCount} time(s) in ${preferredRoomCategory} (Room #${lastRoomNumber}).`;

    if (visitCount >= 3 && preferredRoomCategory === "Single Deluxe Room") {
      recommendedCategory = "Executive Suite";
      roomReason = `Suggested upgrade to Executive Suite based on your 3+ stay visits and loyalty status.`;
    }

    const roomRecommendation: RoomRecommendation = {
      preferredRoom: preferredRoomCategory,
      recommendedCategory,
      suggestedRoomNumber: lastRoomNumber,
      reason: roomReason,
    };

    // 2. Food & Favourite Cuisine Recommendation
    const favouriteDishesList = customer.favouriteDishes.length > 0
      ? customer.favouriteDishes
      : ["Galouti Kebab", "Awadhi Dum Biryani", "Shahi Tukda"];

    const favouriteCuisine = customer.favouriteDishes.some((d) => d.toLowerCase().includes("kebab") || d.toLowerCase().includes("biryani"))
      ? "Awadhi Mughlai Specialty"
      : "North Indian Gourmet & Tandoor";

    const foodRecommendation: FoodRecommendation = {
      favouriteCuisine,
      recommendedDishes: [
        { name: "Royal Awadhi Galouti Kebab", category: "Starters", price: 550 },
        { name: "Yash Grand Chef Special Dum Biryani", category: "Main Course", price: 650 },
        { name: "Zafrani Shahi Tukda", category: "Desserts", price: 280 },
      ],
      reason: `Suggested based on your favourite dishes (${favouriteDishesList.slice(0, 2).join(", ")}) and preference for ${favouriteCuisine}.`,
    };

    // 3. Banquet Package Recommendation
    const lastBanquet = customer.banquetBookings[0];
    const banquetPackage = lastBanquet?.eventType || "Royal Wedding & Celebration Gala";
    const hallName = "Grand Ballroom #1";

    const banquetRecommendation: BanquetRecommendation = {
      recommendedPackage: banquetPackage,
      hallName,
      suggestedCapacity: lastBanquet?.guestsCount || 200,
      reason: `Recommended based on your past ${banquetPackage} celebration for ${lastBanquet?.guestsCount || 200} guests in ${hallName}.`,
    };

    // 4. Return Guest Discount & Offer Recommendation
    let discountPercent = 10;
    let offerTitle = "Return Guest Privilege: 10% Off Stay & Complimentary Breakfast";

    if (tierName === "Diamond" || visitCount >= 10) {
      discountPercent = 25;
      offerTitle = "Diamond VIP Offer: 25% Off Room & Free Suite Upgrade";
    } else if (tierName === "Platinum" || visitCount >= 5) {
      discountPercent = 15;
      offerTitle = "Platinum Privilege: 15% Off Stay & Free Airport Transfer";
    } else if (isReturningGuest) {
      discountPercent = 12;
      offerTitle = "Welcome Back Patron Offer: 12% Off Next Stay & Free Welcome Drink";
    }

    const offerRecommendation: PersonalizedOfferRecommendation = {
      offerTitle,
      discountPercent,
      promoCode: `YG-PATRON-${discountPercent}`,
      perks: [
        `${discountPercent}% Direct Tariff Discount`,
        "Complimentary Early Check-in at 10:00 AM",
        "Free High-Speed Wi-Fi & Welcome Sweets",
      ],
      reason: `Awarded to ${customer.name} as a ${tierBadge} returning guest with ${visitCount} stay visit(s).`,
    };

    return {
      customerId: customer.id,
      guestName: customer.name,
      visitCount,
      isReturningGuest,
      tierBadge,
      roomRecommendation,
      foodRecommendation,
      banquetRecommendation,
      offerRecommendation,
    };
  }
}

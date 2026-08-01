import prisma from "@/lib/prisma";
import { BUSINESS_KNOWLEDGE } from "../services/businessData";
import { NotificationService } from "@/services/notification.service";
import { AuditLogService } from "@/services/audit.service";

export interface AIResponse {
  answer: string;
  suggestions?: string[];
  dishes?: any[];
  roomRecommendation?: string;
  banquetRecommendation?: string;
  isEscalated?: boolean;
}

export async function processSadyaQuery(query: string, history: Array<{ sender: string; text: string }> = []): Promise<AIResponse> {
  const normalized = query.toLowerCase().trim();

  // Audit Log interaction
  await AuditLogService.log({
    action: "SADYA_AI_CONCIERGE_QUERY",
    details: `User asked SADYA: "${query.substring(0, 100)}"`,
  });

  // 1. Human Staff Escalation Request
  if (
    normalized.includes("human") ||
    normalized.includes("manager") ||
    normalized.includes("staff") ||
    normalized.includes("speak to person") ||
    normalized.includes("complain") ||
    normalized.includes("agent") ||
    normalized.includes("receptionist")
  ) {
    await NotificationService.createNotification({
      title: "Human Escalation Requested by Guest",
      message: `A guest chatting with SADYA requested live staff assistance: "${query}"`,
      type: "ALERT",
      link: "/dashboard/enquiries",
    });

    return {
      answer: "I have immediately alerted our Front Desk Duty Manager! 🛎️ A human staff member will connect with you shortly. You can also call us directly at +91 91510 88115 or tap below to WhatsApp our reception manager.",
      suggestions: ["WhatsApp Front Desk", "Call Duty Manager", "Check Room Rates"],
      isEscalated: true,
    };
  }

  // 2. Booking Status Lookup (e.g., "status YG-BK-1234" or "my booking")
  if (normalized.includes("status") || normalized.includes("booking ref") || normalized.includes("my reservation")) {
    const match = normalized.match(/yg-[a-z0-9-]+/i);
    if (match) {
      const ref = match[0].toUpperCase();
      const booking = await prisma.roomBooking.findFirst({
        where: { OR: [{ bookingId: ref }, { id: ref }] },
        include: { room: true },
      });

      if (booking) {
        return {
          answer: `I found your reservation **${booking.bookingId}** for Room ${booking.room.roomNumber} (${booking.room.type})! Status: **${booking.status}**. Check-in: **${new Date(booking.checkIn).toLocaleDateString()}**, Check-out: **${new Date(booking.checkOut).toLocaleDateString()}**. Advance Paid: ₹${booking.advancePaid} of ₹${booking.totalAmount}.`,
          suggestions: ["Need Express Check-in QR?", "Order Room Service", "Contact Reception"],
        };
      }
    }

    return {
      answer: "To check your live booking status, please provide your booking reference ID (e.g. YG-BK-1001) or call our reception desk at +91 91510 88115.",
      suggestions: ["Check Room Availability", "Speak to Human Manager"],
    };
  }

  // 3. Live Menu & Food Recommendations
  if (
    normalized.includes("menu") ||
    normalized.includes("food") ||
    normalized.includes("dish") ||
    normalized.includes("paneer") ||
    normalized.includes("biryani") ||
    normalized.includes("soup") ||
    normalized.includes("veg")
  ) {
    const dbItems = await prisma.menuItem.findMany({ take: 4 });
    const dishesList = dbItems.map((i) => `• ${i.name} (₹${i.price})`).join("\n");

    return {
      answer: `Our signature Awadhi & North Indian menu features delicious master-chef specials:\n\n${dishesList}\n\nAll food is prepared fresh daily. Would you like me to guide you to the POS online order menu?`,
      dishes: dbItems,
      suggestions: ["Order Online Now", "View Full Menu", "Restaurant Timing"],
    };
  }

  // 4. Room Availability & Prices
  if (normalized.includes("room") || normalized.includes("price") || normalized.includes("tariff") || normalized.includes("suite")) {
    const availableRooms = await prisma.room.findMany({ where: { status: "AVAILABLE" }, take: 3 });
    const roomDetails = availableRooms.map((r) => `• Room ${r.roomNumber} (${r.type}): ₹${r.pricePerNight}/night`).join("\n");

    return {
      answer: `We have luxury suite accommodations available at Hotel Yash Grand:\n\n${roomDetails}\n\nEvery room includes complimentary high-speed Wi-Fi, air conditioning, and 24/7 room service.`,
      suggestions: ["Book A Room Now", "Check In/Out Policy", "Parking Info"],
    };
  }

  // 5. Banquet & Event Packages
  if (normalized.includes("banquet") || normalized.includes("wedding") || normalized.includes("hall") || normalized.includes("party")) {
    return {
      answer: "Our Grand Ballroom & Lawn accommodates up to 500+ guests with high-ceiling columnless architectures, bridal suites, acoustic insulation, and gourmet multi-cuisine catering packages. Ideal for weddings, corporate seminars, and birthday galas.",
      suggestions: ["Request Banquet Quote", "Banquet Capacity", "Speak to Event Manager"],
    };
  }

  // 6. Knowledge Base Fallback
  for (const fact of BUSINESS_KNOWLEDGE) {
    const matches = fact.keywords.some((keyword) => normalized.includes(keyword));
    if (matches) {
      return { answer: fact.answer, suggestions: ["Book A Room", "Order Food", "Talk to Manager"] };
    }
  }

  return {
    answer: "Namaste! 🙏 Hotel Yash Grand offers 24/7 luxury stays, fine Awadhi dining, and wedding banquets. You can ask me about room prices, menu dishes, booking status, or request human staff assistance.",
    suggestions: ["View Room Tariffs", "Today's Special Dishes", "Speak to Human Duty Manager"],
  };
}

export const processUserQuery = processSadyaQuery;

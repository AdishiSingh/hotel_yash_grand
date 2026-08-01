export interface HotelFact {
  category: string;
  keywords: string[];
  answer: string;
}

export const BUSINESS_KNOWLEDGE: HotelFact[] = [
  {
    category: "general",
    keywords: ["hotel", "yash grand", "about", "where", "location", "address", "landmark"],
    answer: "Hotel Yash Grand is a premium luxury hotel located Near SMS College, Varanasi, Uttar Pradesh - 221011. It features top-tier suite accommodations, a signature multi-cuisine Veg & Non-Veg restaurant, and wedding banquets."
  },
  {
    category: "rooms",
    keywords: ["room", "suite", "stay", "accommodation", "executive", "deluxe", "price", "tariff", "beds"],
    answer: "We offer two room categories across 11 physical rooms: 1) Single Deluxe Room (INR 2,500/night, max 2 guests, with attached balcony, highway view, 24x7 Wi-Fi, 24x7 room service, LED Smart TV, and restaurant food delivery), and 2) Family Room (INR 4,000/night, max 4 guests, consisting of two connected rooms suitable for families). Check-in is at 12:00 PM and check-out is at 11:00 AM."
  },
  {
    category: "dining",
    keywords: ["restaurant", "food", "veg", "vegetarian", "menu", "dining", "lunch", "dinner", "breakfast", "timing"],
    answer: "Our restaurant offers a premium selection of both Veg & Non-Veg dishes, specializing in North Indian, Awadhi, South Indian, and Chinese cuisines. Timing: 07:00 AM to 11:00 PM daily. In-house guests can order room service 24/7."
  },
  {
    category: "banquet",
    keywords: ["banquet", "hall", "wedding", "marriage", "reception", "party", "lawn", "capacity", "guests"],
    answer: "Our Grand Banquet Hall accommodates up to 500+ guests when integrated with the outdoor lawn setups. It is fully air-conditioned and ideal for weddings, anniversaries, corporate seminars, and birthday parties."
  },
  {
    category: "parking",
    keywords: ["parking", "car", "valet", "vehicle", "garage", "secure"],
    answer: "We provide complimentary secure valet parking inside the hotel gates for all room, restaurant, and banquet guests."
  },
  {
    category: "policy",
    keywords: ["cancel", "cancellation", "refund", "deposit", "policy", "cancellation policy"],
    answer: "For rooms, cancellations made 48 hours prior to check-in receive a full refund. Cancellations inside 48 hours incur a 1-night charge penalty. Banquet bookings require a 25% non-refundable advance deposit."
  },
  {
    category: "contact",
    keywords: ["contact", "phone", "whatsapp", "email", "reservations", "call", "mobile"],
    answer: "You can contact Hotel Yash Grand front desk at +91 91510 88115 or +91 91510 88116, WhatsApp us directly at +91 91510 88115, or email yashgrand03nov@gmail.com."
  }
];

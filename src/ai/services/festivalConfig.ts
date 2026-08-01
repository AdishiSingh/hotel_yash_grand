export interface FestivalPromotion {
  id: string;
  name: string;
  bannerTitle: string;
  description: string;
  discountCode: string;
  discountAmount: number;
  type: "room" | "restaurant" | "banquet";
  isActive: boolean;
}

export const FESTIVAL_PROMOTIONS: FestivalPromotion[] = [
  {
    id: "diwali-2026",
    name: "Diwali Lights Celebration",
    bannerTitle: "Shubh Deepavali Stay Package",
    description: "Celebrate the festival of lights with 15% off on all Royal Suites and complimentary Awadhi breakfast.",
    discountCode: "DEEP15",
    discountAmount: 15,
    type: "room",
    isActive: true
  },
  {
    id: "wedding-2026",
    name: "Winter Wedding Season Special",
    bannerTitle: "Royal Wedding Banquet Deal",
    description: "Secure your wedding date and get complimentary custom theme stage decoration and welcome drinks.",
    discountCode: "WEDDINGGRAND",
    discountAmount: 10,
    type: "banquet",
    isActive: true
  },
  {
    id: "valentines-2026",
    name: "Valentine's Romantic Dining",
    bannerTitle: "Candle-Light Family Dinner",
    description: "Book a table and receive 10% off on signature main courses and a complimentary chocolate fudge dessert.",
    discountCode: "VALENTINE",
    discountAmount: 10,
    type: "restaurant",
    isActive: false
  }
];

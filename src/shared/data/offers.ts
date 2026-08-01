export interface HospitalityOffer {
  id: string;
  title: string;
  tagline: string;
  discountRate: string;
  description: string;
  validity: string;
  ctaText: string;
}

export const OFFERS_DATA: HospitalityOffer[] = [
  {
    id: "early-bird",
    title: "Sanctuary Early Bird",
    tagline: "Book in advance and save",
    discountRate: "15% OFF SUITES",
    description: "Plan your Varanasi visit 15 days in advance to unlock direct discounts on all luxury suite rooms.",
    validity: "Valid till Oct 31, 2026",
    ctaText: "Inquire Offer",
  },
  {
    id: "royal-wedding",
    title: "Grand Wedding Package",
    tagline: "Bespoke decorations included",
    discountRate: "FREE BRIDAL SUITE",
    description: "Secure your wedding date in our Grand Ballroom to receive a complimentary night in our Royal Suite.",
    validity: "Valid for 2026/27 bookings",
    ctaText: "Verify Wedding Package",
  },
];

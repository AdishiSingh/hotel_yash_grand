export interface LoyaltyTier {
  name: "Silver" | "Gold" | "Platinum";
  minVisits: number;
  pointsMultiplier: number;
  perks: string[];
  colorHex: string;
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    name: "Silver",
    minVisits: 0,
    pointsMultiplier: 1.0,
    perks: ["5% off on restaurant dining", "Early check-in request priority"],
    colorHex: "#C0C0C0"
  },
  {
    name: "Gold",
    minVisits: 5,
    pointsMultiplier: 1.2,
    perks: ["10% off on dining", "Complimentary room upgrade subject to availability", "Free high-speed Wi-Fi access"],
    colorHex: "#DFBA73"
  },
  {
    name: "Platinum",
    minVisits: 12,
    pointsMultiplier: 1.5,
    perks: [
      "15% off on dining",
      "Guaranteed room upgrade to suites",
      "Complimentary secure valet parking priority",
      "Dedicated 24/7 front desk manager support"
    ],
    colorHex: "#E5E4E2"
  }
];

export function calculateRewardPoints(spend: number, tier: "Silver" | "Gold" | "Platinum"): number {
  const basePoints = Math.floor(spend / 100); // 1 point per 100 Rupees spend
  const tierObj = LOYALTY_TIERS.find((t) => t.name === tier);
  const multiplier = tierObj ? tierObj.pointsMultiplier : 1.0;
  return Math.floor(basePoints * multiplier);
}

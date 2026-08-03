import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";

export interface BanquetPackage {
  name: string;
  desc: string;
  capacityRange: string;
  pricePlaceholder: string;
}

export interface BanquetFAQ {
  question: string;
  answer: string;
}

export interface BanquetDetails {
  name: string;
  description: string;
  capacity: {
    total: number;
    dining: number;
    stageSize: string;
    parking: string;
  };
  facilities: string[];
  features: string[];
  packages: BanquetPackage[];
  faqs: BanquetFAQ[];
  images: string[];
  videos: string[];
  contact: {
    managerPhone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
}

export const BANQUET_DATA: BanquetDetails = {
  name: "The Grand Ballroom & Lawn",
  description: "The premier luxury event destination in Varanasi. Merging high-ceiling columnless architectures, polished marble pathways, acoustic wood insulation panels, and direct lawn connections to shape royal weddings and grand celebrations.",
  capacity: {
    total: 500,
    dining: 350,
    stageSize: "32ft x 16ft x 3ft",
    parking: "Valet parking for 100+ vehicles"
  },
  facilities: [
    "Fully Air-Conditioned Indoors",
    "Specialized Bridal Dressing Suite",
    "Pre-Function Reception Foyer",
    "Soundproof Acoustic Wall Panels",
    "Gourmet Multi-Cuisine Catering Kitchen",
    "State-of-the-Art Ambient Illumination"
  ],
  features: [
    "Flexible Decoration setups",
    "Dedicated Event Management Support",
    "24/7 Power Generator Backup",
    "Premium Audio-Visual Equipment",
    "Prime Location near SMS College"
  ],
  packages: [
    {
      name: "Wedding Package",
      desc: "Full ballroom reservation, Stage setup, Bridal Suite, flower decors, and grand buffet coordinates.",
      capacityRange: "150 - 300 Guests",
      pricePlaceholder: "Contact for Best Pricing"
    },
    {
      name: "Reception Package",
      desc: "Lawn and Ballroom integration, multi-cuisine catering, stage setup, and valet services.",
      capacityRange: "200 - 450 Guests",
      pricePlaceholder: "Contact for Best Pricing"
    },
    {
      name: "Birthday & Anniversary Package",
      desc: "Cozy family setups, custom lighting, specialized kids dining options, and stage systems.",
      capacityRange: "50 - 200 Guests",
      pricePlaceholder: "Contact for Best Pricing"
    },
    {
      name: "Corporate Conference Package",
      desc: "Projectors, microphones, soundproofing, high-speed WiFi, tea/coffee service, and U-shape seating.",
      capacityRange: "50 - 150 Guests",
      pricePlaceholder: "Contact for Best Pricing"
    }
  ],
  faqs: [
    {
      question: "What is the total guest capacity of the banquet hall?",
      answer: "The Grand Ballroom and Lawn can hold up to 500+ guests in standing receptions, or 350 guests in round-table buffet dining configurations."
    },
    {
      question: "What is the decoration policy?",
      answer: "We support flexible decorations. You can choose from our list of approved premium design panels, or bring your own professional decorators with prior approval."
    },
    {
      question: "Is outside catering allowed?",
      answer: "We provide high-end, Veg & Non-Veg multi-cuisine catering packages prepared by our master chefs. Outside catering is not permitted to guarantee complete safety and culinary hygiene."
    },
    {
      question: "What is the parking availability?",
      answer: "We offer secure, gated valet parking inside the hotel premises for up to 100+ vehicles during large events."
    },
    {
      question: "What is the advance booking amount?",
      answer: "A 25% non-refundable advance payment of the venue rent is required to block your date. Scheduled balance payments follow."
    },
    {
      question: "What is your cancellation/rescheduling policy?",
      answer: "Events can be rescheduled to any vacant date with a 30-day notice. Cancellations trigger tier-based refunds based on the timeframe."
    }
  ],
  images: [
    ASSET_MANIFEST.banquet.banquetDecoration,
    ASSET_MANIFEST.banquet.banquetHall,
    ASSET_MANIFEST.banquet.banquetMain,
    ASSET_MANIFEST.banquet.stageSetup,
    ASSET_MANIFEST.banquet.ceilingArchitecture,
  ],
  videos: [
    ASSET_MANIFEST.videos.banquetBallroom,
    ASSET_MANIFEST.videos.banquetStage,
    ASSET_MANIFEST.videos.banquetEmptyHall
  ],
  contact: {
    managerPhone: "+91 91510 88115",
    whatsapp: "+91 91510 88115",
    email: "yashgrand03nov@gmail.com",
    address: "Near SMS College, Varanasi, UP, 221011"
  }
};

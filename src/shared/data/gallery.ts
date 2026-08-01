import { ASSET_MANIFEST } from "../lib/asset-manifest";

export interface GalleryPhoto {
  src: string;
  alt: string;
  category: "rooms" | "restaurant" | "banquet" | "exterior" | "operations";
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // EXTERIOR / LOBBY
  {
    src: ASSET_MANIFEST.hotel.facadeMain,
    alt: "Grand main facade of Hotel Yash Grand Varanasi, displaying architecture",
    category: "exterior",
  },
  {
    src: ASSET_MANIFEST.hotel.porchSign,
    alt: "Illuminated hotel entrance porch and welcome signage",
    category: "exterior",
  },
  {
    src: ASSET_MANIFEST.hotel.facadeAngle3,
    alt: "Architectural angle view of the hotel building exterior",
    category: "exterior",
  },
  {
    src: ASSET_MANIFEST.gallery.corridorDepth,
    alt: "Symmetric Perspective view of guest corridors with ambient lighting",
    category: "exterior",
  },

  // ROOMS & SUITES
  {
    src: ASSET_MANIFEST.rooms.royalSuite,
    alt: "Royal Suite master bedroom configuration",
    category: "rooms",
  },
  {
    src: ASSET_MANIFEST.rooms.executiveSuite,
    alt: "Executive Suite lounge and bed arrangement",
    category: "rooms",
  },
  {
    src: ASSET_MANIFEST.rooms.deluxeRoom,
    alt: "Premium Deluxe room setup with wooden accents",
    category: "rooms",
  },
  {
    src: ASSET_MANIFEST.rooms.bedDetail,
    alt: "Close-up of premium linen bed detailing in the suite",
    category: "rooms",
  },
  {
    src: ASSET_MANIFEST.rooms.vanityDetail,
    alt: "Bathroom vanity mirror and marble surface setup",
    category: "rooms",
  },

  // CULINARY / DINING
  {
    src: ASSET_MANIFEST.restaurant.interiorCeiling,
    alt: "Fine dining restaurant featuring high wooden design ceilings",
    category: "restaurant",
  },
  {
    src: ASSET_MANIFEST.restaurant.diningTables,
    alt: "Premium dining table arrangements with glass setups",
    category: "restaurant",
  },
  {
    src: ASSET_MANIFEST.restaurant.diningSeatingOverview,
    alt: "Spacious family dining room seating overview",
    category: "restaurant",
  },
  {
    src: ASSET_MANIFEST.restaurant.familyDiningRoom,
    alt: "Dedicated private dining space for group events",
    category: "restaurant",
  },

  // THE GRAND BALLROOM (BANQUET)
  {
    src: ASSET_MANIFEST.banquet.stageSetup,
    alt: "Main stage wedding setup decorated in fresh floral designs",
    category: "banquet",
  },
  {
    src: ASSET_MANIFEST.banquet.ceilingArchitecture,
    alt: "Banquet hall showing wood-carved acoustic ceilings",
    category: "banquet",
  },
  {
    src: ASSET_MANIFEST.banquet.emptyGrandHall,
    alt: "The Grand Ballroom spacious empty view before setups",
    category: "banquet",
  },
  {
    src: ASSET_MANIFEST.banquet.flowerDecoration,
    alt: "Royal theme floral decorations at the entrance doorway",
    category: "banquet",
  },

  // BEHIND-THE-SCENES / OPERATIONS
  {
    src: ASSET_MANIFEST.gallery.receptionDesk,
    alt: "Polished reception desk and welcoming lobby pathways",
    category: "operations",
  },
  {
    src: ASSET_MANIFEST.gallery.kitchenCounter,
    alt: "Brushed stainless steel industrial prep counter in the kitchen",
    category: "operations",
  },
  {
    src: ASSET_MANIFEST.gallery.kitchenRange,
    alt: "Heavy duty cooking ranges for bulk catering preparation",
    category: "operations",
  },
  {
    src: ASSET_MANIFEST.gallery.kitchenPrep,
    alt: "Vegetable chopping station with strict hygiene standards",
    category: "operations",
  },
];

import { ASSET_MANIFEST } from "../lib/asset-manifest";

export interface RoomCategory {
  id: string;
  name: string;
  description: string;
  size: string;
  occupancy: string;
  bedType: string;
  view: string;
  price: string;
  priceValue: number;
  imageUrl: string;
  images: string[];
  amenities: string[];
}

export const ROOMS_DATA: RoomCategory[] = [
  {
    id: "single-deluxe",
    name: "Single Deluxe Room",
    description: "A modern and comfortable room ideal for couples and business travellers. Located near Heritage Hospital, SHEPA College and within walking distance of SMS College, it offers a peaceful stay with premium amenities and convenient access to important city destinations.",
    size: "280 sq ft",
    occupancy: "2 Guests",
    bedType: "Double Bed",
    view: "Highway View",
    price: "INR 2,500 / night",
    priceValue: 2500,
    imageUrl: ASSET_MANIFEST.rooms.deluxeRoom,
    images: [
      "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.09-2.jpeg",
      "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.09.jpeg",
      "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.08-2.jpeg"
    ],
    amenities: [
      "Highway View",
      "Attached Balcony",
      "24×7 High-Speed Wi-Fi",
      "24×7 Room Service",
      "Direct Food Ordering from HOTEL YASH GRAND Restaurant",
      "LED Smart TV",
      "Air Conditioner",
      "Premium Washroom",
      "Daily Housekeeping",
      "Fresh Linen"
    ]
  },
  {
    id: "family-room",
    name: "Family Room",
    description: "A spacious family accommodation consisting of two connected rooms. Perfect for families visiting Varanasi, with easy access to Heritage Hospital, SHEPA College and SMS College, while enjoying comfort, privacy and premium hospitality.",
    size: "480 sq ft",
    occupancy: "Up to 4 Guests",
    bedType: "Two Connected Rooms",
    view: "Highway View",
    price: "INR 4,000 / night",
    priceValue: 4000,
    imageUrl: ASSET_MANIFEST.rooms.royalSuite,
    images: [
      "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.03-2.jpeg",
      "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.03.jpeg",
      "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.10.jpeg",
      "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.04-2.jpeg",
      "/assets/rooms/WhatsApp Image 2026-07-11 at 11.30.04.jpeg"
    ],
    amenities: [
      "Two Connected Rooms",
      "Highway View",
      "Attached Balcony",
      "24×7 High-Speed Wi-Fi",
      "24×7 Room Service",
      "Direct Food Ordering from HOTEL YASH GRAND Restaurant",
      "LED Smart TV",
      "Air Conditioner",
      "Premium Washroom",
      "Daily Housekeeping",
      "Fresh Linen"
    ]
  }
];

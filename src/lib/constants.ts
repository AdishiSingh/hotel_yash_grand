/**
 * BRAND & CONTACT SPECIFICATIONS
 */
export const BRAND = {
  name: "Hotel Yash Grand",
  tagline: "Restaurant & Banquet",
  location: "Near SMS College, Varanasi, Uttar Pradesh",
  phone: "+91 91510 88115 / +91 91510 88116",
  email: "reservations@yashgrand.com",
  whatsappUrl: "https://wa.me/919151088115?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20booking%20at%20Hotel%20Yash%20Grand.",
  googleMapsUrl: "https://maps.google.com",
};

/**
 * MAIN NAVIGATION LINKS
 */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Our Rooms", href: "/rooms" },
  { label: "Banquet Hall", href: "/banquet" },
  { label: "Restaurant", href: "/dining" },
  { label: "Contact Us", href: "/contact" },
];

/**
 * ROOM CATEGORY BLUEPRINTS
 */
export const ROOM_CATEGORIES = [
  {
    slug: "single-deluxe",
    name: "Single Deluxe Room",
    description: "A modern and comfortable deluxe room designed for couples, business travellers and small families.",
    size: "280 sq ft",
    occupancy: "2 Guests",
    amenities: ["Highway View", "Attached Balcony", "24x7 Wi-Fi", "A/C", "LED TV", "Room Service"],
    price: "INR 2,500",
  },
  {
    slug: "family-room",
    name: "Family Room",
    description: "A spacious family accommodation consisting of two connected rooms, specially designed for families and groups.",
    size: "480 sq ft",
    occupancy: "Up to 4 Guests",
    amenities: ["Two Connected Rooms", "Highway View", "Attached Balcony", "24x7 Wi-Fi", "A/C", "LED TV", "Room Service"],
    price: "INR 4,000",
  },
];

/**
 * BANQUET HALL SPECIFICATIONS
 */
export const BANQUET_SPECS = {
  name: "The Grand Ballroom",
  capacity: "Up to 500 Guests",
  area: "6,000 sq ft",
  features: [
    "Warm Wooden Ceiling Architecture",
    "Glossy High-End Marble Flooring",
    "Custom Light Scenarios & Dimming",
    "State-of-the-Art Acoustic System",
    "Dedicated Bridal Preparation Suite",
    "Spacious Banquet Dining Room Area",
  ],
  eventTypes: [
    "Royal Weddings & Receptions",
    "Engagement Ceremonies",
    "Corporate Seminars & Meetings",
    "Anniversaries & Birthday Celebrations",
  ],
};

/**
 * RESTAURANT & CULINARY CONSTANTS
 */
export const CULINARY_SPECS = {
  restaurantName: "HOTEL YASH GRAND",
  style: "Multi-Cuisine Fine Dining & Family Lounge",
  seatingCapacity: "120 Seats",
  cuisines: ["North Indian Awadhi Heritage", "Pan-Asian Delicacies", "Traditional Continental", "Varanasi Local Gastronomy Specials"],
  signatureDishes: [
    { name: "Royal Awadhi Biryani", description: "Slow-cooked saffron rice with aromatic spices." },
    { name: "Banarasi Tomato Chaat", description: "Deconstructed local specialty served in clay pots." },
    { name: "Saffron Rabdi", description: "Traditional sweet milk reduction flavored with cardamom." },
  ],
};

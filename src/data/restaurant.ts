export interface RestaurantDetails {
  name: string;
  description: string;
  openingHours: string;
  cuisine: string;
  facilities: string[];
  specialties: string[];
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
}

export const RESTAURANT_DATA: RestaurantDetails = {
  name: "The Yash Grand Restaurant",
  description: "Experience premium fine dining under architectural high wooden panel ceilings. We orchestrate traditional Veg & Non-Veg Awadhi heritage, North Indian slow-cooked signatures, and global culinary favorites prepared fresh by master chefs.",
  openingHours: "07:00 AM - 11:00 PM (Daily)",
  cuisine: "Authentic North Indian, Awadhi, Chinese, South Indian",
  facilities: [
    "Fully Air-Conditioned Interiors",
    "Private Family Seating Chambers",
    "On-site Safe Valet Parking",
    "Hygienic Open-Counter Kitchen",
    "Fast Table-Side Service",
    "Takeaway & Digital ordering available"
  ],
  specialties: [
    "Paneer Butter Masala",
    "Paneer Tikka Masala",
    "Kaju Paneer Masala",
    "Handi Paneer",
    "Malai Kofta",
    "Tandoori Laccha Paratha"
  ],
  contact: {
    phone: "+91 91510 88115",
    whatsapp: "+91 91510 88115",
    email: "yashgrand03nov@gmail.com",
    address: "Near SMS College, Varanasi, Uttar Pradesh, 221011"
  }
};

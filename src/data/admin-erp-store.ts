export type UserRole = "OWNER" | "MANAGER" | "RECEPTION" | "RESTAURANT_MANAGER" | "KITCHEN_STAFF" | "ACCOUNTANT";

export interface ErpUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface ErpOrder {
  id: string;
  orderId: string;
  tableNumber: string;
  customerName: string;
  customerPhone?: string;
  items: { name: string; quantity: number; price: number; variant?: string }[];
  totalItems: number;
  subtotal: number;
  tax: number;
  grandTotal: number;
  paymentMethod: "CASH" | "UPI" | "CARD" | "ONLINE";
  status: "NEW" | "ACCEPTED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
  orderTime: string;
  kotPrinted: boolean;
}

export interface ErpRoom {
  id: string;
  roomNumber: string;
  type: "Deluxe Single" | "Family Suite" | "Executive King" | "Royal Suite";
  pricePerNight: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  currentGuest?: string;
  checkIn?: string;
  checkOut?: string;
  amenities: string[];
}

export interface ErpBanquet {
  id: string;
  enquiryId: string;
  customerName: string;
  phone: string;
  email?: string;
  eventType: "Wedding Reception" | "Corporate Conference" | "Birthday Gala" | "Anniversary Party";
  guests: number;
  date: string;
  budget: number;
  specialRequirements?: string;
  status: "NEW" | "CONTACTED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export interface ErpCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalSpent: number;
  visitCount: number;
  lastVisit: string;
  favouriteDishes: string[];
  isReturning: boolean;
}

export interface ErpEnquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  date: string;
  status: "UNREAD" | "READ" | "REPLIED" | "CLOSED";
}

export interface ErpBill {
  id: string;
  billNumber: string;
  orderId: string;
  customerName: string;
  tableNumber: string;
  amount: number;
  gstAmount: number;
  grandTotal: number;
  paymentMethod: "CASH" | "UPI" | "CARD" | "ONLINE";
  issuedAt: string;
}

export interface ErpInventory {
  id: string;
  name: string;
  category: "Dairy" | "Grains" | "Vegetables" | "Spices" | "Beverages" | "Oil";
  quantity: number;
  unit: "kg" | "L" | "packets" | "boxes";
  minThreshold: number;
  supplier: string;
  lastRestocked: string;
}

export interface ErpReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  reply?: string;
  isFeatured: boolean;
  date: string;
}

// 1. Initial ERP Users with Role Permissions
export const INITIAL_USERS: ErpUser[] = [
  { id: "u-1", name: "Dharmpal Singh", email: "dharmpal@hotelyashgrand.com", role: "OWNER" },
  { id: "u-2", name: "Ramesh Sharma", email: "manager@hotelyashgrand.com", role: "MANAGER" },
  { id: "u-3", name: "Priya Verma", email: "reception@hotelyashgrand.com", role: "RECEPTION" },
  { id: "u-4", name: "Vikram Malhotra", email: "dining@hotelyashgrand.com", role: "RESTAURANT_MANAGER" },
  { id: "u-5", name: "Chef Harish Rawat", email: "kitchen@hotelyashgrand.com", role: "KITCHEN_STAFF" },
  { id: "u-6", name: "Anit Gupta", email: "accounts@hotelyashgrand.com", role: "ACCOUNTANT" },
];

// 2. Initial Live POS Orders
export const INITIAL_ERP_ORDERS: ErpOrder[] = [
  {
    id: "ord-1",
    orderId: "YG-20260725-789",
    tableNumber: "T-12",
    customerName: "Aarav Sharma",
    customerPhone: "+91 98765 43210",
    items: [
      { name: "Paneer Butter Masala", quantity: 1, price: 300 },
      { name: "Butter Naan", quantity: 2, price: 40 },
      { name: "Veg Fried Rice", quantity: 1, price: 220 }
    ],
    totalItems: 4,
    subtotal: 600,
    tax: 108,
    grandTotal: 708,
    paymentMethod: "UPI",
    status: "PREPARING",
    orderTime: "25 Jul 2026, 07:42 PM",
    kotPrinted: true,
  },
  {
    id: "ord-2",
    orderId: "YG-20260725-790",
    tableNumber: "T-05",
    customerName: "Sunita Patel",
    customerPhone: "+91 91234 56789",
    items: [
      { name: "Dal Makhani", quantity: 1, price: 260 },
      { name: "Jeera Rice", quantity: 1, price: 180 },
      { name: "Garlic Naan", quantity: 3, price: 50 }
    ],
    totalItems: 5,
    subtotal: 590,
    tax: 106.2,
    grandTotal: 696.2,
    paymentMethod: "CASH",
    status: "NEW",
    orderTime: "25 Jul 2026, 07:50 PM",
    kotPrinted: false,
  },
  {
    id: "ord-3",
    orderId: "YG-20260725-791",
    tableNumber: "T-18",
    customerName: "Kabir Roy",
    customerPhone: "+91 99887 76655",
    items: [
      { name: "Chicken Tikka Masala", quantity: 1, price: 360 },
      { name: "Tandoori Roti", quantity: 4, price: 25 },
      { name: "Sweet Lassi", quantity: 2, price: 90 }
    ],
    totalItems: 7,
    subtotal: 640,
    tax: 115.2,
    grandTotal: 755.2,
    paymentMethod: "CARD",
    status: "READY",
    orderTime: "25 Jul 2026, 07:30 PM",
    kotPrinted: true,
  }
];

// 3. Initial Hotel Rooms
export const INITIAL_ERP_ROOMS: ErpRoom[] = [
  { id: "r-101", roomNumber: "101", type: "Deluxe Single", pricePerNight: 2499, status: "OCCUPIED", currentGuest: "Mr. Rajesh Kumar", checkIn: "24 Jul 2026", checkOut: "26 Jul 2026", amenities: ["Free Wi-Fi", "AC", "Smart TV", "Mini Fridge"] },
  { id: "r-102", roomNumber: "102", type: "Deluxe Single", pricePerNight: 2499, status: "AVAILABLE", amenities: ["Free Wi-Fi", "AC", "Smart TV"] },
  { id: "r-103", roomNumber: "103", type: "Family Suite", pricePerNight: 4499, status: "RESERVED", currentGuest: "Sharma Family", checkIn: "26 Jul 2026", checkOut: "29 Jul 2026", amenities: ["2 King Beds", "Jacuzzi", "AC", "Dining Table"] },
  { id: "r-201", roomNumber: "201", type: "Executive King", pricePerNight: 3499, status: "OCCUPIED", currentGuest: "Dr. Ananya Roy", checkIn: "25 Jul 2026", checkOut: "27 Jul 2026", amenities: ["Balcony View", "Work Desk", "AC", "Tea Maker"] },
  { id: "r-202", roomNumber: "202", type: "Executive King", pricePerNight: 3499, status: "MAINTENANCE", amenities: ["Balcony View", "Work Desk", "AC"] },
  { id: "r-301", roomNumber: "301", type: "Royal Suite", pricePerNight: 6999, status: "AVAILABLE", amenities: ["Panoramic View", "Private Lounge", "Personal Butler", "Jacuzzi"] },
];

// 4. Initial Banquet Enquiries
export const INITIAL_BANQUETS: ErpBanquet[] = [
  { id: "bnq-1", enquiryId: "BNQ-202607-01", customerName: "Sanjay Singhania", phone: "+91 98111 22334", email: "sanjay@singhaniagroup.com", eventType: "Wedding Reception", guests: 350, date: "15 Aug 2026", budget: 250000, specialRequirements: "Mandap decoration & Jain food section required", status: "CONFIRMED" },
  { id: "bnq-2", enquiryId: "BNQ-202607-02", customerName: "Anita Saxena", phone: "+91 97222 33445", email: "anita@gmail.com", eventType: "Birthday Gala", guests: 120, date: "02 Aug 2026", budget: 85000, specialRequirements: "DJ setup & mocktail bar", status: "NEW" },
  { id: "bnq-3", enquiryId: "BNQ-202607-03", customerName: "Varanasi Medical Assoc.", phone: "+91 94150 12345", email: "vma@vnsmed.org", eventType: "Corporate Conference", guests: 200, date: "10 Aug 2026", budget: 140000, specialRequirements: "Projector screen & high-speed Wi-Fi", status: "CONTACTED" },
];

// 5. Initial CRM Customers
export const INITIAL_CUSTOMERS: ErpCustomer[] = [
  { id: "c-1", name: "Aarav Sharma", phone: "+91 98765 43210", email: "aarav@gmail.com", totalSpent: 12450, visitCount: 6, lastVisit: "25 Jul 2026", favouriteDishes: ["Paneer Butter Masala", "Veg Fried Rice"], isReturning: true },
  { id: "c-2", name: "Dr. Ananya Roy", phone: "+91 99887 76655", email: "ananya.roy@aiims.edu", totalSpent: 28900, visitCount: 4, lastVisit: "25 Jul 2026", favouriteDishes: ["Chicken Tikka Masala", "Sweet Lassi"], isReturning: true },
  { id: "c-3", name: "Sanjay Singhania", phone: "+91 98111 22334", email: "sanjay@singhaniagroup.com", totalSpent: 250000, visitCount: 2, lastVisit: "20 Jul 2026", favouriteDishes: ["Dal Makhani", "Shahi Paneer"], isReturning: true },
];

// 6. Initial Raw Inventory
export const INITIAL_INVENTORY: ErpInventory[] = [
  { id: "inv-1", name: "Amul Paneer Fresh", category: "Dairy", quantity: 8.5, unit: "kg", minThreshold: 10, supplier: "Amul Dairy Varanasi", lastRestocked: "24 Jul 2026" },
  { id: "inv-2", name: "Basmati Rice Superfine", category: "Grains", quantity: 45, unit: "kg", minThreshold: 25, supplier: "Kashi Grain Merchants", lastRestocked: "22 Jul 2026" },
  { id: "inv-3", name: "Fortune Mustard Oil", category: "Oil", quantity: 18, unit: "L", minThreshold: 15, supplier: "Fortune India Ltd", lastRestocked: "20 Jul 2026" },
  { id: "inv-4", name: "Fresh Amul Milk Toned", category: "Dairy", quantity: 12, unit: "L", minThreshold: 20, supplier: "Amul Dairy Varanasi", lastRestocked: "25 Jul 2026" },
];

// 7. Initial Customer Reviews
export const INITIAL_REVIEWS: ErpReview[] = [
  { id: "rev-1", author: "Pankaj Tripathi", rating: 5, comment: "Exquisite food quality and exceptional hospitality! The Paneer Butter Masala was pure perfection.", reply: "Thank you Pankaj Ji! We are honoured to serve you.", isFeatured: true, date: "23 Jul 2026" },
  { id: "rev-2", author: "Meera Nair", rating: 5, comment: "Super clean rooms, fast room service, and adjacent to SMS College which was super convenient for my conference.", reply: "We appreciate your kind words, Meera!", isFeatured: true, date: "21 Jul 2026" },
];

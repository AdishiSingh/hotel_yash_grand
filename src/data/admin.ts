export interface BookingEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: "room" | "restaurant" | "banquet";
  date: string;
  details: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  guests: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minLimit: number;
  category: "ingredients" | "beverages" | "packaging";
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  visits: number;
  spend: number;
  preferredDish: string;
  bookingHistory: string[];
}

export interface POSOrder {
  id: string;
  table: string;
  type: "dine-in" | "takeaway" | "room-service";
  customerName: string;
  customerPhone: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
  payment: "cash" | "upi" | "card";
  time: string;
  status: "pending" | "completed";
}

export const ADMIN_STATS = {
  todayRevenue: 145890,
  ordersCount: 42,
  roomBookings: 8,
  banquetBookings: 2,
  pendingEnquiries: 5,
  occupancyRate: 85,
  popularDish: "Paneer Butter Masala",
  popularRoom: "Royal Suite",
  upcomingEvents: [
    { title: "Singhal Reception", time: "Today, 07:00 PM", guests: 350 },
    { title: "Mishra Wedding", time: "Tomorrow, 06:00 PM", guests: 500 }
  ]
};

export const INITIAL_ENQUIRIES: BookingEnquiry[] = [
  {
    id: "enq-101",
    name: "Rajesh Tripathi",
    phone: "+91 98765 43210",
    email: "rajesh@gmail.com",
    type: "room",
    date: "2026-07-20",
    details: "Royal Suite // 2 Guests // 2 nights",
    status: "pending",
    guests: 2
  },
  {
    id: "enq-102",
    name: "Alok Kapoor",
    phone: "+91 95123 45678",
    email: "alok@kapoor.com",
    type: "banquet",
    date: "2026-11-12",
    details: "Wedding Reception // 400 Guests // Premium Catering",
    status: "confirmed",
    guests: 400
  },
  {
    id: "enq-103",
    name: "Vikas Pathak",
    phone: "+91 94522 11333",
    email: "vikas@pathak.org",
    type: "restaurant",
    date: "2026-07-16",
    details: "Family Dining // 8 Guests // 08:30 PM",
    status: "confirmed",
    guests: 8
  },
  {
    id: "enq-104",
    name: "Priya Sen",
    phone: "+91 99988 77766",
    email: "priya@sen.co",
    type: "room",
    date: "2026-07-15",
    details: "Premium Deluxe Room // 1 Guest // 3 nights",
    status: "completed",
    guests: 1
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: "inv-01", name: "Premium Basmati Rice", quantity: 120, unit: "kg", minLimit: 50, category: "ingredients" },
  { id: "inv-02", name: "Amul Fresh Butter", quantity: 8, unit: "kg", minLimit: 15, category: "ingredients" }, // Low Stock!
  { id: "inv-03", name: "Paneer (Cottage Cheese)", quantity: 25, unit: "kg", minLimit: 10, category: "ingredients" },
  { id: "inv-04", name: "Coca Cola Cans", quantity: 150, unit: "pcs", minLimit: 100, category: "beverages" },
  { id: "inv-05", name: "Mineral Water Bottles", quantity: 45, unit: "pcs", minLimit: 200, category: "beverages" }, // Out of Stock alert!
  { id: "inv-06", name: "Thermal Paper Rolls", quantity: 30, unit: "pcs", minLimit: 10, category: "packaging" }
];

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: "cust-01",
    name: "Amit Sharma",
    phone: "+91 95191 11333",
    visits: 12,
    spend: 42500,
    preferredDish: "Paneer Tikka Masala",
    bookingHistory: ["enq-104", "enq-102"]
  },
  {
    id: "cust-02",
    name: "Shreya Verma",
    phone: "+91 94522 11444",
    visits: 8,
    spend: 21800,
    preferredDish: "Veg Pulao",
    bookingHistory: ["enq-103"]
  }
];

export const INITIAL_ORDERS: POSOrder[] = [
  {
    id: "ord-4001",
    table: "Table 12",
    type: "dine-in",
    customerName: "Sanjay Kumar",
    customerPhone: "+91 98888 77777",
    items: [
      { name: "Paneer Butter Masala", qty: 2, price: 280 },
      { name: "Dal Makhani", qty: 1, price: 210 },
      { name: "Butter Garlic Naan", qty: 4, price: 60 }
    ],
    subtotal: 1010,
    gst: 50.5,
    discount: 50,
    total: 1010.5,
    payment: "upi",
    time: "Today, 08:15 PM",
    status: "completed"
  }
];

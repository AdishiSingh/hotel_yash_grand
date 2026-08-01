// --- Room Booking Domain ---
export interface RoomReservation {
  id: string;
  guestId: string;
  roomCategoryId: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'partially_paid' | 'paid' | 'refunded';
  reservationStatus: 'booked' | 'checked_in' | 'checked_out' | 'cancelled';
}

// --- Restaurant POS Domain ---
export interface POSOrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface POSOrder {
  id: string;
  tableNumber: number;
  captainId: string;
  items: POSOrderItem[];
  status: 'pending' | 'in_kitchen' | 'served' | 'billed';
  timestamp: string;
}

// --- Billing & Invoicing Domain ---
export interface InvoiceLineItem {
  description: string;
  amount: number;
  taxRate: number; // CGST + SGST percentage calculation
}

export interface Invoice {
  id: string;
  reservationId?: string;
  posOrderId?: string;
  customerName: string;
  customerGSTIN?: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  issuedAt: string;
}

// --- Blog Domain ---
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  author: string;
  tags: string[];
}

// --- Gallery Domain ---
export interface GalleryItem {
  id: string;
  title: string;
  category: 'rooms' | 'restaurant' | 'banquet' | 'exterior' | 'events';
  imageUrl: string;
  width: number;
  height: number;
}

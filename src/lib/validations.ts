import { z } from "zod";

// ==========================================
// ORDER VALIDATION SCHEMAS
// ==========================================

export const createOrderItemSchema = z.object({
  menuItemId: z.string().optional().default("custom-menu-item"),
  itemName: z.string().min(1, "Item name is required"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  price: z.number().nonnegative("Price cannot be negative"),
  variantLabel: z.string().optional(),
  specialInstructions: z.string().optional(),
});

export const createOrderSchema = z.object({
  tableNumber: z.string().min(1, "Table number is required"),
  customerId: z.string().optional(),
  customerName: z.string().min(1, "Customer name is required").default("Guest"),
  customerPhone: z.string().optional(),
  items: z.array(createOrderItemSchema).min(1, "Order must contain at least one item"),
  discount: z.number().nonnegative().default(0),
  paymentMethod: z.enum(["CASH", "CARD", "UPI", "NETBANKING", "NET_BANKING", "RAZORPAY", "PAY_LATER", "ROOM_CHARGE"]).default("CASH"),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["NEW", "IN_KITCHEN", "READY", "SERVED", "COMPLETED", "CANCELLED"]),
  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).optional(),
  kotPrinted: z.boolean().optional(),
});

// ==========================================
// ROOM BOOKING VALIDATION SCHEMAS
// ==========================================

export const createRoomBookingSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(10, "Valid customer phone number is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  checkIn: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  checkOut: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  guests: z.number().int().positive().default(1),
  totalAmount: z.number().positive("Total amount must be positive"),
  advancePaid: z.number().nonnegative().default(0),
  specialRequests: z.string().optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"]),
});

// ==========================================
// MENU VALIDATION SCHEMAS
// ==========================================

export const createMenuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Category ID is required"),
  type: z.enum(["VEG", "NON_VEG", "EGG", "BEVERAGE"]).default("VEG"),
  isAvailable: z.boolean().default(true),
  isChefSpecial: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isRecommended: z.boolean().default(false),
  image: z.string().optional(),
  preparationTime: z.string().optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

// ==========================================
// CUSTOMER VALIDATION SCHEMAS
// ==========================================

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
});

// ==========================================
// PAYMENT VALIDATION SCHEMAS
// ==========================================

export const createPaymentSchema = z.object({
  orderId: z.string().optional(),
  bookingId: z.string().optional(),
  amount: z.number().positive("Payment amount must be positive"),
  paymentMethod: z.enum(["CASH", "CARD", "UPI", "NET_BANKING", "ROOM_CHARGE"]),
  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).default("COMPLETED"),
  gatewayRef: z.string().optional(),
});

// ==========================================
// INVENTORY VALIDATION SCHEMAS
// ==========================================

export const createInventorySchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.number().nonnegative(),
  unit: z.string().min(1, "Unit is required"),
  minThreshold: z.number().nonnegative(),
  supplier: z.string().optional(),
  costPerUnit: z.number().nonnegative().optional(),
});

export const updateInventorySchema = createInventorySchema.partial();

// ==========================================
// BANQUET VALIDATION SCHEMAS
// ==========================================

export const createBanquetBookingSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(10, "Phone number is required"),
  customerEmail: z.string().email().optional().or(z.literal("")),
  eventType: z.string().min(1, "Event type is required"),
  guestsCount: z.number().int().positive(),
  eventDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  budget: z.number().positive().optional(),
  specialRequirements: z.string().optional(),
});

// ==========================================
// CONTACT VALIDATION SCHEMAS
// ==========================================

export const createContactEnquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

// ==========================================
// REVIEW VALIDATION SCHEMAS
// ==========================================

export const createReviewSchema = z.object({
  author: z.string().min(1, "Author name is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, "Review comment is required"),
  source: z.string().optional().default("Google Reviews"),
});

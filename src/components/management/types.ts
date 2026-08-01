/**
 * HOTEL YASH GRAND — Management Dashboard TypeScript Schemas
 */

export interface Customer {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  visitCount?: number;
  totalSpent?: number;
  favouriteRoom?: string | null;
  specialRequests?: string | null;
  idProofNumber?: string | null;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  type: string;
  pricePerNight: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE" | "CLEANING" | "BLOCKED";
  isClean: boolean;
  amenities?: string[];
  bookings?: RoomBooking[];
}

export interface RoomBooking {
  id: string;
  bookingId: string;
  roomId: string;
  customerId: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalAmount: number;
  room?: Room;
  customer?: Customer;
}

export interface BookingRequest {
  id: string;
  guestName: string;
  mobile: string;
  email?: string | null;
  type: "ROOM" | "BANQUET" | "RESTAURANT" | string;
  roomType?: string | null;
  eventType?: string | null;
  eventDate?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  guestsCount?: number | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "CONTACTED" | "PAYMENT_PENDING";
  managerRemarks?: string | null;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message?: string | null;
  type?: string | null;
  category?: string | null;
  read?: boolean;
  createdAt: string;
}

export interface HourlyRevenueItem {
  hour: string;
  value: number;
}

export interface DashboardMetrics {
  todayRevenue: number;
  roomRevenue: number;
  restaurantRevenue: number;
  banquetRevenue: number;
  totalRoomsCount: number;
  occupiedRoomsCount: number;
  availableRoomsCount: number;
  maintenanceRoomsCount: number;
  occupancyRatePercent: number;
  todayCheckInsCount: number;
  todayCheckOutsCount: number;
  pendingRequestsCount: number;
  pendingBanquetRequestsCount: number;
  pendingRoomRequestsCount: number;
  restaurantOrdersCount: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  allRooms: Room[];
  todayCheckIns: RoomBooking[];
  todayCheckOuts: RoomBooking[];
  pendingBookingRequests: BookingRequest[];
  recentGuests: Customer[];
  recentNotifications: NotificationItem[];
  recentOrders: any[];
  hourlyRevenueData: HourlyRevenueItem[];
}

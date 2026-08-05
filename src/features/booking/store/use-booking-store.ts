import { create } from "zustand";

export type BookingType = "room" | "dining" | "banquet";
export type WorkflowStep = "form" | "summary" | "success" | "error";

export interface BookingState {
  // Config & Steps
  bookingType: BookingType;
  activeStep: WorkflowStep;
  isDrawerOpen: boolean;
  
  // Room booking parameters
  checkInDate: string;
  checkOutDate: string;
  roomCategoryId: string;
  adultsCount: number;
  childrenCount: number;

  // Restaurant booking parameters
  diningDate: string;
  diningSession: "lunch" | "dinner";
  diningGuests: number;

  // Banquet booking parameters
  banquetDate: string;
  banquetGuests: string;
  banquetType: string;

  // User details
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;

  // Interface triggers
  isSubmitting: boolean;
  validationError: string | null;

  // Actions
  setBookingType: (type: BookingType) => void;
  setActiveStep: (step: WorkflowStep) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  selectRoomCategory: (id: string) => void;
  updateFields: (fields: Partial<BookingState>) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookingType: "room",
  activeStep: "form",
  isDrawerOpen: false,
  
  checkInDate: "",
  checkOutDate: "",
  roomCategoryId: "single-deluxe",
  adultsCount: 1,
  childrenCount: 0,

  diningDate: "",
  diningSession: "dinner",
  diningGuests: 2,

  banquetDate: "",
  banquetGuests: "150-300",
  banquetType: "weddings",

  guestName: "",
  guestEmail: "",
  guestPhone: "",
  specialRequests: "",

  isSubmitting: false,
  validationError: null,

  setBookingType: (type) => set({ bookingType: type, activeStep: "form", validationError: null }),
  setActiveStep: (step) => set({ activeStep: step }),
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  selectRoomCategory: (id) => set({ roomCategoryId: id, bookingType: "room", activeStep: "form" }),
  updateFields: (fields) => set((state) => ({ ...state, ...fields, validationError: null })),
  
  resetBooking: () => set({
    bookingType: "room",
    activeStep: "form",
    checkInDate: "",
    checkOutDate: "",
    roomCategoryId: "single-deluxe",
    adultsCount: 1,
    childrenCount: 0,
    diningDate: "",
    diningSession: "dinner",
    diningGuests: 2,
    banquetDate: "",
    banquetGuests: "150-300",
    banquetType: "weddings",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
    isSubmitting: false,
    validationError: null,
  }),
}));

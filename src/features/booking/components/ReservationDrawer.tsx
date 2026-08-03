"use client";

import * as React from "react";
import { useBookingStore, BookingType } from "../store/use-booking-store";
import { Button } from "@/components/ui/button";
import { LuxuryInput } from "@/shared/components/atoms/LuxuryInput";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBookingGuard } from "@/context/BookingGuardContext";

// Zod Validation Schemas
const bookingSchema = z.object({
  guestName: z.string().min(2, "Name must be at least 2 characters."),
  guestEmail: z.string().email("Invalid email address."),
  guestPhone: z.string().min(10, "Phone number must be at least 10 digits."),
  specialRequests: z.string().optional(),
});

type FormInputType = z.infer<typeof bookingSchema>;

export function ReservationDrawer() {
  const { requireAuth, customer } = useBookingGuard();
  const [createdBookingId, setCreatedBookingId] = React.useState<string | null>(null);

  const {
    bookingType,
    activeStep,
    isDrawerOpen,
    checkInDate,
    checkOutDate,
    roomCategoryId,
    adultsCount,
    childrenCount,
    diningDate,
    diningSession,
    diningGuests,
    banquetDate,
    banquetGuests,
    banquetType,
    guestName,
    guestEmail,
    guestPhone,
    specialRequests,
    isSubmitting,
    validationError,
    setBookingType,
    setActiveStep,
    setDrawerOpen,
    updateFields,
    resetBooking,
  } = useBookingStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputType>({
    resolver: zodResolver(bookingSchema),
  });

  // Sync state values on drawer open & auto-fill ONLY from authenticated customer profile
  React.useEffect(() => {
    if (isDrawerOpen) {
      if (customer) {
        const name = customer.name || "";
        const email = customer.email || "";
        const phone = customer.phone || "";
        const requests = customer.specialRequests || "";

        setValue("guestName", name);
        setValue("guestEmail", email);
        setValue("guestPhone", phone);
        setValue("specialRequests", requests);

        updateFields({
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
          specialRequests: requests,
        });
      } else {
        // Unauthenticated user: Clear all guest information to prevent leaking previous user data
        setValue("guestName", "");
        setValue("guestEmail", "");
        setValue("guestPhone", "");
        setValue("specialRequests", "");

        updateFields({
          guestName: "",
          guestEmail: "",
          guestPhone: "",
          specialRequests: "",
        });
      }
    }
  }, [isDrawerOpen, customer, setValue, updateFields]);

  if (!isDrawerOpen) return null;

  const handleFormSubmit = (data: FormInputType) => {
    // Validate date intervals and max occupancy for room bookings prior to summary transition
    if (bookingType === "room") {
      if (!checkInDate || !checkOutDate) {
        updateFields({ validationError: "Please select both check-in and check-out dates." });
        return;
      }
      if (new Date(checkInDate) >= new Date(checkOutDate)) {
        updateFields({ validationError: "Check-out date must succeed check-in date." });
        return;
      }

      // Max Occupancy Validation
      const capacityMap: Record<string, { label: string; max: number }> = {
        "single-deluxe": { label: "Single Deluxe Room", max: 2 },
        "Single Deluxe Room": { label: "Single Deluxe Room", max: 2 },
        "family-room": { label: "Family Room", max: 4 },
        "Family Room": { label: "Family Room", max: 4 },
      };
      const totalGuests = (adultsCount || 1) + (childrenCount || 0);
      const roomCapInfo = capacityMap[roomCategoryId] || { label: roomCategoryId, max: 2 };
      if (totalGuests > roomCapInfo.max) {
        updateFields({ validationError: `Total guests (${totalGuests}) exceeds maximum capacity of ${roomCapInfo.max} for ${roomCapInfo.label}. Please select a larger room category or reduce guest count.` });
        return;
      }
    } else if (bookingType === "dining" && !diningDate) {
      updateFields({ validationError: "Please select a dining reservation date." });
      return;
    } else if (bookingType === "banquet" && !banquetDate) {
      updateFields({ validationError: "Please select an event date." });
      return;
    }

    updateFields({
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      specialRequests: data.specialRequests,
    });
    setActiveStep("summary");
  };

  const executeCheckout = async (channel: "whatsapp" | "email") => {
    // Intercept with Centralized Booking Guard
    requireAuth(async (authenticatedCustomer, formData) => {
      updateFields({ isSubmitting: true });

      try {
        const payload = {
          guestName: guestName || authenticatedCustomer.name,
          mobile: guestPhone || authenticatedCustomer.phone,
          email: guestEmail || authenticatedCustomer.email || undefined,
          type: bookingType === "banquet" ? "BANQUET" : "ROOM",
          roomType: roomCategoryId || "Deluxe Suite",
          checkIn: checkInDate || new Date().toISOString().split("T")[0],
          checkOut: checkOutDate || new Date(Date.now() + 86400000).toISOString().split("T")[0],
          adults: adultsCount || 1,
          children: childrenCount || 0,
          specialRequest: specialRequests || undefined,
        };

        const res = await fetch("/api/booking-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const json = await res.json();

        if (json.success && json.request) {
          const bookingId = json.request.requestId || `YG-REQ-${Date.now().toString().slice(-4)}`;
          setCreatedBookingId(bookingId);

          if (channel === "whatsapp") {
            const message = `Hello Hotel Yash Grand, I have created a booking request #${bookingId} for ${payload.roomType} (${payload.checkIn} to ${payload.checkOut}).`;
            const whatsappUrl = `https://wa.me/919151088115?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, "_blank");
          }
        }
      } catch (err) {
        console.error("Booking creation error:", err);
      } finally {
        updateFields({ isSubmitting: false });
        setActiveStep("success");
      }
    }, {
      guestName,
      guestPhone,
      guestEmail,
      specialRequests,
    });
  };

  return (
    <>
      {/* Background overlay backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-500"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Right sliding side-panel */}
      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[500px] bg-background border-l border-gold/15 shadow-lux flex flex-col justify-between overflow-y-auto animate-fade-in">
        
        {/* Drawer Header */}
        <header className="p-6 border-b border-gold/10 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-wide">Inquiry Desk</span>
            <span className="text-[8px] uppercase tracking-widest text-gold mt-0.5">Hotel Yash Grand</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white cursor-pointer"
          >
            Close [Esc]
          </button>
        </header>

        {/* Dynamic Step View Rendering */}
        <div className="flex-1 p-8">
          
          {/* STEP 1: Core details form inputs */}
          {activeStep === "form" && (
            <div className="space-y-8">
              
              {/* Category tabs */}
              <div className="flex border-b border-gold/10 pb-2 gap-4">
                {(["room", "dining", "banquet"] as BookingType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBookingType(type)}
                    className={cn(
                      "text-[10px] uppercase tracking-widest font-semibold pb-2 relative transition-colors duration-300",
                      bookingType === type ? "text-gold" : "text-neutral-400 hover:text-foreground"
                    )}
                  >
                    {type === "room" ? "Suites" : type === "dining" ? "Dining" : "Ballroom"}
                    {bookingType === type && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold" />
                    )}
                  </button>
                ))}
              </div>

              {/* Validation errors alerts */}
              {validationError && (
                <div className="p-3 border border-red-500/20 bg-red-500/5 text-red-500 text-xs font-sans tracking-wide">
                  {validationError}
                </div>
              )}

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                
                {/* DOMAIN SPECIFIC FIELDS */}
                
                {/* A. Room booking inputs */}
                {bookingType === "room" && (
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div className="flex flex-col">
                      <span className="text-neutral-400 font-medium">Check-In</span>
                      <input
                        type="date"
                        className="bg-transparent border-b border-gold/20 py-2 focus:outline-none focus:border-gold text-foreground mt-1 cursor-pointer"
                        value={checkInDate}
                        onChange={(e) => updateFields({ checkInDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-neutral-400 font-medium">Check-Out</span>
                      <input
                        type="date"
                        className="bg-transparent border-b border-gold/20 py-2 focus:outline-none focus:border-gold text-foreground mt-1 cursor-pointer"
                        value={checkOutDate}
                        min={checkInDate}
                        onChange={(e) => updateFields({ checkOutDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <span className="text-neutral-400 font-medium">Room Type</span>
                      <select
                        className="w-full bg-transparent border-b border-gold/20 py-2.5 focus:outline-none focus:border-gold text-foreground mt-1 cursor-pointer"
                        value={roomCategoryId}
                        onChange={(e) => updateFields({ roomCategoryId: e.target.value })}
                      >
                        <option value="single-deluxe" className="bg-background text-foreground">Single Deluxe Room (Max 2 Guests • INR 2,500/night)</option>
                        <option value="family-room" className="bg-background text-foreground">Family Room (Max 4 Guests • INR 4,000/night)</option>
                      </select>
                    </div>

                    {/* REQUIRED INCREMENT/DECREMENT GUEST SELECTOR */}
                    <div className="col-span-2 p-3.5 bg-neutral-900/90 border border-gold/15 rounded-xl space-y-3 mt-2">
                      <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                        <span className="text-[11px] uppercase tracking-wider text-gold font-bold">Guests Selection</span>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Total Guests: {(adultsCount || 1) + (childrenCount || 0)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-2.5 bg-background/50 rounded-lg border border-gold/10">
                          <div>
                            <span className="text-xs text-foreground font-semibold block">Adults <span className="text-red-400">*</span></span>
                            <span className="text-[9px] text-neutral-400">Ages 12+</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <button
                              type="button"
                              disabled={(adultsCount || 1) <= 1}
                              onClick={() => updateFields({ adultsCount: Math.max(1, (adultsCount || 1) - 1) })}
                              className="w-7 h-7 rounded bg-neutral-800 border border-gold/20 hover:border-gold text-foreground flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-4 text-center font-bold text-xs">{adultsCount || 1}</span>
                            <button
                              type="button"
                              onClick={() => updateFields({ adultsCount: (adultsCount || 1) + 1 })}
                              className="w-7 h-7 rounded bg-neutral-800 border border-gold/20 hover:border-gold text-foreground flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-background/50 rounded-lg border border-gold/10">
                          <div>
                            <span className="text-xs text-foreground font-semibold block">Children</span>
                            <span className="text-[9px] text-neutral-400">Ages 0-11</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <button
                              type="button"
                              disabled={(childrenCount || 0) <= 0}
                              onClick={() => updateFields({ childrenCount: Math.max(0, (childrenCount || 0) - 1) })}
                              className="w-7 h-7 rounded bg-neutral-800 border border-gold/20 hover:border-gold text-foreground flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-4 text-center font-bold text-xs">{childrenCount || 0}</span>
                            <button
                              type="button"
                              onClick={() => updateFields({ childrenCount: (childrenCount || 0) + 1 })}
                              className="w-7 h-7 rounded bg-neutral-800 border border-gold/20 hover:border-gold text-foreground flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* B. Restaurant booking inputs */}
                {bookingType === "dining" && (
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div className="flex flex-col">
                      <span className="text-neutral-400 font-medium">Dining Date</span>
                      <input
                        type="date"
                        className="bg-transparent border-b border-gold/20 py-2 focus:outline-none focus:border-gold text-foreground mt-1 cursor-pointer"
                        value={diningDate}
                        onChange={(e) => updateFields({ diningDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-neutral-400 font-medium">Seating Session</span>
                      <select
                        className="bg-transparent border-b border-gold/20 py-2.5 focus:outline-none focus:border-gold text-foreground mt-1 cursor-pointer"
                        value={diningSession}
                        onChange={(e) => updateFields({ diningSession: e.target.value as "lunch" | "dinner" })}
                      >
                        <option value="lunch" className="bg-background text-foreground">Lunch (12:00 PM - 3:30 PM)</option>
                        <option value="dinner" className="bg-background text-foreground">Dinner (7:00 PM - 11:30 PM)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* C. Banquet booking inputs */}
                {bookingType === "banquet" && (
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div className="flex flex-col">
                      <span className="text-neutral-400 font-medium">Event Date</span>
                      <input
                        type="date"
                        className="bg-transparent border-b border-gold/20 py-2 focus:outline-none focus:border-gold text-foreground mt-1 cursor-pointer"
                        value={banquetDate}
                        onChange={(e) => updateFields({ banquetDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-neutral-400 font-medium">Event Category</span>
                      <select
                        className="bg-transparent border-b border-gold/20 py-2.5 focus:outline-none focus:border-gold text-foreground mt-1 cursor-pointer"
                        value={banquetType}
                        onChange={(e) => updateFields({ banquetType: e.target.value })}
                      >
                        <option value="weddings" className="bg-background text-foreground">Weddings & Receptions</option>
                        <option value="birthdays" className="bg-background text-foreground">Milestone Birthdays</option>
                        <option value="corporate" className="bg-background text-foreground">Corporate Seminars</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* CORE GUEST FIELDS (Shared across all domains) */}
                <div className="border-t border-gold/10 pt-6 space-y-4">
                  <LuxuryInput
                    label="Full Name"
                    error={errors.guestName?.message}
                    {...register("guestName")}
                  />
                  <LuxuryInput
                    label="Email Address"
                    type="email"
                    error={errors.guestEmail?.message}
                    {...register("guestEmail")}
                  />
                  <LuxuryInput
                    label="Phone Number"
                    type="tel"
                    error={errors.guestPhone?.message}
                    {...register("guestPhone")}
                  />
                  <LuxuryInput
                    label="Special Requests (e.g. bed type, food allergies)"
                    error={errors.specialRequests?.message}
                    {...register("specialRequests")}
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="primary" size="lg" className="w-full text-xs font-semibold py-4">
                    Continue to Summary
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Inquiry confirmation details summary */}
          {activeStep === "summary" && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-gold font-bold">Verification</span>
                <h3 className="font-serif text-2xl font-light">Inquiry Summary</h3>
              </div>

              {/* Parameter parameters display list */}
              <div className="border-y border-gold/10 py-6 space-y-4 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Category Domain</span>
                  <span className="font-medium uppercase tracking-wider text-foreground">{bookingType}</span>
                </div>
                
                {bookingType === "room" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Selected Suite</span>
                      <span className="font-medium text-foreground">{roomCategoryId.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Arrival - Departure</span>
                      <span className="font-medium text-foreground">{checkInDate} {"//"} {checkOutDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total Guests</span>
                      <span className="font-medium text-emerald-400 font-mono">
                        {(adultsCount || 1) + (childrenCount || 0)} ({adultsCount || 1} Adults, {childrenCount || 0} Children)
                      </span>
                    </div>
                  </>
                )}

                {bookingType === "dining" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Seating Date</span>
                      <span className="font-medium text-foreground">{diningDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Session Hours</span>
                      <span className="font-medium text-foreground capitalize">{diningSession}</span>
                    </div>
                  </>
                )}

                {bookingType === "banquet" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Ballroom Date</span>
                      <span className="font-medium text-foreground">{banquetDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Ceremony Theme</span>
                      <span className="font-medium text-foreground capitalize">{banquetType}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between">
                  <span className="text-neutral-400">Guest Name</span>
                  <span className="font-medium text-foreground">{guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Guest Phone</span>
                  <span className="font-medium text-foreground">{guestPhone}</span>
                </div>
              </div>

              {/* MANDATORY CHECK-IN ID NOTICE */}
              <div className="p-3.5 bg-amber-950/40 border border-amber-500/25 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
                <span className="text-amber-400 font-bold mt-0.5">🛡️</span>
                <p className="leading-relaxed font-sans text-[11.5px]">
                  Identity verification will be completed during hotel check-in. Please carry a valid government-issued photo ID for all adult guests.
                </p>
              </div>

              {/* Action trigger channels */}
              <div className="space-y-4 pt-2">
                <Button
                  onClick={() => executeCheckout("whatsapp")}
                  disabled={isSubmitting}
                  variant="accent"
                  className="w-full text-xs font-semibold py-4"
                >
                  {isSubmitting ? "Confirming..." : "Confirm via WhatsApp"}
                </Button>
                
                <Button
                  onClick={() => executeCheckout("email")}
                  disabled={isSubmitting}
                  variant="secondary"
                  className="w-full text-xs font-semibold py-4"
                >
                  Inquire via Email
                </Button>

                <button
                  onClick={() => setActiveStep("form")}
                  className="w-full text-center text-[10px] uppercase tracking-widest text-neutral-400 hover:text-foreground mt-4 cursor-pointer"
                >
                  ← Modify Parameters
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Verified Success Screen */}
          {activeStep === "success" && (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-6 pt-12 animate-fade-in">
              <div className="h-16 w-16 border border-[#C5A880] rounded-full flex items-center justify-center text-[#C5A880] text-2xl animate-pulse bg-[#C5A880]/10">
                ✓
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold">
                  Saved in PostgreSQL Account
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">Reservation Request Created</h3>
                {createdBookingId && (
                  <div className="pt-2">
                    <span className="text-xs text-neutral-400 font-mono">Reference ID: </span>
                    <strong className="text-[#C5A880] font-mono text-sm tracking-wider">#{createdBookingId}</strong>
                  </div>
                )}
              </div>

              <p className="text-xs text-neutral-300 font-sans leading-relaxed max-w-sm">
                Your reservation request is permanently linked to your account. Our desk manager is reviewing room allocations and tariff details.
              </p>

              <div className="pt-4 space-y-3 w-full">
                {createdBookingId && (
                  <a
                    href={`https://wa.me/919151088115?text=${encodeURIComponent(`Hello Hotel Yash Grand Desk, I have submitted booking #${createdBookingId}. Please assist with confirmation.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-xs uppercase tracking-wider font-bold py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Contact Desk on WhatsApp</span>
                  </a>
                )}

                <a
                  href="/customer/bookings"
                  onClick={() => {
                    setDrawerOpen(false);
                    resetBooking();
                  }}
                  className="w-full text-xs uppercase tracking-wider font-bold py-3.5 px-4 bg-[#C5A880] text-black hover:bg-[#8C6D3F] hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all block"
                >
                  <span>Track Booking in Dashboard</span>
                </a>

                <Button
                  onClick={() => {
                    setDrawerOpen(false);
                    resetBooking();
                  }}
                  variant="secondary"
                  className="w-full text-xs font-semibold py-3"
                >
                  Close & Explore Sanctuary
                </Button>
              </div>
            </div>
          )}

        </div>

      </aside>
    </>
  );
}

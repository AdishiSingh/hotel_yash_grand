"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Send, 
  UserCheck, 
  History, 
  ExternalLink,
  ArrowRight,
  Sparkles,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { ProfileSyncModal } from "@/components/booking/ProfileSyncModal";

const roomRequestSchema = z.object({
  name: z.string().min(2, "Full Name is required (minimum 2 characters)"),
  phone: z.string().regex(/^\+?[0-9\s\-]{10,15}$/, "Please enter a valid mobile number (10+ digits)"),
  checkIn: z.string().min(1, "Check-in Date is mandatory"),
  checkOut: z.string().min(1, "Check-out Date is mandatory"),
  adults: z.coerce.number().min(1, "At least 1 Adult is required"),
  email: z.string().email("Please enter a valid email address").or(z.literal("")).optional(),
  children: z.coerce.number().min(0).default(0),
  roomType: z.string().default("single-deluxe"),
  preferredFloor: z.string().optional(),
  arrivalTime: z.string().optional(),
  celebrationType: z.string().optional(),
  specialRequests: z.string().optional(),
}).refine((data) => {
  if (data.checkIn && data.checkOut) {
    return new Date(data.checkOut) > new Date(data.checkIn);
  }
  return true;
}, {
  message: "Check-out date must be strictly after Check-in date",
  path: ["checkOut"],
});

type RoomRequestValues = z.infer<typeof roomRequestSchema>;

export function RoomBookingForm() {
  const { requireAuth, customer: currentCustomer, refreshSession } = useBookingGuard();

  const [successData, setSuccessData] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Profile Sync State
  const [profileAutoFilled, setProfileAutoFilled] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    roomType?: boolean;
    specialRequests?: boolean;
  }>({});
  const [pendingSubmitData, setPendingSubmitData] = useState<RoomRequestValues | null>(null);
  const [isProfileSyncOpen, setIsProfileSyncOpen] = useState(false);
  const [changedFieldsList, setChangedFieldsList] = useState<Array<{ label: string; oldValue: string; newValue: string }>>([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<RoomRequestValues>({
    resolver: zodResolver(roomRequestSchema) as any,
    mode: "onChange",
    defaultValues: {
      adults: 2,
      children: 0,
      roomType: "single-deluxe",
      preferredFloor: "any",
      arrivalTime: "12:00 PM",
    },
  });

  // Pre-fill user data if customer is logged in
  useEffect(() => {
    if (currentCustomer) {
      const filled: typeof profileAutoFilled = {};
      if (currentCustomer.name) {
        setValue("name", currentCustomer.name);
        filled.name = true;
      }
      if (currentCustomer.phone) {
        setValue("phone", currentCustomer.phone);
        filled.phone = true;
      }
      if (currentCustomer.email) {
        setValue("email", currentCustomer.email);
        filled.email = true;
      }
      if (currentCustomer.favouriteRoom) {
        setValue("roomType", currentCustomer.favouriteRoom);
        filled.roomType = true;
      }
      if (currentCustomer.specialRequests) {
        setValue("specialRequests", currentCustomer.specialRequests);
        filled.specialRequests = true;
      }
      setProfileAutoFilled(filled);
    }
  }, [currentCustomer, setValue]);

  // Execute actual submission to backend
  const executeBookingSubmission = async (data: RoomRequestValues, customerObj?: any) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/booking-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ROOM",
          guestName: data.name || customerObj?.name,
          mobile: data.phone || customerObj?.phone,
          email: data.email || customerObj?.email || undefined,
          roomType: data.roomType,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          adults: data.adults,
          children: data.children,
          preferredFloor: data.preferredFloor,
          arrivalTime: data.arrivalTime,
          celebrationType: data.celebrationType,
          specialRequest: data.specialRequests,
        }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setSuccessData(json);
        reset();
      } else {
        setServerError(json.error || "Failed to submit booking request.");
      }
    } catch (err: any) {
      console.error("Room request submission error:", err);
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form submit button click
  const onSubmit = async (data: RoomRequestValues) => {
    // Room Capacity Validation
    const ROOM_CAPACITIES: Record<string, { label: string; max: number }> = {
      "single-deluxe": { label: "Single Deluxe Room", max: 2 },
      "Single Deluxe Room": { label: "Single Deluxe Room", max: 2 },
      "family-room": { label: "Family Room", max: 4 },
      "Family Room": { label: "Family Room", max: 4 },
      "executive-suite": { label: "Executive Suite", max: 3 },
      "Executive Suite": { label: "Executive Suite", max: 3 },
      "presidential-suite": { label: "Presidential Suite", max: 6 },
      "Presidential Suite": { label: "Presidential Suite", max: 6 },
    };

    const selectedRoom = ROOM_CAPACITIES[data.roomType] || { label: data.roomType, max: 2 };
    const totalGuests = Number(data.adults || 1) + Number(data.children || 0);

    if (totalGuests > selectedRoom.max) {
      setServerError(`Total guests (${totalGuests}) exceeds maximum capacity of ${selectedRoom.max} for ${selectedRoom.label}. Please select a larger room category or reduce guest count.`);
      return;
    }

    requireAuth(async (authenticatedCustomer) => {
      // Profile Change Detection
      const changes: Array<{ label: string; oldValue: string; newValue: string }> = [];

      if (authenticatedCustomer.name && data.name && data.name.trim() !== authenticatedCustomer.name) {
        changes.push({ label: "Full Name", oldValue: authenticatedCustomer.name, newValue: data.name.trim() });
      }
      if (authenticatedCustomer.email && data.email && data.email.trim() !== authenticatedCustomer.email) {
        changes.push({ label: "Email Address", oldValue: authenticatedCustomer.email, newValue: data.email.trim() });
      }
      if (authenticatedCustomer.phone && data.phone && data.phone.trim() !== authenticatedCustomer.phone) {
        changes.push({ label: "Phone Number", oldValue: authenticatedCustomer.phone, newValue: data.phone.trim() });
      }
      if (data.roomType && authenticatedCustomer.favouriteRoom && data.roomType !== authenticatedCustomer.favouriteRoom) {
        changes.push({ label: "Preferred Room", oldValue: authenticatedCustomer.favouriteRoom, newValue: data.roomType });
      }
      if (data.specialRequests && data.specialRequests !== authenticatedCustomer.specialRequests) {
        changes.push({ label: "Saved Preferences", oldValue: authenticatedCustomer.specialRequests || "None", newValue: data.specialRequests });
      }

      if (changes.length > 0) {
        setPendingSubmitData(data);
        setChangedFieldsList(changes);
        setIsProfileSyncOpen(true);
        return;
      }

      await executeBookingSubmission(data, authenticatedCustomer);
    }, data);
  };

  const handleSaveToProfile = async () => {
    if (!pendingSubmitData || !currentCustomer) return;
    setIsProfileSyncOpen(false);

    try {
      await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pendingSubmitData.name,
          phone: pendingSubmitData.phone,
          email: pendingSubmitData.email,
          favouriteRoom: pendingSubmitData.roomType,
          specialRequests: pendingSubmitData.specialRequests,
        }),
      });
      await refreshSession();
    } catch (e) {
      console.warn("Profile sync update notice:", e);
    }

    await executeBookingSubmission(pendingSubmitData, currentCustomer);
    setPendingSubmitData(null);
  };

  const handleOnlyForBooking = async () => {
    if (!pendingSubmitData || !currentCustomer) return;
    setIsProfileSyncOpen(false);
    await executeBookingSubmission(pendingSubmitData, currentCustomer);
    setPendingSubmitData(null);
  };

  const adultsVal = watch("adults") || 2;
  const childrenVal = watch("children") || 0;
  const totalGuestsVal = Number(adultsVal) + Number(childrenVal);

  return (
    <div className="space-y-6 w-full text-left select-none">
      {successData ? (
        /* BOOKING TIMELINE & CONFIRMATION SCREEN */
        <div className="p-8 border border-emerald-500/30 bg-[#0F1115] rounded-3xl space-y-6 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="h-16 w-16 bg-gradient-to-br from-emerald-400 to-emerald-600 p-0.5 rounded-2xl flex items-center justify-center mx-auto text-black shadow-xl">
            <div className="w-full h-full bg-[#0F1115] rounded-2xl flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-bold block">
              SAVED UNDER CUSTOMER ACCOUNT & TIMELINE CREATED
            </span>
            <h4 className="font-serif text-3xl text-white font-bold">Booking Request Submitted</h4>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed max-w-md mx-auto">
              Your room reservation request (ID: <strong className="text-[#C5A880] font-mono">{successData.data?.requestId}</strong>) has been stored under your guest account.
            </p>
          </div>

          {/* CONFIRMATION GUEST COUNT SUMMARY */}
          <div className="p-4 bg-neutral-950/90 border border-white/10 rounded-xl max-w-md mx-auto text-left text-xs font-mono space-y-1">
            <div className="text-neutral-400 text-[10px] uppercase tracking-wider font-bold">Guest Count & Room Category</div>
            <div className="text-white font-bold">
              Total Guests: <span className="text-[#C5A880]">{successData.data?.guestsCount || (successData.data?.adults || 1) + (successData.data?.children || 0)}</span> ({successData.data?.adults || 1} Adults, {successData.data?.children || 0} Children)
            </div>
            <div className="text-neutral-300 text-[11px]">Room Type: {successData.data?.roomType || "Single Deluxe"}</div>
          </div>

          {/* CHECK-IN IDENTITY NOTICE */}
          <div className="p-3.5 bg-amber-950/40 border border-amber-500/25 rounded-xl max-w-md mx-auto text-left text-[11.5px] text-amber-200 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">
              Identity verification will be completed during hotel check-in. Please carry a valid government-issued photo ID for all adult guests.
            </p>
          </div>

          {/* TIMELINE DISPLAY */}
          <div className="p-5 bg-neutral-950/80 border border-white/10 rounded-2xl text-left space-y-4 max-w-md mx-auto">
            <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2 flex items-center justify-between">
              <span>Booking Status & Timeline</span>
              <span className="text-amber-400 font-mono text-[10px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                PENDING APPROVAL
              </span>
            </div>

            <div className="space-y-3 relative pl-4 border-l border-white/10">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <div className="text-xs font-semibold text-white">Request Created & Saved to Account</div>
                <div className="text-[10px] text-neutral-400">Persisted in PostgreSQL database under your profile</div>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-neutral-600" />
                <div className="text-xs font-semibold text-neutral-400">Manager Tariff & Availability Review</div>
                <div className="text-[10px] text-neutral-500">Front Desk Duty Manager will process within 15 minutes</div>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-neutral-600" />
                <div className="text-xs font-semibold text-neutral-400">Room Assignment & Confirmation Token</div>
                <div className="text-[10px] text-neutral-500">Digital invoice & WhatsApp notification dispatch</div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/customer/bookings"
              className="px-6 py-3.5 bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <History className="h-4 w-4" />
              <span>Track in Customer Portal</span>
            </Link>
            {successData.managerWhatsappUrl && (
              <a
                href={successData.managerWhatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 bg-[#25D366] hover:bg-[#1DA851] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Notify Desk via WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Authentication Status Banner */}
          {currentCustomer ? (
            <div className="bg-[#C5A880]/15 border border-[#C5A880]/30 p-3.5 rounded-xl flex items-center justify-between text-xs text-[#C5A880]">
              <div className="flex items-center gap-2.5">
                <UserCheck className="h-4 w-4 text-[#C5A880]" />
                <span>
                  Signed in as <strong className="text-white">{currentCustomer.name}</strong> ({currentCustomer.phone})
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-black/40 px-2.5 py-1 rounded text-emerald-400">
                Verified Customer
              </span>
            </div>
          ) : (
            <div className="bg-amber-950/40 border border-amber-500/25 p-3.5 rounded-xl flex items-center gap-3 text-xs text-amber-200">
              <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0" />
              <p className="leading-relaxed font-sans">
                Fill details below. Clicking <strong>Book Room</strong> will prompt quick customer sign-in without losing your form inputs.
              </p>
            </div>
          )}

          {serverError && (
            <div className="p-3.5 bg-red-950/80 border border-red-500/30 text-red-200 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* SECTION 1: MANDATORY GUEST DETAILS */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-bold border-b border-white/10 pb-1.5 flex items-center gap-1.5">
              <span>1. Mandatory Details</span>
              <span className="text-red-400 text-sm">*</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="Enter your full name"
                  className="w-full bg-[#0F1115] border border-white/15 focus:border-[#C5A880] px-4 py-3 rounded-xl text-sm text-white placeholder-neutral-600 outline-none transition-all"
                />
                {profileAutoFilled.name && (
                  <span className="text-[10px] text-[#C5A880]/80 italic flex items-center gap-1 mt-1 font-sans">
                    <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" /> From your profile
                  </span>
                )}
                {errors.name && (
                  <span className="text-[10px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.name.message}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("phone")}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#0F1115] border border-white/15 focus:border-[#C5A880] px-4 py-3 rounded-xl text-sm text-white placeholder-neutral-600 outline-none transition-all font-mono"
                />
                {profileAutoFilled.phone && (
                  <span className="text-[10px] text-[#C5A880]/80 italic flex items-center gap-1 mt-1 font-sans">
                    <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" /> From your profile
                  </span>
                )}
                {errors.phone && (
                  <span className="text-[10px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.phone.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Check-in */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                  Check-in Date <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("checkIn")}
                  type="date"
                  className="w-full bg-[#0F1115] border border-white/15 focus:border-[#C5A880] px-3.5 py-3 rounded-xl text-sm text-white outline-none transition-all font-mono"
                />
                {errors.checkIn && (
                  <span className="text-[10px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.checkIn.message}
                  </span>
                )}
              </div>

              {/* Check-out */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                  Check-out Date <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("checkOut")}
                  type="date"
                  className="w-full bg-[#0F1115] border border-white/15 focus:border-[#C5A880] px-3.5 py-3 rounded-xl text-sm text-white outline-none transition-all font-mono"
                />
                {errors.checkOut && (
                  <span className="text-[10px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.checkOut.message}
                  </span>
                )}
              </div>
            </div>

            {/* REQUIRED GUESTS INCREMENT/DECREMENT SELECTOR SECTION */}
            <div className="p-4 bg-[#0F1115] border border-white/15 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs uppercase tracking-wider text-[#C5A880] font-bold">
                  Guests Count <span className="text-red-400">*</span>
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Total Guests: {totalGuestsVal}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Adults Selector */}
                <div className="flex items-center justify-between p-3 bg-neutral-900/90 rounded-xl border border-white/10">
                  <div>
                    <span className="text-xs text-white font-semibold block">Adults <span className="text-red-400">*</span></span>
                    <span className="text-[10px] text-neutral-400">Ages 12+</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <button
                      type="button"
                      disabled={adultsVal <= 1}
                      onClick={() => setValue("adults", Math.max(1, adultsVal - 1), { shouldValidate: true })}
                      className="w-8 h-8 rounded-lg bg-neutral-800 border border-white/20 hover:border-[#C5A880] text-white flex items-center justify-center font-bold text-sm disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-sm text-white">{adultsVal}</span>
                    <button
                      type="button"
                      onClick={() => setValue("adults", adultsVal + 1, { shouldValidate: true })}
                      className="w-8 h-8 rounded-lg bg-neutral-800 border border-white/20 hover:border-[#C5A880] text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children Selector */}
                <div className="flex items-center justify-between p-3 bg-neutral-900/90 rounded-xl border border-white/10">
                  <div>
                    <span className="text-xs text-white font-semibold block">Children</span>
                    <span className="text-[10px] text-neutral-400">Ages 0 - 11</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <button
                      type="button"
                      disabled={childrenVal <= 0}
                      onClick={() => setValue("children", Math.max(0, childrenVal - 1), { shouldValidate: true })}
                      className="w-8 h-8 rounded-lg bg-neutral-800 border border-white/20 hover:border-[#C5A880] text-white flex items-center justify-center font-bold text-sm disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-sm text-white">{childrenVal}</span>
                    <button
                      type="button"
                      onClick={() => setValue("children", childrenVal + 1, { shouldValidate: true })}
                      className="w-8 h-8 rounded-lg bg-neutral-800 border border-white/20 hover:border-[#C5A880] text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 2: OPTIONAL PREFERENCES */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-bold border-b border-white/10 pb-1.5">
              2. Optional Preferences
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="guest@email.com"
                  className="w-full bg-[#0F1115] border border-white/10 focus:border-[#C5A880] px-4 py-2.5 rounded-xl text-xs text-white placeholder-neutral-600 outline-none"
                />
                {profileAutoFilled.email && (
                  <span className="text-[10px] text-[#C5A880]/80 italic flex items-center gap-1 mt-1 font-sans">
                    <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" /> From your profile
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                  Preferred Room Type
                </label>
                <select
                  {...register("roomType")}
                  className="w-full bg-[#0F1115] border border-white/10 focus:border-[#C5A880] px-3 py-2.5 rounded-xl text-xs text-white outline-none cursor-pointer"
                >
                  <option value="single-deluxe">Single Deluxe Room (Max 2 Guests • ₹2,500/night)</option>
                  <option value="family-room">Family Room (Max 4 Guests • ₹4,000/night)</option>
                  <option value="executive-suite">Executive Suite (Max 3 Guests • ₹5,500/night)</option>
                  <option value="presidential-suite">Presidential Suite (Max 6 Guests • ₹8,500/night)</option>
                </select>
                {profileAutoFilled.roomType && (
                  <span className="text-[10px] text-[#C5A880]/80 italic flex items-center gap-1 mt-1 font-sans">
                    <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" /> From your profile
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                  Preferred Floor
                </label>
                <select
                  {...register("preferredFloor")}
                  className="w-full bg-[#0F1115] border border-white/10 focus:border-[#C5A880] px-3 py-2.5 rounded-xl text-xs text-white outline-none cursor-pointer"
                >
                  <option value="any">Any Available Floor</option>
                  <option value="ground">Ground Floor</option>
                  <option value="1st">1st Floor</option>
                  <option value="2nd">2nd Floor (High View)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                  Expected Arrival Time
                </label>
                <select
                  {...register("arrivalTime")}
                  className="w-full bg-[#0F1115] border border-white/10 focus:border-[#C5A880] px-3 py-2.5 rounded-xl text-xs text-white outline-none cursor-pointer"
                >
                  <option value="12:00 PM">12:00 PM (Standard Check-in)</option>
                  <option value="10:00 AM">10:00 AM (Early Request)</option>
                  <option value="04:00 PM">04:00 PM (Afternoon)</option>
                  <option value="08:00 PM">08:00 PM (Night Arrival)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                  Any Celebration
                </label>
                <input
                  {...register("celebrationType")}
                  placeholder="e.g. Birthday, Anniversary"
                  className="w-full bg-[#0F1115] border border-white/10 focus:border-[#C5A880] px-4 py-2.5 rounded-xl text-xs text-white placeholder-neutral-600 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                Special Requests & Saved Preferences
              </label>
              <textarea
                {...register("specialRequests")}
                rows={2}
                placeholder="e.g., Extra bed, quiet room away from elevator, airport pickup"
                className="w-full bg-[#0F1115] border border-white/10 focus:border-[#C5A880] px-4 py-3 rounded-xl text-xs text-white placeholder-neutral-600 outline-none resize-none"
              />
              {profileAutoFilled.specialRequests && (
                <span className="text-[10px] text-[#C5A880]/80 italic flex items-center gap-1 mt-1 font-sans">
                  <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" /> From your profile
                </span>
              )}
            </div>
          </div>

          {/* MANDATORY CHECK-IN ID NOTICE (REQUIREMENT 1) */}
          <div className="p-3.5 bg-amber-950/30 border border-amber-500/20 rounded-xl text-xs text-amber-200/90 flex items-start gap-2.5">
            <ShieldCheck className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans text-[11.5px]">
              Identity verification will be completed during hotel check-in. Please carry a valid government-issued photo ID for all adult guests.
            </p>
          </div>

          {/* BOOKING SUMMARY BOX */}
          <div className="p-4 bg-neutral-950 border border-white/10 rounded-xl text-xs font-mono space-y-1 text-neutral-300">
            <div className="text-white font-bold text-xs uppercase tracking-wider font-sans border-b border-white/10 pb-1">
              Booking Summary
            </div>
            <div>Selected Room: <strong className="text-white">{watch("roomType") || "single-deluxe"}</strong></div>
            <div>Total Guests: <strong className="text-emerald-400">{totalGuestsVal}</strong> ({adultsVal} Adults, {childrenVal} Children)</div>
            {watch("checkIn") && watch("checkOut") && (
              <div>Stay Dates: <span className="text-[#C5A880]">{watch("checkIn")} → {watch("checkOut")}</span></div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#8C6D3F] hover:opacity-95 text-black font-bold text-xs uppercase tracking-widest transition-all rounded-xl shadow-lg shadow-[#C5A880]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? "Saving Booking under Customer Profile..." : "Book Room & Reserve Stay"}</span>
            </button>
            <p className="text-[10px] text-neutral-400 text-center font-sans mt-2">
              Every booking is saved under your verified customer profile with instant status tracking.
            </p>
          </div>
        </form>
      )}

      {/* PROFILE SYNCHRONIZATION MODAL */}
      <ProfileSyncModal
        isOpen={isProfileSyncOpen}
        onSaveToProfile={handleSaveToProfile}
        onOnlyForBooking={handleOnlyForBooking}
        changedFields={changedFieldsList}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Send, 
  UserCheck, 
  History, 
  PartyPopper,
  Clock,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { ProfileSyncModal } from "@/components/booking/ProfileSyncModal";

const banquetRequestSchema = z.object({
  name: z.string().min(2, "Organizer Name is required (minimum 2 characters)"),
  phone: z.string().regex(/^\+?[0-9\s\-]{10,15}$/, "Please enter a valid mobile number (10+ digits)"),
  eventType: z.string().min(1, "Event Type is mandatory"),
  guestsCount: z.coerce.number().min(10, "Minimum 10 guests for banquet booking"),
  eventDate: z.string().min(1, "Event Date is mandatory"),
  email: z.string().email("Please enter a valid email address").or(z.literal("")).optional(),
  hallName: z.string().optional(),
  budget: z.coerce.number().optional(),
  specialRequirements: z.string().optional(),
});

type BanquetRequestValues = z.infer<typeof banquetRequestSchema>;

export function BanquetBookingForm() {
  const { requireAuth, customer: currentCustomer, refreshSession } = useBookingGuard();

  const [successData, setSuccessData] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Profile Sync state
  const [profileAutoFilled, setProfileAutoFilled] = useState<{
    name?: boolean;
    email?: boolean;
    phone?: boolean;
    specialRequirements?: boolean;
  }>({});
  const [pendingSubmitData, setPendingSubmitData] = useState<BanquetRequestValues | null>(null);
  const [isProfileSyncOpen, setIsProfileSyncOpen] = useState(false);
  const [changedFieldsList, setChangedFieldsList] = useState<Array<{ label: string; oldValue: string; newValue: string }>>([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<BanquetRequestValues>({
    resolver: zodResolver(banquetRequestSchema) as any,
    mode: "onChange",
    defaultValues: {
      guestsCount: 150,
      eventType: "Wedding Reception",
      hallName: "Grand Yash Ballroom",
    },
  });

  // Pre-fill fields if customer is logged in
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
      if (currentCustomer.specialRequests) {
        setValue("specialRequirements", currentCustomer.specialRequests);
        filled.specialRequirements = true;
      }
      setProfileAutoFilled(filled);
    }
  }, [currentCustomer, setValue]);

  // Execute banquet booking submission to PostgreSQL
  const executeBanquetSubmission = async (data: BanquetRequestValues, customerObj?: any) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/booking-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "BANQUET",
          guestName: data.name || customerObj?.name,
          mobile: data.phone || customerObj?.phone,
          email: data.email || customerObj?.email || undefined,
          eventType: data.eventType,
          guestsCount: data.guestsCount,
          eventDate: data.eventDate,
          hallName: data.hallName,
          specialRequest: data.specialRequirements,
        }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setSuccessData(json);
        reset();
      } else {
        setServerError(json.error || "Failed to submit banquet booking request.");
      }
    } catch (err: any) {
      console.error("Banquet request error:", err);
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Form Submission Handler
  const onSubmit = async (data: BanquetRequestValues) => {
    requireAuth(async (authenticatedCustomer) => {
      // Profile Change Detection
      const changes: Array<{ label: string; oldValue: string; newValue: string }> = [];

      if (authenticatedCustomer.name && data.name && data.name.trim() !== authenticatedCustomer.name) {
        changes.push({ label: "Organizer Name", oldValue: authenticatedCustomer.name, newValue: data.name.trim() });
      }
      if (authenticatedCustomer.email && data.email && data.email.trim() !== authenticatedCustomer.email) {
        changes.push({ label: "Email Address", oldValue: authenticatedCustomer.email, newValue: data.email.trim() });
      }
      if (authenticatedCustomer.phone && data.phone && data.phone.trim() !== authenticatedCustomer.phone) {
        changes.push({ label: "Phone Number", oldValue: authenticatedCustomer.phone, newValue: data.phone.trim() });
      }
      if (data.specialRequirements && data.specialRequirements !== authenticatedCustomer.specialRequests) {
        changes.push({ label: "Saved Preferences", oldValue: authenticatedCustomer.specialRequests || "None", newValue: data.specialRequirements });
      }

      if (changes.length > 0) {
        setPendingSubmitData(data);
        setChangedFieldsList(changes);
        setIsProfileSyncOpen(true);
        return;
      }

      await executeBanquetSubmission(data, authenticatedCustomer);
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
          specialRequests: pendingSubmitData.specialRequirements,
        }),
      });
      await refreshSession();
    } catch (e) {
      console.warn("Profile sync update notice:", e);
    }

    await executeBanquetSubmission(pendingSubmitData, currentCustomer);
    setPendingSubmitData(null);
  };

  const handleOnlyForBooking = async () => {
    if (!pendingSubmitData || !currentCustomer) return;
    setIsProfileSyncOpen(false);
    await executeBanquetSubmission(pendingSubmitData, currentCustomer);
    setPendingSubmitData(null);
  };

  return (
    <div className="space-y-6 w-full text-left select-none">
      {successData ? (
        /* BANQUET BOOKING TIMELINE & CONFIRMATION SCREEN */
        <div className="p-8 border border-purple-500/30 bg-[#0F1115] rounded-3xl space-y-6 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="h-16 w-16 bg-gradient-to-br from-purple-400 to-purple-600 p-0.5 rounded-2xl flex items-center justify-center mx-auto text-black shadow-xl">
            <div className="w-full h-full bg-[#0F1115] rounded-2xl flex items-center justify-center text-purple-400">
              <PartyPopper className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] font-bold block">
              BANQUET EVENT RESERVATION PERSISTED IN POSTGRESQL
            </span>
            <h4 className="font-serif text-3xl text-white font-bold">Banquet Request Sent</h4>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed max-w-md mx-auto">
              Your banquet event inquiry (ID: <strong className="text-[#C5A880] font-mono">{successData.data?.requestId}</strong>) is saved under your customer account and notified to our Banquet Manager.
            </p>
          </div>

          {/* TIMELINE DISPLAY */}
          <div className="p-5 bg-neutral-950/80 border border-white/10 rounded-2xl text-left space-y-4 max-w-md mx-auto">
            <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2 flex items-center justify-between">
              <span>Event Request Timeline</span>
              <span className="text-amber-400 font-mono text-[10px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                PENDING QUOTE & APPROVAL
              </span>
            </div>

            <div className="space-y-3 relative pl-4 border-l border-white/10">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-purple-400 animate-ping" />
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-purple-400" />
                <div className="text-xs font-semibold text-white">Event Request Logged in Customer Portal</div>
                <div className="text-[10px] text-neutral-400">Linked to customer account & stored in database</div>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-neutral-600" />
                <div className="text-xs font-semibold text-neutral-400">Hall Availability & Menu Package Quote</div>
                <div className="text-[10px] text-neutral-500">Banquet Manager will review & call organizer</div>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-neutral-600" />
                <div className="text-xs font-semibold text-neutral-400">Final Event Confirmation</div>
                <div className="text-[10px] text-neutral-500">Advance deposit & venue reservation token dispatch</div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/customer/dashboard"
              className="px-6 py-3.5 bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <History className="h-4 w-4" />
              <span>View in Customer Dashboard</span>
            </Link>
            {successData.managerWhatsappUrl && (
              <a
                href={successData.managerWhatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 bg-[#25D366] hover:bg-[#1DA851] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Notify Banquet Manager via WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Authentication Banner */}
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
                Browse halls freely. Clicking <strong>Book Banquet</strong> prompts fast customer sign-in without losing your form inputs.
              </p>
            </div>
          )}

          {serverError && (
            <div className="p-3.5 bg-red-950/80 border border-red-500/30 text-red-200 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* SECTION 1: MANDATORY EVENT DETAILS */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-bold border-b border-white/10 pb-1.5 flex items-center gap-1.5">
              <span>1. Mandatory Event Details</span>
              <span className="text-red-400 text-sm">*</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                  Organizer Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("name")}
                  placeholder="Enter organizer's name"
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                  Event Category <span className="text-red-400">*</span>
                </label>
                <select
                  {...register("eventType")}
                  className="w-full bg-[#0F1115] border border-white/15 focus:border-[#C5A880] px-3.5 py-3 rounded-xl text-sm text-white outline-none cursor-pointer"
                >
                  <option value="Wedding Reception">Wedding Reception & Sangeet</option>
                  <option value="Corporate Seminar">Corporate Seminar & Exhibition</option>
                  <option value="Milestone Birthday">Milestone Birthday / Anniversary</option>
                  <option value="Family Gala">Family Gala / Tilak Ceremony</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                  Expected Guests <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("guestsCount")}
                  type="number"
                  min="10"
                  max="1000"
                  className="w-full bg-[#0F1115] border border-white/15 focus:border-[#C5A880] px-4 py-3 rounded-xl text-sm text-white outline-none font-mono"
                />
                {errors.guestsCount && (
                  <span className="text-[10px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.guestsCount.message}
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-300 font-semibold block">
                  Event Date <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("eventDate")}
                  type="date"
                  className="w-full bg-[#0F1115] border border-white/15 focus:border-[#C5A880] px-3.5 py-3 rounded-xl text-sm text-white outline-none font-mono"
                />
                {errors.eventDate && (
                  <span className="text-[10px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.eventDate.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: OPTIONAL BANQUET DETAILS */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs uppercase tracking-widest text-[#C5A880] font-bold border-b border-white/10 pb-1.5">
              2. Optional Customization
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="organizer@email.com"
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
                  Preferred Ballroom / Hall
                </label>
                <select
                  {...register("hallName")}
                  className="w-full bg-[#0F1115] border border-white/10 focus:border-[#C5A880] px-3 py-2.5 rounded-xl text-xs text-white outline-none cursor-pointer"
                >
                  <option value="Grand Yash Ballroom">Grand Yash Ballroom (Capacity 300+)</option>
                  <option value="Royal Crystal Hall">Royal Crystal Hall (Capacity 150)</option>
                  <option value="Lawn Terrace Garden">Lawn Terrace Garden (Capacity 500+)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                  Estimated Budget (₹)
                </label>
                <input
                  {...register("budget")}
                  type="number"
                  placeholder="e.g. 150000"
                  className="w-full bg-[#0F1115] border border-white/10 focus:border-[#C5A880] px-4 py-2.5 rounded-xl text-xs text-white outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold block">
                Special Requirements & Catering Preference
              </label>
              <textarea
                {...register("specialRequirements")}
                rows={3}
                placeholder="e.g. Pure Veg Awadhi buffet, DJ setup, floral stage theme decoration"
                className="w-full bg-[#0F1115] border border-white/10 focus:border-[#C5A880] px-4 py-3 rounded-xl text-xs text-white placeholder-neutral-600 outline-none resize-none"
              />
              {profileAutoFilled.specialRequirements && (
                <span className="text-[10px] text-[#C5A880]/80 italic flex items-center gap-1 mt-1 font-sans">
                  <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" /> From your profile
                </span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-[#C5A880] via-[#D4AF37] to-[#8C6D3F] hover:opacity-95 text-black font-bold text-xs uppercase tracking-widest transition-all rounded-xl shadow-lg shadow-[#C5A880]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? "Saving Banquet Request..." : "Book Banquet & Reserve Event"}</span>
            </button>
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

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { ProfileSyncModal } from "@/components/booking/ProfileSyncModal";

const tableSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[0-9\s\-]{10,15}$/, "Please enter a valid phone number"),
  date: z.string().min(1, "Reservation date is required"),
  time: z.string().min(1, "Reservation time is required"),
  guests: z.coerce.number().min(1, "At least 1 guest is required").max(30, "For groups larger than 30, please contact us directly"),
  occasion: z.string().optional(),
  specialRequest: z.string().optional()
});

type TableFormValues = z.infer<typeof tableSchema>;

export function RestaurantBookingForm() {
  const { requireAuth, customer: currentCustomer, refreshSession } = useBookingGuard();
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Profile Sync state
  const [profileAutoFilled, setProfileAutoFilled] = useState<{
    name?: boolean;
    phone?: boolean;
    specialRequest?: boolean;
  }>({});
  const [pendingSubmitData, setPendingSubmitData] = useState<TableFormValues | null>(null);
  const [isProfileSyncOpen, setIsProfileSyncOpen] = useState(false);
  const [changedFieldsList, setChangedFieldsList] = useState<Array<{ label: string; oldValue: string; newValue: string }>>([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<TableFormValues>({
    resolver: zodResolver(tableSchema) as any,
    defaultValues: {
      guests: 4,
      occasion: "family-dining"
    }
  });

  // Pre-fill profile data if logged in
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
      if (currentCustomer.specialRequests) {
        setValue("specialRequest", currentCustomer.specialRequests);
        filled.specialRequest = true;
      }
      setProfileAutoFilled(filled);
    }
  }, [currentCustomer, setValue]);

  const executeRestaurantSubmission = async (data: TableFormValues, customerObj?: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "RESTAURANT",
          guestName: data.name || customerObj?.name,
          mobile: data.phone || customerObj?.phone,
          email: customerObj?.email || undefined,
          eventType: data.occasion || "Table Reservation",
          eventDate: data.date,
          eventTime: data.time,
          guestsCount: data.guests,
          specialRequest: data.specialRequest || "None",
        }),
      });

      if (res.ok) {
        setSuccess(true);
        reset();
      }
    } catch (err) {
      console.error("Failed to submit table reservation:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (data: TableFormValues) => {
    requireAuth(async (authenticatedCustomer) => {
      // Profile Change Detection
      const changes: Array<{ label: string; oldValue: string; newValue: string }> = [];

      if (authenticatedCustomer.name && data.name && data.name.trim() !== authenticatedCustomer.name) {
        changes.push({ label: "Full Name", oldValue: authenticatedCustomer.name, newValue: data.name.trim() });
      }
      if (authenticatedCustomer.phone && data.phone && data.phone.trim() !== authenticatedCustomer.phone) {
        changes.push({ label: "Phone Number", oldValue: authenticatedCustomer.phone, newValue: data.phone.trim() });
      }
      if (data.specialRequest && data.specialRequest !== authenticatedCustomer.specialRequests) {
        changes.push({ label: "Dietary & Special Requests", oldValue: authenticatedCustomer.specialRequests || "None", newValue: data.specialRequest });
      }

      if (changes.length > 0) {
        setPendingSubmitData(data);
        setChangedFieldsList(changes);
        setIsProfileSyncOpen(true);
        return;
      }

      await executeRestaurantSubmission(data, authenticatedCustomer);
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
          specialRequests: pendingSubmitData.specialRequest,
        }),
      });
      await refreshSession();
    } catch (e) {
      console.warn("Profile sync update notice:", e);
    }

    await executeRestaurantSubmission(pendingSubmitData, currentCustomer);
    setPendingSubmitData(null);
  };

  const handleOnlyForBooking = async () => {
    if (!pendingSubmitData || !currentCustomer) return;
    setIsProfileSyncOpen(false);
    await executeRestaurantSubmission(pendingSubmitData, currentCustomer);
    setPendingSubmitData(null);
  };

  return (
    <div className="space-y-6 w-full text-left">
      {success ? (
        <div className="p-6 border border-emerald-500/20 bg-emerald-500/5 rounded-xl space-y-3 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
          <h4 className="font-serif text-lg text-white">Table Reservation Registered</h4>
          <p className="text-[11.5px] text-neutral-400 font-sans leading-relaxed">
            Thank you! Your table reservation is recorded in our database. A restaurant captain will contact you shortly to confirm your booking timing and seat arrangements.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="text-[9px] uppercase tracking-widest text-gold hover:text-white font-bold block pt-2 mx-auto cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Full Name</label>
              <input
                {...register("name")}
                placeholder="Enter your name"
                className="w-full bg-[#0F1115] border border-white/10 hover:border-gold/30 focus:border-gold px-4 py-3 rounded-lg text-sm text-white placeholder-neutral-600 outline-none transition-all"
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
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Phone Number</label>
              <input
                {...register("phone")}
                placeholder="e.g., +91 91510 88115"
                className="w-full bg-[#0F1115] border border-white/10 hover:border-gold/30 focus:border-gold px-4 py-3 rounded-lg text-sm text-white placeholder-neutral-600 outline-none transition-all"
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
            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Reservation Date</label>
              <input
                {...register("date")}
                type="date"
                className="w-full bg-[#0F1115] border border-white/10 hover:border-gold/30 focus:border-gold px-4 py-3 rounded-lg text-sm text-white outline-none transition-all"
              />
              {errors.date && (
                <span className="text-[10px] text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.date.message}
                </span>
              )}
            </div>

            {/* Time */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Reservation Time</label>
              <input
                {...register("time")}
                type="time"
                className="w-full bg-[#0F1115] border border-white/10 hover:border-gold/30 focus:border-gold px-4 py-3 rounded-lg text-sm text-white outline-none transition-all"
              />
              {errors.time && (
                <span className="text-[10px] text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.time.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Guests */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Number of Guests</label>
              <input
                {...register("guests")}
                type="number"
                min="1"
                max="30"
                className="w-full bg-[#0F1115] border border-white/10 hover:border-gold/30 focus:border-gold px-4 py-3 rounded-lg text-sm text-white outline-none transition-all"
              />
              {errors.guests && (
                <span className="text-[10px] text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.guests.message}
                </span>
              )}
            </div>

            {/* Occasion */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Dining Occasion</label>
              <select
                {...register("occasion")}
                className="w-full bg-[#0F1115] border border-white/10 hover:border-gold/30 focus:border-gold px-4 py-3 rounded-lg text-sm text-white outline-none transition-all"
              >
                <option value="Family Dining">Family Dining</option>
                <option value="Birthday Celebration">Birthday Celebration</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Business Dinner">Business Dinner</option>
                <option value="Casual Dining">Casual Dining</option>
              </select>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">Special Requests & Dietary Preferences (Optional)</label>
            <textarea
              {...register("specialRequest")}
              rows={3}
              placeholder="e.g., A/C chamber table, high-chair for toddler, spicy foods preference"
              className="w-full bg-[#0F1115] border border-white/10 hover:border-gold/30 focus:border-gold px-4 py-3 rounded-lg text-sm text-white placeholder-neutral-600 outline-none transition-all resize-none"
            />
            {profileAutoFilled.specialRequest && (
              <span className="text-[10px] text-[#C5A880]/80 italic flex items-center gap-1 mt-1 font-sans">
                <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" /> From your profile
              </span>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2 font-buttons">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4.5 bg-[#DFBA73] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white text-[10px] uppercase tracking-widest font-bold rounded-sm cursor-pointer transition-all duration-500 shadow-md"
            >
              {submitting ? "Submitting Reservation..." : "Confirm Table Reservation"}
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

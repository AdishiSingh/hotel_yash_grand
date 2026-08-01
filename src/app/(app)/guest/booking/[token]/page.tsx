"use client";

import React, { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Send, 
  Clock, 
  ShieldCheck, 
  Download, 
  FileText,
  Building,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useParams } from "next/navigation";

export default function GuestBookingPortalPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/booking-requests/${token}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json);
        } else {
          setError(json.error || "Booking details not found.");
        }
      })
      .catch((err) => setError("Failed to load booking profile."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-6 font-mono text-xs text-[#DFBA73] animate-pulse">
        Retrieving your Hotel Yash Grand booking details...
      </div>
    );
  }

  if (error || !data?.request) {
    return (
      <div className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-6 text-center text-white">
        <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl max-w-md w-full space-y-4">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold">Booking Link Expired or Invalid</h3>
          <p className="text-xs text-neutral-400 font-sans">
            Please contact front desk reception at +91 91510 88115 for assistance.
          </p>
        </div>
      </div>
    );
  }

  const req = data.request;
  const isApproved = req.status === "APPROVED" || req.status === "CONFIRMED" || req.status === "PAYMENT_PENDING";

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white py-12 px-4 sm:px-6 font-sans select-none">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* BRAND HEADER */}
        <div className="text-center space-y-2 border-b border-white/10 pb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#DFBA73] font-bold block">
            GUEST SELF-SERVICE PORTAL
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-white">
            HOTEL YASH GRAND
          </h1>
          <p className="text-xs text-neutral-400 font-sans">
            Luxury Stay & Hospitality • Varanasi, Uttar Pradesh
          </p>
        </div>

        {/* STATUS CARD */}
        <div className={`p-6 sm:p-8 rounded-2xl border shadow-lux text-center space-y-4 ${
          isApproved 
            ? "bg-emerald-950/30 border-emerald-500/40" 
            : req.status === "REJECTED"
            ? "bg-red-950/30 border-red-500/40"
            : "bg-amber-950/30 border-amber-500/40"
        }`}>
          <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border bg-neutral-950">
            {isApproved ? "🎉" : req.status === "REJECTED" ? "❌" : "⏳"}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#DFBA73] font-bold block">
              BOOKING REFERENCE #{req.requestId}
            </span>
            <h2 className="font-serif text-2xl text-white font-bold">
              {isApproved ? "Booking Approved & Confirmed" : req.status === "REJECTED" ? "Request Declined" : "Request Pending Manager Verification"}
            </h2>
            <p className="text-xs text-neutral-300 max-w-md mx-auto">
              Guest Name: <strong className="text-white">{req.guestName}</strong> ({req.mobile})
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-white/15 text-xs font-mono">
            <span>Status:</span>
            <span className="font-bold text-[#DFBA73] uppercase">{req.status.replace("_", " ")}</span>
          </div>
        </div>

        {/* BOOKING DETAILS SUMMARY */}
        <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="font-serif text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#DFBA73]" />
            <span>Reservation Summary</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-neutral-900 p-4 rounded-lg space-y-1 border border-white/5">
              <span className="text-neutral-500 text-[10px] uppercase">Category / Domain</span>
              <div className="text-white font-bold text-sm">{req.type === "ROOM" ? "Room Stay" : "Banquet Event"}</div>
              <div className="text-neutral-400">{req.roomType || req.eventType || "Single Deluxe"}</div>
            </div>

            <div className="bg-neutral-900 p-4 rounded-lg space-y-1 border border-white/5">
              <span className="text-neutral-500 text-[10px] uppercase">Dates & Duration</span>
              <div className="text-[#DFBA73] font-bold text-sm">
                {req.type === "ROOM" 
                  ? `${req.checkIn ? new Date(req.checkIn).toLocaleDateString() : "N/A"} → ${req.checkOut ? new Date(req.checkOut).toLocaleDateString() : "N/A"}`
                  : (req.eventDate ? new Date(req.eventDate).toLocaleDateString() : "N/A")}
              </div>
              <div className="text-neutral-400">Standard Check-in: 12:00 PM</div>
            </div>

            <div className="bg-neutral-900 p-4 rounded-lg space-y-1 border border-white/5">
              <span className="text-neutral-500 text-[10px] uppercase">Assigned Unit / Room</span>
              <div className="text-emerald-400 font-bold text-sm">
                {req.assignedRoomNumber ? `Room Number ${req.assignedRoomNumber}` : "Room Assignment Pending"}
              </div>
            </div>

            <div className="bg-neutral-900 p-4 rounded-lg space-y-1 border border-white/5">
              <span className="text-neutral-500 text-[10px] uppercase">Tariff & Advance Paid</span>
              <div className="text-white font-bold text-sm">Total: ₹{req.totalAmount || 0}</div>
              <div className="text-neutral-400">Advance Paid: ₹{req.advanceAmount || 0}</div>
            </div>
          </div>

          {req.specialRequest && (
            <div className="bg-neutral-900/60 p-4 rounded-lg border border-white/5 text-xs text-neutral-300">
              <span className="text-[#DFBA73] font-bold">Your Special Requests: </span>
              <span>{req.specialRequest}</span>
            </div>
          )}
        </div>

        {/* HOTEL POLICIES & LOCATION HUB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4 text-xs font-sans">
            <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-[#DFBA73]" />
              <span>Hotel Check-in Policies</span>
            </h4>
            <ul className="space-y-2 text-neutral-300 list-disc list-inside">
              <li>Check-in: 12:00 PM | Check-out: 11:00 AM</li>
              <li>Valid Government Photo ID proof (Aadhaar / Passport) mandatory for all adult guests.</li>
              <li>Free cancellation up to 48 hours prior to check-in.</li>
              <li>Strict no-smoking policy inside rooms.</li>
            </ul>
          </div>

          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4 text-xs font-sans">
            <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-[#DFBA73]" />
              <span>Location & Contact</span>
            </h4>
            <p className="text-neutral-300 leading-relaxed">
              Adjacent to SMS College, Bypass Road, Varanasi, Uttar Pradesh 221011
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://maps.google.com/?q=Hotel+Yash+Grand+Varanasi"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-white text-xs font-bold uppercase tracking-wider rounded text-center block"
              >
                📍 Open Google Maps Directions
              </a>
              <a
                href={`https://wa.me/919151088115?text=${encodeURIComponent(`Hello Hotel Yash Grand, inquiring about booking #${req.requestId}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#1DA851] text-black text-xs font-bold uppercase tracking-wider rounded text-center flex items-center justify-center gap-2 block"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Chat with Hotel Front Desk</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

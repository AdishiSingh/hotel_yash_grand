"use client";

import React, { useEffect, useState } from "react";
import { CustomerNavbar } from "../CustomerNavbar";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileCheck, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck,
  BedDouble,
  Heart,
  Users,
  Plus,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Laptop,
  Smartphone,
  Bell,
  Sparkles,
  Camera,
  Crown,
  KeyRound,
  X
} from "lucide-react";

interface SavedGuestItem {
  id: string;
  name: string;
  relationship: string;
  age: string;
  idNumber?: string;
}

const AVATAR_OPTIONS = [
  "👑", "🤵", "👸", "⚜️", "🏨", "🌟", "💼", "🌿"
];

export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState<any>(null);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("👑");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [idProofType, setIdProofType] = useState("Aadhaar Card");
  const [idProofNumber, setIdProofNumber] = useState("");
  const [favouriteRoom, setFavouriteRoom] = useState("Single Deluxe Room");
  const [specialRequests, setSpecialRequests] = useState("");
  const [preferredFloor, setPreferredFloor] = useState("any");
  const [preferredCheckInTime, setPreferredCheckInTime] = useState("12:00 PM");

  // Saved Guests State
  const [savedGuests, setSavedGuests] = useState<SavedGuestItem[]>([]);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestRel, setNewGuestRel] = useState("Spouse");
  const [newGuestAge, setNewGuestAge] = useState("");
  const [newGuestId, setNewGuestId] = useState("");

  // Password Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    async function loadFullProfile() {
      try {
        const res = await fetch("/api/customer/profile");
        const json = await res.json();

        if (json.success && json.customer) {
          setCustomer(json.customer);
          setName(json.customer.name || "");
          setPhone(json.customer.phone || "");
          setEmail(json.customer.email || "");
          setAvatar(json.customer.avatar || "👑");
          setAddress(json.customer.address || "");
          setCity(json.customer.city || "");
          setState(json.customer.state || "");
          setPincode(json.customer.pincode || "");
          setIdProofType(json.customer.idProofType || "Aadhaar Card");
          setIdProofNumber(json.customer.idProofNumber || "");
          setFavouriteRoom(json.customer.favouriteRoom || "Single Deluxe Room");
          setSpecialRequests(json.customer.specialRequests || "");
          setPreferredFloor(json.customer.preferredFloor || "any");
          setPreferredCheckInTime(json.customer.preferredCheckInTime || "12:00 PM");
          
          if (Array.isArray(json.customer.savedGuests)) {
            setSavedGuests(json.customer.savedGuests);
          }

          setActiveSessions(json.activeSessions || []);
          setNotifications(json.notifications || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadFullProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          avatar,
          address,
          city,
          state,
          pincode,
          idProofType,
          idProofNumber,
          favouriteRoom,
          specialRequests,
          preferredFloor,
          preferredCheckInTime,
          savedGuests,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(json.error || "Failed to update profile in PostgreSQL.");
        setSavingProfile(false);
        return;
      }

      setSuccessMsg("Profile details, preferences, and saved guests updated successfully!");
      setCustomer(json.customer);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddGuest = () => {
    if (!newGuestName.trim()) return;
    const item: SavedGuestItem = {
      id: `guest-${Date.now()}`,
      name: newGuestName.trim(),
      relationship: newGuestRel,
      age: newGuestAge.trim() || "N/A",
      idNumber: newGuestId.trim() || undefined,
    };
    setSavedGuests([...savedGuests, item]);
    setNewGuestName("");
    setNewGuestAge("");
    setNewGuestId("");
    setShowAddGuestModal(false);
  };

  const handleRemoveGuest = (id: string) => {
    setSavedGuests(savedGuests.filter((g) => g.id !== id));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/customer/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMsg(json.error || "Failed to update password.");
        setSavingPassword(false);
        return;
      }

      setSuccessMsg("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleRevokeSession = async (sessionId?: string) => {
    try {
      const url = sessionId ? `/api/customer/sessions?id=${sessionId}` : "/api/customer/sessions";
      const res = await fetch(url, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setActiveSessions(activeSessions.filter((s) => (sessionId ? s.id !== sessionId : false)));
        setSuccessMsg(json.message || "Sessions updated.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090D] text-white flex flex-col">
        <CustomerNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#C5A880] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090D] text-white flex flex-col selection:bg-[#C5A880] selection:text-black">
      <CustomerNavbar customerName={customer?.name} customerEmail={customer?.email} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* PAGE HEADER */}
        <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#C5A880]">
              Customer Profile & Guest Preferences
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Manage personal info, saved companions, favourite room categories, active sessions, and security credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-4 h-4" />
              <span>Verified Customer</span>
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. PROFILE HEADER CARD & AVATAR PICKER */}
        <div className="bg-gradient-to-r from-[#141820] via-[#0F1115] to-[#0A0C0F] border border-[#C5A880]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C5A880]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Badge & Emoji Picker */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-[#C5A880] via-[#D4AF37] to-[#8C6D3F] p-0.5 shadow-xl">
                <div className="w-full h-full bg-[#0F1115] rounded-3xl flex items-center justify-center text-4xl select-none">
                  {avatar}
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-white/10">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    className={`h-7 w-7 rounded-lg text-xs flex items-center justify-center transition-all cursor-pointer ${
                      avatar === emoji ? "bg-[#C5A880]/30 border border-[#C5A880]" : "hover:bg-neutral-800"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <h2 className="font-serif text-2xl font-bold text-white">{customer?.name}</h2>
                {customer?.provider?.includes("google") && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                    <span>Google OAuth</span>
                  </span>
                )}
                {customer?.isEmailVerified && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span>Email Verified</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-neutral-300 space-y-1 font-sans">
                <div>Mobile: <strong className="text-white font-mono">{customer?.phone}</strong></div>
                {customer?.email && <div>Email: <strong className="text-white">{customer?.email}</strong></div>}
                <div>Auth Provider: <strong className="text-[#C5A880] uppercase">{customer?.provider || "credentials"}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. EDIT PROFILE & ADDRESS FORM */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-[#0F1115] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <User className="w-5 h-5 text-[#C5A880]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Personal & Contact Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@example.com"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House No., Street, Landmark"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Varanasi"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Uttar Pradesh"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 221011"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Government ID Proof Type
                </label>
                <select
                  value={idProofType}
                  onChange={(e) => setIdProofType(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none cursor-pointer"
                >
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                  <option value="Voter ID">Voter ID Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Government ID Number
                </label>
                <input
                  type="text"
                  value={idProofNumber}
                  onChange={(e) => setIdProofNumber(e.target.value)}
                  placeholder="e.g. XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* 3. FAVOURITE ROOM & SPECIAL REQUESTS */}
          <div className="bg-[#0F1115] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Heart className="w-5 h-5 text-red-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Stay Preferences & Favourite Room</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Favourite Room Category
                </label>
                <select
                  value={favouriteRoom}
                  onChange={(e) => setFavouriteRoom(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none cursor-pointer"
                >
                  <option value="Single Deluxe Room">Single Deluxe Room</option>
                  <option value="Family Room">Family Room</option>
                  <option value="Executive Suite">Executive Suite (High View)</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Preferred Floor
                </label>
                <select
                  value={preferredFloor}
                  onChange={(e) => setPreferredFloor(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none cursor-pointer"
                >
                  <option value="any">No Preference (Any Floor)</option>
                  <option value="ground">Ground Floor</option>
                  <option value="first">First Floor</option>
                  <option value="high">High Floor (Executive View)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Preferred Check-In Time
                </label>
                <input
                  type="text"
                  value={preferredCheckInTime}
                  onChange={(e) => setPreferredCheckInTime(e.target.value)}
                  placeholder="e.g. 12:00 PM / Early Check-in 10:00 AM"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Permanent Special Requests
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Non-smoking, Extra pillows, Pure Veg"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. SAVED GUESTS COMPANION MANAGER */}
          <div className="bg-[#0F1115] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#C5A880]" />
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Saved Guests & Companions</h2>
                  <p className="text-[11px] text-neutral-400">Save family or colleagues for 1-click room booking</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddGuestModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#C5A880]/15 hover:bg-[#C5A880] text-[#C5A880] hover:text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all border border-[#C5A880]/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Companion</span>
              </button>
            </div>

            {savedGuests.length === 0 ? (
              <div className="p-6 bg-neutral-950 rounded-2xl text-center text-xs text-neutral-400 border border-white/5">
                No saved guest companions added yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedGuests.map((g) => (
                  <div key={g.id} className="p-4 bg-neutral-950 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{g.name}</div>
                      <div className="text-[11px] text-neutral-400 font-sans">
                        {g.relationship} • Age: {g.age}
                        {g.idNumber && ` • ID: ${g.idNumber}`}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveGuest(g.id)}
                      className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                      title="Remove saved guest"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-lg shadow-[#C5A880]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating PostgreSQL...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Full Profile Details</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* 5. ACCOUNT SECURITY & ACTIVE SESSIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PASSWORD UPDATE CARD */}
          <div className="bg-[#0F1115] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <KeyRound className="w-5 h-5 text-[#C5A880]" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Change Security Password</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-xs text-[#C5A880] hover:underline flex items-center gap-1"
              >
                {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Current Password *
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  New Password *
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                  Confirm New Password *
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#8C6D3F] text-black font-bold text-xs uppercase tracking-widest hover:opacity-95 shadow-lg shadow-[#C5A880]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ACTIVE SESSIONS CARD */}
          <div className="bg-[#0F1115] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-[#C5A880]" />
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Device Sessions</h2>
                  <p className="text-[11px] text-neutral-400">Authenticated login sessions</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRevokeSession()}
                className="text-xs text-red-400 hover:underline font-semibold"
              >
                Revoke Others
              </button>
            </div>

            <div className="space-y-3">
              {activeSessions.length === 0 ? (
                <div className="text-xs text-neutral-400">No active session records found.</div>
              ) : (
                activeSessions.map((s) => (
                  <div key={s.id} className="p-3.5 bg-neutral-950 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-white font-mono">{s.ipAddress || "127.0.0.1"}</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[200px]">{s.userAgent || "Browser"}</div>
                      <div className="text-[9.5px] text-neutral-500 font-mono">Logged: {new Date(s.createdAt).toLocaleDateString()}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRevokeSession(s.id)}
                      className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold uppercase hover:bg-red-500/20"
                    >
                      Revoke
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ADD SAVED GUEST MODAL */}
        {showAddGuestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none">
            <div className="bg-[#0F1115] border border-[#C5A880]/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add Saved Guest Companion</h3>
                <button onClick={() => setShowAddGuestModal(false)} className="text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Companion Name *
                  </label>
                  <input
                    type="text"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="e.g. Sunita Devi"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Relationship
                  </label>
                  <select
                    value={newGuestRel}
                    onChange={(e) => setNewGuestRel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Colleague">Corporate Colleague</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    value={newGuestAge}
                    onChange={(e) => setNewGuestAge(e.target.value)}
                    placeholder="e.g. 32"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                    Government ID Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={newGuestId}
                    onChange={(e) => setNewGuestId(e.target.value)}
                    placeholder="Aadhaar / Passport"
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white focus:border-[#C5A880] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-xs font-semibold text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddGuest}
                  className="px-4 py-2 rounded-xl bg-[#C5A880] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90"
                >
                  Save Companion
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

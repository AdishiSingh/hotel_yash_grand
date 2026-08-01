"use client";

import * as React from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export default function ErpSettingsPage() {
  const [hotelName, setHotelName] = React.useState("HOTEL YASH GRAND");
  const [gstNumber, setGstNumber] = React.useState("09AAAAA0000A1Z5");
  const [whatsappPhone, setWhatsappPhone] = React.useState("+91 91510 88115");
  const [email, setEmail] = React.useState("yashgrand03nov@gmail.com");
  const [timing, setTiming] = React.useState("07:00 AM - 11:00 PM");
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 font-sans max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-white">ERP Hotel & Operational Settings</h2>
          <p className="text-xs text-neutral-400 font-light">
            GST compliance details, official contact info, and system defaults.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="border border-white/10 bg-neutral-950 p-6 rounded-xl space-y-5 shadow-lux">
        <div>
          <label className="text-xs uppercase tracking-widest text-[#C5A880] font-bold block mb-1">Hotel Trade Name</label>
          <input
            type="text"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            className="w-full bg-neutral-900 border border-white/15 focus:border-[#C5A880] p-3 rounded-sm text-xs text-white outline-none font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-[#C5A880] font-bold block mb-1">GST Tax Registration #</label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 focus:border-[#C5A880] p-3 rounded-sm text-xs text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-[#C5A880] font-bold block mb-1">Official WhatsApp Phone</label>
            <input
              type="text"
              value={whatsappPhone}
              onChange={(e) => setWhatsappPhone(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 focus:border-[#C5A880] p-3 rounded-sm text-xs text-white outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-[#C5A880] font-bold block mb-1">Official Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 focus:border-[#C5A880] p-3 rounded-sm text-xs text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-[#C5A880] font-bold block mb-1">Restaurant Operating Hours</label>
            <input
              type="text"
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              className="w-full bg-neutral-900 border border-white/15 focus:border-[#C5A880] p-3 rounded-sm text-xs text-white outline-none"
            />
          </div>
        </div>

        {saved ? (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>ERP Settings Updated Successfully!</span>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full py-3.5 bg-[#C5A880] hover:bg-[#A37C40] text-black font-bold text-xs uppercase tracking-widest transition-all rounded-sm shadow-md cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save ERP Settings</span>
          </button>
        )}
      </form>
    </div>
  );
}

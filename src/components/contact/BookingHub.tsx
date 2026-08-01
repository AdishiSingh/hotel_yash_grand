import React, { useState, useEffect } from "react";
import { RoomBookingForm } from "./RoomBookingForm";
import { RestaurantBookingForm } from "./RestaurantBookingForm";
import { BanquetBookingForm } from "./BanquetBookingForm";
import { Hotel, Utensils, Award, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/features/booking/store/use-booking-store";

export function BookingHub() {
  const [activeForm, setActiveForm] = useState<"room" | "table" | "banquet">("room");
  const { bookingType } = useBookingStore();

  // Listen to global booking store changes to keep synchrony
  useEffect(() => {
    if (bookingType === "room") setActiveForm("room");
    if (bookingType === "dining") setActiveForm("table");
    if (bookingType === "banquet") setActiveForm("banquet");
  }, [bookingType]);

  return (
    <div className="space-y-10 w-full select-none">
      {/* Category selection cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Room Booking */}
        <div
          onClick={() => setActiveForm("room")}
          className={`p-5 border rounded-xl flex flex-col items-center justify-center text-center gap-3.5 cursor-pointer transition-all duration-500 shadow-md ${
            activeForm === "room"
              ? "bg-[#DFBA73] text-[#0F1115] border-[#DFBA73] shadow-[0_0_15px_rgba(223,186,115,0.2)]"
              : "bg-[#14161C]/50 text-white border-white/5 hover:border-gold/20"
          }`}
        >
          <Hotel className="h-5 w-5" />
          <div className="space-y-0.5">
            <h4 className="font-serif text-sm font-semibold tracking-wide">Book a Room</h4>
            <span className="text-[8.5px] uppercase tracking-wider block opacity-75">Suites & Deluxe</span>
          </div>
        </div>

        {/* Card 2: Table Reservation */}
        <div
          onClick={() => setActiveForm("table")}
          className={`p-5 border rounded-xl flex flex-col items-center justify-center text-center gap-3.5 cursor-pointer transition-all duration-500 shadow-md ${
            activeForm === "table"
              ? "bg-[#DFBA73] text-[#0F1115] border-[#DFBA73] shadow-[0_0_15px_rgba(223,186,115,0.2)]"
              : "bg-[#14161C]/50 text-white border-white/5 hover:border-gold/20"
          }`}
        >
          <Utensils className="h-5 w-5" />
          <div className="space-y-0.5">
            <h4 className="font-serif text-sm font-semibold tracking-wide">Reserve Table</h4>
            <span className="text-[8.5px] uppercase tracking-wider block opacity-75">Veg & Non-Veg Dining</span>
          </div>
        </div>

        {/* Card 3: Banquet Hall */}
        <div
          onClick={() => setActiveForm("banquet")}
          className={`p-5 border rounded-xl flex flex-col items-center justify-center text-center gap-3.5 cursor-pointer transition-all duration-500 shadow-md ${
            activeForm === "banquet"
              ? "bg-[#DFBA73] text-[#0F1115] border-[#DFBA73] shadow-[0_0_15px_rgba(223,186,115,0.2)]"
              : "bg-[#14161C]/50 text-white border-white/5 hover:border-gold/20"
          }`}
        >
          <Award className="h-5 w-5" />
          <div className="space-y-0.5">
            <h4 className="font-serif text-sm font-semibold tracking-wide">Book Banquet</h4>
            <span className="text-[8.5px] uppercase tracking-wider block opacity-75">Ballroom & Lawn</span>
          </div>
        </div>
      </div>

      {/* Render Active Form Casing */}
      <div className="p-6 sm:p-10 border border-white/5 bg-[#14161C]/35 backdrop-blur-md rounded-2xl shadow-lux hover:border-gold/10 transition-colors duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeForm}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {activeForm === "room" && <RoomBookingForm />}
            {activeForm === "table" && <RestaurantBookingForm />}
            {activeForm === "banquet" && <BanquetBookingForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

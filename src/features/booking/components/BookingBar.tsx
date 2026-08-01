"use client";

import * as React from "react";
import { useBookingStore } from "../store/use-booking-store";
import { useBookingGuard } from "@/context/BookingGuardContext";
import { Button } from "@/components/ui/button";

/**
 * Sticky Booking Action Bar
 * Updates date intervals in the global Zustand store and opens the checkout drawer.
 */
export function BookingBar() {
  const {
    checkInDate,
    checkOutDate,
    adultsCount,
    childrenCount,
    updateFields,
    setDrawerOpen,
    setBookingType,
  } = useBookingStore();
  const { requireAuth } = useBookingGuard();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      if (!checkInDate || !checkOutDate) {
        updateFields({ validationError: "Please select arrival and departure dates." });
        setBookingType("room");
        setDrawerOpen(true);
        return;
      }
      
      setBookingType("room");
      setDrawerOpen(true);
    }, { checkInDate, checkOutDate, adultsCount, childrenCount });
  };

  return (
    <div className="w-full bg-neutral-900/90 dark:bg-black/80 backdrop-blur-md border-t border-gold/15 text-white py-5 px-6 shadow-lux select-none">
      <form
        onSubmit={handleBookingSubmit}
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
      >
        {/* Selection Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full md:w-auto flex-1">
          {/* Check-In Input */}
          <div className="flex flex-col border-r border-gold/10 pr-4">
            <span className="text-[9px] uppercase tracking-widest text-gold font-medium">
              Arrival
            </span>
            <input
              type="date"
              className="bg-transparent border-none text-sm text-neutral-300 focus:outline-none focus:text-white mt-1 pt-1 font-sans cursor-pointer"
              value={checkInDate}
              onChange={(e) => updateFields({ checkInDate: e.target.value })}
            />
          </div>

          {/* Check-Out Input */}
          <div className="flex flex-col border-r border-gold/10 pr-4">
            <span className="text-[9px] uppercase tracking-widest text-gold font-medium">
              Departure
            </span>
            <input
              type="date"
              className="bg-transparent border-none text-sm text-neutral-300 focus:outline-none focus:text-white mt-1 pt-1 font-sans cursor-pointer"
              value={checkOutDate}
              min={checkInDate}
              onChange={(e) => updateFields({ checkOutDate: e.target.value })}
            />
          </div>

          {/* Adults Selection */}
          <div className="flex flex-col border-r border-gold/10 pr-4">
            <span className="text-[9px] uppercase tracking-widest text-gold font-medium">
              Adults
            </span>
            <select
              className="bg-transparent border-none text-sm text-neutral-300 focus:outline-none focus:text-white mt-1 pt-1 font-sans cursor-pointer"
              value={adultsCount}
              onChange={(e) => updateFields({ adultsCount: Number(e.target.value) })}
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num} className="bg-neutral-900 text-white">
                  {num} Guest{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Children Selection */}
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-gold font-medium">
              Children
            </span>
            <select
              className="bg-transparent border-none text-sm text-neutral-300 focus:outline-none focus:text-white mt-1 pt-1 font-sans cursor-pointer"
              value={childrenCount}
              onChange={(e) => updateFields({ childrenCount: Number(e.target.value) })}
            >
              {[0, 1, 2, 3].map((num) => (
                <option key={num} value={num} className="bg-neutral-900 text-white">
                  {num} Child{num > 1 ? "ren" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Trigger */}
        <div className="flex flex-col items-center md:items-end w-full md:w-auto">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full md:w-auto text-xs font-semibold py-4"
          >
            Check Availability
          </Button>
        </div>
      </form>
    </div>
  );
}

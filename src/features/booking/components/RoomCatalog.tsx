"use client";

import * as React from "react";
import Image from "next/image";
import { ROOMS_DATA } from "@/shared/data/rooms";
import { useBookingStore } from "../store/use-booking-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { BookingHub } from "@/components/contact/BookingHub";
import { LocationAndTrust } from "@/components/rooms/LocationAndTrust";

import { useBookingGuard } from "@/context/BookingGuardContext";

const ThreeCanvas = dynamic(
  () => import("@/shared/lib/three-canvas").then((mod) => mod.ThreeCanvas),
  { ssr: false }
);

export function RoomCatalog() {
  const { setDrawerOpen, selectRoomCategory } = useBookingStore();
  const { requireAuth } = useBookingGuard();
  const [fullscreenImage, setFullscreenImage] = React.useState<string | null>(null);
  const [active360RoomId, setActive360RoomId] = React.useState<string | null>(null);
  const [activeImageIndexes, setActiveImageIndexes] = React.useState<Record<string, number>>({});

  const handleScrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full py-24 sm:py-36 bg-background text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Top Cinematic Room Video Header Banner */}
        <div className="relative w-full h-[38vh] sm:h-[48vh] min-h-[300px] rounded-2xl overflow-hidden border border-white/10 shadow-lux mb-12 sm:mb-16 group">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          >
            <source src="/assets/rooms/rooms.mp4" type="video/mp4" />
          </video>
          
          {/* Ambient gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

          {/* Floating Luxury Tag & Heading */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 space-y-2 z-10">
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-black bg-[#C5A880] px-3 py-1 rounded-sm shadow-md inline-block">
              Cinematic Room Tour
            </span>
            <h2 className="font-serif text-xl sm:text-3xl text-white font-light tracking-wide drop-shadow-md">
              Sanctuary of Wood, Marble & Warm Gold
            </h2>
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl space-y-6 mb-16 sm:mb-24 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-gold/50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
              Bespoke Sanctums
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-wide">
            Rooms & Suites
          </h1>
          <p className="max-w-xl text-sm sm:text-base text-neutral-500 font-sans font-light leading-relaxed tracking-wide">
            Inspired by classic editorial layouts, each suite is presented as an independent sanctuary of wood, marble, and light. Explore detailed configurations and secure your reservation below.
          </p>
        </div>

        {/* Room Inventory list */}
        <div className="space-y-36">
          {ROOMS_DATA.map((room, idx) => {
            const isEven = idx % 2 === 0;
            const currentIdx = activeImageIndexes[room.id] || 0;
            return (
              <div
                key={room.id}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center",
                  !isEven && "lg:flex-row-reverse"
                )}
              >
                {/* Visual Media Panel (Images Slider / 3D Walkthrough) */}
                <div
                  className={cn(
                    "lg:col-span-7 space-y-4",
                    !isEven && "lg:order-last"
                  )}
                >
                  <div className="relative w-full aspect-[16/10] bg-neutral-900 shadow-lux overflow-hidden group">
                    {active360RoomId === room.id ? (
                      /* Dynamic 360° spherical Canvas */
                      <div className="w-full h-full relative">
                        <ThreeCanvas
                          sceneName={`${room.name} 360° Panorama`}
                          fallbackImage={room.imageUrl}
                        >
                          <div className="absolute inset-0 bg-neutral-900/95 flex flex-col items-center justify-center text-center p-6 space-y-4">
                            <span className="text-[9px] uppercase tracking-widest text-gold font-bold">
                              360° VR Active
                            </span>
                            <h4 className="font-serif text-lg text-white">Interactive 3D View</h4>
                            <p className="text-xs text-neutral-400 max-w-sm">
                              Rotate camera angles dynamically using drag gestures.
                            </p>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setActive360RoomId(null)}
                              className="text-[9px] tracking-widest font-semibold border-white/20 hover:bg-white hover:text-black"
                            >
                              Exit 360° Mode
                            </Button>
                          </div>
                        </ThreeCanvas>
                      </div>
                    ) : (
                      /* Image Slider with Smooth Navigation Controls */
                      <div className="relative w-full h-full overflow-hidden group/slider">
                        <Image
                          src={room.images[currentIdx]}
                          alt={room.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover transition-all duration-700 ease-in-out group-hover/slider:scale-105"
                          priority={idx === 0}
                        />
                        <div className="absolute inset-0 bg-black/15 transition-opacity duration-500 group-hover/slider:bg-black/20" />
                        
                        {/* Navigation Arrows */}
                        {room.images.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const prevIdx = (currentIdx - 1 + room.images.length) % room.images.length;
                                setActiveImageIndexes(prev => ({ ...prev, [room.id]: prevIdx }));
                              }}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-gold/90 border border-white/10 flex items-center justify-center text-white text-sm cursor-pointer transition-all opacity-0 group-hover/slider:opacity-100 duration-300 z-10"
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextIdx = (currentIdx + 1) % room.images.length;
                                setActiveImageIndexes(prev => ({ ...prev, [room.id]: nextIdx }));
                              }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-gold/90 border border-white/10 flex items-center justify-center text-white text-sm cursor-pointer transition-all opacity-0 group-hover/slider:opacity-100 duration-300 z-10"
                            >
                              →
                            </button>
                          </>
                        )}

                        {/* Image Counter indicator */}
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm border border-white/10 px-3 py-1 rounded text-[9px] uppercase tracking-wider text-[#DFBA73] font-bold z-10 select-none">
                          {currentIdx + 1} / {room.images.length}
                        </div>

                        {/* Image Controls overlays */}
                        <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-auto flex flex-wrap gap-2 sm:gap-4 z-10">
                          <button
                            onClick={() => setFullscreenImage(room.images[currentIdx])}
                            className="bg-black/70 backdrop-blur-md border border-white/10 hover:bg-gold/90 hover:border-transparent text-white text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold px-3 py-1.5 sm:px-4 sm:py-2 transition-all duration-300 cursor-pointer rounded-sm"
                          >
                            Fullscreen
                          </button>
                          <button
                            onClick={() => setActive360RoomId(room.id)}
                            className="bg-black/70 backdrop-blur-md border border-white/10 hover:bg-gold/90 hover:border-transparent text-white text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold px-3 py-1.5 sm:px-4 sm:py-2 transition-all duration-300 cursor-pointer rounded-sm"
                          >
                            360° Virtual View
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Narrative Specification details */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex justify-between items-baseline border-b border-gold/15 pb-4">
                    <h2 className="font-serif text-2xl sm:text-4xl font-light text-foreground">
                      {room.name}
                    </h2>
                    <span className="font-serif text-lg text-gold font-medium">
                      {room.price.split(" /")[0]}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
                    {room.description}
                  </p>

                  {/* Room parameters grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-sans border-b border-gold/15 pb-6">
                    <div>
                      <span className="text-neutral-400 block mb-1">Dimensions</span>
                      <span className="font-medium text-foreground">{room.size}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-1">Occupancy</span>
                      <span className="font-medium text-foreground">{room.occupancy}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-1">Bed Configuration</span>
                      <span className="font-medium text-foreground">{room.bedType}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-1">View Parameters</span>
                      <span className="font-medium text-foreground">{room.view}</span>
                    </div>
                  </div>

                  {/* Amenities highlights */}
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-bold">
                      Room Amenities
                    </span>
                    <ul className="grid grid-cols-2 gap-2 text-xs text-neutral-500 font-sans font-light">
                      {room.amenities.map((amenity, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-[7px] text-gold">◆</span>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>

                    {/* CTAs */}
                    <div className="pt-6">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => {
                          requireAuth(() => {
                            selectRoomCategory(room.id);
                            setDrawerOpen(true);
                          });
                        }}
                        className="w-full text-xs font-semibold py-4 uppercase tracking-widest"
                      >
                        Reserve Room
                      </Button>
                    </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Location Highlights & Stay Checklist */}
        <LocationAndTrust />
      </div>

      {/* Embedded Booking Hub at bottom */}
      <div id="contact" className="border-t border-white/5 bg-[#0A0C10] pt-24 mt-36">
        <div className="max-w-4xl mx-auto px-6 pb-24">
          <div className="text-center space-y-4 mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A97E] font-bold">Instant Reservation</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white">Secure Your Room Stay</h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Confirm your dates and guest information below. Our reservation desk will validate availability instantly.
            </p>
          </div>
          <BookingHub />
        </div>
      </div>

      {/* Fullscreen Image Overlay dialog */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 transition-all duration-500 ease-expo-out cursor-zoom-out"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
            <Image
              src={fullscreenImage}
              alt="Fullscreen Room Detail View"
              fill
              className="object-contain"
            />
          </div>
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-6 right-6 text-white uppercase text-[10px] tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors"
          >
            Close Viewer [Esc]
          </button>
        </div>
      )}
    </section>
  );
}

import React from "react";
import { Room } from "@/data/rooms";
import { RoomGallery } from "./RoomGallery";
import { RoomBadge } from "./RoomBadge";
import { Layers, Users, BedDouble, Check, Wifi, Wind, Tv, Bath, Clock, Car, MapPin, Home, Utensils, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface RoomCardProps {
  room: Room;
  onBook: (id: string) => void;
  idx: number;
}

// Map amenity strings to their corresponding Lucide icons for high-contrast representations
const AMENITY_ICONS: Record<string, any> = {
  "Highway View": { icon: MapPin, label: "Highway View" },
  "Attached Balcony": { icon: Home, label: "Balcony" },
  "24×7 High-Speed Wi-Fi": { icon: Wifi, label: "24x7 Wi-Fi" },
  "24×7 Room Service": { icon: Clock, label: "Room Service" },
  "Direct Food Ordering from HOTEL YASH GRAND Restaurant": { icon: Utensils, label: "Food Delivery" },
  "LED Smart TV": { icon: Tv, label: "LED TV" },
  "Air Conditioner": { icon: Wind, label: "A/C" },
  "Premium Washroom": { icon: Bath, label: "Washroom" },
  "Daily Housekeeping": { icon: Sparkles, label: "Housekeeping" },
  "Fresh Linen": { icon: Layers, label: "Fresh Linen" },
  "Two Connected Rooms": { icon: Layers, label: "2 Connected Rooms" }
};

export function RoomCard({ room, onBook, idx }: RoomCardProps) {
  const handleScrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] as const }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col justify-between border border-white/5 bg-[#14161C]/60 rounded-xl overflow-hidden shadow-lux hover:border-[#DFBA73]/25 transition-all duration-500 p-4 select-none"
    >
      <div className="space-y-6">
        {/* 1. Image slideshow gallery component with luxury badge overlay */}
        <div className="relative rounded-lg overflow-hidden">
          <RoomGallery images={room.images} name={room.name} />
          {room.badge && (
            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-black/85 backdrop-blur-sm border border-gold/30 text-[9px] uppercase tracking-widest text-[#DFBA73] font-bold rounded">
              {room.badge}
            </div>
          )}
        </div>

        {/* 2. Room Metadata Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          <RoomBadge icon={Layers} label={room.size} />
          <RoomBadge icon={Users} label={`Max: ${room.capacity} Guests`} />
          <RoomBadge icon={BedDouble} label={room.bedType} />
        </div>

        {/* 3. Room Details Stack */}
        <div className="space-y-3 px-1.5">
          <div className="flex justify-between items-baseline gap-4">
            <h3 className="font-serif text-2xl font-medium text-white group-hover:text-[#DFBA73] transition-colors duration-300">
              {room.name}
            </h3>
            
            {/* Price section */}
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-semibold">
                Per Night
              </span>
              <span className="font-serif text-xl text-[#DFBA73] font-medium block">
                ₹{room.price.toLocaleString("en-IN")}
                <span className="text-[9px] text-neutral-500 font-sans tracking-wide block font-light mt-0.5">/ night</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed font-sans font-light line-clamp-3 select-text">
            {room.description}
          </p>
        </div>

        {/* 4. Feature List details */}
        <div className="border-t border-white/5 pt-4 px-1.5 space-y-2.5">
          <span className="text-[8.5px] uppercase tracking-[0.25em] text-[#C8A97E] font-bold block">
            Stay Highlight Features
          </span>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-400 font-sans font-light">
            <div className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-gold shrink-0" />
              <span>Attached Balcony</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-gold shrink-0" />
              <span>Highway View</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-gold shrink-0" />
              <span>24/7 Room Service</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-gold shrink-0" />
              <span>Daily Housekeeping</span>
            </div>
          </div>
        </div>

        {/* 5. In-room Premium Amenities Grid (represented as icons) */}
        <div className="border-t border-white/5 pt-4 px-1.5 space-y-2.5">
          <span className="text-[8.5px] uppercase tracking-[0.25em] text-[#C8A97E] font-bold block">
            Included Comforts
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-2.5 pt-1">
            {room.amenities.map((amenity, k) => {
              const cfg = AMENITY_ICONS[amenity];
              if (!cfg) return null;
              const AmenityIcon = cfg.icon;
              return (
                <div key={k} className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors duration-300 cursor-help" title={amenity}>
                  <AmenityIcon className="h-3.5 w-3.5 text-gold/60" />
                  <span className="text-[8px] uppercase tracking-wider font-semibold font-sans">{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Action Booking Buttons */}
      <div className="pt-6 mt-6 border-t border-white/5 flex px-1 pb-1 font-buttons">
        <button
          onClick={handleScrollToContact}
          className="w-full text-center text-[9.5px] uppercase tracking-widest font-bold py-4 bg-[#DFBA73] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white transition-all duration-500 rounded-sm cursor-pointer shadow-md"
        >
          Reserve Room
        </button>
      </div>
    </motion.div>
  );
}

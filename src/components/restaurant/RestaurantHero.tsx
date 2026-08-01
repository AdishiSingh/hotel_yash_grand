import React, { useState, useEffect, useRef } from "react";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function RestaurantHero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setIsVideoLoaded(true);
    }
  }, []);

  return (
    <div className="relative w-full h-[65vh] min-h-[480px] overflow-hidden select-none border-b border-white/5 flex items-center justify-center text-center">
      {/* 1. Poster Fallback Image */}
      <img
        src={ASSET_MANIFEST.restaurant.diningSeatingOverview}
        alt="The Yash Grand Dining Interior Seating"
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out z-0",
          isVideoLoaded ? "opacity-0" : "opacity-100"
        )}
      />

      {/* 2. Autoplay Loop Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        onCanPlayThrough={() => setIsVideoLoaded(true)}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out scale-100 z-0",
          isVideoLoaded ? "opacity-45" : "opacity-0"
        )}
        preload="auto"
      >
        <source src={ASSET_MANIFEST.videos.diningTables} type="video/mp4" />
      </video>

      {/* 3. Dark Luxury Overlay & Shading */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/60 to-neutral-950 z-[1]" />
      
      {/* 4. Content card info */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            SIGNATURE DINING EXPERIENCE
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-6xl font-light text-white leading-tight"
        >
          Authentic Flavours. <br />
          <span className="italic font-light text-gold font-serif">Elegant Dining.</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-xs sm:text-sm text-neutral-300 font-sans font-light leading-relaxed tracking-wide"
        >
          Experience freshly prepared Veg & Non-Veg culinary signatures, multi-cuisine Awadhi heritage recipes, a comfortable air-conditioned ambience, and the warm, professional hospitality of HOTEL YASH GRAND.
        </motion.p>
      </div>
    </div>
  );
}

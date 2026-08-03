"use client";

import * as React from "react";
import Image from "next/image";
import { GALLERY_ITEMS } from "@/data/gallery";
import { Sparkles, ArrowRight } from "lucide-react";
import { InstagramIcon } from "@/shared/components/icons/InstagramIcon";
import { motion } from "framer-motion";

export function GalleryGrid() {
  const homePhotos = React.useMemo(() => {
    return GALLERY_ITEMS.filter((item) => item.mediaType === "image").slice(0, 4);
  }, []);

  return (
    <section className="relative w-full py-28 sm:py-36 bg-[#0F1115] text-[#F8F8F8] overflow-hidden border-t border-white/5">
      
      {/* Mesh grid backgrounds */}
      <div className="absolute inset-0 bg-grid-mesh pointer-events-none opacity-[0.04]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16 select-none">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold">
              06 // The Visual Chronicles
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-light">
            Behind the Scenes
          </h2>
          <p className="max-w-md text-xs sm:text-sm text-[#A9A9A9] font-sans font-light leading-relaxed tracking-wide pt-1">
            See the rigorous standards of hygiene in our modern kitchen and the quiet depth of our corridors.
          </p>
        </div>

        {/* Touch-Friendly Mobile Swipeable Carousel / Desktop Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 pb-4 sm:pb-0 scrollbar-none -mx-6 px-6 sm:mx-0 sm:px-0">
          {homePhotos.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="flex-shrink-0 w-[80vw] sm:w-auto snap-center overflow-hidden aspect-[4/5] bg-[#171A21]/50 group relative z-10 shadow-lux border border-white/5 p-2 rounded-xl hover:border-gold/25 transition-all duration-500 cursor-pointer"
            >
              <div className="relative w-full h-full overflow-hidden rounded-lg bg-neutral-900">
                <Image
                  src={img.image}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[3000ms] ease-expo-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gallery redirect link */}
        <div className="flex justify-center pt-4 font-buttons">
          <a
            href="/gallery"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-white hover:text-gold transition-colors duration-300 group cursor-pointer"
          >
            <span>Explore Full Property Gallery</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Luxury Instagram Editorial CTA Banner */}
        <div className="pt-8 border-t border-white/5 flex flex-col items-center justify-center text-center space-y-2 select-text">
          <p className="text-xs text-neutral-400 font-sans font-light tracking-wide">
            Discover more moments from HOTEL YASH GRAND.
          </p>
          <a
            href="https://www.instagram.com/yash_grand_?igsh=dXNtcjNwcmpwNThy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit HOTEL YASH GRAND on Instagram"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-medium text-gold hover:text-white transition-all duration-[250ms] hover:-translate-y-0.5 cursor-pointer py-2 px-4 rounded-sm min-h-[44px]"
          >
            <InstagramIcon className="h-4 w-4 text-gold shrink-0" />
            <span>Follow our journey on Instagram →</span>
          </a>
        </div>

      </div>
    </section>
  );
}

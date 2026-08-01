import React from "react";
import Image from "next/image";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AboutStory() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
      {/* Left Side: Large Portrait Visual */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-6 relative group"
      >
        <div className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden border border-gold/15 p-2 bg-[#171A21]/30 rounded-sm shadow-lux">
          <div className="relative w-full h-full overflow-hidden rounded-sm">
            <Image
              src={ASSET_MANIFEST.gallery.receptionDesk}
              alt="Hotel Yash Grand Reception Sanctuary"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-105"
            />
            {/* Ambient luxury shading */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
        {/* Floating Tag */}
        <div className="absolute bottom-6 right-6 bg-[#171A21]/95 backdrop-blur-md px-4 py-2 border border-gold/15 text-[8px] uppercase tracking-[0.25em] font-bold text-gold rounded-sm hidden sm:block">
          Reception Sanctuary
        </div>
      </motion.div>

      {/* Right Side: Storytelling Column */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-6 space-y-6 text-center lg:text-left"
      >
        <div className="flex items-center justify-center lg:justify-start gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold">
            01 // Our Identity
          </span>
        </div>

        <div className="space-y-3">
          <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-semibold block">
            Welcome to
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-extralight leading-none tracking-wide text-white">
            HOTEL YASH GRAND
          </h2>
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold font-bold block pt-1">
            Restaurant & Banquet • Near SMS College, Varanasi
          </span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide pt-2 select-text">
          Nestled in the spiritual heartland of Varanasi, Hotel Yash Grand is an enclave of luxury and modern heritage. Conceived as a peaceful sanctuary near SMS College, our spaces pair organic textures with warm, ambient lighting to create a soothing, royal atmosphere. 
        </p>

        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide select-text">
          Whether you are a traveler seeking the mystical ghats of Kashi, a family gathering for fine dining, or a couple orchestrating a dream wedding in our grand ballroom, we ensure every moment is shaped with signature Indian warmth and premium hospitality. Experience a stay defined by bespoke attention, curated culinary craft, and memories that linger long after you depart.
        </p>
      </motion.div>
    </div>
  );
}

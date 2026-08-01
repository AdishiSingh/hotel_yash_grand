import React from "react";
import { motion } from "framer-motion";
import { MapPin, Compass, ShieldCheck, Sparkles } from "lucide-react";

export function LocationHighlights() {
  return (
    <div className="space-y-16 select-none">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold">
            05 // Destination Varanasi
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Location Highlights
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          Ideally located in Kashi, combining peaceful seclusion with simple accessibility.
        </p>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Dynamic Info Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Card 1 */}
          <div className="p-6 border border-white/5 bg-[#14161C]/50 rounded-lg flex gap-4">
            <div className="h-10 w-10 border border-gold/15 rounded-md flex items-center justify-center bg-black text-gold shrink-0">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                Near SMS College
              </h4>
              <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed">
                Positioned close to the School of Management Sciences, Varanasi, creating a peaceful environment far from heavy traffic.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 border border-white/5 bg-[#14161C]/50 rounded-lg flex gap-4">
            <div className="h-10 w-10 border border-gold/15 rounded-md flex items-center justify-center bg-black text-gold shrink-0">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                Easy City & Ghats Access
              </h4>
              <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed">
                Connects directly to the main highway, allowing effortless transit to Vishwanath Temple, the sacred Ganga Ghats, and airports.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 border border-white/5 bg-[#14161C]/50 rounded-lg flex gap-4">
            <div className="h-10 w-10 border border-gold/15 rounded-md flex items-center justify-center bg-black text-gold shrink-0">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                Tourist & Family Friendly
              </h4>
              <p className="text-[11px] text-neutral-400 font-sans font-light leading-relaxed">
                A highly secure, quiet, and comfortable neighborhood, making it the perfect destination for family stays and corporate visits.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Grayscale Interactive Luxury Map Map Frame */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 relative group"
        >
          <div className="relative w-full h-[380px] overflow-hidden border border-gold/15 bg-neutral-950 p-2 rounded-xl shadow-lux">
            <div className="relative w-full h-full overflow-hidden rounded-lg filter grayscale invert contrast-[1.1] opacity-40 hover:opacity-75 transition-all duration-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.8122396349386!2d82.97391781501174!3d25.317645183842998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db7bf0f9d9f%3A0x6b1076b6d51a9e34!2sSchool%20of%20Management%20Sciences!5e0!3m2!1sen!2sin!4v1689325983792!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Yash Grand Map Location"
              />
            </div>
            {/* Ambient luxury cover frame */}
            <div className="absolute inset-0 pointer-events-none border border-gold/10 rounded-xl" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

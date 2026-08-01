import React from "react";
import { Star, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const REVIEWS = [
  {
    name: "Amit Sharma",
    rating: 5,
    text: "Hotel Yash Grand offers excellent room booking packages. The Veg & Non-Veg multi-cuisine food is outstanding and tasted like Taj. Highly recommended for family stays.",
    date: "1 week ago"
  },
  {
    name: "Shreya Verma",
    rating: 5,
    text: "The suites are clean, spacious, and very luxurious. Direct location near SMS college makes it easily accessible. Valet parking is fast and professional.",
    date: "2 weeks ago"
  },
  {
    name: "Dr. Vijay Pathak",
    rating: 5,
    text: "Highly recommended the Awadhi restaurant. Best North Indian food in Varanasi. Clean kitchen prep, air-conditioned rooms, and warm hospitality.",
    date: "1 month ago"
  }
];

export function ReviewSection() {
  return (
    <div className="space-y-12 select-none border-t border-white/5 pt-28">
      {/* Header Metrics */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto border border-white/5 bg-[#14161C]/50 rounded-2xl p-6 md:p-8">
        <div className="text-center md:text-left space-y-1">
          <span className="text-[9px] uppercase tracking-widest text-[#DFBA73] block font-bold">Google Trust Score</span>
          <div className="flex items-baseline gap-2.5 justify-center md:justify-start">
            <span className="font-serif text-4xl sm:text-5xl text-white font-medium">4.8</span>
            <span className="text-neutral-500 font-sans text-xs sm:text-sm">/ 5.0</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 pt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
            ))}
          </div>
        </div>

        <div className="h-[1px] w-full md:h-12 md:w-[1px] bg-white/5" />

        <div className="text-center md:text-left space-y-1">
          <span className="text-[9px] uppercase tracking-widest text-neutral-500 block font-bold">Total Reviews</span>
          <span className="font-serif text-2xl sm:text-3xl text-white font-light block">
            1,240+ Verified Reviews
          </span>
          <span className="text-[9px] text-[#DFBA73] font-sans flex items-center justify-center md:justify-start gap-1 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>100% Genuine Hotel Guests</span>
          </span>
        </div>
      </div>

      {/* Review cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((review, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="p-6 border border-white/5 bg-[#14161C]/50 rounded-xl space-y-4 text-left hover:border-gold/15 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-[11.5px] text-neutral-400 font-sans font-light leading-relaxed select-text italic">
                "{review.text}"
              </p>
            </div>
            
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-sans font-bold">
              <span className="text-white">{review.name}</span>
              <span className="text-neutral-500 uppercase tracking-wider">{review.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

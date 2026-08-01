import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const REVIEWS = [
  {
    author: "Aditya Mishra",
    role: "Bride's Father",
    text: "We hosted our daughter's wedding here. The Grand Ballroom decor was absolutely royal, and the catering was praised by all our 400+ guests. Valet parking was managed very professionally. Unforgettable experience!",
    rating: 5
  },
  {
    author: "Rohan Singhal",
    role: "Regional HR Director",
    text: "Outstanding corporate conference setup in Varanasi! The soundproofing wall boards, wireless lapel mics, high-speed WiFi, and tea service were flawless. The manager kept everything fully coordinated.",
    rating: 5
  },
  {
    author: "Pooja Chawla",
    role: "Anniversary Celebrant",
    text: "The best banquet hall near SMS College. The indoor ballroom is integrated beautifully with the outdoor lawn. Bridal suites were clean, spacious, and fully air-conditioned. Thank you for the warm hospitality!",
    rating: 5
  }
];

export function ReviewCarousel() {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            08 // Guest Testimonials
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          What Our Clients Say
        </h2>
      </div>

      {/* Review Card Slider */}
      <div className="relative max-w-3xl mx-auto px-12">
        {/* Slider arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors z-10"
          aria-label="Previous review"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors z-10"
          aria-label="Next review"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Active review container */}
        <div className="relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className="p-8 border border-white/5 bg-[#14161C]/50 backdrop-blur-sm rounded-xl text-center space-y-6 w-full shadow-md relative overflow-hidden"
            >
              <Quote className="h-10 w-10 text-gold/10 mx-auto" />
              
              <p className="text-sm sm:text-base text-neutral-300 font-serif leading-relaxed italic max-w-xl mx-auto select-text">
                "{REVIEWS[index].text}"
              </p>

              <div className="space-y-2">
                {/* Rating */}
                <div className="flex items-center justify-center gap-1">
                  {[...Array(REVIEWS[index].rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                  ))}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                    {REVIEWS[index].author}
                  </h4>
                  <span className="text-[9px] uppercase tracking-widest text-[#C8A97E] block font-bold mt-0.5">
                    {REVIEWS[index].role}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

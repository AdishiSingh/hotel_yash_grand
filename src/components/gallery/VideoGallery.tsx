import React, { useState } from "react";
import { GALLERY_ITEMS } from "@/data/gallery";
import { Play, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function VideoGallery() {
  const videoItems = React.useMemo(() => {
    return GALLERY_ITEMS.filter((item) => item.mediaType === "video");
  }, []);

  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (videoItems.length === 0) return null;

  return (
    <div className="space-y-16 select-none border-t border-white/5 pt-28">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2.5">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A97E] font-bold font-sans">
            02 // Cinematic Chronicles
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          Property Video Showcases
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans font-light leading-relaxed tracking-wide">
          Experience the motion and life of Hotel Yash Grand through real interior panning videos.
        </p>
      </div>

      {/* Grid of Video Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videoItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            onClick={() => setActiveVideo(item.video || null)}
            className="group relative border border-white/5 bg-[#14161C]/50 rounded-xl overflow-hidden aspect-[16/10] shadow-lux hover:border-gold/25 transition-all duration-500 cursor-pointer p-3"
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg bg-neutral-900 flex items-center justify-center">
              {/* Autoplay silent preview on card hover if possible, else video tag */}
              <video
                src={item.video}
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity duration-500"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="h-12 w-12 border border-[#DFBA73]/30 rounded-full flex items-center justify-center bg-black/80 text-[#DFBA73] group-hover:bg-[#DFBA73] group-hover:text-black group-hover:shadow-[0_0_15px_rgba(223,186,115,0.25)] transition-all duration-500">
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Title tag */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
                <h4 className="font-serif text-sm font-semibold text-white tracking-wide group-hover:text-gold transition-colors duration-300">
                  {item.title}
                </h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Video Player Portal */}
      <AnimatePresence>
        {activeVideo !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setActiveVideo(null)}
          >
            {/* Close controls */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 h-10 w-10 bg-white/5 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer z-[110]"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Video container */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-white/5 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={activeVideo}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

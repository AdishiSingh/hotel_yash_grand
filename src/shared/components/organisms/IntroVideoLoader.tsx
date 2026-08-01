"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntroStore } from "@/shared/store/use-intro-store";
import { ArrowRight, Clock } from "lucide-react";

/**
 * Cinematic Phase-Driven Intro Player
 * Governs the splash -> intro -> homepage layout transition lifecycle,
 * storing session triggers inside sessionStorage.
 */
export function IntroVideoLoader() {
  const { phase, setPhase } = useIntroStore();
  const [showSkip, setShowSkip] = React.useState(false);
  const [hasPulsed, setHasPulsed] = React.useState(false);
  const [showHelperMsg, setShowHelperMsg] = React.useState(false);
  const introVideoRef = React.useRef<HTMLVideoElement>(null);

  // Read session metrics on mount
  React.useEffect(() => {
    const hasPlayed = sessionStorage.getItem("hasPlayedIntro");
    if (hasPlayed === "true") {
      setPhase("landing");
    } else {
      setPhase("intro");
    }
  }, [setPhase]);

  // Lock scroll parameters on viewport during intro playback
  React.useEffect(() => {
    if (phase !== "landing" && phase !== "checking") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  // Reveal skip CTA & timed helper message after 2 seconds
  React.useEffect(() => {
    if (phase === "intro") {
      const timer = setTimeout(() => {
        setShowSkip(true);
        
        // Helper badge for first-time session
        const hasSeenIntroHelper = sessionStorage.getItem("has_seen_intro_helper");
        if (!hasSeenIntroHelper) {
          setShowHelperMsg(true);
          sessionStorage.setItem("has_seen_intro_helper", "true");
          
          // Auto-dismiss helper text after 4 seconds
          setTimeout(() => {
            setShowHelperMsg(false);
          }, 4000);
        }
      }, 2000);

      // Single gentle pulse animation after 3.5 seconds
      const pulseTimer = setTimeout(() => {
        setHasPulsed(true);
      }, 3500);

      return () => {
        clearTimeout(timer);
        clearTimeout(pulseTimer);
      };
    }
  }, [phase]);

  // Save session state and reveal homepage
  const handleComplete = () => {
    sessionStorage.setItem("hasPlayedIntro", "true");
    setPhase("landing");
  };

  if (phase === "landing" || phase === "checking") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 bg-black select-none flex items-center justify-center font-sans"
      >
        {/* Cinematic ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.05)_0%,transparent_70%)] pointer-events-none" />

        {/* Hotel Intro Video Screen */}
        <motion.div
          key="intro-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          <video
            ref={introVideoRef}
            src="/videos/intro.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleComplete}
            onError={handleComplete}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* TOP-RIGHT SKIP INTRO PILL CONTAINER */}
        {showSkip && (
          <div className="absolute top-6 right-6 z-50 flex flex-col items-end gap-2">
            
            {/* HELPER TEXT BADGE */}
            <AnimatePresence>
              {showHelperMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="px-3 py-1.5 bg-[#0F1115]/90 border border-[#C5A880]/40 rounded-lg text-[11px] text-neutral-300 backdrop-blur-md flex items-center gap-1.5 shadow-lux"
                >
                  <Clock className="h-3 w-3 text-[#C5A880]" />
                  <span>Short on time? Skip the intro.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ROUNDED PILL BUTTON */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                hasPulsed
                  ? { opacity: 1, scale: [1, 1.06, 1] }
                  : { opacity: 1, scale: 1 }
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
              onClick={handleComplete}
              className="px-5 py-2.5 rounded-full bg-black/60 border border-[#C5A880]/50 hover:border-[#C5A880] text-white hover:text-[#C5A880] text-xs uppercase tracking-widest font-bold backdrop-blur-md shadow-lux transition-all duration-300 cursor-pointer flex items-center gap-2 min-h-[44px] hover:scale-105 active:scale-95"
              aria-label="Skip cinematic introduction video"
            >
              <span>Skip Intro</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#C5A880]" />
            </motion.button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

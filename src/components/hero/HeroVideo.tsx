import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ASSET_MANIFEST } from "@/shared/lib/asset-manifest";

export function HeroVideo() {
  const { scrollY } = useScroll();
  // Parallax transform on scroll
  const y = useTransform(scrollY, [0, 900], [0, 85]);
  const opacity = useTransform(scrollY, [0, 700], [1, 0.72]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 bg-[#0A0C0F]">
      {/* Cinematic Exterior Photograph with Slow Zoom & Parallax */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <motion.img
          src={ASSET_MANIFEST.hotel.facadeMain}
          alt="Hotel Yash Grand Exterior facade and main entrance signage in Varanasi"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="h-full w-full object-cover object-[center_24%] md:object-[center_20%] xl:object-[center_18%] filter brightness-[1.06] contrast-[1.07] saturate-[1.1] sepia-[0.04]"
        />
      </motion.div>
    </div>
  );
}

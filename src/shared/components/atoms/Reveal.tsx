"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
}

/**
 * Editorial Viewport Reveal Wrapper
 * Triggers a slow, elegant opacity fade-in and subtle upward translation (20px)
 * when sections enter the viewport, matching Aman/Apple smooth transitions.
 */
export function Reveal({ children, width = "100%" }: RevealProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <div ref={ref} style={{ position: "relative", width }} className="w-full">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1], // Expo luxury ease out
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

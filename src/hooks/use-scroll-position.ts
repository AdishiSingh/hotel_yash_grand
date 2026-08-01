"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to track scroll position.
 * Essential for rendering cinematic sticky headers that transitions from transparent to blurred.
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrollPosition;
}

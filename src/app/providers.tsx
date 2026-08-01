"use client";

import * as React from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { BookingGuardProvider } from "@/context/BookingGuardContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHoveringClickable, setIsHoveringClickable] = React.useState(false);

  React.useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", (e) => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(e.scroll / totalScroll);
      }
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      ScrollTrigger.killAll();
    };
  }, [pathname]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer");
      setIsHoveringClickable(!!isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <SessionProvider>
      <BookingGuardProvider>
        {/* Scroll Progress Bar */}
        <div
          className="fixed top-0 left-0 h-[2px] bg-gold z-50 transition-all duration-100 ease-out origin-left"
          style={{ width: `${scrollProgress * 100}%` }}
        />

        {/* Subtle Luxury Custom Cursor */}
        <div
          className={cn(
            "hidden md:block fixed pointer-events-none z-50 h-5 w-5 rounded-full border border-gold/40 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-expo-out",
            isHoveringClickable && "h-8 w-8 bg-gold/10 border-gold"
          )}
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        />

        {children}
      </BookingGuardProvider>
    </SessionProvider>
  );
}

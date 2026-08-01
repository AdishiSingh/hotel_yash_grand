"use client";

import * as React from "react";

interface ThreeCanvasProps {
  sceneName: string;
  fallbackImage: string;
  fallbackAlt?: string;
  children?: React.ReactNode;
}

/**
 * Immersive 3D Canvas Loader Core
 * Handles WebGL availability check, renders high-fidelity image fallback,
 * and lazy-loads heavy Three.js / React Three Fiber contexts to preserve Web Vitals scores.
 */
export function ThreeCanvas({
  sceneName,
  fallbackImage,
  fallbackAlt = "Luxury suite view",
  children,
}: ThreeCanvasProps) {
  const [isWebGLSupported, setIsWebGLSupported] = React.useState<boolean | null>(null);
  const [shouldLoad3D, setShouldLoad3D] = React.useState(false);

  // Check for WebGL capability on client mount
  React.useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const support = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setIsWebGLSupported(support);
    } catch {
      setIsWebGLSupported(false);
    }
  }, []);

  // Simple deferred trigger for Awwwards-style entry reveal
  React.useEffect(() => {
    if (isWebGLSupported) {
      const timer = setTimeout(() => {
        setShouldLoad3D(true);
      }, 800); // 800ms fade-in budget
      return () => clearTimeout(timer);
    }
  }, [isWebGLSupported]);

  // If WebGL is not supported, return high-fidelity fallback image immediately
  if (isWebGLSupported === false) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-neutral-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fallbackImage}
          alt={fallbackAlt}
          className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105"
        />
        <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-white/50 bg-black/40 px-2 py-1">
          Static Render Mode
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {!shouldLoad3D ? (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950 transition-opacity duration-500">
          <div className="text-center space-y-3">
            <div className="h-6 w-6 border border-gold/40 border-t-gold rounded-full animate-spin mx-auto" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold/60">
              Initializing Immersive 3D Space ({sceneName})...
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full animate-fade-in">
          {/* This is where React Three Fiber Canvas components will be mounted */}
          {children}
        </div>
      )}
    </div>
  );
}

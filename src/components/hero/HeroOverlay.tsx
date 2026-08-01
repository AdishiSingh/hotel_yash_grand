import React from "react";
export function HeroOverlay() {
  return (
    <div className="absolute inset-0 z-[1] select-none pointer-events-none overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#0A0C0F]/60 via-[#0A0C0F]/28 to-transparent md:w-[56%]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0C0F]/36 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0C0F]/38 to-transparent" />
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.18)]" />
      <div className="hero-dust hero-dust-one" />
      <div className="hero-dust hero-dust-two" />
      <div className="hero-dust hero-dust-three" />
    </div>
  );
}

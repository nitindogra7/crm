"use client";

import React from "react";

export function HeroBackground() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Top Ambient Charcoal-Emerald Corona */}
      <div
        className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[400px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(52, 211, 153, 0.14) 0%, rgba(16, 185, 129, 0.05) 45%, transparent 70%)",
        }}
      />

      {/* Subtle Mid-Page Emerald Vignette */}
      <div
        className="absolute top-[280px] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[320px] rounded-full blur-[100px] opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.04) 50%, transparent 75%)",
        }}
      />

      {/* Engineering Technical Grid with Radial Mask */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(52, 211, 153, 0.6) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(52, 211, 153, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 65% 55% at 50% 35%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 55% at 50% 35%, black 20%, transparent 75%)",
        }}
      />

      {/* Subtle Hairline Glint Edge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
    </div>
  );
}

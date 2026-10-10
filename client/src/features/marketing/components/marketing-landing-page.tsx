"use client";

import React, { useState, useCallback } from "react";
import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { Marquee } from "./marquee";
import { StatsStrip } from "./stats-strip";
import { BenefitsCross } from "./benefits-cross";
import { HowItWorks } from "./how-it-works";
import { FeaturesGrid } from "./features-grid";
import { TryIt } from "./try-it";
import { CtaBanner } from "./cta-banner";
import { Pricing } from "./pricing";
import { Testimonials } from "./testimonials";
import { Faq } from "./faq";
import { Footer } from "./footer";
import { StickyMobileCta } from "./sticky-mobile-cta";

export function MarketingLandingPage() {
  const [kept, setKept] = useState(0);
  const [blocked, setBlocked] = useState(0);

  const incrementKept = useCallback(() => {
    setKept((prev) => prev + 1);
  }, []);

  const incrementBlocked = useCallback(() => {
    setBlocked((prev) => prev + 1);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-[#f2f2f2] font-sans antialiased selection:bg-white selection:text-black overflow-x-hidden pb-[70px] md:pb-0">
      {/* Component Animation Keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes float { 50% { transform: translateY(-6px); } }
        @keyframes sweep { from { left: -60px; } to { left: 100%; } }
        @keyframes grow { from { transform: scaleX(0.3); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes breathe { 50% { transform: scale(1.06); opacity: 0.4; } }
        @keyframes fadeInChar { from { opacity: 0; filter: blur(6px); } to { opacity: 1; filter: blur(0); } }
      `}</style>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero
          kept={kept}
          blocked={blocked}
          onIncrementKept={incrementKept}
          onIncrementBlocked={incrementBlocked}
        />

        {/* Marquee Ticker */}
        <Marquee />

        {/* Metrics Strip */}
        <StatsStrip />

        {/* Benefits Cross Section */}
        <BenefitsCross />

        {/* How It Works (3 Steps) */}
        <HowItWorks />

        {/* Features Showcase (3D Isometric Scenes) */}
        <FeaturesGrid />

        {/* Interactive Try It Section */}
        <TryIt
          kept={kept}
          blocked={blocked}
          onIncrementKept={incrementKept}
          onIncrementBlocked={incrementBlocked}
        />

        {/* CTA Banner Section */}
        <CtaBanner />

        {/* Pricing Section */}
        <Pricing />

        {/* Testimonials */}
        <Testimonials />

        {/* FAQ Section */}
        <Faq />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile CTA */}
      <StickyMobileCta />
    </div>
  );
}

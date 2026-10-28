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
    <div className="relative min-h-screen bg-[#121212] text-[#f4f4f5] font-sans antialiased selection:bg-white selection:text-black overflow-x-hidden pb-[70px] md:pb-0">
        {/* Deep High-Tech Ambient Depth (Emerald & Mint Green Glow matching Hero) */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Top ambient aura */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1300px] h-[550px] rounded-full blur-[160px] opacity-25"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.18) 0%, rgba(16,185,129,0.10) 40%, transparent 70%)",
            }}
          />
          {/* Mid-page subtle emerald aura */}
          <div
            className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[1100px] h-[600px] rounded-full blur-[180px] opacity-15"
            style={{
              background: "radial-gradient(circle, rgba(52,211,153,0.14) 0%, rgba(16,185,129,0.06) 50%, transparent 75%)",
            }}
          />
          {/* Clean minimal dot texture */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
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
          @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes ambientBreathe {
            0% { opacity: 0.55; }
            50% { opacity: 0.85; }
            100% { opacity: 0.55; }
          }
          @keyframes ambientDrift1 {
            0% { transform: translate(0, 0); opacity: 0.5; }
            50% { transform: translate(15px, -10px); opacity: 0.75; }
            100% { transform: translate(-10px, 10px); opacity: 0.5; }
          }
          @keyframes ambientDrift2 {
            0% { transform: translate(0, 0); opacity: 0.5; }
            50% { transform: translate(-15px, -8px); opacity: 0.75; }
            100% { transform: translate(12px, 8px); opacity: 0.5; }
          }
          @keyframes horizonShimmer {
            0% { transform: translateX(-100%); opacity: 0; }
            25% { opacity: 0.7; }
            50% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          @keyframes sonarPulse {
            0% { transform: scale(0.7); opacity: 0; }
            20% { opacity: 0.55; }
            60% { opacity: 0.2; }
            100% { transform: scale(1.3); opacity: 0; }
          }
          @keyframes btnShine {
            0% { transform: translateX(-100%) skewX(-20deg); }
            100% { transform: translateX(250%) skewX(-20deg); }
          }
          @keyframes meshDrift1 {
            0% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(35px, -30px) scale(1.08); }
            100% { transform: translate(-25px, 20px) scale(0.96); }
          }
          @keyframes meshDrift2 {
            0% { transform: translate(0px, 0px) scale(1); }
            50% { transform: translate(-35px, 25px) scale(1.1); }
            100% { transform: translate(30px, -20px) scale(0.94); }
          }
          @keyframes sweepBeam {
            0% { transform: translateX(-100%); opacity: 0; }
            30% { opacity: 0.6; }
            70% { opacity: 0.6; }
            100% { transform: translateX(100%); opacity: 0; }
          }
          @keyframes flowPacket1 {
            0% { stroke-dashoffset: 480; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes flowPacket2 {
            0% { stroke-dashoffset: 360; }
            100% { stroke-dashoffset: 0; }
          }
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

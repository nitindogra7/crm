"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Icon } from "@/features/marketing/components/icons";
import { AuthFormSkeleton } from "@/shared/components/auth-skeleton";

export interface AuthShellProps {
  mode: "sign-in" | "sign-up";
  children: React.ReactNode;
}

export const clerkAuthAppearance = {
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
    logoPlacement: "none" as const,
    unsafe_disableDevelopmentModeWarnings: true,
  },
  elements: {
    rootBox: "w-full overflow-visible",
    cardBox: "w-full shadow-none border-0 bg-transparent p-0 overflow-visible",
    card: "w-full shadow-none border-0 bg-transparent p-0 overflow-visible",
    header: "text-left mb-4 p-0 block w-full",
    headerTitle:
      "text-2xl sm:text-[26px] font-heading font-semibold text-white tracking-tight leading-tight block",
    headerSubtitle: "text-[13px] text-zinc-400 font-sans mt-1 leading-normal block",
    headerBackLink:
      "inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-2.5 font-medium cursor-pointer",
    headerBackIcon: "w-3.5 h-3.5 text-zinc-400",
    socialButtons: "w-full mb-2.5",
    socialButtonsBlockButton:
      "bg-[#141414] border border-white/[0.09] hover:border-white/[0.18] hover:bg-[#222222] text-white rounded-xl py-2 px-3 text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-2.5 h-[42px] w-full",
    socialButtonsBlockButtonText: "text-zinc-200 font-sans font-medium text-[13px]",
    socialButtonsProviderIcon: "w-4 h-4",
    dividerRow: "my-2.5 relative flex items-center justify-center",
    dividerLine: "bg-white/[0.08] h-[1px] w-full",
    dividerText: "text-[11px] font-sans text-zinc-500 uppercase tracking-wider px-2 bg-[#181818]",
    form: "space-y-2.5 overflow-visible",
    formField: "space-y-1 overflow-visible",
    formFieldLabelRow: "flex items-center justify-between w-full mb-1 px-0.5 overflow-visible",
    formFieldLabel:
      "text-[12px] font-sans font-medium text-zinc-300 inline-flex items-center overflow-visible",
    formFieldAction:
      "text-[11.5px] font-sans text-zinc-400 hover:text-emerald-400 transition-colors whitespace-nowrap overflow-visible",
    formFieldInputGroup:
      "bg-[#141414] border border-white/[0.09] hover:border-white/[0.16] focus-within:border-emerald-500/80 rounded-xl transition-all h-[42px] flex items-center shadow-inner overflow-hidden",
    formFieldInput:
      "bg-transparent border-0 text-white placeholder-zinc-500 text-[13px] px-3.5 py-1.5 transition-all outline-none font-sans w-full h-full shadow-none",
    formButtonPrimary:
      "w-full bg-white hover:bg-zinc-100 text-[#121212] font-medium text-[13px] rounded-xl h-[42px] transition-all shadow-[0_0_16px_rgba(255,255,255,0.08)] active:scale-[0.99] cursor-pointer mt-3 flex items-center justify-center gap-1.5 font-sans",
    footer: "!hidden hidden h-0 w-0 p-0 m-0 overflow-hidden",
    footerAction: "!hidden hidden h-0 w-0 p-0 m-0 overflow-hidden",
    footerPages: "!hidden hidden h-0 w-0 p-0 m-0 overflow-hidden",
    badge: "!hidden hidden h-0 w-0 p-0 m-0 overflow-hidden",
    developmentModeBadge: "!hidden hidden h-0 w-0 p-0 m-0 overflow-hidden",
    formFieldSuccessText: "text-emerald-400 text-xs font-sans mt-0.5",
    formFieldErrorText: "text-rose-400 text-xs font-sans mt-0.5",
    identityPreview:
      "bg-[#141414] border border-white/[0.08] hover:border-white/[0.14] rounded-xl px-3.5 py-2.5 mb-3 flex items-center justify-between shadow-sm transition-all",
    identityPreviewText: "text-zinc-200 font-sans text-xs font-medium",
    identityPreviewEditButton:
      "text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-colors cursor-pointer",
    otpCodeField: "my-3",
    otpCodeFieldInputs: "flex gap-2 justify-center py-1",
    otpCodeFieldInput:
      "w-11 h-12 rounded-xl bg-[#141414] border border-white/[0.12] focus:border-emerald-500/80 text-white text-lg font-mono text-center shadow-inner outline-none",
    internal: "font-sans",
  },
  variables: {
    colorPrimary: "#ffffff",
    colorBackground: "transparent",
    colorInputBackground: "#141414",
    colorInputText: "#ffffff",
    colorText: "#f4f4f5",
    colorTextSecondary: "#a1a1aa",
    colorTextOnPrimaryBackground: "#000000",
    borderRadius: "0.6875rem",
    fontFamily: "var(--font-inter), sans-serif",
  },
};

const SLIDES = [
  {
    tag: "High Velocity",
    title: "Capturing Inbound Leads, Powering Modern Teams",
    subtitle:
      "Zero server setups. Collect, protect, and route form submissions in seconds with a single endpoint.",
  },
  {
    tag: "Sub-15ms Latency",
    title: "Global Serverless Delivery Across 300+ Edge Nodes",
    subtitle:
      "Built-in exponential retry mechanisms, real-time spam quarantine, and automatic zero-config SSL.",
  },
  {
    tag: "Zero Spam",
    title: "Autonomous Anti-Spam & Zero-Knowledge Encryption",
    subtitle:
      "Machine learning honeypot filters, Cloudflare Turnstile verification, and TLS 1.3 payload encryption.",
  },
];

export function AuthShell({ mode, children }: AuthShellProps) {
  const isSignIn = mode === "sign-in";
  const [activeSlide, setActiveSlide] = useState(0);

  // Clerk Auth initialization state for smooth skeleton loading
  const { isLoaded } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setIsReady(true), 80);
      return () => clearTimeout(timer);
    }
    const fallback = setTimeout(() => setIsReady(true), 2500);
    return () => clearTimeout(fallback);
  }, [isLoaded]);

  // Auto-advance showcase slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 h-screen h-[100dvh] w-screen bg-[#121212] text-[#f4f4f5] flex items-center justify-center p-3 sm:p-5 lg:p-6 overflow-hidden overscroll-none selection:bg-white selection:text-black">
      {/* Ambient Radial Lighting in Salenova Emerald / Obsidian theme (matching marketing landing page) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[540px] rounded-full blur-[150px] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(52,211,153,0.18) 0%, rgba(18,18,18,0.92) 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Fixed-Height Modal Card Container: Locked in place, page does not move */}
      <div className="relative z-10 w-full max-w-[1040px] h-[min(650px,calc(100dvh-28px))] rounded-[26px] sm:rounded-[30px] bg-[#181818] border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.85)] p-2.5 sm:p-3.5 md:p-4 overflow-hidden flex flex-col justify-center animate-in fade-in zoom-in-[0.99] duration-200">
        <div className="h-full w-full grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-stretch overflow-hidden">
          
          {/* Left Column: Fixed Visual Showcase Card */}
          <div className="hidden md:flex md:col-span-5 h-full relative rounded-[20px] sm:rounded-[22px] overflow-hidden flex-col justify-between p-6 lg:p-7 border border-white/[0.08] shadow-inner select-none shrink-0">
            {/* Background Image: Obsidian & Emerald Twilight Dunes */}
            <Image
              src="/auth-showcase.jpg"
              alt="Salenova Visual Atmosphere"
              fill
              className="object-cover object-center scale-[1.02]"
              priority
            />

            {/* High-Contrast Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-black/90 pointer-events-none" />

            {/* Top Bar: Brand Logo & Back to Website Link */}
            <div className="relative z-10 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5 group">
                <span className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 inline-grid place-items-center text-white group-hover:scale-105 transition-transform shadow-sm">
                  <Icon name="logo" className="w-4 h-4 text-white" />
                </span>
                <span className="font-heading font-semibold tracking-tight text-[16px] text-white drop-shadow-sm">
                  Salenova
                </span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-[11.5px] font-sans text-white/90 hover:text-white transition-all shadow-sm group"
              >
                <span>Back to website</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Bottom Section: Dynamic Taglines, Carousel Indicators & Security Badge */}
            <div className="relative z-10 space-y-4 pt-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10.5px] font-mono tracking-wide uppercase mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {SLIDES[activeSlide].tag}
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-medium tracking-tight text-white leading-snug drop-shadow-md">
                  {SLIDES[activeSlide].title}
                </h2>
                <p className="text-[12px] text-zinc-300/90 font-sans leading-relaxed max-w-xs drop-shadow-sm line-clamp-2">
                  {SLIDES[activeSlide].subtitle}
                </p>
              </div>

              {/* 3-Dash Indicators */}
              <div className="flex items-center justify-between pt-1 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  {SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                        activeSlide === idx
                          ? "w-7 bg-white shadow-sm"
                          : "w-2 bg-white/35 hover:bg-white/60"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>TLS 1.3 · Turnstile</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The ONLY Scrollable Panel (Page does not move) */}
          <div className="col-span-1 md:col-span-7 h-full flex flex-col overflow-y-auto overflow-x-hidden auth-scroll-panel overscroll-contain px-4 sm:px-8 lg:px-10 py-5 sm:py-6">
            <div className="my-auto w-full max-w-[400px] sm:max-w-[420px] mx-auto px-1 py-3">
              
              {/* Content Container: Shows Form when ready, or Skeleton while loading */}
              <div className="w-full relative overflow-visible">
                {/* Sleek Mode-Aware Skeleton Loading State */}
                {!isReady && (
                  <div className="w-full transition-opacity duration-300">
                    <AuthFormSkeleton mode={mode} />
                  </div>
                )}

                {/* Actual Form Render Target */}
                <div
                  className={`w-full overflow-visible transition-opacity duration-300 ${
                    isReady ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                >
                  {children}
                </div>
              </div>

              {/* Stitched Navigation & Watermark Mask (100% Watermark-Free & Responsive) */}
              <div className="relative z-20 mt-4 pt-1 flex items-center justify-center gap-1.5 text-[13px] font-sans">
                <span className="text-zinc-400">
                  {isSignIn ? "Don't have an account?" : "Already have an account?"}
                </span>
                <Link
                  href={isSignIn ? "/sign-up" : "/sign-in"}
                  className="text-white hover:text-emerald-400 font-medium underline underline-offset-4 transition-colors cursor-pointer"
                >
                  {isSignIn ? "Sign up" : "Sign in"}
                </Link>
              </div>

              {/* Subtle Security & Terms Footer */}
              <p className="mt-4 text-center text-[11px] text-zinc-500 font-sans leading-relaxed">
                Protected by 256-bit encryption. By continuing, you agree to Salenova&apos;s{" "}
                <Link href="/" className="text-zinc-400 hover:text-white underline underline-offset-2 transition-colors">
                  Terms
                </Link>{" "}
                &{" "}
                <Link href="/" className="text-zinc-400 hover:text-white underline underline-offset-2 transition-colors">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


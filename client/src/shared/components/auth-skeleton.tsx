import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Icon } from "@/features/marketing/components/icons";

interface AuthFormSkeletonProps {
  mode: "sign-in" | "sign-up";
}

/**
 * Pixel-perfect Skeleton for Clerk Auth Forms.
 * Precisely mirrors Clerk's mode-specific layouts:
 * - sign-in: 1 email field, 1 submit button, Google OAuth button, footer link
 * - sign-up: email + password fields, 1 submit button, Google OAuth button, footer link
 */
export function AuthFormSkeleton({ mode }: AuthFormSkeletonProps) {
  const isSignIn = mode === "sign-in";

  return (
    <div className="w-full space-y-3.5 select-none" aria-busy="true" aria-label="Loading authentication form">
      {/* Step Header Skeleton */}
      <div className="space-y-2 mb-5">
        <div className="h-7 w-44 sm:w-52 rounded-lg bg-white/[0.12] animate-skeleton-shimmer" />
        <div className="h-3.5 w-60 sm:w-72 rounded-md bg-white/[0.06] animate-skeleton-shimmer" />
      </div>

      {/* Social Button Skeleton (Google) */}
      <div className="w-full h-[42px] rounded-xl bg-[#141414] border border-white/[0.08] flex items-center justify-center gap-2.5 shadow-sm">
        <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
        <div className="w-36 h-3 rounded bg-white/15 animate-skeleton-shimmer" />
      </div>

      {/* Divider Skeleton */}
      <div className="my-3 flex items-center justify-center relative">
        <div className="w-full h-[1px] bg-white/[0.08]" />
        <span className="absolute px-2.5 bg-[#181818] text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          or
        </span>
      </div>

      {/* Email Field Skeleton */}
      <div className="space-y-1.5">
        <div className="h-3 w-20 rounded bg-white/[0.12] animate-skeleton-shimmer" />
        <div className="w-full h-[42px] rounded-xl bg-[#141414] border border-white/[0.08] flex items-center px-3.5">
          <div className="w-40 h-2.5 rounded bg-white/[0.07] animate-skeleton-shimmer" />
        </div>
      </div>

      {/* Password Field Skeleton (Rendered on sign-up, omitted on initial sign-in step) */}
      {!isSignIn && (
        <div className="space-y-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 rounded bg-white/[0.12] animate-skeleton-shimmer" />
          </div>
          <div className="w-full h-[42px] rounded-xl bg-[#141414] border border-white/[0.08] flex items-center px-3.5">
            <div className="w-28 h-2.5 rounded bg-white/[0.07] animate-skeleton-shimmer" />
          </div>
        </div>
      )}

      {/* Primary Submit Button Skeleton */}
      <div className="w-full h-[42px] rounded-xl bg-white/[0.14] border border-white/10 mt-3 flex items-center justify-center gap-2 shadow-sm animate-skeleton-shimmer">
        <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-[12px] font-mono text-zinc-300">Connecting securely...</span>
      </div>

      {/* Footer Navigation Link Skeleton */}
      <div className="mt-4 flex items-center justify-center gap-1.5 pt-1">
        <div className="h-3 w-36 rounded bg-white/[0.06] animate-skeleton-shimmer" />
        <div className="h-3 w-12 rounded bg-white/[0.14] animate-skeleton-shimmer" />
      </div>
    </div>
  );
}

/**
 * Full page-level loading state used by Next.js loading.tsx
 * Streams immediately during SSR for instant perceived performance.
 */
export function AuthPageSkeleton({ mode }: AuthFormSkeletonProps) {
  return (
    <div className="fixed inset-0 h-screen h-[100dvh] w-screen bg-[#121212] text-[#f4f4f5] flex items-center justify-center p-3 sm:p-5 lg:p-6 overflow-hidden overscroll-none selection:bg-white selection:text-black">
      {/* Ambient Radial Lighting in Salenova Emerald / Obsidian theme */}
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
            <Image
              src="/auth-showcase.jpg"
              alt="Salenova Visual Atmosphere"
              fill
              className="object-cover object-center scale-[1.02]"
              priority
            />
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

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11.5px] font-sans text-white/90 shadow-sm">
                <span>Back to website</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Bottom Section: Dynamic Taglines & Security Badge */}
            <div className="relative z-10 space-y-4 pt-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10.5px] font-mono tracking-wide uppercase mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  High Velocity
                </div>
                <h2 className="text-lg sm:text-xl font-heading font-medium tracking-tight text-white leading-snug drop-shadow-md">
                  Capturing Inbound Leads, Powering Modern Teams
                </h2>
                <p className="text-[12px] text-zinc-300/90 font-sans leading-relaxed max-w-xs drop-shadow-sm line-clamp-2">
                  Zero server setups. Collect, protect, and route form submissions in seconds with a single endpoint.
                </p>
              </div>

              {/* 3-Dash Indicators & Security Badge */}
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-7 h-1 rounded-full bg-white shadow-sm" />
                  <span className="w-2 h-1 rounded-full bg-white/35" />
                  <span className="w-2 h-1 rounded-full bg-white/35" />
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>TLS 1.3 · Turnstile</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The ONLY Scrollable Panel (Page does not move) */}
          <div className="col-span-1 md:col-span-7 h-full flex flex-col overflow-y-auto overflow-x-hidden auth-scroll-panel overscroll-contain px-4 sm:px-8 lg:px-10 py-5 sm:py-6">
            <div className="my-auto w-full max-w-[400px] sm:max-w-[420px] mx-auto px-1 py-3">
              <AuthFormSkeleton mode={mode} />

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

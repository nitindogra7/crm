import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AuthFormSkeletonProps {
  mode: "sign-in" | "sign-up";
}

/**
 * Pixel-perfect Skeleton for Clerk Auth Forms matching Infraly Landing Page.
 * Precisely mirrors Clerk's mode-specific layouts:
 * - sign-in: 1 email field, 1 submit button, Google OAuth button, footer link
 * - sign-up: email + password fields, 1 submit button, Google OAuth button, footer link
 */
export function AuthFormSkeleton({ mode }: AuthFormSkeletonProps) {
  const isSignIn = mode === "sign-in";

  return (
    <div className="w-full space-y-3 select-none" aria-busy="true" aria-label="Loading authentication form">
      {/* Step Header Skeleton */}
      <div className="space-y-1.5 mb-4">
        <div className="h-7 w-48 sm:w-56 rounded-lg bg-slate-200 animate-skeleton-shimmer" />
        <div className="h-3.5 w-64 sm:w-72 rounded-md bg-slate-100 animate-skeleton-shimmer" />
      </div>

      {/* Social Button Skeleton (Google) */}
      <div className="w-full h-[40px] rounded-xl bg-white border border-slate-200 flex items-center justify-center gap-2.5 shadow-2xs">
        <div className="w-4 h-4 rounded-full bg-slate-200 animate-pulse" />
        <div className="w-36 h-3 rounded bg-slate-200 animate-skeleton-shimmer" />
      </div>

      {/* Divider Skeleton */}
      <div className="my-2.5 flex items-center justify-center relative">
        <div className="w-full h-[1px] bg-slate-200/80" />
        <span className="absolute px-2.5 bg-white text-[10px] font-mono text-slate-400 uppercase tracking-widest font-medium">
          or
        </span>
      </div>

      {/* Email Field Skeleton */}
      <div className="space-y-1">
        <div className="h-3 w-20 rounded bg-slate-200 animate-skeleton-shimmer" />
        <div className="w-full h-[40px] rounded-xl bg-slate-50 border border-slate-200 flex items-center px-3.5">
          <div className="w-40 h-2.5 rounded bg-slate-200 animate-skeleton-shimmer" />
        </div>
      </div>

      {/* Password Field Skeleton (Rendered on sign-up, omitted on initial sign-in step) */}
      {!isSignIn && (
        <div className="space-y-1 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 rounded bg-slate-200 animate-skeleton-shimmer" />
          </div>
          <div className="w-full h-[40px] rounded-xl bg-slate-50 border border-slate-200 flex items-center px-3.5">
            <div className="w-28 h-2.5 rounded bg-slate-200 animate-skeleton-shimmer" />
          </div>
        </div>
      )}

      {/* Primary Submit Button Skeleton */}
      <div className="w-full h-[40px] rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/30 mt-2.5 flex items-center justify-center gap-2 shadow-2xs animate-skeleton-shimmer">
        <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-[12px] font-mono text-blue-700 font-medium">Connecting securely...</span>
      </div>

      {/* Footer Navigation Link Skeleton */}
      <div className="mt-3 flex items-center justify-center gap-1.5 pt-1">
        <div className="h-3 w-36 rounded bg-slate-200 animate-skeleton-shimmer" />
        <div className="h-3 w-12 rounded bg-blue-200 animate-skeleton-shimmer" />
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
    <div className="fixed inset-0 h-screen h-[100dvh] w-screen overflow-hidden overscroll-none bg-white text-slate-900 flex flex-col md:flex-row selection:bg-blue-500/20 selection:text-blue-900">
      
      {/* Left Column (50% Width, 100vh Height): Full Screen Photo */}
      <div className="hidden md:block md:w-1/2 h-full relative overflow-hidden select-none shrink-0 bg-slate-100">
        <Image
          src="/auth-showcase.jpg"
          alt="Infraly Auth Showcase"
          fill
          className="object-cover object-center"
          priority
          sizes="50vw"
        />
      </div>

      {/* Right Column (50% Width, 100vh Height): Non-scrollable Centered Input / Form Box */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center px-6 sm:px-10 lg:px-14 xl:px-16 overflow-hidden bg-white relative auth-scroll-panel selection:bg-blue-500/20">
        {/* Background Top Gradient matching Hero Section */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          {/* Top Only: Left-to-Right Blue to Light Very Light Pink Gradient */}
          <div
            className="absolute top-0 left-0 right-0 h-[360px] sm:h-[400px] pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(186, 218, 255, 0.72) 0%, rgba(206, 227, 255, 0.45) 25%, rgba(242, 237, 254, 0.28) 50%, rgba(253, 230, 244, 0.48) 75%, rgba(252, 216, 236, 0.75) 100%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[400px] sm:max-w-[420px] mx-auto py-2 flex flex-col justify-center">
          
          {/* Brand Logo & Back to Website Navigation */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <Image
                  src="/favicon.ico"
                  alt="Infraly"
                  width={32}
                  height={32}
                  unoptimized
                  className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <span className="font-heading font-bold tracking-tight text-[18px] text-slate-900">
                infraly
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-slate-200/90 text-[12px] font-sans font-medium text-slate-600 hover:text-slate-900 shadow-2xs transition-all"
            >
              <span>Back to website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <AuthFormSkeleton mode={mode} />

          {/* Subtle Security & Terms Footer */}
          <p className="mt-3 text-center text-[11px] text-slate-400 font-sans leading-relaxed">
            Protected by 256-bit encryption. By continuing, you agree to Infraly&apos;s{" "}
            <Link href="/" className="text-slate-600 hover:text-blue-600 underline underline-offset-2 transition-colors">
              Terms
            </Link>{" "}
            &{" "}
            <Link href="/" className="text-slate-600 hover:text-blue-600 underline underline-offset-2 transition-colors">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>

    </div>
  );
}

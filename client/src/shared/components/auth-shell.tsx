"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
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
    header: "text-left mb-3.5 p-0 block w-full",
    headerTitle:
      "text-2xl sm:text-[26px] font-heading font-bold text-slate-900 tracking-tight leading-tight block",
    headerSubtitle: "text-[13px] text-slate-500 font-sans mt-1 leading-normal block",
    headerBackLink:
      "inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-2 font-medium cursor-pointer",
    headerBackIcon: "w-3.5 h-3.5 text-slate-500",
    socialButtons: "w-full mb-2",
    socialButtonsBlockButton:
      "bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl py-2 px-3 text-xs font-medium transition-all shadow-2xs flex items-center justify-center gap-2.5 h-[40px] w-full",
    socialButtonsBlockButtonText: "text-slate-700 font-sans font-medium text-[13px]",
    socialButtonsProviderIcon: "w-4 h-4",
    dividerRow: "my-2 relative flex items-center justify-center",
    dividerLine: "bg-slate-200/80 h-[1px] w-full",
    dividerText: "text-[11px] font-sans text-slate-400 uppercase tracking-wider px-2.5 bg-white font-medium",
    form: "space-y-2 overflow-visible",
    formField: "space-y-1 overflow-visible",
    formFieldLabelRow: "flex items-center justify-between w-full mb-0.5 px-0.5 overflow-visible",
    formFieldLabel:
      "text-[12px] font-sans font-semibold text-slate-700 inline-flex items-center overflow-visible",
    formFieldAction:
      "text-[11.5px] font-sans text-[#2563eb] hover:text-blue-700 transition-colors whitespace-nowrap overflow-visible font-medium",
    formFieldInputGroup:
      "bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-3 focus-within:ring-blue-500/10 rounded-xl transition-all h-[40px] flex items-center shadow-2xs overflow-hidden",
    formFieldInput:
      "bg-transparent border-0 text-slate-900 placeholder:text-slate-400 text-[13px] px-3.5 py-1 transition-all outline-none font-sans w-full h-full shadow-none",
    formButtonPrimary:
      "w-full bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-[13px] rounded-xl h-[40px] transition-all shadow-md shadow-blue-500/25 active:scale-[0.99] cursor-pointer mt-2.5 flex items-center justify-center gap-1.5 font-sans",
    footer: "!hidden hidden h-0 w-0 p-0 m-0 overflow-hidden",
    footerAction: "!hidden hidden h-0 w-0 p-0 m-0 overflow-hidden",
    footerPages: "!hidden hidden h-0 w-0 p-0 m-0 overflow-hidden",
    badge: "!hidden hidden h-0 w-0 p-0 m-0 overflow-hidden",
    developmentModeBadge: "!hidden hidden h-0 w-0 p-0 m-0 overflow-hidden",
    formFieldSuccessText: "text-emerald-600 text-xs font-sans mt-0.5",
    formFieldErrorText: "text-red-500 text-xs font-sans mt-0.5",
    identityPreview:
      "bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 mb-2.5 flex items-center justify-between shadow-2xs transition-all",
    identityPreviewText: "text-slate-800 font-sans text-xs font-semibold",
    identityPreviewEditButton:
      "text-[#2563eb] hover:text-blue-700 text-xs font-semibold transition-colors cursor-pointer",
    otpCodeField: "my-2.5",
    otpCodeFieldInputs: "flex gap-2 justify-center py-1",
    otpCodeFieldInput:
      "w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-3 focus:ring-blue-500/10 text-slate-900 text-lg font-mono text-center shadow-2xs outline-none",
    internal: "font-sans",
  },
  variables: {
    colorPrimary: "#2563eb",
    colorBackground: "transparent",
    colorInputBackground: "#f8fafc",
    colorInputText: "#0f172a",
    colorText: "#0f172a",
    colorTextSecondary: "#64748b",
    colorTextOnPrimaryBackground: "#ffffff",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-inter), sans-serif",
  },
};

export function AuthShell({ mode, children }: AuthShellProps) {
  const isSignIn = mode === "sign-in";

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

          {/* Content Container: Shows Form when ready, or Skeleton while loading */}
          <div className="w-full relative overflow-visible">
            {!isReady && (
              <div className="w-full transition-opacity duration-300">
                <AuthFormSkeleton mode={mode} />
              </div>
            )}

            <div
              className={`w-full overflow-visible transition-opacity duration-300 ${
                isReady ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
              }`}
            >
              {children}
            </div>
          </div>

          {/* Switch Mode Link */}
          <div className="relative z-20 mt-3 pt-1 flex items-center justify-center gap-1.5 text-[13px] font-sans">
            <span className="text-slate-500">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
            </span>
            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="text-[#2563eb] hover:text-blue-700 font-semibold underline underline-offset-4 transition-colors cursor-pointer"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
          </div>

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

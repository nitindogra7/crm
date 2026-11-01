"use client";

import React from "react";
import Link from "@/shared/components/app-link";
import { useAuth } from "@clerk/nextjs";
import { AuthFormSkeleton } from "./auth-skeleton";
import { AuthFrame } from "./auth-frame";

export interface AuthShellProps { mode: "sign-in" | "sign-up"; children: React.ReactNode; }

export const clerkAuthAppearance = {
  options: {
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
      "text-[11.5px] font-sans text-[#303236] hover:text-blue-700 transition-colors whitespace-nowrap overflow-visible font-medium",
    formFieldInputGroup:
      "bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-3 focus-within:ring-blue-500/10 rounded-xl transition-all h-[40px] flex items-center shadow-2xs overflow-hidden",
    formFieldInput:
      "bg-transparent border-0 text-slate-900 placeholder:text-slate-400 text-[13px] px-3.5 py-1 transition-all outline-none font-sans w-full h-full shadow-none",
    formButtonPrimary:
      "w-full bg-[#303236] hover:bg-[var(--ui-action-hover)] text-white font-semibold text-[13px] rounded-xl h-[40px] transition-all shadow-md shadow-blue-500/25 active:scale-[0.99] cursor-pointer mt-2.5 flex items-center justify-center gap-1.5 font-sans",
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
      "text-[#303236] hover:text-blue-700 text-xs font-semibold transition-colors cursor-pointer",
    otpCodeField: "my-2.5",
    otpCodeFieldInputs: "flex gap-2 justify-center py-1",
    otpCodeFieldInput:
      "w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-3 focus:ring-blue-500/10 text-slate-900 text-lg font-mono text-center shadow-2xs outline-none",
    internal: "font-sans",
  },
  variables: {
    colorPrimary: "#303236",
    colorBackground: "transparent",
    colorInput: "#f8fafc",
    colorInputForeground: "#0f172a",
    colorForeground: "#0f172a",
    colorMutedForeground: "#64748b",
    colorPrimaryForeground: "#ffffff",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-inter), sans-serif",
  },
};

export function AuthShell({ mode, children }: AuthShellProps) {
  const { isLoaded } = useAuth();
  const isSignIn = mode === "sign-in";
  return <AuthFrame mode={mode}>
    {!isLoaded && <AuthFormSkeleton mode={mode} />}
    <div hidden={!isLoaded}>{children}</div>
    <p className="mt-6 text-center text-[13px] text-slate-500">{isSignIn ? "Don\u2019t have an account?" : "Already have an account?"}{" "}<Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-medium text-blue-700 underline underline-offset-4">{isSignIn ? "Sign up" : "Sign in"}</Link></p>
  </AuthFrame>;
}

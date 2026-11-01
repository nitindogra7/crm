import React from "react";
import { AuthFrame } from "./auth-frame";

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
      <div className="w-full h-[40px] rounded-xl bg-[var(--ui-action)]/20 border border-slate-300 mt-2.5 flex items-center justify-center gap-2 shadow-2xs animate-skeleton-shimmer">
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


export function AuthPageSkeleton({ mode }: AuthFormSkeletonProps) { return <AuthFrame mode={mode}><AuthFormSkeleton mode={mode} /></AuthFrame>; }

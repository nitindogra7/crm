"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Icon } from "@/features/marketing/components/icons";

interface OnboardingHeaderProps {
  userEmail?: string;
  userName?: string | null;
}

export function OnboardingHeader({
  userEmail,
  userName,
}: OnboardingHeaderProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <header className="w-full border-b border-white/[0.08] bg-[#121212]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 text-white group">
            <span className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 inline-grid place-items-center text-white group-hover:border-zinc-700 transition-colors">
              <Icon name="logo" className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="font-heading font-medium tracking-tight text-[15px] text-white">
              Salenova
            </span>
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-[12px] text-zinc-400 font-sans">
            Workspace Setup
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>api.salenova.com</span>
          </div>

          <div className="flex items-center gap-3">
            {userEmail || userName ? (
              <span className="text-[12px] text-zinc-400 hidden sm:inline font-sans truncate max-w-[180px]">
                {userEmail || userName}
              </span>
            ) : (
              <div className="w-24 h-3 rounded bg-zinc-800 animate-pulse hidden sm:inline-block" />
            )}
            {mounted ? (
              <UserButton />
            ) : (
              <div className="w-7 h-7 rounded-full bg-white/10 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

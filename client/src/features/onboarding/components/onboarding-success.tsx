"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { TeamSize } from "../types";

interface OnboardingSuccessProps {
  activeName: string;
  activeSlug: string;
  teamSize: TeamSize;
  useCase: string;
  onEnterDashboard: () => void;
}

export function OnboardingSuccess({
  activeName,
  activeSlug,
  teamSize,
  useCase,
  onEnterDashboard,
}: OnboardingSuccessProps) {
  return (
    <div className="w-full max-w-lg mx-auto bg-[#181818] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center mx-auto shadow-inner">
        <Check className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
      </div>

      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Ingestion Ready
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-white font-heading">
          Workspace Initialized
        </h1>
        <p className="text-[13px] text-zinc-400 font-sans max-w-sm mx-auto">
          Your workspace <span className="text-white font-medium">&quot;{activeName}&quot;</span> is provisioned. Redirecting to your console...
        </p>
      </div>

      {/* Spec breakdown */}
      <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-4 text-left space-y-2.5">
        <div className="flex items-center justify-between text-[11.5px] font-mono">
          <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Endpoint</span>
          <span className="text-zinc-300 truncate max-w-[220px]">POST /v1/f/{activeSlug}</span>
        </div>
        <div className="flex items-center justify-between text-[11.5px] font-mono">
          <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Scope</span>
          <span className="text-zinc-300 capitalize">{teamSize} · {useCase}</span>
        </div>
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11.5px] font-mono">
          <span className="text-zinc-400">Endpoint Status</span>
          <span className="text-emerald-400 font-medium">Active (Automatic SSL)</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onEnterDashboard}
        className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
      >
        <span>Enter Workspace Dashboard</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

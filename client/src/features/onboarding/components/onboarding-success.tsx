"use client";

import React from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";

interface OnboardingSuccessProps {
  activeName: string;
  onEnterDashboard: () => void;
}

export function OnboardingSuccess({
  activeName,
  onEnterDashboard,
}: OnboardingSuccessProps) {
  return (
    <div className="w-full max-w-[440px] mx-auto bg-white border border-slate-200/90 rounded-2xl p-7 shadow-sm text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
        <Check className="w-7 h-7 stroke-[2.5]" />
      </div>

      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-sans font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ready to go</span>
        </div>
        <h2 className="text-2xl font-heading font-bold tracking-tight text-slate-900">
          Workspace Created!
        </h2>
        <p className="text-[13px] text-slate-500 font-sans max-w-sm mx-auto leading-relaxed">
          Your workspace <span className="text-slate-900 font-semibold">&quot;{activeName}&quot;</span> has been created. Redirecting you to your dashboard...
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-sans text-slate-400 py-1">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
        <span>Loading console...</span>
      </div>

      <button
        type="button"
        onClick={onEnterDashboard}
        className="w-full h-[42px] rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-semibold text-[13px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/25 active:scale-[0.99] font-sans"
      >
        <span>Open Dashboard Now</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

"use client";

import React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import styles from "./onboarding.module.css";
import { USE_CASES, TEAM_SIZES } from "../constants";
import { TeamSize } from "../types";

interface OnboardingFormProps {
  name: string;
  suggestedName: string;
  activeName: string;
  activeSlug: string;
  useCase: string;
  teamSize: TeamSize;
  submitError?: string | null;
  isSubmitting: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectUseCase: (useCaseId: string) => void;
  onSelectTeamSize: (size: TeamSize) => void;
  onSubmit: (e?: React.FormEvent) => void;
}

export function OnboardingForm({
  name,
  suggestedName,
  activeSlug,
  useCase,
  teamSize,
  submitError,
  isSubmitting,
  onNameChange,
  onSelectUseCase,
  onSelectTeamSize,
  onSubmit,
}: OnboardingFormProps) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {/* 1. Workspace Name */}
      <div className="space-y-1">
        <label
          htmlFor="workspace-name"
          className="text-[12.5px] font-sans font-semibold text-slate-700 block"
        >
          Workspace or company name
        </label>
        <div className="bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-3 focus-within:ring-blue-500/10 rounded-xl transition-all h-[42px] flex items-center shadow-2xs overflow-hidden px-3.5">
          <input
            id="workspace-name"
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder={suggestedName}
            autoFocus
            className="bg-transparent border-0 text-slate-900 placeholder:text-slate-400 text-[13.5px] transition-all outline-none font-sans w-full h-full shadow-none"
          />
        </div>
        <p className="text-[11.5px] text-slate-400 font-sans flex flex-wrap items-center gap-1 pt-0.5">
          <span>Your routing handle:</span>
          <span className="text-slate-600 font-medium font-mono break-all">
            infraly.com/w/{activeSlug}
          </span>
        </p>
      </div>

      {/* 2. What describes your work best? */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[12.5px] font-sans font-semibold text-slate-700 block">
          What describes your business best?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {USE_CASES.map((uc) => {
            const isSelected = useCase === uc.id;
            const Icon = uc.icon;
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => onSelectUseCase(uc.id)}
                aria-pressed={isSelected}
                className={`${styles.choice} p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                  isSelected
                    ? "bg-blue-50/80 border-blue-600 text-slate-900 ring-2 ring-blue-500/20 shadow-xs"
                    : "bg-slate-50/60 hover:bg-slate-50 border-slate-200/90 text-slate-700 hover:border-slate-300"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg border shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? "bg-[var(--ui-action)] border-blue-600 text-white"
                      : "bg-white border-slate-200 text-slate-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-[12.5px] font-semibold font-sans leading-tight ${
                      isSelected ? "text-blue-900" : "text-slate-900"
                    }`}
                  >
                    {uc.label}
                  </div>
                  <p className={`${styles.choiceDescription} text-[11px] text-slate-500 font-sans mt-0.5`}>
                    {uc.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Team Size */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[12.5px] font-sans font-semibold text-slate-700 block">
          How many people on your team?
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TEAM_SIZES.map((ts) => {
            const isSelected = teamSize === ts.id;
            return (
              <button
                key={ts.id}
                type="button"
                onClick={() => onSelectTeamSize(ts.id)}
                aria-pressed={isSelected}
                className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[var(--ui-action)] border-blue-600 text-white font-semibold shadow-xs ring-2 ring-blue-500/20"
                    : "bg-slate-50/60 hover:bg-slate-50 border-slate-200/90 text-slate-700 hover:border-slate-300 font-medium"
                }`}
              >
                <div className="text-[12px] font-sans leading-tight">
                  {ts.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div role="alert" className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Submit Action */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[var(--ui-action)] hover:bg-[var(--ui-action-hover)] text-white font-semibold text-[13.5px] rounded-xl h-[42px] transition-all shadow-md shadow-blue-500/25 active:scale-[0.99] cursor-pointer mt-3 flex items-center justify-center gap-2 font-sans disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Setting up your workspace...</span>
          </>
        ) : (
          <>
            <span>Launch Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

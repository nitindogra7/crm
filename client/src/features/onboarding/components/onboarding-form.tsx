"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { WorkspaceDetailsField } from "./workspace-details-field";
import { AvatarTonePicker } from "./avatar-tone-picker";
import { TeamScopePicker } from "./team-scope-picker";
import { UseCasePicker } from "./use-case-picker";
import { TeamSize, AvatarToneOption, SlugAvailabilityStatus } from "../types";

interface OnboardingFormProps {
  name: string;
  suggestedName: string;
  activeName: string;
  activeSlug: string;
  initial: string;
  selectedTone: AvatarToneOption;
  avatarTone: string;
  teamSize: TeamSize;
  useCase: string;
  slugStatus: SlugAvailabilityStatus;
  slugMessage?: string;
  submitError?: string | null;
  isSubmitting: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectTone: (toneId: string) => void;
  onSelectTeamSize: (size: TeamSize) => void;
  onSelectUseCase: (useCaseId: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
}

export function OnboardingForm({
  name,
  suggestedName,
  activeName,
  activeSlug,
  initial,
  selectedTone,
  avatarTone,
  teamSize,
  useCase,
  slugStatus,
  slugMessage,
  submitError,
  isSubmitting,
  onNameChange,
  onSlugChange,
  onSelectTone,
  onSelectTeamSize,
  onSelectUseCase,
  onSubmit,
}: OnboardingFormProps) {
  const isSubmitDisabled =
    isSubmitting ||
    !activeName.trim() ||
    !activeSlug.trim() ||
    slugStatus === "taken" ||
    slugStatus === "invalid" ||
    slugStatus === "checking";

  return (
    <div className="w-full lg:col-span-7 bg-[#181818] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
      <form onSubmit={onSubmit} className="space-y-5">
        <WorkspaceDetailsField
          name={name}
          suggestedName={suggestedName}
          activeSlug={activeSlug}
          initial={initial}
          selectedTone={selectedTone}
          slugStatus={slugStatus}
          slugMessage={slugMessage}
          onNameChange={onNameChange}
          onSlugChange={onSlugChange}
        />

        <AvatarTonePicker
          avatarTone={avatarTone}
          onSelectTone={onSelectTone}
        />

        <TeamScopePicker
          teamSize={teamSize}
          onSelectTeamSize={onSelectTeamSize}
        />

        <UseCasePicker
          useCase={useCase}
          onSelectUseCase={onSelectUseCase}
        />

        {submitError && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Bottom Action Button */}
        <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-black bg-white hover:bg-zinc-200 text-[13px] transition-all cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Creating workspace...</span>
              </>
            ) : (
              <>
                <span>Create Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {slugStatus === "taken" ? (
            <span className="text-[12px] text-rose-400 font-sans text-center sm:text-left">
              Resolve URL handle conflict to proceed
            </span>
          ) : slugStatus === "invalid" ? (
            <span className="text-[12px] text-amber-400 font-sans text-center sm:text-left">
              Enter a valid URL handle to continue
            </span>
          ) : (
            <span className="text-[12px] text-zinc-500 font-sans text-center sm:text-left">
              Press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10.5px] font-mono">
                Enter ↵
              </kbd>{" "}
              to continue
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

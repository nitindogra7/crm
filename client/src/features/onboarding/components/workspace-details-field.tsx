import React from "react";
import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { AvatarToneOption, SlugAvailabilityStatus } from "../types";

interface WorkspaceDetailsFieldProps {
  name: string;
  suggestedName: string;
  activeSlug: string;
  initial: string;
  selectedTone: AvatarToneOption;
  slugStatus: SlugAvailabilityStatus;
  slugMessage?: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function WorkspaceDetailsField({
  name,
  suggestedName,
  activeSlug,
  initial,
  selectedTone,
  slugStatus,
  slugMessage,
  onNameChange,
  onSlugChange,
}: WorkspaceDetailsFieldProps) {
  // Border style helper for slug input
  const getSlugBorderClass = () => {
    switch (slugStatus) {
      case "taken":
        return "border-rose-500/60 focus-within:border-rose-500 ring-1 ring-rose-500/20";
      case "invalid":
        return "border-amber-500/50 focus-within:border-amber-500 ring-1 ring-amber-500/20";
      case "available":
        return "border-emerald-500/40 hover:border-emerald-500/60 focus-within:border-emerald-500/80";
      case "checking":
        return "border-white/[0.12] focus-within:border-zinc-400";
      default:
        return "border-white/[0.08] hover:border-white/[0.16] focus-within:border-emerald-500/80";
    }
  };

  return (
    <>
      {/* 1. Workspace Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="workspace-name"
          className="block text-[12px] font-sans font-medium text-zinc-300"
        >
          Workspace name
        </label>
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 text-[16px] font-heading font-medium transition-all ${selectedTone.bg} ${selectedTone.border} ${selectedTone.text}`}
          >
            {initial}
          </div>

          <input
            id="workspace-name"
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder={suggestedName}
            autoFocus
            className="flex-1 px-3.5 py-2.5 bg-[#141414] border border-white/[0.08] hover:border-white/[0.16] focus:border-emerald-500/80 rounded-xl text-white placeholder-zinc-600 text-[14px] focus:outline-none transition-all font-sans"
          />
        </div>
      </div>

      {/* 2. Workspace URL Handle */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="workspace-slug"
            className="block text-[12px] font-sans font-medium text-zinc-300"
          >
            Workspace URL handle
          </label>
          <span className="text-[11px] font-mono text-zinc-500">
            Public routing ID
          </span>
        </div>

        <div
          className={`flex items-center rounded-xl bg-[#141414] border transition-all overflow-hidden ${getSlugBorderClass()}`}
        >
          <span className="px-3.5 py-2.5 text-[12.5px] font-mono text-zinc-500 bg-[#181818] border-r border-white/[0.08] select-none">
            salenova.com/w/
          </span>
          <input
            id="workspace-slug"
            type="text"
            value={activeSlug}
            onChange={onSlugChange}
            placeholder="acme-studio"
            className="flex-1 px-3.5 py-2.5 bg-transparent text-white placeholder-zinc-600 text-[13px] font-mono focus:outline-none"
          />

          {/* Dynamic Slug Availability Badge */}
          <div className="pr-3.5 flex items-center gap-1.5 select-none transition-all">
            {slugStatus === "checking" && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[2]" />
                <span>Checking...</span>
              </div>
            )}
            {slugStatus === "available" && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-medium">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Available</span>
              </div>
            )}
            {slugStatus === "taken" && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-400 font-medium">
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Already taken</span>
              </div>
            )}
            {slugStatus === "invalid" && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 stroke-[2]" />
                <span>Invalid</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Helper Text / Error Hint */}
        {slugStatus === "taken" && (
          <p className="text-[11.5px] font-sans text-rose-400/90 flex items-center gap-1.5 pt-0.5">
            <span>&bull;</span>
            <span>
              This URL handle is already claimed. Try modifying your workspace name or adding numbers.
            </span>
          </p>
        )}
        {slugStatus === "invalid" && (
          <p className="text-[11.5px] font-sans text-amber-400/90 flex items-center gap-1.5 pt-0.5">
            <span>&bull;</span>
            <span>
              {slugMessage ||
                "Handles must contain only lowercase letters, numbers, and single hyphens."}
            </span>
          </p>
        )}
        {slugStatus === "available" && (
          <p className="text-[11px] font-sans text-zinc-500 pt-0.5">
            Your public form endpoint will route via{" "}
            <span className="font-mono text-zinc-400">
              https://api.salenova.com/v1/f/{activeSlug}
            </span>
          </p>
        )}
      </div>
    </>
  );
}

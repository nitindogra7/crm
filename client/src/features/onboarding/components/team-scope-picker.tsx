import React from "react";
import { Users, User } from "lucide-react";
import { TeamSize } from "../types";

interface TeamScopePickerProps {
  teamSize: TeamSize;
  onSelectTeamSize: (size: TeamSize) => void;
}

export function TeamScopePicker({
  teamSize,
  onSelectTeamSize,
}: TeamScopePickerProps) {
  return (
    <div className="space-y-1.5 pt-1">
      <label className="block text-[12px] font-sans font-medium text-zinc-300">
        How will you use Salenova?
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelectTeamSize("team")}
          className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
            teamSize === "team"
              ? "bg-zinc-800/80 border-zinc-600 text-white shadow-sm"
              : "bg-[#141414] border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200"
          }`}
        >
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 mt-0.5">
            <Users className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[13px] font-medium text-white font-sans">
              With a team
            </div>
            <p className="text-[11.5px] text-zinc-400 font-sans leading-relaxed">
              Shared forms, team access controls, and collaborative webhook dispatch.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectTeamSize("solo")}
          className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
            teamSize === "solo"
              ? "bg-zinc-800/80 border-zinc-600 text-white shadow-sm"
              : "bg-[#141414] border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200"
          }`}
        >
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 mt-0.5">
            <User className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[13px] font-medium text-white font-sans">
              Solo developer
            </div>
            <p className="text-[11.5px] text-zinc-400 font-sans leading-relaxed">
              Streamlined single-operator flow for personal websites and apps.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

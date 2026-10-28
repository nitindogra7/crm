import React from "react";
import { AVATAR_TONES } from "../constants";

interface AvatarTonePickerProps {
  avatarTone: string;
  onSelectTone: (toneId: string) => void;
}

export function AvatarTonePicker({
  avatarTone,
  onSelectTone,
}: AvatarTonePickerProps) {
  return (
    <div className="space-y-1.5 pt-0.5">
      <label className="block text-[12px] font-sans font-medium text-zinc-300">
        Avatar tone
      </label>
      <div className="flex items-center gap-2">
        {AVATAR_TONES.map((tone) => (
          <button
            key={tone.id}
            type="button"
            onClick={() => onSelectTone(tone.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-sans transition-all cursor-pointer ${
              avatarTone === tone.id
                ? "bg-zinc-800 border-zinc-600 text-white shadow-sm"
                : "bg-[#141414] border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full border ${tone.bg} ${tone.border}`}
            />
            <span className="capitalize">{tone.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

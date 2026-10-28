import React from "react";
import { USE_CASES } from "../constants";

interface UseCasePickerProps {
  useCase: string;
  onSelectUseCase: (useCaseId: string) => void;
}

export function UseCasePicker({
  useCase,
  onSelectUseCase,
}: UseCasePickerProps) {
  return (
    <div className="space-y-1.5 pt-1">
      <label className="block text-[12px] font-sans font-medium text-zinc-300">
        Primary use case
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {USE_CASES.map((uc) => {
          const IconComp = uc.icon;
          const isSelected = useCase === uc.id;
          return (
            <button
              key={uc.id}
              type="button"
              onClick={() => onSelectUseCase(uc.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 cursor-pointer ${
                isSelected
                  ? "bg-zinc-800/90 border-zinc-500 text-white shadow-sm"
                  : "bg-[#141414] border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200"
              }`}
            >
              <IconComp className="w-4 h-4 text-zinc-300" />
              <span className="text-[12px] font-medium font-sans truncate w-full">
                {uc.label.split(" & ")[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

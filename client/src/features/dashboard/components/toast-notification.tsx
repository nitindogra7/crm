"use client";

import React from "react";
import { useDashboard } from "../context/dashboard-context";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastNotificationContainer() {
  const { toasts, removeToast } = useDashboard();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.variant === "success" || !toast.variant;
        const isError = toast.variant === "error";

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border border-white/[0.12] bg-[#181818]/95 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] text-white text-xs transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex-none pt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-zinc-100 text-[12.5px] leading-snug">{toast.title}</p>
              {toast.description && (
                <p className="text-zinc-400 text-[11.5px] mt-0.5 leading-normal text-pretty">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="flex-none text-zinc-500 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

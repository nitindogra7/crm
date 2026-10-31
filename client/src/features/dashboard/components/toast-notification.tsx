"use client";

import React from "react";
import { useDashboard } from "../context/dashboard-context";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastNotificationContainer() {
  const { toasts, removeToast } = useDashboard(["toasts","removeToast"]);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2.5 sm:max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.variant === "success" || !toast.variant;
        const isError = toast.variant === "error";

        return (
          <div
            key={toast.id}
            role={isError ? "alert" : "status"}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.1)] text-slate-900 text-xs transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex-none pt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-600" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-[12.5px] leading-snug">{toast.title}</p>
              {toast.description && (
                <p className="text-slate-500 text-[11.5px] mt-0.5 leading-normal text-pretty">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="flex-none text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
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

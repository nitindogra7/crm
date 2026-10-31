"use client";

import React, { useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import { AlertTriangle, Globe, ArrowRight, Check, Loader2 } from "lucide-react";

export function ProductionOriginBanner() {
  const { currentEnvironment, workspace, updateProductionOriginAsync } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [originInput, setOriginInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Only display when in production mode and no origin is set
  if (currentEnvironment !== "production" || workspace?.productionOrigin) {
    return null;
  }

  const handleSaveOrigin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originInput.trim() || isSaving) return;

    let clean = originInput.trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }

    setIsSaving(true);
    try {
      await updateProductionOriginAsync(clean);
      setIsEditing(false);
      setOriginInput("");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-amber-50/70 to-orange-50/60 p-4 shadow-sm text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 font-heading">
              Production Origin Required for Live Ingestion
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              In Production mode, your backend verifies and injects CORS headers matching your production origin. Submissions from unauthorized domains will be rejected with HTTP 403.
            </p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveOrigin} className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="https://mycompany.com"
                value={originInput}
                onChange={(e) => setOriginInput(e.target.value)}
                autoFocus
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 sm:w-64"
              />
            </div>
            <button
              type="submit"
              disabled={isSaving || !originInput.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-colors shrink-0 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            Set Production Origin
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

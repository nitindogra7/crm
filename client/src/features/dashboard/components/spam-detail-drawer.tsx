"use client";

import { DialogLayer } from "@/shared/components/dialog-layer";
import React, { useEffect, useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import {
  X,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  FileCode,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";

export function SpamDetailDrawer() {
  const { spam, selectedSpamId, setSelectedSpamId, rescueSpamLeadAsync, addToast } = useDashboard(["spam","selectedSpamId","setSelectedSpamId","rescueSpamLeadAsync","addToast"]);
  const [isRescuing, setIsRescuing] = useState(false);

  const item = spam.find((s) => s.id === selectedSpamId);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedSpamId(null);
      }
    }
    if (selectedSpamId) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedSpamId, setSelectedSpamId]);

  if (!item) return null;

  const handleRescue = async () => {
    if (isRescuing) return;
    setIsRescuing(true);
    try {
      await rescueSpamLeadAsync(item.id);
      addToast("Lead rescued", "Submission moved to active Leads.");
      setSelectedSpamId(null);
    } catch {
      addToast("Error", "Failed to rescue spam record", "error");
    } finally {
      setIsRescuing(false);
    }
  };

  return (
    <DialogLayer label="Spam submission details" onClose={() => setSelectedSpamId(null)} className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setSelectedSpamId(null)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-lg bg-white border-l border-slate-200 text-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {item.environment && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      item.environment === "production"
                        ? "bg-purple-50 text-purple-700 border border-purple-200/80"
                        : "bg-amber-50 text-amber-700 border border-amber-200/80"
                    }`}
                  >
                    {item.environment === "production" ? "PROD" : "DEV"}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${
                    item.disposition === "Quarantined"
                      ? "bg-amber-50 text-amber-700 border-amber-200/80"
                      : "bg-rose-50 text-rose-700 border-rose-200/80"
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {item.disposition}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  ID: {item.id}
                </span>
              </div>
              <h2 className="text-xl font-heading font-bold tracking-tight text-slate-900 truncate">
                {item.senderName}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-mono">{item.senderEmail}</p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedSpamId(null)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-none"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Rescue Action Toolbar */}
          <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center justify-between gap-3">
            <div className="text-[11.5px] text-slate-500">
              False positive? Move this submission back to your active Leads.
            </div>
            <button
              type="button"
              onClick={handleRescue}
              disabled={isRescuing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer whitespace-nowrap flex-none disabled:opacity-70"
            >
              {isRescuing ? (
                <span className="sr-only">Working</span>
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>{isRescuing ? "Rescuing..." : "Rescue Lead"}</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs bg-slate-50/40">
            {/* Triggered Rule & Reason */}
            <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/70 space-y-1.5 text-amber-900 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 text-xs font-semibold font-sans">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Detection Reason: {item.reason}</span>
              </div>
              <p className="text-[11.5px] text-amber-800 leading-relaxed font-sans">
                {item.triggerRule}
              </p>
            </div>

            {/* Submission Content */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Extracted Message Body
              </label>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-white text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans shadow-xs">
                {item.messageSnippet || "(Empty message string)"}
              </div>
            </div>

            {/* Raw JSON Payload */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                Raw Inbound Payload
              </label>
              <pre className="p-3.5 rounded-2xl border border-slate-800 bg-[#0f172a] text-[11px] font-mono text-slate-200 overflow-x-auto leading-relaxed shadow-xs">
                {JSON.stringify(item.rawPayload, null, 2)}
              </pre>
            </div>

            {/* Route & Timestamp */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Origin Form</span>
                <span className="text-slate-900 font-semibold">{item.formName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Disposition</span>
                <span
                  className={`font-mono text-[11px] font-semibold ${
                    item.disposition === "Quarantined" ? "text-amber-700" : "text-rose-700"
                  }`}
                >
                  {item.disposition}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Received Timestamp</span>
                <span suppressHydrationWarning className="text-slate-700 font-mono text-[11.5px]">
                  <FormattedDate date={item.receivedAt} format="full" />
                </span>
              </div>
              {item.metadata?.ip && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Client IP</span>
                  <span className="text-slate-800 font-mono text-[11.5px] font-semibold">{item.metadata.ip}</span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </DialogLayer>
  );
}

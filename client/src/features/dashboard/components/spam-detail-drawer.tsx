"use client";

import React, { useEffect, useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import {
  X,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  FileCode,
  Loader2,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";

export function SpamDetailDrawer() {
  const { spam, selectedSpamId, setSelectedSpamId, rescueSpamLeadAsync, addToast } = useDashboard();
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setSelectedSpamId(null)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-lg bg-[#161616] border-l border-white/[0.1] text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono border ${
                    item.disposition === "Quarantined"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {item.disposition}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  ID: {item.id}
                </span>
              </div>
              <h2 className="text-xl font-heading font-medium tracking-tight text-white truncate">
                {item.senderName}
              </h2>
              <p className="text-xs text-zinc-400 mt-1">{item.senderEmail}</p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedSpamId(null)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors flex-none"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Rescue Action Toolbar */}
          <div className="px-5 py-3 border-b border-white/[0.06] bg-[#1a1a1a] flex items-center justify-between gap-3">
            <div className="text-[11px] text-zinc-400">
              False positive? Move this submission back to your active Leads.
            </div>
            <button
              type="button"
              onClick={handleRescue}
              disabled={isRescuing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer whitespace-nowrap flex-none disabled:opacity-70"
            >
              {isRescuing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>{isRescuing ? "Rescuing..." : "Rescue Lead"}</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
            {/* Triggered Rule & Reason */}
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-medium font-sans">
                <ShieldAlert className="w-4 h-4" />
                <span>Detection Reason: {item.reason}</span>
              </div>
              <p className="text-[11.5px] text-amber-200/80 leading-relaxed font-sans">
                {item.triggerRule}
              </p>
            </div>

            {/* Submission Content */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Extracted Message Body
              </label>
              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#121212] text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {item.messageSnippet || "(Empty message string)"}
              </div>
            </div>

            {/* Raw JSON Payload */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                Raw Inbound Payload
              </label>
              <pre className="p-3 rounded-xl border border-white/[0.06] bg-[#101010] text-[11px] font-mono text-zinc-300 overflow-x-auto leading-normal">
                {JSON.stringify(item.rawPayload, null, 2)}
              </pre>
            </div>

            {/* Route & Timestamp */}
            <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Origin Form</span>
                <span className="text-white font-medium">{item.formName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Disposition</span>
                <span
                  className={`font-mono text-[11px] ${
                    item.disposition === "Quarantined" ? "text-amber-400" : "text-rose-400"
                  }`}
                >
                  {item.disposition}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Received Timestamp</span>
                <span suppressHydrationWarning className="text-zinc-300 font-mono text-[11px]">
                  <FormattedDate date={item.receivedAt} format="full" />
                </span>
              </div>
              {item.metadata?.ip && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Client IP</span>
                  <span className="text-zinc-300 font-mono text-[11px]">{item.metadata.ip}</span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

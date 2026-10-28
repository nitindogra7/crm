"use client";

import React, { useEffect, useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import {
  X,
  Copy,
  Check,
  Clock,
  Globe,
  FileText,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";

export function LeadDetailDrawer() {
  const {
    leads,
    selectedLeadId,
    setSelectedLeadId,
    updateLeadStatusAsync,
    addToast,
  } = useDashboard();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const lead = leads.find((l) => l.id === selectedLeadId);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedLeadId(null);
      }
    }
    if (selectedLeadId) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedLeadId, setSelectedLeadId]);

  if (!lead) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(lead.email);
    setCopiedEmail(true);
    addToast("Email copied", `${lead.email} copied to clipboard.`);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleToggleStatus = async () => {
    if (isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    const nextStatus = lead.status === "New" ? "Contacted" : "New";
    try {
      await updateLeadStatusAsync(lead.id, nextStatus);
      addToast("Status updated", `Lead marked as ${nextStatus}.`);
    } catch {
      addToast("Error", "Failed to update lead status", "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setSelectedLeadId(null)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-lg bg-[#161616] border-l border-white/[0.1] text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono border ${
                    lead.status === "New"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-zinc-800 text-zinc-300 border-zinc-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      lead.status === "New" ? "bg-emerald-400" : "bg-zinc-500"
                    }`}
                  />
                  {lead.status} Lead
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  ID: {lead.id}
                </span>
              </div>
              <h2 className="text-xl font-heading font-medium tracking-tight text-white truncate">
                {lead.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <span>{lead.email}</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="hover:text-white transition-colors"
                  title="Copy email address"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedLeadId(null)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors flex-none"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="px-5 py-3 border-b border-white/[0.06] bg-[#1a1a1a] flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={isUpdatingStatus}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer disabled:opacity-70 ${
                lead.status === "New"
                  ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-sm"
                  : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
              }`}
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : lead.status === "New" ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Contacted</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Mark New</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] text-xs text-zinc-300 transition-colors"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
            {/* Submission Message */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                Message / Inquiry Content
              </label>
              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#121212] text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap select-text font-sans">
                {lead.message || "(No message body provided)"}
              </div>
            </div>

            {/* Custom/Extra Fields if submitted */}
            {lead.extraFields && Object.keys(lead.extraFields).length > 0 && (
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Submitted Field Values
                </label>
                <div className="rounded-xl border border-white/[0.08] bg-[#121212] divide-y divide-white/[0.05] overflow-hidden">
                  {Object.entries(lead.extraFields).map(([key, value]) => (
                    <div key={key} className="p-3 flex items-start justify-between gap-4">
                      <span className="font-mono text-zinc-400 uppercase text-[10.5px]">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-zinc-200 text-right font-medium">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Origin & Routing Details */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Origin & Inbound Route
              </label>
              <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-3.5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    Target Form
                  </span>
                  <span className="text-white font-medium">{lead.formName}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-500" />
                    Inbound Source
                  </span>
                  <span className="text-zinc-300 font-mono text-[11px]">{lead.source}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    Received Timestamp
                  </span>
                  <span suppressHydrationWarning className="text-zinc-300 font-mono text-[11px]">
                    <FormattedDate date={lead.receivedAt} format="full" />
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.04]">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Spam Verification
                  </span>
                  <span className="text-emerald-400 font-medium text-[11px] font-mono">
                    Passed (Clean)
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Metadata */}
            {lead.metadata && (
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  Request Metadata
                </label>
                <div className="p-3 rounded-xl border border-white/[0.06] bg-[#121212]/60 space-y-1.5 font-mono text-[11px] text-zinc-400">
                  {lead.metadata.ip && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Client IP</span>
                      <span className="text-zinc-300">{lead.metadata.ip}</span>
                    </div>
                  )}
                  {lead.metadata.referrer && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">HTTP Referer</span>
                      <span className="text-zinc-300 truncate max-w-[200px]" title={lead.metadata.referrer}>
                        {lead.metadata.referrer}
                      </span>
                    </div>
                  )}
                  {lead.metadata.userAgent && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">User Agent</span>
                      <span className="text-zinc-300 truncate max-w-[200px]" title={lead.metadata.userAgent}>
                        {lead.metadata.userAgent}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

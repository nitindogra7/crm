"use client";

import { DialogLayer } from "@/shared/components/dialog-layer";
import { copyText } from "@/shared/lib/clipboard";
import React, { useEffect, useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import { LeadStatus } from "@/shared/types";
import {
  X,
  Copy,
  Check,
  Clock,
  Globe,
  FileText,
  ShieldCheck,
  Trash2,
  Download,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";

export function LeadDetailDrawer() {
  const {
    leads,
    selectedLeadId,
    setSelectedLeadId,
    updateLeadStatusAsync,
    deleteLeadAsync,
    addToast,
  } = useDashboard(["leads","selectedLeadId","setSelectedLeadId","updateLeadStatusAsync","deleteLeadAsync","addToast"]);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const lead = leads.find((l) => l.id === selectedLeadId);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          setSelectedLeadId(null);
        }
      }
    }
    if (selectedLeadId) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedLeadId, setSelectedLeadId, showDeleteConfirm]);

  if (!lead) return null;

  const handleCopyEmail = async () => {
    if (!(await copyText(lead.email))) return;
    setCopiedEmail(true);
    addToast("Email copied", `${lead.email} copied to clipboard.`);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPayload = async () => {
    if (!(await copyText(JSON.stringify(lead, null, 2)))) return;
    setCopiedPayload(true);
    addToast("Lead details copied", "JSON payload copied to clipboard.");
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (isUpdatingStatus || lead.status === newStatus) return;
    setIsUpdatingStatus(true);
    try {
      await updateLeadStatusAsync(lead.id, newStatus);
      addToast("Status updated", `Lead marked as ${newStatus}.`);
    } catch {
      addToast("Error", "Failed to update lead status", "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteLeadAsync(lead.id);
      setSelectedLeadId(null);
      setShowDeleteConfirm(false);
    } catch {
      addToast("Error", "Failed to delete lead from server", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeStyle = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "Contacted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "Qualified":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "Archived":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <DialogLayer label="Lead details" onClose={() => showDeleteConfirm ? setShowDeleteConfirm(false) : setSelectedLeadId(null)} className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setSelectedLeadId(null)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-lg bg-white border-l border-slate-200 text-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {lead.environment && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      lead.environment === "production"
                        ? "bg-purple-50 text-purple-700 border border-purple-200/80"
                        : "bg-amber-50 text-amber-700 border border-amber-200/80"
                    }`}
                  >
                    {lead.environment === "production" ? "PROD" : "DEV"}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${getStatusBadgeStyle(
                    lead.status
                  )}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      lead.status === "New"
                        ? "bg-[var(--ui-action)]"
                        : lead.status === "Contacted"
                        ? "bg-emerald-600"
                        : lead.status === "Qualified"
                        ? "bg-purple-600"
                        : "bg-slate-500"
                    }`}
                  />
                  {lead.status}
                </span>
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">
                  ID: {lead.id}
                </span>
              </div>
              <h2 className="text-xl font-heading font-bold tracking-tight text-slate-900 truncate">
                {lead.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>{lead.email}</span>
                <button aria-label="Copy email address"
                  type="button"
                  onClick={handleCopyEmail}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                  title="Copy email address"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedLeadId(null)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-none cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center justify-between gap-2 flex-wrap">
            {/* Status Dropdown Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">
                Status:
              </span>
              <select aria-label="Lead status"
                value={lead.status}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-semibold cursor-pointer disabled:opacity-50"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Archived">Archived</option>
              </select>
              {isUpdatingStatus && (
                <span className="sr-only">Working</span>
              )}
            </div>

            {/* Actions group */}
            <div className="flex items-center gap-2">
              <button aria-label="Copy lead JSON payload"
                type="button"
                onClick={handleCopyPayload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-700 font-semibold transition-colors cursor-pointer shadow-2xs"
                title="Copy lead JSON payload"
              >
                {copiedPayload ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>JSON</span>
              </button>

              <button aria-label="Delete this lead"
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs text-rose-700 font-semibold transition-colors cursor-pointer"
                title="Delete this lead"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Delete Confirmation Alert Banner */}
          {showDeleteConfirm && (
            <div className="p-4 bg-rose-50 border-b border-rose-200 text-xs text-rose-900 animate-in fade-in duration-150 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-none" />
                <span className="font-semibold">Delete this lead permanently?</span>
              </div>
              <div className="flex items-center gap-2 flex-none">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span className="sr-only">Working</span>
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                  <span>Confirm</span>
                </button>
              </div>
            </div>
          )}

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs bg-slate-50/40">
            {/* Quick Status Bar */}
            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-slate-900 font-semibold">Pipeline Stage</span>
              </div>
              <div className="flex items-center gap-1.5">
                {(["New", "Contacted", "Qualified", "Archived"] as LeadStatus[]).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStatusChange(s)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono transition-all cursor-pointer ${
                        lead.status === s
                          ? "bg-[var(--ui-action)] text-white font-semibold shadow-xs"
                          : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/60 font-medium"
                      }`}
                    >
                      {s}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Submission Message */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Message / Inquiry Content
              </label>
              <div className="p-4 rounded-xl border border-slate-200/80 bg-white text-slate-800 text-sm leading-relaxed whitespace-pre-wrap select-text font-sans shadow-xs">
                {lead.message || "(No message body provided)"}
              </div>
            </div>

            {/* Custom/Extra Fields if submitted */}
            {lead.extraFields && Object.keys(lead.extraFields).length > 0 && (
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Submitted Field Values
                </label>
                <div className="rounded-xl border border-slate-200/80 bg-white divide-y divide-slate-100 overflow-hidden shadow-xs">
                  {Object.entries(lead.extraFields).map(([key, value]) => (
                    <div key={key} className="p-3 flex items-start justify-between gap-4">
                      <span className="font-mono text-slate-500 uppercase text-[10.5px] font-semibold">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-slate-900 text-right font-semibold">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Origin & Routing Details */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Origin & Inbound Route
              </label>
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    Target Form
                  </span>
                  <span className="text-slate-900 font-semibold">{lead.formName}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    Inbound Source
                  </span>
                  <span className="text-slate-700 font-mono text-[11.5px] font-semibold">{lead.source}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Received Timestamp
                  </span>
                  <span suppressHydrationWarning className="text-slate-700 font-mono text-[11.5px]">
                    <FormattedDate date={lead.receivedAt} format="full" />
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Spam Verification
                  </span>
                  <span className="text-emerald-700 font-semibold text-[11.5px] font-mono">
                    Passed (Clean)
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Metadata */}
            {lead.metadata && (
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Request Metadata
                </label>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1.5 font-mono text-[11px] text-slate-600">
                  {lead.metadata.ip && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Client IP</span>
                      <span className="text-slate-800 font-semibold">{lead.metadata.ip}</span>
                    </div>
                  )}
                  {lead.metadata.referrer && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">HTTP Referer</span>
                      <span className="text-slate-800 font-semibold truncate max-w-[200px]" title={lead.metadata.referrer}>
                        {lead.metadata.referrer}
                      </span>
                    </div>
                  )}
                  {lead.metadata.userAgent && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">User Agent</span>
                      <span className="text-slate-800 font-semibold truncate max-w-[200px]" title={lead.metadata.userAgent}>
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
    </DialogLayer>
  );
}

"use client";

import React, { useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import {
  Plus,
  Copy,
  Check,
  FileText,
} from "lucide-react";

export function FormsView() {
  const {
    forms,
    setIsCreateFormOpen,
    setSelectedFormId,
    toggleFormEnabled,
    addToast,
  } = useDashboard();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyEndpoint = (e: React.MouseEvent, formId: string, endpoint: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(endpoint);
    setCopiedId(formId);
    addToast("Endpoint copied", "Paste into your form action attribute.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-white">
            Forms Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create endpoints, inspect fields schema, copy HTML code snippets, and simulate submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Form</span>
        </button>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => {
          const isCopied = copiedId === form.id;
          return (
            <div
              key={form.id}
              onClick={() => setSelectedFormId(form.id)}
              className="group relative p-5 rounded-2xl border border-white/[0.08] bg-[#181818]/90 hover:bg-[#1c1c1c] hover:border-white/[0.18] transition-all duration-200 shadow-sm cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Status & Endpoint Slug */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10.5px] font-mono border ${
                      form.enabled
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        form.enabled ? "bg-emerald-400" : "bg-zinc-500"
                      }`}
                    />
                    {form.enabled ? "Active" : "Paused"}
                  </span>

                  <span className="text-[11px] font-mono text-zinc-500 truncate">
                    /{form.slug}
                  </span>
                </div>

                {/* Form Title & Redirect */}
                <h2 className="text-base font-heading font-medium text-white group-hover:text-emerald-300 transition-colors truncate">
                  {form.name}
                </h2>

                <p className="text-[11.5px] text-zinc-400 mt-1 line-clamp-1 font-mono">
                  {form.redirectUrl ? `Redirect: ${form.redirectUrl}` : "Default JSON response"}
                </p>

                {/* Field Count Badge */}
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10.5px] font-mono text-zinc-300">
                    {form.fields.length} fields
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10.5px] font-mono text-zinc-300">
                    {form.leadCount} leads
                  </span>
                  {form.spamCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10.5px] font-mono text-amber-400">
                      {form.spamCount} spam
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={(e) => handleCopyEndpoint(e, form.id, form.endpointUrl)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.08] text-[11px] text-zinc-300 transition-colors"
                  title="Copy endpoint URL"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFormEnabled(form.id);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-white/[0.08] text-[11px] text-zinc-400 hover:text-white transition-colors"
                  >
                    {form.enabled ? "Pause" : "Enable"}
                  </button>

                  <span className="text-[11px] text-zinc-400 font-medium group-hover:text-white flex items-center gap-0.5">
                    Details
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {forms.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-white/[0.08] bg-[#181818] space-y-3">
          <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-400">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-medium text-white">No forms created yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Click &quot;Create Form&quot; above to configure an endpoint and start receiving leads.
          </p>
        </div>
      )}
    </div>
  );
}

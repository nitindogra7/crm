"use client";

import React, { useState, useMemo } from "react";
import { useDashboard } from "../context/dashboard-context";
import { SpamSkeleton } from "./dashboard-skeleton";
import { SpamDisposition } from "../types";
import {
  ShieldAlert,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Search,
  Loader2,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";

export function SpamShieldView() {
  const { spam, forms, isLoading, setSelectedSpamId, rescueSpamLeadAsync, addToast } = useDashboard();

  const [selectedDisposition, setSelectedDisposition] = useState<"all" | SpamDisposition>("all");
  const [selectedReason, setSelectedReason] = useState<string>("all");
  const [selectedForm, setSelectedForm] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [rescuingId, setRescuingId] = useState<string | null>(null);

  const handleRescueItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (rescuingId) return;
    setRescuingId(id);
    try {
      await rescueSpamLeadAsync(id);
      addToast("Lead rescued", "Submission moved to active Leads.");
    } catch {
      addToast("Error", "Failed to rescue lead", "error");
    } finally {
      setRescuingId(null);
    }
  };

  const allReasons = useMemo(() => {
    const set = new Set<string>();
    spam.forEach((s) => set.add(s.reason));
    return Array.from(set);
  }, [spam]);

  const filteredSpam = useMemo(() => {
    return spam.filter((item) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.senderName.toLowerCase().includes(query);
        const matchesEmail = item.senderEmail.toLowerCase().includes(query);
        const matchesSnippet = item.messageSnippet.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesSnippet) return false;
      }

      if (selectedDisposition !== "all" && item.disposition !== selectedDisposition) {
        return false;
      }

      if (selectedReason !== "all" && item.reason !== selectedReason) {
        return false;
      }

      if (selectedForm !== "all" && item.formId !== selectedForm) {
        return false;
      }

      return true;
    });
  }, [spam, searchTerm, selectedDisposition, selectedReason, selectedForm]);

  const quarantinedCount = spam.filter((s) => s.disposition === "Quarantined").length;
  const rejectedCount = spam.filter((s) => s.disposition === "Rejected").length;

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDisposition("all");
    setSelectedReason("all");
    setSelectedForm("all");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedDisposition !== "all" ||
    selectedReason !== "all" ||
    selectedForm !== "all";

  if (isLoading) {
    return <SpamSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-400 mb-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Automated Quarantine & Bot Defenses</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-white">
            Spam Shield
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review quarantined and rejected submissions caught by honeypots, disposable email filters, and rate limiters.
          </p>
        </div>

        {/* Quick Tally Cards */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] text-xs">
            <span className="text-zinc-400 font-mono text-[10.5px] uppercase block">
              Quarantined
            </span>
            <span className="font-heading font-medium text-amber-400 text-sm tabular-nums">
              {quarantinedCount} items
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/[0.06] text-xs">
            <span className="text-zinc-400 font-mono text-[10.5px] uppercase block">
              Rejected
            </span>
            <span className="font-heading font-medium text-rose-400 text-sm tabular-nums">
              {rejectedCount} items
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sender name, email, or message body..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 font-sans"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* Disposition Filter */}
            <select
              value={selectedDisposition}
              onChange={(e) =>
                setSelectedDisposition(e.target.value as "all" | SpamDisposition)
              }
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-zinc-200 focus:outline-none text-[11.5px]"
            >
              <option value="all">All Dispositions</option>
              <option value="Quarantined">Quarantined</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Reason Filter */}
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-zinc-200 focus:outline-none text-[11.5px]"
            >
              <option value="all">All Detection Reasons</option>
              {allReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Form Filter */}
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-zinc-200 focus:outline-none text-[11.5px]"
            >
              <option value="all">All Forms</option>
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.1] text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Spam Submissions Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#181818]/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-zinc-500 font-mono text-[10.5px] uppercase tracking-wider bg-white/[0.01]">
                <th className="py-3.5 px-4 font-normal">Sender (Name & Email)</th>
                <th className="py-3.5 px-4 font-normal hidden sm:table-cell">Form</th>
                <th className="py-3.5 px-4 font-normal">Detection Reason</th>
                <th className="py-3.5 px-4 font-normal">Disposition</th>
                <th className="py-3.5 px-4 font-normal text-right hidden md:table-cell">Received</th>
                <th className="py-3.5 px-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredSpam.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-400">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-white">No spam records found</p>
                        <p className="text-xs text-zinc-500">
                          Your forms are clean and protected. No quarantine backlog.
                        </p>
                      </div>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-zinc-200 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset filters</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSpam.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedSpamId(item.id)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-zinc-200 group-hover:text-white transition-colors truncate max-w-[160px] sm:max-w-[200px]">
                        {item.senderName}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-[160px] sm:max-w-[200px] font-mono">
                        {item.senderEmail}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className="font-sans text-zinc-300 truncate block max-w-[140px]">
                        {item.formName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-mono bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                        {item.reason}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10.5px] font-mono border ${
                          item.disposition === "Quarantined"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                        }`}
                      >
                        {item.disposition === "Quarantined" ? (
                          <AlertTriangle className="w-3 h-3 flex-none" />
                        ) : (
                          <XCircle className="w-3 h-3 flex-none" />
                        )}
                        <span>{item.disposition}</span>
                      </span>
                    </td>

                    <td
                      suppressHydrationWarning
                      className="py-3.5 px-4 text-right font-mono text-[11px] text-zinc-400 whitespace-nowrap hidden md:table-cell"
                    >
                      <FormattedDate date={item.receivedAt} format="both" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => handleRescueItem(e, item.id)}
                        disabled={rescuingId === item.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/[0.1] bg-white/[0.04] hover:bg-white text-zinc-200 hover:text-black font-medium text-[11px] transition-all cursor-pointer whitespace-nowrap shadow-sm disabled:opacity-50"
                        title="Move to inbox as New lead"
                      >
                        {rescuingId === item.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <RotateCcw className="w-3 h-3" />
                        )}
                        <span>{rescuingId === item.id ? "Rescuing..." : "Rescue"}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { useDashboard } from "../context/dashboard-context";
import { SpamSkeleton } from "./dashboard-skeleton";
import { SpamDisposition } from "../types";
import {
  AlertTriangle,
  XCircle,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";

export function SpamShieldView() {
  const { spam, forms, isLoading, setSelectedSpamId, rescueSpamLeadAsync, addToast } = useDashboard(["spam","forms","isLoading","setSelectedSpamId","rescueSpamLeadAsync","addToast"]);

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
      <div className="dashboard-page-header flex flex-col xl:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-slate-900">
            Spam Shield
          </h1>
          <p className="text-[13px] sm:text-sm text-slate-500 mt-1 font-sans">
            Review flagged submissions and restore legitimate leads.
          </p>
        </div>

        {/* Quick Tally Cards */}
        <div className="flex items-center gap-2.5">
          <div className="px-4 py-2.5 rounded-xl border border-amber-200/80 bg-amber-50/60 text-[13px] shadow-xs">
            <span className="text-amber-800 text-xs font-semibold block">
              Quarantined
            </span>
            <span className="font-bold text-amber-700 text-sm tabular-nums font-heading">
              {quarantinedCount} items
            </span>
          </div>
          <div className="px-4 py-2.5 rounded-xl border border-rose-200/80 bg-rose-50/60 text-[13px] shadow-xs">
            <span className="text-rose-800 text-xs font-semibold block">
              Rejected
            </span>
            <span className="font-bold text-rose-700 text-sm tabular-nums font-heading">
              {rejectedCount} items
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-white space-y-3.5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search flagged submissions..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 font-sans transition-all"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[13px]">
            {/* Disposition Filter */}
            <select
              value={selectedDisposition}
              onChange={(e) =>
                setSelectedDisposition(e.target.value as "all" | SpamDisposition)
              }
              className="px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 text-[13px] cursor-pointer transition-all"
            >
              <option value="all">All Dispositions</option>
              <option value="Quarantined">Quarantined</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Reason Filter */}
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 text-[13px] cursor-pointer transition-all"
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
              className="px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 text-[13px] cursor-pointer transition-all"
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
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-[13px] font-semibold text-slate-600 hover:text-slate-900 transition-all whitespace-nowrap cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Spam Submissions Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 font-semibold text-[13px] uppercase tracking-wider bg-slate-50/70">
                <th className="py-3.5 px-4 font-semibold">Sender</th>
                <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">Form</th>
                <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">Detection Reason</th>
                <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">Disposition</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden md:table-cell">Received</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSpam.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mx-auto text-emerald-600">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">No spam records found</p>
                        <p className="text-[13px] text-slate-500">
                          Your forms are clean and protected. No quarantine backlog.
                        </p>
                      </div>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20"
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
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[160px] sm:max-w-[200px]">
                          <button type="button" className="max-w-full truncate text-left" onClick={(e) => { e.stopPropagation(); setSelectedSpamId(item.id); }}>{item.senderName}</button>
                        </div>
                      <div className="text-[13px] text-slate-500 truncate max-w-[160px] sm:max-w-[200px] font-mono">
                        {item.senderEmail}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        {item.environment && (
                          <span
                            className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold uppercase tracking-wider ${
                              item.environment === "production"
                                ? "bg-purple-50 text-purple-700 border border-purple-200/70"
                                : "bg-amber-50 text-amber-700 border border-amber-200/70"
                            }`}
                          >
                            {item.environment === "production" ? "PROD" : "DEV"}
                          </span>
                        )}
                        <span className="text-slate-600 truncate block max-w-[140px] font-medium">
                          {item.formName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-mono bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                        {item.reason}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border ${
                          item.disposition === "Quarantined"
                            ? "bg-amber-50 text-amber-700 border-amber-200/80"
                            : "bg-rose-50 text-rose-700 border-rose-200/80"
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
                      className="py-3.5 px-4 text-right font-mono text-[13px] text-slate-500 whitespace-nowrap hidden md:table-cell"
                    >
                      <FormattedDate date={item.receivedAt} format="both" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button aria-label="Move to inbox as New lead"
                        type="button"
                        onClick={(e) => handleRescueItem(e, item.id)}
                        disabled={rescuingId === item.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[13px] transition-all cursor-pointer whitespace-nowrap shadow-2xs disabled:opacity-50"
                        title="Move to inbox as New lead"
                      >
                        {rescuingId === item.id ? (
                          <span className="sr-only">Working</span>
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

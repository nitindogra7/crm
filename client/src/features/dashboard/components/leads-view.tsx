"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "../context/dashboard-context";
import { LeadStatus } from "../types";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Inbox,
  X,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";
import { LeadsSkeleton } from "./dashboard-skeleton";

const ITEMS_PER_PAGE = 7;

export function LeadsView() {
  const searchParams = useSearchParams();
  const { leads, forms, isLoading, setSelectedLeadId } = useDashboard();

  const timeParam = searchParams.get("time");
  const statusParam = searchParams.get("status");

  // Search & Filter state initialized directly from searchParams
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | LeadStatus>(() => {
    if (statusParam === "new") return "New";
    if (statusParam === "contacted") return "Contacted";
    return "all";
  });
  const [selectedDate, setSelectedDate] = useState<"all" | "today" | "week" | "month">(() => {
    if (timeParam === "today") return "today";
    if (timeParam === "week") return "week";
    return "all";
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Unique sources
  const allSources = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => set.add(l.source));
    return Array.from(set);
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = startOfToday - 6 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = startOfToday - 29 * 24 * 60 * 60 * 1000;

    return leads.filter((lead) => {
      // Search: name, email, message
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(query);
        const matchesEmail = lead.email.toLowerCase().includes(query);
        const matchesMessage = lead.message.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesMessage) return false;
      }

      // Form filter
      if (selectedForm !== "all" && lead.formId !== selectedForm) {
        return false;
      }

      // Source filter
      if (selectedSource !== "all" && lead.source !== selectedSource) {
        return false;
      }

      // Status filter (Only "New" and "Contacted")
      if (selectedStatus !== "all" && lead.status !== selectedStatus) {
        return false;
      }

      // Date filter
      const leadTime = new Date(lead.receivedAt).getTime();
      if (selectedDate === "today" && leadTime < startOfToday) {
        return false;
      }
      if (selectedDate === "week" && leadTime < sevenDaysAgo) {
        return false;
      }
      if (selectedDate === "month" && leadTime < thirtyDaysAgo) {
        return false;
      }

      return true;
    });
  }, [leads, searchTerm, selectedForm, selectedSource, selectedStatus, selectedDate]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedLeads = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLeads, safePage]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedForm("all");
    setSelectedSource("all");
    setSelectedStatus("all");
    setSelectedDate("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedForm !== "all" ||
    selectedSource !== "all" ||
    selectedStatus !== "all" ||
    selectedDate !== "all";

  if (isLoading) {
    return <LeadsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-white">
          Leads Inbox
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Review, filter, and track inquiries received from your live form endpoints.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email, or message content..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 font-sans"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* Form Filter */}
            <select
              value={selectedForm}
              onChange={(e) => {
                setSelectedForm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-zinc-200 focus:outline-none text-[11.5px]"
            >
              <option value="all">All Forms</option>
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>

            {/* Source Filter */}
            <select
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-zinc-200 focus:outline-none text-[11.5px]"
            >
              <option value="all">All Sources</option>
              {allSources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value as "all" | "today" | "week" | "month");
                setCurrentPage(1);
              }}
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-zinc-200 focus:outline-none text-[11.5px]"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">Past 30 Days</option>
            </select>

            {/* Status Filter (Strictly "New" & "Contacted") */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as "all" | LeadStatus);
                setCurrentPage(1);
              }}
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-zinc-200 focus:outline-none text-[11.5px]"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
            </select>
          </div>

          {/* Reset Filters Quick Button */}
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

      {/* Leads Table Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#181818]/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-zinc-500 font-mono text-[10.5px] uppercase tracking-wider bg-white/[0.01]">
                <th className="py-3.5 px-4 font-normal">Contact (Name & Email)</th>
                <th className="py-3.5 px-4 font-normal hidden sm:table-cell">Form</th>
                <th className="py-3.5 px-4 font-normal hidden md:table-cell">Source</th>
                <th className="py-3.5 px-4 font-normal">Status</th>
                <th className="py-3.5 px-4 font-normal text-right">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-zinc-400">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-500">
                        <Inbox className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-white">
                          {leads.length === 0 ? "No leads received yet" : "No leads match filters"}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {leads.length === 0
                            ? "Submissions captured by your forms will automatically show up here."
                            : "Try adjusting your search criteria, dates, or status toggles."}
                        </p>
                      </div>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-zinc-200 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset all filters</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-zinc-200 group-hover:text-white transition-colors truncate max-w-[180px] sm:max-w-[240px]">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-[180px] sm:max-w-[240px]">
                        {lead.email}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className="font-sans text-zinc-300 truncate block max-w-[160px]">
                        {lead.formName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="font-mono text-[11px] text-zinc-400">
                        {lead.source}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border ${
                          lead.status === "New"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            lead.status === "New" ? "bg-emerald-400" : "bg-zinc-500"
                          }`}
                        />
                        {lead.status}
                      </span>
                    </td>

                    <td
                      suppressHydrationWarning
                      className="py-3.5 px-4 text-right font-mono text-[11px] text-zinc-400 whitespace-nowrap"
                    >
                      <FormattedDate date={lead.receivedAt} format="both" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count Bar */}
        <div className="p-3.5 sm:p-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 flex-wrap gap-2">
          <div className="font-mono text-[11px]">
            Showing{" "}
            <span className="text-white font-medium">
              {filteredLeads.length > 0
                ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredLeads.length
                  )}`
                : "0"}
            </span>{" "}
            of <span className="text-white font-medium">{filteredLeads.length}</span> leads
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 font-mono text-[11px] text-zinc-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

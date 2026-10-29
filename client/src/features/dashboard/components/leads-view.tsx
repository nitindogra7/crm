"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "../context/dashboard-context";
import { LeadStatus, LeadItem } from "@/shared/types";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Inbox,
  X,
  MoreVertical,
  Trash2,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";
import { LeadsSkeleton } from "./dashboard-skeleton";

const PAGE_SIZE_OPTIONS = [7, 10, 20, 50];

export function LeadsView() {
  const searchParams = useSearchParams();
  const {
    leads,
    forms,
    isLoading,
    setSelectedLeadId,
    updateLeadStatusAsync,
    deleteLeadAsync,
    batchDeleteLeadsAsync,
    batchUpdateLeadStatusAsync,
    addToast,
  } = useDashboard();

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

  // Pagination state
  const [pageSize, setPageSize] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);

  // Selection & Bulk actions state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Row dropdown menus
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<
    { type: "single"; lead: LeadItem } | { type: "batch"; ids: string[] } | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close menus when clicking outside
  const menuContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        setOpenActionMenuId(null);
        setOpenStatusMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      // Status filter
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
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedLeads = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, safePage, pageSize]);

  // Select all on current page logic
  const isAllCurrentPageSelected =
    paginatedLeads.length > 0 &&
    paginatedLeads.every((lead) => selectedIds.includes(lead.id));

  const handleToggleSelectAll = () => {
    if (isAllCurrentPageSelected) {
      const pageIds = new Set(paginatedLeads.map((l) => l.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const newIds = new Set([...selectedIds, ...paginatedLeads.map((l) => l.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedForm("all");
    setSelectedSource("all");
    setSelectedStatus("all");
    setSelectedDate("all");
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedForm !== "all" ||
    selectedSource !== "all" ||
    selectedStatus !== "all" ||
    selectedDate !== "all";

  // Status badge styling
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          dot: "bg-emerald-400",
        };
      case "Contacted":
        return {
          bg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
          dot: "bg-sky-400",
        };
      case "Qualified":
        return {
          bg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          dot: "bg-purple-400",
        };
      case "Archived":
        return {
          bg: "bg-zinc-800 text-zinc-400 border-zinc-700",
          dot: "bg-zinc-500",
        };
      default:
        return {
          bg: "bg-zinc-800 text-zinc-300 border-zinc-700",
          dot: "bg-zinc-400",
        };
    }
  };

  // Inline status update
  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    setOpenStatusMenuId(null);
    setOpenActionMenuId(null);
    try {
      await updateLeadStatusAsync(leadId, newStatus);
    } catch {
      addToast("Error", "Failed to update lead status on server", "error");
    }
  };

  // Bulk status update
  const handleBulkStatusChange = async (status: LeadStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await batchUpdateLeadStatusAsync(selectedIds, status);
      setSelectedIds([]);
    } catch {
      addToast("Error", "Failed to update selected leads", "error");
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "single") {
        await deleteLeadAsync(deleteTarget.lead.id);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.lead.id));
      } else {
        await batchDeleteLeadsAsync(deleteTarget.ids);
        setSelectedIds([]);
      }
      setDeleteTarget(null);
    } catch {
      addToast("Error", "Failed to delete lead(s) on server", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    addToast("Email copied", `${email} copied to clipboard.`);
    setOpenActionMenuId(null);
  };

  if (isLoading) {
    return <LeadsSkeleton />;
  }

  return (
    <div ref={menuContainerRef} className="space-y-6">
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
      <div className="p-3.5 sm:p-4 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-3 shadow-sm">
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                aria-label="Clear search"
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
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-zinc-200 focus:outline-none text-[11.5px] cursor-pointer"
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
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-zinc-200 focus:outline-none text-[11.5px] cursor-pointer"
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
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-zinc-200 focus:outline-none text-[11.5px] cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">Past 30 Days</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as "all" | LeadStatus);
                setCurrentPage(1);
              }}
              className="px-2.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-zinc-200 focus:outline-none text-[11.5px] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Reset Filters Quick Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.1] text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Bulk Actions Floating Toolbar */}
        {selectedIds.length > 0 && (
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-2 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="font-mono text-zinc-300 font-medium">
                {selectedIds.length} lead{selectedIds.length > 1 ? "s" : ""} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
              >
                Clear selection
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleBulkStatusChange("Contacted")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors cursor-pointer text-xs font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Contacted</span>
              </button>

              <button
                type="button"
                onClick={() => handleBulkStatusChange("New")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer text-xs font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mark New</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setDeleteTarget({ type: "batch", ids: selectedIds })
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer text-xs font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leads Table Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#181818]/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[360px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-zinc-500 font-mono text-[10.5px] uppercase tracking-wider bg-white/[0.01]">
                <th className="py-3.5 pl-4 pr-2 w-8">
                  <input
                    type="checkbox"
                    checked={isAllCurrentPageSelected}
                    onChange={handleToggleSelectAll}
                    disabled={paginatedLeads.length === 0}
                    aria-label="Select all leads on current page"
                    className="rounded bg-zinc-900 border-white/20 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-normal">Contact (Name & Email)</th>
                <th className="py-3.5 px-4 font-normal hidden sm:table-cell">Form</th>
                <th className="py-3.5 px-4 font-normal hidden md:table-cell">Source</th>
                <th className="py-3.5 px-4 font-normal">Status</th>
                <th className="py-3.5 px-4 font-normal text-right">Received</th>
                <th className="py-3.5 px-4 font-normal text-right w-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-400">
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-zinc-200 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset all filters</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => {
                  const badge = getStatusBadge(lead.status);
                  const isSelected = selectedIds.includes(lead.id);
                  const isStatusMenuOpen = openStatusMenuId === lead.id;
                  const isActionMenuOpen = openActionMenuId === lead.id;

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className={`hover:bg-white/[0.03] transition-colors cursor-pointer group ${
                        isSelected ? "bg-white/[0.02]" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-3.5 pl-4 pr-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(lead.id)}
                          aria-label={`Select lead ${lead.name}`}
                          className="rounded bg-zinc-900 border-white/20 text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Contact Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-zinc-200 group-hover:text-white transition-colors truncate max-w-[180px] sm:max-w-[240px]">
                          {lead.name}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[180px] sm:max-w-[240px]">
                          {lead.email}
                        </div>
                      </td>

                      {/* Form */}
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <span className="font-sans text-zinc-300 truncate block max-w-[160px]">
                          {lead.formName}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span className="font-mono text-[11px] text-zinc-400">
                          {lead.source}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td
                        className="py-3.5 px-4 relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenActionMenuId(null);
                              setOpenStatusMenuId(isStatusMenuOpen ? null : lead.id);
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10.5px] font-mono border transition-all cursor-pointer hover:border-white/40 ${badge.bg}`}
                            title="Click to change lead status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            <span>{lead.status}</span>
                            <ChevronDown className="w-3 h-3 text-zinc-400 opacity-60 group-hover:opacity-100" />
                          </button>

                          {/* Status Popover Dropdown */}
                          {isStatusMenuOpen && (
                            <div className="absolute left-0 mt-1 w-32 rounded-xl bg-[#202022] border border-white/[0.12] shadow-xl py-1 z-30 animate-in fade-in duration-100">
                              {(["New", "Contacted", "Qualified", "Archived"] as LeadStatus[]).map(
                                (st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleUpdateStatus(lead.id, st)}
                                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/[0.08] transition-colors cursor-pointer ${
                                      lead.status === st
                                        ? "text-white font-medium bg-white/[0.04]"
                                        : "text-zinc-400"
                                    }`}
                                  >
                                    <span>{st}</span>
                                    {lead.status === st && (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    )}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Received Date */}
                      <td
                        suppressHydrationWarning
                        className="py-3.5 px-4 text-right font-mono text-[11px] text-zinc-400 whitespace-nowrap"
                      >
                        <FormattedDate date={lead.receivedAt} format="both" />
                      </td>

                      {/* Row Action Menu */}
                      <td
                        className="py-3.5 px-4 text-right relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenStatusMenuId(null);
                              setOpenActionMenuId(isActionMenuOpen ? null : lead.id);
                            }}
                            className="p-1 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Lead actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Action Dropdown Menu */}
                          {isActionMenuOpen && (
                            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-[#202022] border border-white/[0.12] shadow-2xl py-1 z-30 animate-in fade-in duration-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedLeadId(lead.id);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.08] flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                                <span>View Details</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleCopyEmail(lead.email, e)}
                                className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.08] flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Copy Email</span>
                              </button>

                              <div className="my-1 border-t border-white/[0.06]" />

                              {lead.status !== "Contacted" && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(lead.id, "Contacted")}
                                  className="w-full text-left px-3 py-2 text-xs text-sky-400 hover:bg-white/[0.08] flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Mark Contacted</span>
                                </button>
                              )}

                              {lead.status !== "New" && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(lead.id, "New")}
                                  className="w-full text-left px-3 py-2 text-xs text-emerald-400 hover:bg-white/[0.08] flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Mark New</span>
                                </button>
                              )}

                              <div className="my-1 border-t border-white/[0.06]" />

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  setDeleteTarget({ type: "single", lead });
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Lead</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count Bar */}
        <div className="p-3.5 sm:p-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 flex-wrap gap-2">
          {/* Showing Count & Per Page Selector */}
          <div className="flex items-center gap-3">
            <div className="font-mono text-[11px]">
              Showing{" "}
              <span className="text-white font-medium">
                {filteredLeads.length > 0
                  ? `${(safePage - 1) * pageSize + 1}-${Math.min(
                      safePage * pageSize,
                      filteredLeads.length
                    )}`
                  : "0"}
              </span>{" "}
              of{" "}
              <span className="text-white font-medium">{filteredLeads.length}</span>{" "}
              leads
            </div>

            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px]">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.1] text-zinc-200 text-[11px] focus:outline-none cursor-pointer"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 font-mono text-[11px] text-zinc-300">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#181818] border border-white/[0.12] rounded-2xl p-5 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center flex-none">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-medium font-heading">
                  {deleteTarget.type === "single"
                    ? "Delete Lead"
                    : "Delete Selected Leads"}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  {deleteTarget.type === "single"
                    ? `Are you sure you want to remove "${deleteTarget.lead.name}"?`
                    : `Are you sure you want to delete ${deleteTarget.ids.length} selected lead(s)?`}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              This action permanently deletes the submission record and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-2 rounded-xl border border-white/[0.1] text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

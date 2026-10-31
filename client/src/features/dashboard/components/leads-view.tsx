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
  Download,
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
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    return leads.filter((lead) => {
      // 1. Search term match
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(query);
        const matchesEmail = lead.email.toLowerCase().includes(query);
        const matchesMessage = lead.message.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesMessage) return false;
      }

      // 2. Form filter
      if (selectedForm !== "all" && lead.formId !== selectedForm) {
        return false;
      }

      // 3. Source filter
      if (selectedSource !== "all" && lead.source !== selectedSource) {
        return false;
      }

      // 4. Status filter
      if (selectedStatus !== "all" && lead.status !== selectedStatus) {
        return false;
      }

      // 5. Date filter
      if (selectedDate !== "all") {
        const leadDate = new Date(lead.receivedAt).getTime();
        const diffMs = now - leadDate;

        if (selectedDate === "today" && diffMs > oneDayMs) return false;
        if (selectedDate === "week" && diffMs > 7 * oneDayMs) return false;
        if (selectedDate === "month" && diffMs > 30 * oneDayMs) return false;
      }

      return true;
    });
  }, [leads, searchTerm, selectedForm, selectedSource, selectedStatus, selectedDate]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedLeads = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, safePage, pageSize]);

  // Selection handlers
  const isAllCurrentPageSelected =
    paginatedLeads.length > 0 &&
    paginatedLeads.every((lead) => selectedIds.includes(lead.id));

  const handleToggleSelectAll = () => {
    if (isAllCurrentPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedLeads.some((l) => l.id === id))
      );
    } else {
      const newIds = new Set(selectedIds);
      paginatedLeads.forEach((l) => newIds.add(l.id));
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
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedForm !== "all" ||
    selectedSource !== "all" ||
    selectedStatus !== "all" ||
    selectedDate !== "all";

  // Badge stylings
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200/80",
          dot: "bg-blue-600",
        };
      case "Contacted":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
          dot: "bg-emerald-600",
        };
      case "Qualified":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200/80",
          dot: "bg-purple-600",
        };
      case "Archived":
        return {
          bg: "bg-slate-100 text-slate-600 border-slate-200",
          dot: "bg-slate-500",
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-600 border-slate-200",
          dot: "bg-slate-400",
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

  const handleExportLeadsCSV = () => {
    if (filteredLeads.length === 0) return;
    const sanitizeCsvCell = (val: string) => {
      let clean = (val || "").replace(/"/g, '""');
      if (/^[=+\-@\t\r]/.test(clean)) {
        clean = `'${clean}`;
      }
      return `"${clean}"`;
    };

    const headers = ["Name", "Email", "Form", "Status", "Source", "Date", "Message"];
    const rows = filteredLeads.map((l) => [
      sanitizeCsvCell(l.name),
      sanitizeCsvCell(l.email),
      sanitizeCsvCell(l.formName || ""),
      sanitizeCsvCell(l.status),
      sanitizeCsvCell(l.source || ""),
      sanitizeCsvCell(l.receivedAt ? new Date(l.receivedAt).toISOString() : ""),
      sanitizeCsvCell((l.message || "").replace(/\r?\n/g, " ")),
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `infraly_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Export Complete", `Exported ${filteredLeads.length} lead(s) to CSV.`);
  };

  if (isLoading) {
    return <LeadsSkeleton />;
  }

  return (
    <div ref={menuContainerRef} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-slate-900">
            Leads Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review, filter, and track inquiries received from your live form endpoints.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportLeadsCSV}
          disabled={filteredLeads.length === 0}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all disabled:opacity-40 cursor-pointer self-start sm:self-auto"
          title="Export filtered leads as a secure CSV spreadsheet"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email, or message content..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 font-sans transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
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
              className="px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 text-[11.5px] cursor-pointer transition-all"
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
              className="px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 text-[11.5px] cursor-pointer transition-all"
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
              className="px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 text-[11.5px] cursor-pointer transition-all"
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
              className="px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 text-[11.5px] cursor-pointer transition-all"
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
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-all whitespace-nowrap cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Bulk Actions Floating Toolbar */}
        {selectedIds.length > 0 && (
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-700 font-semibold">
                {selectedIds.length} lead{selectedIds.length > 1 ? "s" : ""} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Clear selection
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleBulkStatusChange("Contacted")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer text-xs font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Contacted</span>
              </button>

              <button
                type="button"
                onClick={() => handleBulkStatusChange("New")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mark New</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setDeleteTarget({ type: "batch", ids: selectedIds })
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete ({selectedIds.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Leads Table Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto min-h-[360px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 font-semibold text-[11px] uppercase tracking-wider bg-slate-50/70">
                <th className="py-3.5 pl-4 pr-2 w-8">
                  <input
                    type="checkbox"
                    checked={isAllCurrentPageSelected}
                    onChange={handleToggleSelectAll}
                    disabled={paginatedLeads.length === 0}
                    aria-label="Select all leads on current page"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-semibold">Contact (Name & Email)</th>
                <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">Form</th>
                <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Source</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Received</th>
                <th className="py-3.5 px-4 font-semibold text-right w-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                        <Inbox className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {leads.length === 0 ? "No leads received yet" : "No leads match filters"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {leads.length === 0
                            ? "Submissions captured by your forms will automatically show up here."
                            : "Try adjusting your search criteria, dates, or status toggles."}
                        </p>
                      </div>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
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
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                        isSelected ? "bg-blue-50/30" : ""
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
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                        />
                      </td>

                      {/* Contact Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[180px] sm:max-w-[240px]">
                          {lead.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px] sm:max-w-[240px]">
                          {lead.email}
                        </div>
                      </td>

                      {/* Form */}
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5">
                          {lead.environment && (
                            <span
                              className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold uppercase tracking-wider ${
                                lead.environment === "production"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200/70"
                                  : "bg-amber-50 text-amber-700 border border-amber-200/70"
                              }`}
                            >
                              {lead.environment === "production" ? "PROD" : "DEV"}
                            </span>
                          )}
                          <span className="font-sans text-slate-600 truncate block max-w-[160px] font-medium">
                            {lead.formName}
                          </span>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span className="font-mono text-[11px] text-slate-500">
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
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${badge.bg}`}
                            title="Click to change lead status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                            <span>{lead.status}</span>
                            <ChevronDown className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100" />
                          </button>

                          {/* Status Popover Dropdown */}
                          {isStatusMenuOpen && (
                            <div className="absolute left-0 mt-1 w-32 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-30 animate-in fade-in duration-100">
                              {(["New", "Contacted", "Qualified", "Archived"] as LeadStatus[]).map(
                                (st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleUpdateStatus(lead.id, st)}
                                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                                      lead.status === st
                                        ? "text-blue-700 font-semibold bg-blue-50/60"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    <span>{st}</span>
                                    {lead.status === st && (
                                      <Check className="w-3.5 h-3.5 text-blue-600" />
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
                        className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap"
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
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            aria-label="Lead actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Action Dropdown Menu */}
                          {isActionMenuOpen && (
                            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-30 animate-in fade-in duration-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedLeadId(lead.id);
                                  setOpenActionMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-blue-600 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                                <span>View Details</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleCopyEmail(lead.email, e)}
                                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-blue-600 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Copy Email</span>
                              </button>

                              <div className="my-1 border-t border-slate-100" />

                              {lead.status !== "Contacted" && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(lead.id, "Contacted")}
                                  className="w-full text-left px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Mark Contacted</span>
                                </button>
                              )}

                              {lead.status !== "New" && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(lead.id, "New")}
                                  className="w-full text-left px-3 py-2 text-xs text-blue-700 hover:bg-blue-50 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>Mark New</span>
                                </button>
                              )}

                              <div className="my-1 border-t border-slate-100" />

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  setDeleteTarget({ type: "single", lead });
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer font-medium"
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
        <div className="p-3.5 sm:p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
          {/* Showing Count & Per Page Selector */}
          <div className="flex items-center gap-3">
            <div className="font-mono text-[11px]">
              Showing{" "}
              <span className="text-slate-900 font-semibold">
                {filteredLeads.length > 0
                  ? `${(safePage - 1) * pageSize + 1}-${Math.min(
                      safePage * pageSize,
                      filteredLeads.length
                    )}`
                  : "0"}
              </span>{" "}
              of{" "}
              <span className="text-slate-900 font-semibold">{filteredLeads.length}</span>{" "}
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
                className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[11px] focus:outline-none cursor-pointer"
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
              className="p-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer shadow-2xs"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 font-mono text-[11px] text-slate-600 font-medium">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer shadow-2xs"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center flex-none">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-heading font-bold text-slate-900">
                  {deleteTarget.type === "single"
                    ? "Delete Lead"
                    : "Delete Selected Leads"}
                </h3>
                <p className="text-[11.5px] text-slate-500">
                  {deleteTarget.type === "single"
                    ? `Are you sure you want to remove "${deleteTarget.lead.name}"?`
                    : `Are you sure you want to delete ${deleteTarget.ids.length} selected lead(s)?`}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              This action permanently deletes the submission record and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors cursor-pointer disabled:opacity-60 shadow-sm shadow-rose-500/20"
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

"use client";

import React from "react";
import Link from "next/link";
import { useDashboard } from "../context/dashboard-context";
import { OverviewSkeleton } from "./dashboard-skeleton";
import { StatCard } from "./stat-card";
import { FormattedDate } from "./formatted-date";
import {
  Users,
  Calendar,
  Clock,
  ShieldAlert,
  Plus,
  ArrowRight,
  CheckCircle2,
  Inbox,
  FileText,
  BarChart3,
} from "lucide-react";

export function OverviewView() {
  const {
    stats,
    leads,
    forms,
    isLoading,
    setSelectedLeadId,
    setIsCreateFormOpen,
    setSelectedFormId,
  } = useDashboard();

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  const recentLeads = leads.slice(0, 6);
  const isEmptyWorkspace = forms.length === 0 && leads.length === 0;

  // Aggregate counts by form
  const formCounts = forms.map((form) => ({
    name: form.name,
    count: leads.filter((l) => l.formId === form.id).length,
    id: form.id,
  }));

  // Aggregate counts by source
  const sourceMap = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});
  const sourceCounts = Object.entries(sourceMap).map(([source, count]) => ({
    source,
    count,
  }));

  const maxFormCount = Math.max(...formCounts.map((f) => f.count), 1);
  const maxSourceCount = Math.max(...sourceCounts.map((s) => s.count), 1);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header section with Welcome & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-slate-900">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">
            Inbound activity across all pipelines & endpoints
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <Link
            href="/dashboard/analytics"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs transition-all shadow-2xs"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Analytics</span>
          </Link>

          <button
            data-tour="create-form-btn"
            type="button"
            onClick={() => setIsCreateFormOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Form</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div data-tour="stats-overview" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Leads"
          value={stats.totalLeads}
          subtext="Verified submissions"
          href="/dashboard/leads"
          icon={Users}
        />
        <StatCard
          label="Past 24 Hours"
          value={stats.leadsToday}
          subtext="Today's new arrivals"
          href="/dashboard/leads?time=today"
          icon={Clock}
        />
        <StatCard
          label="Past 7 Days"
          value={stats.leadsThisWeek}
          subtext="Rolling 7-day velocity"
          href="/dashboard/leads?time=week"
          icon={Calendar}
        />
        <StatCard
          label="Spam Quarantined"
          value={stats.spamFlagged}
          subtext="Shielded from inbox"
          href="/dashboard/spam"
          icon={ShieldAlert}
        />
      </div>

      {/* Empty State Setup Checklist */}
      {isEmptyWorkspace && (
        <div className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-heading font-bold text-slate-900">
                Workspace Setup Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Follow these three simple steps to start capturing leads with zero backend setup.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2">
              <span className="text-[10px] font-mono uppercase text-blue-600 font-bold">
                Step 1
              </span>
              <h4 className="text-sm font-semibold text-slate-900">Create a Form</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate an endpoint URL with your required form fields.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateFormOpen(true)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Launch form modal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Step 2
              </span>
              <h4 className="text-sm font-semibold text-slate-900">Copy Snippet</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Paste the HTML form action or React fetch hook into your static site.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                Step 3
              </span>
              <h4 className="text-sm font-semibold text-slate-900">Send Test Lead</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Simulate a submission to test spam filters, email alerts, and tables.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Recent Leads Table & Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Leads Table (8 cols) */}
        <div data-tour="recent-leads-table" className="lg:col-span-8 rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-heading font-bold text-slate-900">
                Recent Submissions
              </h2>
            </div>
            <Link
              href="/dashboard/leads"
              className="text-xs text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-500 text-[11px] font-semibold uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3 px-4 font-semibold">Contact</th>
                  <th className="py-3 px-4 font-semibold hidden sm:table-cell">Form</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">Source</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Inbox className="w-6 h-6 text-slate-300" />
                        <p className="font-semibold text-slate-700">No leads recorded yet</p>
                        <p className="text-[11.5px] text-slate-400">
                          Submissions captured by your forms will appear here in real-time.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[160px] sm:max-w-[200px]">
                          {lead.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px] sm:max-w-[200px]">
                          {lead.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <span className="font-sans text-slate-600 truncate block max-w-[140px] font-medium">
                          {lead.formName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span className="font-mono text-[11px] text-slate-500">
                          {lead.source}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            lead.status === "New"
                              ? "bg-blue-50 text-blue-700 border-blue-200/80"
                              : lead.status === "Contacted"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                              : lead.status === "Qualified"
                              ? "bg-purple-50 text-purple-700 border-purple-200/80"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              lead.status === "New"
                                ? "bg-blue-600"
                                : lead.status === "Contacted"
                                ? "bg-emerald-600"
                                : lead.status === "Qualified"
                                ? "bg-purple-600"
                                : "bg-slate-500"
                            }`}
                          />
                          <span>{lead.status}</span>
                        </span>
                      </td>

                      <td
                        suppressHydrationWarning
                        className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap"
                      >
                        <FormattedDate date={lead.receivedAt} format="time" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakdown by Form & Source (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Lead Counts by Form */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Forms
              </h3>
              <Link
                href="/dashboard/forms"
                className="text-[11px] text-slate-500 hover:text-blue-600 font-semibold transition-colors"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-3 pt-1">
              {formCounts.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-xs">
                  <p className="text-slate-700 font-medium">No forms created yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click &quot;Create Form&quot; above to get started.</p>
                </div>
              ) : (
                formCounts.map((item) => {
                  const pct = Math.round((item.count / maxFormCount) * 100);
                  return (
                    <div
                      key={item.name}
                      onClick={() => setSelectedFormId(item.id)}
                      className="p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-800 group-hover:text-blue-600 font-semibold truncate">
                          {item.name}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px] tabular-nums font-semibold">
                          {item.count}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Lead Counts by Inbound Source */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <h3 className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
              <Inbox className="w-3.5 h-3.5 text-slate-400" />
              Traffic Sources
            </h3>

            <div className="space-y-2.5 pt-1">
              {sourceCounts.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-xs">
                  <p className="text-slate-700 font-medium">No traffic sources yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Source data will populate as inquiries arrive.</p>
                </div>
              ) : (
                sourceCounts.map((item) => {
                  const pct = Math.round((item.count / maxSourceCount) * 100);
                  return (
                    <div key={item.source} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 text-[11.5px] font-medium truncate">
                          {item.source}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px] tabular-nums font-semibold">
                          {item.count}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

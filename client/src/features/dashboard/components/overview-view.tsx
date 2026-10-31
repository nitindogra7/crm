"use client";

import React from "react";
import Link from "@/shared/components/app-link";
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
  } = useDashboard(["stats","leads","forms","isLoading","setSelectedLeadId","setIsCreateFormOpen","setSelectedFormId"]);

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
  })).sort((a, b) => b.count - a.count);

  // Aggregate counts by source
  const sourceMap = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});
  const sourceCounts = Object.entries(sourceMap).map(([source, count]) => ({
    source,
    count,
  })).sort((a, b) => b.count - a.count);

  const maxFormCount = Math.max(...formCounts.map((f) => f.count), 1);
  const maxSourceCount = Math.max(...sourceCounts.map((s) => s.count), 1);

  return (
    <div className="space-y-6">
      {/* Header section with Welcome & Primary CTA */}
      <div className="dashboard-page-header flex flex-col xl:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-slate-900">
            Overview
          </h1>
          <p className="text-[13px] sm:text-sm text-slate-500 mt-1 font-sans">
            Your latest leads and form activity.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <Link
            href="/dashboard/analytics"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-[13px] transition-all shadow-2xs"
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Analytics</span>
          </Link>

          <button
            data-tour="create-form-btn"
            type="button"
            onClick={() => setIsCreateFormOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Form</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div data-tour="stats-overview" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total leads"
          value={stats.totalLeads}
          href="/dashboard/leads"
          icon={Users}
        />
        <StatCard
          label="Today"
          value={stats.leadsToday}
          href="/dashboard/leads?time=today"
          icon={Clock}
        />
        <StatCard
          label="This week"
          value={stats.leadsThisWeek}
          href="/dashboard/leads?time=week"
          icon={Calendar}
        />
        <StatCard
          label="Flagged spam"
          value={stats.spamFlagged}
          href="/dashboard/spam"
          icon={ShieldAlert}
        />
      </div>

      {isEmptyWorkspace && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Connect your first form</h2>
              <p className="mt-1 text-sm text-slate-500">Three steps to start receiving leads.</p>
            </div>
            <Link href="/docs" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-blue-600 hover:text-blue-700">
              Setup guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ol className="mt-5 grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-3">
            {[
              ["Create a form", "Choose the fields you want to collect."],
              ["Connect your website", "Add the form endpoint to your site."],
              ["Send a test", "Check that your submission arrives here."],
            ].map(([title, description], index) => (
              <li key={title} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">{index + 1}</span>
                <div>
                  <h3 className="text-sm font-medium text-slate-900">{title}</h3>
                  <p className="mt-1 text-[13px] text-slate-500">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Main Grid: Recent Leads Table & Breakdown Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Recent Leads Table (8 cols) */}
        <div data-tour="recent-leads-table" className="min-w-0 xl:col-span-8 rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-heading font-bold text-slate-900">
                Recent leads
              </h2>
            </div>
            <Link
              href="/dashboard/leads"
              className="text-[13px] text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-500 text-[13px] font-medium bg-slate-50/70">
                  <th className="py-3 px-4 font-semibold">Contact</th>
                  <th className="py-3 px-4 font-semibold hidden sm:table-cell">Form</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">Source</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right hidden sm:table-cell">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 text-[13px]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Inbox className="w-6 h-6 text-slate-300" />
                        <p className="font-semibold text-slate-700">No leads recorded yet</p>
                        <p className="text-[13px] text-slate-500">
                          New form submissions will appear here.
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
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
                          <button type="button" className="max-w-full truncate text-left" onClick={(e) => { e.stopPropagation(); setSelectedLeadId(lead.id); }}>{lead.name}</button>
                        </div>
                        <div className="text-[13px] text-slate-500 truncate max-w-[150px] sm:max-w-[200px]">
                          {lead.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <span className="font-sans text-slate-600 truncate block max-w-[140px] font-medium">
                          {lead.formName}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span className="font-sans text-[13px] text-slate-500">
                          {lead.source}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[13px] font-semibold border ${
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
                        className="py-3.5 px-4 text-right font-sans text-[13px] text-slate-500 whitespace-nowrap hidden sm:table-cell"
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
        <div className="min-w-0 grid gap-5 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1">
          {/* Lead Counts by Form */}
          <div className="min-w-0 p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-slate-600 flex items-center gap-1.5 normal-case tracking-normal">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Top forms
              </h3>
              <Link
                href="/dashboard/forms"
                className="text-[13px] text-slate-500 hover:text-blue-600 font-semibold transition-colors"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-3 pt-1">
              {formCounts.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-[13px]">
                  <p className="text-slate-700 font-medium">No forms created yet</p>
                  <p className="text-[13px] text-slate-500 mt-0.5">Create a form to start collecting leads.</p>
                </div>
              ) : (
                formCounts.slice(0, 5).map((item) => {
                  const pct = Math.round((item.count / maxFormCount) * 100);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedFormId(item.id)}
                      type="button"
                      className="block min-w-0 w-full p-1.5 rounded-lg text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex min-w-0 items-center justify-between gap-3 text-[13px] mb-2">
                        <span className="text-slate-800 group-hover:text-blue-600 font-semibold truncate">
                          {item.name}
                        </span>
                        <span className="shrink-0 text-slate-600 tabular-nums text-[13px] font-medium">
                          {item.count}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Lead Counts by Inbound Source */}
          <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[13px] font-semibold text-slate-600 flex items-center gap-1.5">
                <Inbox className="w-3.5 h-3.5 text-slate-500" />
                Top sources
              </h3>
              <Link href="/dashboard/analytics" className="text-[13px] font-medium text-slate-500 hover:text-blue-600">View all</Link>
            </div>

            <div className="space-y-2.5 pt-1">
              {sourceCounts.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-[13px]">
                  <p className="text-slate-700 font-medium">No traffic sources yet</p>
                  <p className="text-[13px] text-slate-500 mt-0.5">Sources appear after your first submission.</p>
                </div>
              ) : (
                sourceCounts.slice(0, 5).map((item) => {
                  const pct = Math.round((item.count / maxSourceCount) * 100);
                  return (
                    <div key={item.source} className="space-y-1 text-[13px]">
                      <div className="flex min-w-0 items-center justify-between gap-3">
                        <span className="text-slate-600 text-[13px] font-medium truncate">
                          {item.source}
                        </span>
                        <span className="shrink-0 text-slate-600 tabular-nums text-[13px] font-medium">
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

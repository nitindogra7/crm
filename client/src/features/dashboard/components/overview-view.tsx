"use client";

import React from "react";
import Link from "next/link";
import { useDashboard } from "../context/dashboard-context";
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
    workspace,
    stats,
    leads,
    forms,
    setSelectedLeadId,
    setIsCreateFormOpen,
    setSelectedFormId,
  } = useDashboard();

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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-zinc-400 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Workspace: {workspace.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-white">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
            Monitor incoming leads, inspect delivery activity, and manage your form pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <Link
            href="/dashboard/analytics"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 font-medium text-xs transition-colors shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Analytics</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsCreateFormOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Form</span>
          </button>
        </div>
      </div>

      {/* 4 Compact Stat Cards (Clicking opens relevant filtered page) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Leads"
          value={stats.totalLeads}
          subtext="All-time verified submissions"
          href="/dashboard/leads"
          icon={Users}
          badge="Inbox"
          badgeColor="blue"
        />
        <StatCard
          label="Leads Today"
          value={stats.leadsToday}
          subtext="Received past 24 hours"
          href="/dashboard/leads?time=today"
          icon={Clock}
          badge="Live"
          badgeColor="emerald"
        />
        <StatCard
          label="Leads This Week"
          value={stats.leadsThisWeek}
          subtext="Rolling 7-day volume"
          href="/dashboard/leads?time=week"
          icon={Calendar}
          badge="Weekly"
          badgeColor="emerald"
        />
        <StatCard
          label="Spam Flagged"
          value={stats.spamFlagged}
          subtext="Shielded & quarantined"
          href="/dashboard/spam"
          icon={ShieldAlert}
          badge="Shield"
          badgeColor="amber"
        />
      </div>

      {/* Empty State Setup Checklist */}
      {isEmptyWorkspace && (
        <div className="p-6 rounded-2xl border border-white/[0.1] bg-[#181818] space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-medium font-heading text-white">
                Workspace Setup Checklist
              </h3>
              <p className="text-xs text-zinc-400">
                Follow these three simple steps to start capturing leads with zero backend setup.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#141414] space-y-2">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                Step 1
              </span>
              <h4 className="text-sm font-medium text-white">Create a Form</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generate an endpoint URL with your required form fields.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateFormOpen(true)}
                className="mt-2 text-xs text-white font-medium underline flex items-center gap-1"
              >
                <span>Launch form modal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#141414] space-y-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold">
                Step 2
              </span>
              <h4 className="text-sm font-medium text-white">Copy Snippet</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Paste the HTML form action or React fetch hook into your static site.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#141414] space-y-2">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold">
                Step 3
              </span>
              <h4 className="text-sm font-medium text-white">Send Test Lead</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Simulate a submission to test spam filters, email alerts, and tables.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Recent Leads Table (Left/Top) & Breakdown Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Leads Table (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-white/[0.08] bg-[#181818]/90 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-heading font-medium text-white">
                Recent Leads
              </h2>
              <p className="text-[11.5px] text-zinc-400">
                Latest submissions across all active form endpoints.
              </p>
            </div>
            <Link
              href="/dashboard/leads"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-500 font-mono text-[10.5px] uppercase tracking-wider bg-white/[0.01]">
                  <th className="py-3 px-4 font-normal">Contact</th>
                  <th className="py-3 px-4 font-normal hidden sm:table-cell">Form</th>
                  <th className="py-3 px-4 font-normal hidden md:table-cell">Source</th>
                  <th className="py-3 px-4 font-normal">Status</th>
                  <th className="py-3 px-4 font-normal text-right">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500 text-xs">
                      No recent leads recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-zinc-200 group-hover:text-white transition-colors truncate max-w-[160px] sm:max-w-[200px]">
                          {lead.name}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[160px] sm:max-w-[200px]">
                          {lead.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <span className="font-sans text-zinc-300 truncate block max-w-[140px]">
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
                        <FormattedDate date={lead.receivedAt} format="time" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Breakdown by Form & Source (4 cols) - Clean, simple, no heavy charts */}
        <div className="lg:col-span-4 space-y-4">
          {/* Lead Counts by Form */}
          <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                Leads by Form
              </h3>
              <Link
                href="/dashboard/forms"
                className="text-[11px] text-zinc-400 hover:text-white transition-colors"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-3 pt-1">
              {formCounts.map((item) => {
                const pct = Math.round((item.count / maxFormCount) * 100);
                return (
                  <div
                    key={item.name}
                    onClick={() => setSelectedFormId(item.id)}
                    className="p-2 -mx-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-zinc-200 group-hover:text-white font-medium truncate">
                        {item.name}
                      </span>
                      <span className="text-zinc-400 font-mono text-[11.5px] tabular-nums">
                        {item.count} leads
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full bg-emerald-400/80 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Counts by Inbound Source */}
          <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Inbox className="w-3.5 h-3.5 text-zinc-500" />
              Traffic by Inbound Source
            </h3>

            <div className="space-y-2.5 pt-1">
              {sourceCounts.map((item) => {
                const pct = Math.round((item.count / maxSourceCount) * 100);
                return (
                  <div key={item.source} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-300 font-mono text-[11px] truncate">
                        {item.source}
                      </span>
                      <span className="text-zinc-400 font-mono text-[11px] tabular-nums">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full bg-zinc-300 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

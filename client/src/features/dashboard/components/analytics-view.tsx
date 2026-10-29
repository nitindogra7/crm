"use client";

import React, { useState, useMemo } from "react";
import { useDashboard } from "../context/dashboard-context";
import { AnalyticsSkeleton } from "./dashboard-skeleton";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Download } from "lucide-react";

type TimeRange = "7d" | "30d" | "90d";

const SOURCE_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899"];
const SPAM_COLORS = ["#f59e0b", "#ef4444", "#f97316", "#eab308"];

function useHydrated() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

// Custom Chart Tooltip declared outside render to satisfy React 19 rules
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl border border-white/[0.12] bg-[#181818]/95 backdrop-blur-md shadow-2xl text-xs space-y-1.5 font-sans">
        <p className="font-mono text-zinc-400 text-[11px] font-medium border-b border-white/[0.08] pb-1">
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-mono font-medium text-white tabular-nums">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function AnalyticsView() {
  const { leads, spam, forms, isLoading, addToast } = useDashboard();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const isMounted = useHydrated();

  // 1. Calculate Daily Timeline Data
  const timelineData = useMemo(() => {
    const daysCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 14 : 30;
    const now = new Date();
    const result = [];

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      const dayLeads = leads.filter((l) => {
        const t = new Date(l.receivedAt).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      const daySpam = spam.filter((s) => {
        const t = new Date(s.receivedAt).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      result.push({
        date: dateLabel,
        leads: dayLeads,
        spam: daySpam,
        total: dayLeads + daySpam,
      });
    }

    return result;
  }, [leads, spam, timeRange]);

  // 2. Calculate Form Performance Data
  const formData = useMemo(() => {
    return forms.map((form) => {
      const formLeads = leads.filter((l) => l.formId === form.id).length;
      const formSpam = spam.filter((s) => s.formId === form.id).length;
      return {
        name: form.name,
        leads: formLeads,
        spam: formSpam,
        total: formLeads + formSpam,
      };
    });
  }, [forms, leads, spam]);

  // 3. Traffic Source Distribution Data
  const sourceData = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach((l) => {
      map.set(l.source, (map.get(l.source) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [leads]);

  // 4. Spam Reasons Distribution Data
  const spamReasonData = useMemo(() => {
    const map = new Map<string, number>();
    spam.forEach((s) => {
      map.set(s.reason, (map.get(s.reason) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [spam]);

  // 5. Hourly Activity Distribution (dynamically aggregated)
  const hourlyData = useMemo(() => {
    const buckets: Record<string, number> = {
      "12 AM": 0,
      "3 AM": 0,
      "6 AM": 0,
      "9 AM": 0,
      "12 PM": 0,
      "3 PM": 0,
      "6 PM": 0,
      "9 PM": 0,
    };

    leads.forEach((l) => {
      if (!l.receivedAt) return;
      const hour = new Date(l.receivedAt).getHours();
      if (hour < 3) buckets["12 AM"]++;
      else if (hour < 6) buckets["3 AM"]++;
      else if (hour < 9) buckets["6 AM"]++;
      else if (hour < 12) buckets["9 AM"]++;
      else if (hour < 15) buckets["12 PM"]++;
      else if (hour < 18) buckets["3 PM"]++;
      else if (hour < 21) buckets["6 PM"]++;
      else buckets["9 PM"]++;
    });

    return Object.entries(buckets).map(([hour, count]) => ({ hour, count }));
  }, [leads]);

  const peakBucket = useMemo(() => {
    const max = Math.max(...hourlyData.map((h) => h.count));
    if (max === 0) return null;
    const found = hourlyData.find((h) => h.count === max);
    return found ? found.hour : null;
  }, [hourlyData]);

  // Summary Metrics
  const totalSubmissions = leads.length + spam.length;
  const cleanRate = totalSubmissions > 0 ? Math.round((leads.length / totalSubmissions) * 100) : 0;
  const spamRate = totalSubmissions > 0 ? Math.round((spam.length / totalSubmissions) * 100) : 0;
  const avgDaily = (leads.length / (timeRange === "7d" ? 7 : 30)).toFixed(1);

  const handleExportCSV = () => {
    const rows = [
      ["Date", "Verified Leads", "Filtered Spam", "Total Inbound"],
      ...timelineData.map((d) => [d.date, d.leads, d.spam, d.total]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `salenova_analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast("Analytics exported", `Generated report for ${timeRange} timeline.`);
  };

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Interactive Data Visualizations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-white">
            Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track submission volume trajectories, form conversion efficiency, and spam filtering benchmarks.
          </p>
        </div>

        {/* Toolbar: Time Range Toggle + Export CSV */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="p-0.5 rounded-xl border border-white/[0.08] bg-[#181818] flex items-center text-xs">
            {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  timeRange === range
                    ? "bg-white/[0.1] text-white font-medium shadow-sm"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-200 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#181818]/90">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
            Total Submissions
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-medium text-white tabular-nums">
            {totalSubmissions}
          </div>
          <p className="text-[11.5px] text-zinc-500 mt-1 font-sans">
            Inbound payloads received
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#181818]/90">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-1">
            Clean Lead Quality
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-medium text-emerald-400 tabular-nums">
            {cleanRate}%
          </div>
          <p className="text-[11.5px] text-zinc-500 mt-1 font-sans">
            Passed verification cleanly
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#181818]/90">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1">
            Avg. Inbound Rate
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-medium text-white tabular-nums">
            {avgDaily} <span className="text-sm font-normal text-zinc-500">/day</span>
          </div>
          <p className="text-[11.5px] text-zinc-500 mt-1 font-sans">
            Average verified leads
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#181818]/90">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 block mb-1">
            Spam Block Rate
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-medium text-amber-400 tabular-nums">
            {spamRate}%
          </div>
          <p className="text-[11.5px] text-zinc-500 mt-1 font-sans">
            Filtered out by bot defense
          </p>
        </div>
      </div>

      {/* Main Chart: Timeline Volume (AreaChart with Gradient) */}
      <div className="p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-heading font-medium text-white">
              Inbound Pipeline Activity Over Time
            </h2>
            <p className="text-[11.5px] text-zinc-400">
              Verified incoming leads contrasted with quarantined/rejected spam bots.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Verified Leads
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Spam Shield Blocks
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="spamGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Verified Leads"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#leadGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="spam"
                  name="Blocked Spam"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#spamGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-zinc-500 font-mono">
              Loading graph visualizations...
            </div>
          )}
        </div>
      </div>

      {/* Grid: Form Performance (Left) and Source Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Conversion Comparison (7 cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-heading font-medium text-white">
                Volume by Form Endpoint
              </h2>
              <p className="text-[11.5px] text-zinc-400">
                Comparative submission volume per individual form endpoint.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              {forms.length} active endpoints
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            {formData.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/[0.08] rounded-xl text-zinc-500 text-xs gap-1.5">
                <p className="font-medium text-zinc-400">No form endpoints registered yet</p>
                <p className="text-[11px] text-zinc-600">Create forms to track comparative volume per endpoint.</p>
              </div>
            ) : isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="name"
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                  />
                  <YAxis
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="leads" name="Verified Leads" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spam" name="Blocked Spam" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* Traffic Source Donut Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-heading font-medium text-white">
              Inbound Traffic Sources
            </h2>
            <p className="text-[11.5px] text-zinc-400">
              Distribution of incoming leads across capture channels.
            </p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            {sourceData.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/[0.08] rounded-xl text-zinc-500 text-xs gap-1.5">
                <p className="font-medium text-zinc-400">No traffic sources recorded yet</p>
                <p className="text-[11px] text-zinc-600">Source tags will populate as inquiries arrive.</p>
              </div>
            ) : isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={SOURCE_COLORS[index % SOURCE_COLORS.length]}
                        stroke="rgba(0,0,0,0.4)"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : null}

            {sourceData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-heading font-medium text-white tabular-nums">
                  {leads.length}
                </span>
                <span className="text-[10px] font-mono uppercase text-zinc-500">
                  Total Leads
                </span>
              </div>
            )}
          </div>

          {/* Legend items */}
          {sourceData.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs">
              {sourceData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-none"
                    style={{ backgroundColor: SOURCE_COLORS[idx % SOURCE_COLORS.length] }}
                  />
                  <span className="text-zinc-300 truncate text-[11px] font-mono">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Spam Filter Breakdown & Hourly Peak Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spam Reasons Breakdown */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-4">
          <div>
            <h2 className="text-sm sm:text-base font-heading font-medium text-white">
              Spam Detection Trigger Rules
            </h2>
            <p className="text-[11.5px] text-zinc-400">
              Breakdown of automated defenses that intercepted malicious or junk submissions.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {spamReasonData.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-white/[0.08] rounded-xl text-zinc-500 text-xs">
                <p className="font-medium text-zinc-400">No spam detected</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">Automated bot defense triggers will be charted here.</p>
              </div>
            ) : (
              spamReasonData.map((item, idx) => {
                const pct = spam.length > 0 ? Math.round((item.value / spam.length) * 100) : 0;
                return (
                  <div key={item.name} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-300 font-mono text-[11.5px] flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: SPAM_COLORS[idx % SPAM_COLORS.length] }}
                        />
                        {item.name}
                      </span>
                      <span className="text-zinc-400 font-mono text-[11px] tabular-nums">
                        {item.value} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: SPAM_COLORS[idx % SPAM_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Hourly Peak Activity Heatmap */}
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-heading font-medium text-white">
                Submissions by Time of Day
              </h2>
              <p className="text-[11.5px] text-zinc-400">
                Hourly activity clusters to understand when prospects submit inquiries.
              </p>
            </div>
            {peakBucket ? (
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Peak: {peakBucket}
              </span>
            ) : (
              <span className="text-[11px] font-mono text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                Awaiting Submissions
              </span>
            )}
          </div>

          <div className="h-48 w-full pt-2">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="hour"
                    stroke="#71717a"
                    fontSize={10.5}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                  />
                  <YAxis
                    stroke="#71717a"
                    fontSize={10.5}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Submissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

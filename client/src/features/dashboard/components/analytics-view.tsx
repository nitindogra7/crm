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
import { Download } from "lucide-react";

type TimeRange = "7d" | "30d" | "90d";

const SOURCE_COLORS = ["#2563eb", "#06b6d4", "#10b981", "#8b5cf6", "#f59e0b"];
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
      <div className="p-3 rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-xl text-[13px] space-y-1.5 font-sans">
        <p className="font-sans text-slate-500 text-[13px] font-semibold border-b border-slate-100 pb-1">
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-sans font-bold text-slate-900 tabular-nums">
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
  const { leads: allLeads, spam: allSpam, forms, isLoading, addToast } = useDashboard(["leads","spam","forms","isLoading","addToast"]);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const isMounted = useHydrated();

  const daysCount = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
  const { leads, spam, days } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Array.from({ length: daysCount }, (_, index) => {
      const day = new Date(today);
      day.setDate(day.getDate() - daysCount + index + 1);
      return day;
    });
    const start = days[0].getTime();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime();
    const inRange = (item: { receivedAt: string }) => { const time = new Date(item.receivedAt).getTime(); return time >= start && time < end; };
    return { leads: allLeads.filter(inRange), spam: allSpam.filter(inRange), days };
  }, [allLeads, allSpam, daysCount]);

  // 1. Calculate Daily Timeline Data
  const timelineData = useMemo(() => {
    const buckets = new Map(days.map(day => [day.toDateString(), { date: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }), leads: 0, spam: 0, total: 0 }]));
    leads.forEach(lead => { const bucket = buckets.get(new Date(lead.receivedAt).toDateString()); if (bucket) { bucket.leads++; bucket.total++; } });
    spam.forEach(item => { const bucket = buckets.get(new Date(item.receivedAt).toDateString()); if (bucket) { bucket.spam++; bucket.total++; } });
    return Array.from(buckets.values());
  }, [leads, spam, days]);

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
  const avgDaily = (leads.length / daysCount).toFixed(1);

  const handleExportCSV = () => {
    const rows = [
      ["Date", "Verified Leads", "Filtered Spam", "Total Inbound"],
      ...timelineData.map((d) => [d.date, d.leads, d.spam, d.total]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `infraly_analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast("Analytics exported", `Generated report for ${timeRange} timeline.`);
  };

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="dashboard-page-header flex flex-col xl:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-slate-900">
            Analytics
          </h1>
          <p className="text-[13px] sm:text-sm text-slate-500 mt-1 font-sans">
            Lead volume, sources, and spam activity.
          </p>
        </div>

        {/* Toolbar: Time Range Toggle + Export CSV */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <div className="p-1 rounded-xl border border-slate-200/80 bg-slate-100/90 flex items-center text-[13px]">
            {(["7d", "30d", "90d"] as TimeRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                aria-pressed={timeRange === range}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-sans transition-all cursor-pointer ${
                  timeRange === range
                    ? "bg-white text-slate-900 font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 font-medium"
                }`}
              >
                {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-[13px] font-semibold text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <span className="text-[13px] font-semibold normal-case tracking-normal text-slate-500 block min-h-10 mb-1">
            Total submissions
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-semibold text-slate-900 tabular-nums">
            {totalSubmissions}
          </div>
          <p className="text-[13px] text-slate-500 mt-1 font-sans">
            Leads and spam combined
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <span className="text-[13px] font-semibold normal-case tracking-normal text-emerald-700 block min-h-10 mb-1">
            Verified leads
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-semibold text-emerald-600 tabular-nums">
            {cleanRate}%
          </div>
          <p className="text-[13px] text-slate-500 mt-1 font-sans">
            Share of all submissions
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <span className="text-[13px] font-semibold normal-case tracking-normal text-slate-500 block min-h-10 mb-1">
            Daily average
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-semibold text-slate-900 tabular-nums">
            {avgDaily} <span className="text-sm font-normal text-slate-500">/day</span>
          </div>
          <p className="text-[13px] text-slate-500 mt-1 font-sans">
            Average verified leads
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-white shadow-xs">
          <span className="text-[13px] font-semibold normal-case tracking-normal text-amber-700 block min-h-10 mb-1">
            Spam rate
          </span>
          <div className="text-2xl sm:text-3xl font-heading font-semibold text-amber-600 tabular-nums">
            {spamRate}%
          </div>
          <p className="text-[13px] text-slate-500 mt-1 font-sans">
            Share flagged as spam
          </p>
        </div>
      </div>

      {/* Main Chart: Timeline Volume (AreaChart with Gradient) */}
      <div className="p-5 sm:p-6 rounded-xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-heading font-bold text-slate-900">
              Submission activity
            </h2>
            <p className="text-[13px] text-slate-500">
              Leads and spam over time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-sans">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Verified Leads
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Flagged spam
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="spamGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area isAnimationActive={false}
                  type="monotone"
                  dataKey="leads"
                  name="Verified Leads"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#leadGradient)"
                />
                <Area isAnimationActive={false}
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
            <div className="h-full flex items-center justify-center text-[13px] text-slate-500 font-sans">
              Loading chart...
            </div>
          )}
        </div>
      </div>

      {/* Grid: Form Performance (Left) and Source Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Conversion Comparison (7 cols) */}
        <div className="min-w-0 lg:col-span-7 p-5 sm:p-6 rounded-xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-heading font-bold text-slate-900">
                Leads by form
              </h2>
              <p className="text-[13px] text-slate-500">
                Submission counts for each form.
              </p>
            </div>
            <span className="text-[13px] font-sans text-slate-500">
              {forms.length} active endpoints
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            {formData.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl text-slate-500 text-[13px] gap-1.5">
                <p className="font-semibold text-slate-700">No form endpoints registered yet</p>
                <p className="text-[13px] text-slate-500">Create forms to track comparative volume per endpoint.</p>
              </div>
            ) : isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar isAnimationActive={false} dataKey="leads" name="Verified Leads" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  <Bar isAnimationActive={false} dataKey="spam" name="Blocked Spam" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* Traffic Source Donut Breakdown (5 cols) */}
        <div className="min-w-0 lg:col-span-5 p-5 sm:p-6 rounded-xl border border-slate-200/80 bg-white space-y-4 flex flex-col justify-between shadow-xs">
          <div>
            <h2 className="text-sm sm:text-base font-heading font-bold text-slate-900">
              Lead sources
            </h2>
            <p className="text-[13px] text-slate-500">
              Where your leads come from.
            </p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            {sourceData.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl text-slate-500 text-[13px] gap-1.5">
                <p className="font-semibold text-slate-700">No traffic sources recorded yet</p>
                <p className="text-[13px] text-slate-500">Source tags will populate as inquiries arrive.</p>
              </div>
            ) : isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie isAnimationActive={false}
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
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : null}

            {sourceData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-heading font-bold text-slate-900 tabular-nums">
                  {leads.length}
                </span>
                <span className="text-[10px] font-sans uppercase text-slate-500 font-semibold">
                  Total Leads
                </span>
              </div>
            )}
          </div>

          {/* Legend items */}
          {sourceData.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[13px]">
              {sourceData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-none"
                    style={{ backgroundColor: SOURCE_COLORS[idx % SOURCE_COLORS.length] }}
                  />
                  <span className="text-slate-700 truncate text-[13px] font-sans font-medium">
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
        <div className="min-w-0 lg:col-span-6 p-5 sm:p-6 rounded-xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
          <div>
            <h2 className="text-sm sm:text-base font-heading font-bold text-slate-900">
              Spam reasons
            </h2>
            <p className="text-[13px] text-slate-500">
              Why submissions were flagged.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {spamReasonData.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-500 text-[13px]">
                <p className="font-semibold text-slate-700">No spam detected</p>
                <p className="text-[13px] text-slate-500 mt-0.5">Automated bot defense triggers will be charted here.</p>
              </div>
            ) : (
              spamReasonData.map((item, idx) => {
                const pct = spam.length > 0 ? Math.round((item.value / spam.length) * 100) : 0;
                return (
                  <div key={item.name} className="space-y-1 text-[13px]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-slate-700 font-sans text-[13px] flex items-center gap-2 font-medium">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: SPAM_COLORS[idx % SPAM_COLORS.length] }}
                        />
                        {item.name}
                      </span>
                      <span className="text-slate-500 font-sans text-[13px] tabular-nums font-semibold">
                        {item.value} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
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
        <div className="min-w-0 lg:col-span-6 p-5 sm:p-6 rounded-xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm sm:text-base font-heading font-bold text-slate-900">
                Time of day
              </h2>
              <p className="text-[13px] text-slate-500">
                When leads submit your forms.
              </p>
            </div>
            {peakBucket ? (
              <span className="text-[13px] font-sans text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/80 font-semibold">
                Peak: {peakBucket}
              </span>
            ) : (
              <span className="text-[13px] font-sans text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200 font-medium">
                No activity yet
              </span>
            )}
          </div>

          <div className="h-48 w-full pt-2">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="hour"
                    stroke="#64748b"
                    fontSize={10.5}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10.5}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar isAnimationActive={false} dataKey="count" name="Submissions" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

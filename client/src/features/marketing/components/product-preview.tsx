"use client";

import React, { useState } from "react";
import Image from "next/image";
import { InboxIcon, PlusIcon } from "./icons";
import {
  TrendingUp,
  Clock,
  Search,
  CheckCircle2,
  BarChart3,
  Layers,
  Settings,
  ShieldCheck,
  Activity,
  ArrowUpRight,
} from "lucide-react";

export interface LeadItem {
  name: string;
  email: string;
  source: string;
  status: "New" | "Contacted" | "Flagged";
  time: string;
  message: string;
}

interface ProductPreviewProps {
  leads: LeadItem[];
  spam: LeadItem[];
  view: "leads" | "spam";
  onViewChange: (view: "leads" | "spam") => void;
  onOpenInquiry: () => void;
  onOpenDetail: (lead: LeadItem) => void;
  onRestoreSpam: (index: number) => void;
  motionPaused: boolean;
  onToggleMotion: () => void;
}

export function ProductPreview({
  leads,
  spam,
  view,
  onViewChange,
  onOpenInquiry,
  onOpenDetail,
  onRestoreSpam,
  motionPaused,
  onToggleMotion,
}: ProductPreviewProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "inbox">("analytics");
  const [activeRange, setActiveRange] = useState<"12M" | "30D" | "7D">("12M");

  const activeEntries = view === "leads" ? leads : spam;

  return (
    <section className="pb-20 pt-4" id="product">
      <div className="w-[min(1160px,calc(100%-36px))] mx-auto">
        {/* Top telemetry caption */}
        <div
          className="flex items-center justify-between px-2 pb-3.5 text-[9px] tracking-[0.08em] text-[#98a6a1]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#34d399]"
              style={{
                boxShadow: "0 0 8px rgba(52, 211, 153, 0.6)",
              }}
            />
            LIVE TELEMETRY & PIPELINE ENGINE
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleMotion}
              aria-pressed={motionPaused}
              className="min-h-[26px] px-2.5 rounded-md text-[9px] text-[#a9b8af] border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              {motionPaused ? "Resume animations" : "Pause effects"}
            </button>
          </div>
        </div>

        {/* Outer Dashboard Shell (Template Styled) */}
        <div className="bg-[#141b18]/95 backdrop-blur-xl border border-white/[0.12] rounded-3xl shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_30px_90px_rgba(0,0,0,0.6)] overflow-hidden relative">
          {/* Subtle Top Glow Highlight */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#ff995e]/40 to-transparent pointer-events-none" />

          {/* Top Window Navigation Bar */}
          <div className="h-14 flex items-center justify-between px-5 md:px-7 border-b border-white/[0.08] bg-white/[0.015]">
            {/* Left: Brand / Workspace */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <Image
                  src="/favicon.ico"
                  alt="Infraly"
                  width={28}
                  height={28}
                  unoptimized
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#f5f7f5]">
                <span>Infraly Workspace</span>
                <span className="text-[#6d7d76]">/</span>
                <span className="text-[#a8b8b0] text-[11px]">Inbound Pipeline</span>
              </div>
            </div>

            {/* Middle: Mode Switcher Pills */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-[#0e1411] border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "analytics"
                    ? "bg-[#222e28] text-[#ffb080] shadow-sm"
                    : "text-[#8a9b92] hover:text-[#f5f7f5]"
                }`}
              >
                Analytics & Graphs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("inbox")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === "inbox"
                    ? "bg-[#222e28] text-[#ffb080] shadow-sm"
                    : "text-[#8a9b92] hover:text-[#f5f7f5]"
                }`}
              >
                <span>Live Inquiries</span>
                <span className="px-1.5 py-0.2 bg-[#ff995e]/20 text-[#ffab76] text-[10px] rounded-full">
                  {leads.length}
                </span>
              </button>
            </div>

            {/* Right: Search, Notifications & Try Inquiry */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-[#8a9b92]">
                <Search className="w-3.5 h-3.5" />
                <span className="text-[11px]">Search leads or metrics...</span>
              </div>

              <button
                type="button"
                onClick={onOpenInquiry}
                className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#ffb080] to-[#f48143] text-[#2d1b09] text-xs font-semibold hover:brightness-105 active:scale-95 transition-all shadow-md"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Test Lead</span>
              </button>
            </div>
          </div>

          {/* Main Dashboard Body: Left Mini-Nav + Content Area */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)] min-h-[520px]">
            {/* Sidebar (Template Style) */}
            <aside className="p-4 bg-[#111714] border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-row md:flex-col justify-between gap-1 overflow-x-auto">
              <div className="space-y-1 w-full flex-1">
                <span
                  className="hidden md:block px-3 pb-2 text-[9px] uppercase tracking-[0.1em] text-[#71827a] font-medium"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Dashboard Menu
                </span>

                <button
                  type="button"
                  onClick={() => setActiveTab("analytics")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                    activeTab === "analytics"
                      ? "bg-[#202c26] text-[#ffab76] border border-[#ff995e]/20"
                      : "text-[#9cb0a6] hover:bg-white/[0.03] hover:text-[#f5f7f5]"
                  }`}
                >
                  <Activity className="w-4 h-4 text-[#ffab76]" />
                  <span>Overview & Charts</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("inbox");
                    onViewChange("leads");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                    activeTab === "inbox" && view === "leads"
                      ? "bg-[#202c26] text-[#ffab76] border border-[#ff995e]/20"
                      : "text-[#9cb0a6] hover:bg-white/[0.03] hover:text-[#f5f7f5]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <InboxIcon className="w-4 h-4" />
                    <span>Inbound Leads</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.08] text-[#cdd8d2]">
                    {leads.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("inbox");
                    onViewChange("spam");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                    activeTab === "inbox" && view === "spam"
                      ? "bg-[#202c26] text-[#ffab76] border border-[#ff995e]/20"
                      : "text-[#9cb0a6] hover:bg-white/[0.03] hover:text-[#f5f7f5]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#34d399]" />
                    <span>Spam Quarantine</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#34d399]/20 text-[#34d399]">
                    {spam.length}
                  </span>
                </button>

                <div className="hidden md:block pt-3 border-t border-white/[0.06] mt-3 space-y-1">
                  <div className="px-3 py-1.5 text-xs text-[#71827a] flex items-center gap-2.5 hover:text-[#cdd8d2] cursor-pointer">
                    <BarChart3 className="w-4 h-4" />
                    <span>Reports & ROI</span>
                  </div>
                  <div className="px-3 py-1.5 text-xs text-[#71827a] flex items-center gap-2.5 hover:text-[#cdd8d2] cursor-pointer">
                    <Layers className="w-4 h-4" />
                    <span>Endpoints & Forms</span>
                  </div>
                  <div className="px-3 py-1.5 text-xs text-[#71827a] flex items-center gap-2.5 hover:text-[#cdd8d2] cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span>Workspace Settings</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Status */}
              <div className="hidden md:block mt-auto p-3 rounded-2xl bg-[#19221d] border border-white/[0.06]">
                <div className="flex items-center gap-2 text-[11px] text-[#ffab76] font-medium mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                  <span>Pipeline Shield: Active</span>
                </div>
                <p className="text-[10px] text-[#7f9188] leading-relaxed">
                  0 spam bypasses in last 30 days. Auto-quarantine is active.
                </p>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="p-5 md:p-7 min-w-0 flex flex-col justify-between">
              {/* Top 4 Stat Cards (Just like the template image!) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                {/* Stat 1: Total Inbound Leads */}
                <div className="p-4 rounded-2xl bg-[#1a231f] border border-white/[0.07] hover:border-white/[0.15] transition-all">
                  <div className="flex items-center justify-between text-[11px] text-[#8fa198] mb-2">
                    <span>Total Inbound</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#34d399]/15 text-[#34d399] font-medium flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +14.2%
                    </span>
                  </div>
                  <div className="text-xl md:text-2xl font-semibold text-[#f5f7f5] tracking-tight">
                    24,150
                  </div>
                  <div className="text-[10px] text-[#73847c] mt-1">Across all web forms</div>
                </div>

                {/* Stat 2: Qualified Leads */}
                <div className="p-4 rounded-2xl bg-[#1a231f] border border-white/[0.07] hover:border-white/[0.15] transition-all">
                  <div className="flex items-center justify-between text-[11px] text-[#8fa198] mb-2">
                    <span>Active Inquiries</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#34d399]/15 text-[#34d399] font-medium flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +8.6%
                    </span>
                  </div>
                  <div className="text-xl md:text-2xl font-semibold text-[#f5f7f5] tracking-tight">
                    8,450
                  </div>
                  <div className="text-[10px] text-[#73847c] mt-1">Ready for follow-up</div>
                </div>

                {/* Stat 3: Response Speed */}
                <div className="p-4 rounded-2xl bg-[#1a231f] border border-white/[0.07] hover:border-white/[0.15] transition-all">
                  <div className="flex items-center justify-between text-[11px] text-[#8fa198] mb-2">
                    <span>Quick Response</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#34d399]/15 text-[#34d399] font-medium flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> 2.4 min
                    </span>
                  </div>
                  <div className="text-xl md:text-2xl font-semibold text-[#ffab76] tracking-tight">
                    98.4%
                  </div>
                  <div className="text-[10px] text-[#73847c] mt-1">Avg 1st response rate</div>
                </div>

                {/* Stat 4: Pipeline Value */}
                <div className="p-4 rounded-2xl bg-[#1a231f] border border-white/[0.07] hover:border-white/[0.15] transition-all">
                  <div className="flex items-center justify-between text-[11px] text-[#8fa198] mb-2">
                    <span>Pipeline Value</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#34d399]/15 text-[#34d399] font-medium flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +18.4%
                    </span>
                  </div>
                  <div className="text-xl md:text-2xl font-semibold text-[#f5f7f5] tracking-tight">
                    $280,000
                  </div>
                  <div className="text-[10px] text-[#73847c] mt-1">Estimated conversion</div>
                </div>
              </div>

              {/* View 1: Analytics & Graphs (Exact layout as template!) */}
              {activeTab === "analytics" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Left (2 cols): Curved Area/Line Graph (Revenue vs Expense / Inbound vs Qualified) */}
                  <div className="lg:col-span-2 p-5 rounded-2xl bg-[#1a231f] border border-white/[0.07] relative overflow-hidden flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-[#f5f7f5] flex items-center gap-2">
                          <span>Inbound Inquiries & Conversion</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff995e]/15 text-[#ffab76]">
                            Live Telemetry
                          </span>
                        </h4>
                        <p className="text-[11px] text-[#73847c] mt-0.5">
                          Inbound lead volume vs successfully qualified conversations
                        </p>
                      </div>

                      {/* Period Pills */}
                      <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/[0.06] text-[10px]">
                        {(["12M", "30D", "7D"] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setActiveRange(r)}
                            className={`px-2 py-1 rounded-md transition-colors ${
                              activeRange === r
                                ? "bg-[#ff995e] text-[#2d1b09] font-semibold"
                                : "text-[#7f9188] hover:text-[#f5f7f5]"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rich SVG Line & Area Chart */}
                    <div className="relative h-[220px] w-full pt-2">
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 600 200"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
                            <stop offset="60%" stopColor="#34d399" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#2dd4bf" />
                            <stop offset="50%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#ffb080" />
                          </linearGradient>
                          <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#d97706" />
                            <stop offset="100%" stopColor="#ff995e" />
                          </linearGradient>
                        </defs>

                        {/* Subtle Horizontal Grid lines */}
                        <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="90" x2="600" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="140" x2="600" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                        <line x1="0" y1="190" x2="600" y2="190" stroke="rgba(255,255,255,0.08)" />

                        {/* Area Fill */}
                        <path
                          d="M 0 160 Q 60 140, 110 135 T 220 100 T 330 85 T 440 40 T 540 60 L 600 35 L 600 190 L 0 190 Z"
                          fill="url(#areaGlow)"
                        />

                        {/* Main Smooth Spline Line */}
                        <path
                          d="M 0 160 Q 60 140, 110 135 T 220 100 T 330 85 T 440 40 T 540 60 L 600 35"
                          fill="none"
                          stroke="url(#lineGrad)"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                        />

                        {/* Secondary Converted Line */}
                        <path
                          d="M 0 180 Q 60 165, 110 155 T 220 130 T 330 120 T 440 85 T 540 100 L 600 70"
                          fill="none"
                          stroke="url(#goldLine)"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          opacity="0.75"
                        />

                        {/* Highlight Point at Oct with Interactive Tooltip */}
                        <circle cx="440" cy="40" r="5" fill="#34d399" stroke="#141b18" strokeWidth="2.5" />
                        <circle cx="440" cy="40" r="9" fill="#34d399" opacity="0.3" />
                      </svg>

                      {/* Tooltip Card (Matching template "Revenue Oct $58.2K") */}
                      <div className="absolute top-2 right-[22%] sm:right-[26%] bg-[#0e1411] border border-[#ff995e]/40 p-2.5 rounded-xl shadow-xl backdrop-blur-md pointer-events-none">
                        <div className="flex items-center gap-1.5 text-[9px] text-[#ffab76] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffab76]" />
                          <span>October Peak</span>
                        </div>
                        <div className="text-xs font-semibold text-[#f5f7f5] mt-0.5">
                          $58,200 Qualified
                        </div>
                        <div className="text-[9px] text-[#7f9188]">
                          3,400 leads • 84% conversion
                        </div>
                      </div>
                    </div>

                    {/* Chart Footer Months */}
                    <div className="flex items-center justify-between text-[10px] text-[#71827a] pt-3 border-t border-white/[0.06] mt-2">
                      {["Jan", "Mar", "May", "Jul", "Sep", "Oct (Peak)", "Dec"].map((m) => (
                        <span key={m} className={m.includes("Oct") ? "text-[#ffab76] font-medium" : ""}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right (1 col): Channel Breakdown & Bar Graph ($61.1K Volume) */}
                  <div className="p-5 rounded-2xl bg-[#1a231f] border border-white/[0.07] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-[#f5f7f5]">
                          Pipeline Volume
                        </h4>
                        <span className="text-[10px] text-[#34d399] font-medium flex items-center gap-0.5">
                          +24.8%
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-[#ffab76] tracking-tight">
                        $61,140
                      </div>
                      <p className="text-[10px] text-[#73847c] mt-0.5">
                        High-intent leads currently in progress
                      </p>
                    </div>

                    {/* Bar Chart Visualization */}
                    <div className="flex items-end justify-between gap-2 h-36 pt-4 pb-1">
                      {[
                        { label: "Website", height: "65%", val: "$24K", col: "bg-[#34d399]" },
                        { label: "Demos", height: "88%", val: "$38K", col: "bg-[#ffab76]" },
                        { label: "Referral", height: "45%", val: "$16K", col: "bg-[#60a5fa]" },
                        { label: "Outreach", height: "55%", val: "$20K", col: "bg-[#a78bfa]" },
                      ].map((bar) => (
                        <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <span className="text-[9px] text-[#8fa198] font-medium">{bar.val}</span>
                          <div className="w-full rounded-lg bg-black/40 p-0.5 h-full flex items-end">
                            <div
                              className={`w-full rounded-md ${bar.col} transition-all duration-500`}
                              style={{ height: bar.height }}
                            />
                          </div>
                          <span className="text-[9px] text-[#71827a] truncate max-w-full">
                            {bar.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Quick CTA to switch to table */}
                    <button
                      type="button"
                      onClick={() => setActiveTab("inbox")}
                      className="w-full mt-3 py-2 px-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-xs text-[#cdd8d2] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Inspect Live Inquiries</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#ffab76]" />
                    </button>
                  </div>
                </div>
              )}

              {/* View 2: Live Inquiries & Spam Table */}
              {activeTab === "inbox" && (
                <div className="rounded-2xl bg-[#1a231f] border border-white/[0.07] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onViewChange("leads")}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                          view === "leads"
                            ? "bg-[#ff995e]/20 text-[#ffab76]"
                            : "text-[#8fa198] hover:text-[#f5f7f5]"
                        }`}
                      >
                        All Leads ({leads.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => onViewChange("spam")}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                          view === "spam"
                            ? "bg-[#34d399]/20 text-[#34d399]"
                            : "text-[#8fa198] hover:text-[#f5f7f5]"
                        }`}
                      >
                        Spam Review ({spam.length})
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={onOpenInquiry}
                      className="text-xs px-3 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-[#f5f7f5] flex items-center gap-1.5"
                    >
                      <PlusIcon className="w-3 h-3 text-[#ffab76]" />
                      <span>Submit Test Lead</span>
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-white/[0.08] text-[10px] text-[#71827a] uppercase tracking-wider font-mono">
                          <th className="pb-2.5 font-medium">Contact</th>
                          <th className="pb-2.5 px-3 font-medium">Source</th>
                          <th className="pb-2.5 px-3 font-medium">Status</th>
                          <th className="pb-2.5 px-3 font-medium text-right">Received</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeEntries.map((item, idx) => {
                          const initials = item.name
                            .split(/\s+/)
                            .map((s) => s[0] || "")
                            .slice(0, 2)
                            .join("")
                            .toUpperCase();

                          return (
                            <tr
                              key={`${item.name}-${idx}`}
                              className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
                            >
                              <td className="py-3 pr-3">
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-full bg-[#24312b] text-[#ffab76] border border-white/10 flex items-center justify-center text-xs font-bold">
                                    {initials}
                                  </span>
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => onOpenDetail(item)}
                                      className="text-left font-medium text-[#f5f7f5] hover:text-[#ff995e] transition-colors cursor-pointer"
                                    >
                                      {item.name}
                                    </button>
                                    <span className="block text-[10px] text-[#71827a]">
                                      {item.email}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-3 text-[#a8b8b0]">{item.source}</td>

                              <td className="py-3 px-3">
                                {view === "spam" ? (
                                  <button
                                    type="button"
                                    onClick={() => onRestoreSpam(idx)}
                                    className="px-2.5 py-1 rounded bg-[#24312b] border border-white/10 text-[10px] text-[#f5f7f5] hover:bg-white/10 transition-colors"
                                  >
                                    Restore to Leads
                                  </button>
                                ) : (
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                                      item.status === "Contacted"
                                        ? "bg-white/[0.06] text-[#cdd8d2]"
                                        : "bg-[#ff995e]/15 text-[#ffab76]"
                                    }`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {item.status}
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3 text-right text-[11px] text-[#71827a] font-mono">
                                {item.time}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bottom Quick Bar */}
              <div className="flex items-center justify-between text-[11px] text-[#71827a] pt-4 mt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>Real-time webhook sync enabled • 0 delay</span>
                </div>
                <div className="text-[10px] text-[#8fa198]">
                  Click any lead or metric to test interactivity
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

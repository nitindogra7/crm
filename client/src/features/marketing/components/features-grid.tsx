"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Bell,
  Database,
} from "lucide-react";

export function FeaturesGrid() {
  const [pipelineScore, setPipelineScore] = useState(94);

  return (
    <section className="py-20 md:py-28 bg-[#f2f4f2] border-t border-[#e2e8e4]" id="features">
      <div className="w-[min(1160px,calc(100%-36px))] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16 md:mb-20">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1a2321] leading-[1.15]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Smart CRM Made{" "}
            <span
              style={{
                background: "linear-gradient(100deg, #d97706, #f59e0b 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Simple
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5d6967] leading-relaxed mt-4 max-w-[480px] mx-auto">
            Clear, real-time analytics to steer your pipeline, eliminate lead leaks, and accelerate conversion with confidence.
          </p>
        </div>

        {/* Bento Grid: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (7 cols): 2 Cards stacked */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Card 1: Real-Time Overview with embedded graph card */}
            <div className="p-7 sm:p-8 rounded-3xl bg-[#fafbfa] border border-[#dce3de] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <h3
                    className="text-xl sm:text-2xl font-semibold text-[#1a2321] tracking-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Real-Time Overview
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5d6967] mt-1">
                    Track lead velocity, conversion rate, and pipeline health live.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981]/10 text-[#059669] text-xs font-semibold self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>Live Stream</span>
                </div>
              </div>

              {/* Embedded White Card with Line Chart */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#e4ebe6] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-[#73847c] uppercase tracking-wider font-mono">
                    Total Leads Handled
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#10b981]/15 text-[#059669] flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +14.2%
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-bold text-[#1a2321] tracking-tight">
                  24,150.00
                </div>

                {/* Smooth SVG Area Line Chart */}
                <div className="h-28 w-full my-3 relative">
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 500 120"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="bentoGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="bentoLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#14b8a6" />
                        <stop offset="60%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M 0 95 Q 60 80, 120 75 T 240 50 T 360 40 T 450 15 L 500 20 L 500 120 L 0 120 Z"
                      fill="url(#bentoGlow)"
                    />
                    <path
                      d="M 0 95 Q 60 80, 120 75 T 240 50 T 360 40 T 450 15 L 500 20"
                      fill="none"
                      stroke="url(#bentoLine)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="450" cy="15" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                </div>

                {/* Sub Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#edf2ee] text-xs">
                  <div>
                    <span className="text-[10px] text-[#73847c] block">Inbound</span>
                    <strong className="text-[#1a2321] font-semibold text-xs sm:text-sm">18,290</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#73847c] block">Qualified</span>
                    <strong className="text-[#1a2321] font-semibold text-xs sm:text-sm">4,710</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#73847c] block">Conversion</span>
                    <strong className="text-[#059669] font-semibold text-xs sm:text-sm">84.2%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Automate & Save Time with checklist */}
            <div className="p-7 sm:p-8 rounded-3xl bg-[#fafbfa] border border-[#dce3de] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="mb-5">
                <h3
                  className="text-xl sm:text-2xl font-semibold text-[#1a2321] tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Automate & Save Time
                </h3>
                <p className="text-xs sm:text-sm text-[#5d6967] mt-1">
                  Automate lead routing, instant notifications, and auto-tagging.
                </p>
              </div>

              {/* Status Row Checklist (Matching template visual) */}
              <div className="space-y-2.5">
                {[
                  {
                    title: "Inbound Lead Captured",
                    desc: "Instantly ingested from website forms",
                    icon: Zap,
                    color: "text-[#10b981] bg-[#10b981]/15",
                  },
                  {
                    title: "AI Spam Filter Verified",
                    desc: "Automated honeypot & screening passed",
                    icon: ShieldCheck,
                    color: "text-[#f59e0b] bg-[#f59e0b]/15",
                  },
                  {
                    title: "Team Notification Sent",
                    desc: "Slack & email alert dispatched in 0.2s",
                    icon: Bell,
                    color: "text-[#8b5cf6] bg-[#8b5cf6]/15",
                  },
                  {
                    title: "CRM Pipeline Synced",
                    desc: "Contact added to active opportunity list",
                    icon: Database,
                    color: "text-[#0284c7] bg-[#0284c7]/15",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-3.5 rounded-xl bg-white border border-[#e4ebe6] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-[#1a2321]">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-[#73847c]">
                          {item.desc}
                        </div>
                      </div>
                    </div>

                    <div className="w-5 h-5 rounded-full bg-[#10b981]/15 text-[#059669] flex items-center justify-center flex-none">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Tall Card (Smarter Insights for Better Growth) */}
          <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-[#fafbfa] border border-[#dce3de] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <h3
                className="text-xl sm:text-2xl font-semibold text-[#1a2321] tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Smarter Insights for Better Growth
              </h3>
              <p className="text-xs sm:text-sm text-[#5d6967] mt-2 leading-relaxed">
                Powerful analytics and reports to help you track conversions, forecast pipeline, and scale your business with confidence.
              </p>
            </div>

            {/* Embedded Pipeline Score Card with Amber Tick Slider (Matching template visual!) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-white to-[#fffcf7] border border-[#edd5bf] shadow-sm my-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1a2321]">
                    Monthly Pipeline Score
                  </h4>
                  <p className="text-[10px] text-[#8c7e73]">
                    Inbound velocity & qualification efficiency
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#6e6359] leading-relaxed mb-6">
                Pipeline efficiency and lead health score represents total qualified opportunities generated within the single monthly billing period.
              </p>

              {/* Big Score Pill */}
              <div className="flex items-center justify-center mb-5">
                <div className="px-5 py-2 rounded-full bg-gradient-to-r from-[#ffb080] to-[#f59e0b] text-[#2d1b09] font-bold text-lg sm:text-xl shadow-[0_4px_16px_rgba(245,158,11,0.25)] flex items-center gap-1.5">
                  <span>{pipelineScore}%</span>
                  <span className="text-xs font-medium text-[#4d2909]">Healthy</span>
                </div>
              </div>

              {/* Progress Slider Track with Vertical Tick Marks (Just like template!) */}
              <div className="space-y-2">
                {/* Tick marks bar */}
                <div className="flex justify-between px-1 text-[8px] text-[#b3a191] font-mono select-none">
                  {[0, 20, 40, 60, 80, 100].map((v) => (
                    <span key={v}>{v}%</span>
                  ))}
                </div>

                {/* Custom Slider Track */}
                <div className="relative h-6 flex items-center">
                  {/* Background track */}
                  <div className="w-full h-3 rounded-full bg-[#f3eae0] overflow-hidden relative border border-[#e4d3c3]">
                    {/* Filled gradient bar */}
                    <div
                      className="h-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] rounded-full transition-all duration-300"
                      style={{ width: `${pipelineScore}%` }}
                    />
                  </div>

                  {/* Interactive Slider Thumb / Draggable */}
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={pipelineScore}
                    onChange={(e) => setPipelineScore(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    aria-label="Pipeline Score adjustment"
                  />
                </div>

                {/* Vertical tick lines below */}
                <div className="flex justify-between px-2 pt-1 opacity-40">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-[1px] bg-[#a89584] ${i % 5 === 0 ? "h-2" : "h-1"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom summary note */}
            <div className="p-4 rounded-xl bg-white border border-[#e4ebe6] flex items-center justify-between text-xs text-[#5d6967]">
              <span>Real-time conversion benchmark</span>
              <strong className="text-[#059669] font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Top 5% of SaaS
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

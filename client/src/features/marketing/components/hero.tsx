"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Icon } from "./icons";
import { Button, Avatar } from "./ui";
import { HeroBackground } from "./hero-background";
import { cn } from "@/shared/lib/utils";

interface HeroProps {
  kept: number;
  blocked: number;
  onIncrementKept: () => void;
  onIncrementBlocked: () => void;
}

interface HeroLeadRow {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  status: "verified" | "blocked";
  score: string;
  time: string;
  avatarIndex: number;
  isNew?: boolean;
}

const INITIAL_ROWS: HeroLeadRow[] = [
  {
    id: "lead-1",
    name: "Maya Lin",
    email: "maya@studio.co",
    company: "Studio Labs",
    source: "Contact Form",
    status: "verified",
    score: "0.01 clean",
    time: "Just now",
    avatarIndex: 0,
  },
  {
    id: "lead-2",
    name: "Alex Vance",
    email: "alex@startup.io",
    company: "Vance Media",
    source: "Pricing Page",
    status: "verified",
    score: "0.02 clean",
    time: "3m ago",
    avatarIndex: 1,
  },
  {
    id: "lead-3",
    name: "Bot Crawler",
    email: "crawler@scrape-test.net",
    company: "Unknown",
    source: "Demo Request",
    status: "blocked",
    score: "0.98 spam",
    time: "7m ago",
    avatarIndex: 3,
  },
  {
    id: "lead-4",
    name: "Sarah Connor",
    email: "sarah@cyberdyne.io",
    company: "Cyberdyne",
    source: "Partner Inbound",
    status: "verified",
    score: "0.01 clean",
    time: "14m ago",
    avatarIndex: 2,
  },
];

const SIMULATED_LEADS = [
  { name: "Liam Chen", email: "liam@fintech.co", company: "Fintech HQ", source: "Homepage Form", status: "verified" as const, score: "0.01 clean", avatarIndex: 4 },
  { name: "Elena Rostova", email: "elena@design.io", company: "Rostova Studio", source: "Demo Request", status: "verified" as const, score: "0.02 clean", avatarIndex: 5 },
  { name: "Disposable Bot", email: "trash@tempmail.xyz", company: "Unknown", source: "Contact Form", status: "blocked" as const, score: "0.99 disposable", avatarIndex: 6 },
  { name: "Marcus Brody", email: "marcus@enterprise.com", company: "Brody Logistics", source: "Quote Request", status: "verified" as const, score: "0.01 clean", avatarIndex: 7 },
];

export function Hero({
  kept,
  blocked,
  onIncrementKept,
  onIncrementBlocked,
}: HeroProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [leads, setLeads] = useState<HeroLeadRow[]>(INITIAL_ROWS);
  const simIndexRef = React.useRef(0);
  const [activeTab, setActiveTab] = useState<"crm" | "curl">("crm");

  const curlSnippet = `curl -X POST https://api.salenova.com/v1/leads \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: sln_live_acme_9f82c1" \\
  -d '{"name":"Alex","email":"alex@startup.io","company":"Acme Corp"}'`;

  const handleCopyKey = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("sln_live_acme_9f82c1");
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 1500);
    }
  };

  const handleCopyCurl = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(curlSnippet);
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 1500);
    }
  };

  const handleSimulatePost = useCallback(() => {
    const idx = simIndexRef.current;
    const next = SIMULATED_LEADS[idx % SIMULATED_LEADS.length];
    simIndexRef.current = idx + 1;

    const newLead: HeroLeadRow = {
      id: `${Date.now()}-${Math.random()}`,
      name: next.name,
      email: next.email,
      company: next.company,
      source: next.source,
      status: next.status,
      score: next.score,
      time: "Just now",
      avatarIndex: next.avatarIndex,
      isNew: true,
    };

    setLeads((currentLeads) => [newLead, ...currentLeads.slice(0, 4)]);

    if (next.status === "verified") {
      onIncrementKept();
    } else {
      onIncrementBlocked();
    }
  }, [onIncrementKept, onIncrementBlocked]);

  // Automated live pipeline lead stream every 6s (resets if user triggers manual post)
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        handleSimulatePost();
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [handleSimulatePost]);

  return (
    <header className="relative pt-[85px] sm:pt-[110px] md:pt-[130px] pb-[50px] md:pb-[80px] overflow-hidden">
      {/* Dynamic Animated Cosmic Aurora & Floating Stardust (No grids) */}
      <HeroBackground />

      <div className="max-w-[1100px] mx-auto px-[16px] sm:px-[24px] relative z-10 text-center">
        {/* Pill Badge with Radar Dot (Hidden on mobile) */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.14] bg-white/[0.04] text-[11px] sm:text-[11.5px] text-neutral-300 mb-5 sm:mb-6 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_20px_rgba(0,0,0,0.5)] transition-all hover:border-white/30 max-w-[90vw] group cursor-default">
          <span className="relative flex h-2 w-2 flex-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
          </span>
          <span className="font-medium text-white truncate">Salenova</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-300 truncate">The zero-backend form pipeline</span>
          <span className="text-neutral-400 transition-transform group-hover:translate-x-0.5">→</span>
        </div>

        {/* Headline with Dynamic Kinetic Shimmer */}
        <h1 className="text-[28px] sm:text-[42px] md:text-[54px] lg:text-[62px] font-heading font-medium tracking-[-0.025em] leading-[1.16] sm:leading-[1.1] max-w-[840px] mx-auto mb-4 sm:mb-5">
          Capture every lead. <br className="hidden sm:inline" />
          <span className="bg-[linear-gradient(110deg,#ffffff,35%,#34d399,50%,#ffffff,65%,#10b981)] bg-[length:250%_100%] bg-clip-text text-transparent animate-[textShimmer_8s_ease_infinite]">
            Without building a backend.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-neutral-400 font-p font-normal text-[13.5px] sm:text-[15.5px] max-w-[560px] mx-auto mb-7 sm:mb-8 leading-[1.65] text-pretty px-2 sm:px-0">
          Create an organisation workspace, copy your API key, and send POST requests from any form. Instant spam screening, automated alerts, and a real-time CRM dashboard.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 mb-10 w-full max-w-[340px] sm:max-w-none mx-auto">
          <Button
            href="/sign-up"
            variant="solid"
            size="default"
            className="relative group overflow-hidden w-full sm:w-auto shadow-[0_0_24px_rgba(255,255,255,0.18)]"
          >
            {/* Traveling Specular Button Shine */}
            <span className="absolute top-0 -left-[100%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-[btnShine_1.2s_ease-in-out_infinite] pointer-events-none" />
            <span className="relative z-10 flex items-center gap-1.5">
              Start free trial
              <Icon name="arrow" className="w-[13px] h-[13px] transition-transform group-hover:translate-x-1" />
            </span>
          </Button>

          <button
            type="button"
            onClick={handleCopyCurl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-[8.5px] rounded-full border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.07] hover:border-emerald-500/30 text-[12px] text-neutral-300 font-sans transition-all cursor-pointer select-none group"
          >
            <span className="text-emerald-400 font-semibold font-sans text-[10px] px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">POST</span>
            <span className="text-neutral-400">/v1/leads</span>
            <Icon name={copiedCurl ? "chk" : "copy"} className="w-3 h-3 text-neutral-400 ml-1" />
            <span className="text-neutral-400 text-[11px] font-sans">{copiedCurl ? "Copied cURL" : "Copy cURL"}</span>
          </button>
        </div>

        {/* Hero Interactive SaaS Product Showcase (Window with Luminous Border Beam) */}
        <div className="relative rounded-[20px] p-[1px] overflow-hidden group shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(52,211,153,0.12)] transition-all">
          {/* Luminous 360° Conic Border Beam */}
          <div
            className="absolute -inset-[150%] animate-[spin_10s_linear_infinite] opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0 250deg, rgba(255,255,255,0.15) 290deg, rgba(16,185,129,0.7) 325deg, rgba(52,211,153,0.95) 350deg, rgba(255,255,255,1) 360deg)",
            }}
          />

          {/* Top Specular Edge Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />

          {/* Ambient Card Underglow Bloom */}
          <div className="absolute -inset-2 bg-gradient-to-b from-white/[0.1] via-emerald-500/[0.06] to-transparent rounded-[22px] blur-2xl -z-10 pointer-events-none" />

          {/* Inner Dashboard Window */}
          <div className="relative rounded-[19px] border border-white/[0.08] bg-[#181818]/98 backdrop-blur-2xl overflow-hidden text-left">
            {/* Top Window Bar */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/[0.08] bg-white/[0.02]">
              {/* Window Controls & Breadcrumb */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/[0.18]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/[0.12]" />
                </div>
                <span className="h-3 w-[1px] bg-white/[0.1]" />
                <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] text-neutral-400 font-sans">
                  <span className="w-4 h-4 rounded-full bg-neutral-800 border border-white/20 inline-grid place-items-center text-[8.5px] text-white font-medium">A</span>
                  <span className="text-white font-medium">Acme Corp</span>
                  <span className="hidden sm:inline text-neutral-600">/</span>
                  <span className="hidden sm:inline text-neutral-400">Production Hub</span>
                </div>
              </div>

              {/* View Switcher & API Key Tag */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:inline-flex p-0.5 rounded-lg border border-white/[0.08] bg-black/50 text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => setActiveTab("crm")}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-colors",
                      activeTab === "crm" ? "bg-white/[0.1] text-white" : "text-neutral-500 hover:text-white"
                    )}
                  >
                    Live CRM Leads
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("curl")}
                    className={cn(
                      "px-2.5 py-1 rounded-md transition-colors",
                      activeTab === "curl" ? "bg-white/[0.1] text-white" : "text-neutral-500 hover:text-white"
                    )}
                  >
                    Endpoint & API Key
                  </button>
                </div>

                {/* Scoped API Key Pill */}
                <button
                  type="button"
                  onClick={handleCopyKey}
                  title="Click to copy workspace API key"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] text-[10.5px] text-neutral-300 font-mono transition-all"
                >
                  <span className="text-neutral-500">key:</span>
                  <span className="text-neutral-200">sln_live_••••c1</span>
                  <Icon name={copiedKey ? "chk" : "copy"} className="w-2.5 h-2.5 text-neutral-400 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/[0.06] bg-black/40 text-[11px] gap-2 flex-wrap">
              <div className="flex items-center gap-2 sm:gap-3 text-[10.5px]">
                {/* Pulsing Live Telemetry Indicator */}
                <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                  </span>
                  200 OK
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400">
                  <b className="text-white font-medium tabular-nums">{48 + kept}</b> delivered
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400">
                  <b className="text-white font-medium tabular-nums">{4 + blocked}</b> blocked
                </span>
                <span className="hidden md:inline text-neutral-600">•</span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-emerald-400/90 font-mono bg-emerald-500/[0.08] px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  Live Pipeline
                </span>
              </div>

              {/* Simulator Button */}
              <button
                type="button"
                onClick={handleSimulatePost}
                className="ml-auto inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md bg-white text-black hover:bg-neutral-200 text-[10.5px] sm:text-[11px] font-medium transition-all shadow-sm cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <Icon name="bolt" className="w-3 h-3 text-black" />
                <span>Simulate Inbound POST</span>
              </button>
            </div>

            {/* Content Area */}
            {activeTab === "crm" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] sm:text-[11.5px] border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
                      <th className="py-2.5 px-3 sm:px-4 font-normal">Contact</th>
                      <th className="py-2.5 px-4 font-normal hidden sm:table-cell">Company</th>
                      <th className="py-2.5 px-4 font-normal hidden md:table-cell">Origin Form</th>
                      <th className="py-2.5 px-3 sm:px-4 font-normal text-right sm:text-left">Status</th>
                      <th className="py-2.5 px-4 font-normal hidden sm:table-cell">Spam Shield</th>
                      <th className="py-2.5 px-4 font-normal text-right hidden sm:table-cell">Received</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {leads.map((row) => (
                      <tr
                        key={row.id}
                        className={cn(
                          "group hover:bg-white/[0.02] transition-colors",
                          row.isNew && "bg-emerald-500/[0.06] animate-[fadeIn_0.5s_ease]"
                        )}
                      >
                        <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <Avatar size={24} index={row.avatarIndex} alt={row.name} />
                            <div className="min-w-0">
                              <div className="font-medium text-white flex items-center gap-1.5 whitespace-nowrap text-[11px] sm:text-[11.5px]">
                                <span className="truncate max-w-[105px] sm:max-w-none">{row.name}</span>
                                {row.isNew && (
                                  <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono flex-none">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] sm:text-[10.5px] text-neutral-500 font-mono truncate max-w-[115px] sm:max-w-none">{row.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-neutral-300 hidden sm:table-cell">
                          {row.company}
                        </td>

                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-neutral-400 text-[10px]">
                            {row.source}
                          </span>
                        </td>

                        <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-right sm:text-left">
                          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2">
                            {row.status === "verified" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 whitespace-nowrap">
                                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                Delivered
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium bg-red-500/10 border border-red-500/20 text-red-400 whitespace-nowrap">
                                <span className="w-1 h-1 rounded-full bg-red-400" />
                                Spam Blocked
                              </span>
                            )}
                            <span className="sm:hidden text-[9px] text-neutral-500 font-mono">{row.time}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-neutral-500 font-mono text-[10px] hidden sm:table-cell whitespace-nowrap">
                          {row.score}
                        </td>

                        <td className="py-3 px-4 text-right text-neutral-500 font-mono text-[10.5px] hidden sm:table-cell whitespace-nowrap">
                          {row.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 bg-black/60 font-mono text-[11px] leading-[1.8] text-neutral-300 overflow-x-auto">
                <div className="text-neutral-500 mb-2 font-mono text-[11px]">&gt; Submit directly from cURL, JavaScript, or backend services:</div>
                <pre className="text-neutral-200">{curlSnippet}</pre>
              </div>
            )}

            {/* Window Footer Status */}
            <div className="px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-[10.5px] text-neutral-500 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Endpoint:</span>
                <code className="text-neutral-300 font-mono bg-white/[0.04] px-1.5 py-0.5 rounded">
                  POST https://api.salenova.com/v1/leads
                </code>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-neutral-400">
                  <Icon name="mail" className="w-3 h-3 text-neutral-500" />
                  Email Alerts: On
                </span>
                <span className="text-neutral-600">•</span>
                <span className="flex items-center gap-1 text-neutral-400">
                  <Icon name="hook" className="w-3 h-3 text-neutral-500" />
                  Webhooks: 3 Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

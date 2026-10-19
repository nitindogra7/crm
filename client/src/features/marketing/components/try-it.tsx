"use client";

import React, { useState } from "react";
import { Icon } from "./icons";
import { Pill, Avatar, Button } from "./ui";
import { cn } from "@/shared/lib/utils";

const SNIPPETS = {
  html: `<!-- 1. Point standard HTML form to Salenova with your API key -->
<form action="https://api.salenova.com/v1/leads?apiKey=sln_live_acme_9f2k" method="POST">
  <input name="name" type="text" placeholder="Full name" required />
  <input name="email" type="email" placeholder="work@acme.com" required />
  <input name="company" type="text" placeholder="Company name" />
  <input name="_gotcha" tabindex="-1" hidden /> <!-- silent honeypot -->
  <button type="submit">Submit Lead</button>
</form>`,
  js: `// 2. Or send POST with your workspace x-api-key header
const res = await fetch("https://api.salenova.com/v1/leads", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "sln_live_acme_9f2k"
  },
  body: JSON.stringify({
    name: "Maya Lin",
    email: "maya@studio.co",
    company: "Studio Labs",
    message: "Interested in pro plan"
  })
});
const lead = await res.json(); // { id: "lead_89a", status: "delivered" }`,
  curl: `# 3. Direct HTTP POST from cURL, Python, or Webhooks
curl -X POST https://api.salenova.com/v1/leads \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: sln_live_acme_9f2k" \\
  -d '{
    "name": "Alex Vance",
    "email": "alex@startup.io",
    "source": "Landing Page Form"
  }'`,
};

type TabType = "html" | "js" | "curl";

interface LeadItem {
  id: string;
  name: string;
  email: string;
  status: "ok" | "no";
  reason: string;
  avatarIndex: number;
  time: string;
  isNew?: boolean;
}

const LEADS_DATA: Array<{ name: string; email: string; status: "ok" | "no"; reason: string; avatarIndex: number }> = [
  { name: "Maya Lin", email: "maya@studio.co", status: "ok", reason: "Verified lead", avatarIndex: 0 },
  { name: "Bot Crawler", email: "bot.crawler@test.com", status: "no", reason: "Rate limited", avatarIndex: 1 },
  { name: "Dev Patel", email: "dev@startup.io", status: "ok", reason: "Verified lead", avatarIndex: 2 },
  { name: "Disposable User", email: "fake@tempmail.com", status: "no", reason: "Disposable email", avatarIndex: 3 },
  { name: "Lena Rossi", email: "lena@agency.com", status: "ok", reason: "Verified lead", avatarIndex: 4 },
  { name: "Spam Bot 7", email: "x7@spam.net", status: "no", reason: "Honeypot hit", avatarIndex: 5 },
];

interface TryItProps {
  kept: number;
  blocked: number;
  onIncrementKept: () => void;
  onIncrementBlocked: () => void;
}

export function TryIt({
  kept,
  blocked,
  onIncrementKept,
  onIncrementBlocked,
}: TryItProps) {
  const [activeTab, setActiveTab] = useState<TabType>("html");
  const [copied, setCopied] = useState(false);
  const [leadsIndex, setLeadsIndex] = useState(2);
  const [feedItems, setFeedItems] = useState<LeadItem[]>([
    { id: "1", name: "Bot Crawler", email: "bot.crawler@test.com", status: "no", reason: "Rate limited", avatarIndex: 1, time: "Just now" },
    { id: "0", name: "Maya Lin", email: "maya@studio.co", status: "ok", reason: "Verified lead", avatarIndex: 0, time: "1m ago" },
  ]);

  const handleCopySnippet = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(SNIPPETS[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleSendTestLead = () => {
    const nextLead = LEADS_DATA[leadsIndex % LEADS_DATA.length];
    setLeadsIndex((prev) => prev + 1);

    const newItem: LeadItem = {
      id: `${Date.now()}-${Math.random()}`,
      name: nextLead.name,
      email: nextLead.email,
      status: nextLead.status,
      reason: nextLead.reason,
      avatarIndex: nextLead.avatarIndex,
      time: "Just now",
      isNew: true,
    };

    setFeedItems((prev) => [newItem, ...prev.slice(0, 3)]);

    if (nextLead.status === "ok") {
      onIncrementKept();
    } else {
      onIncrementBlocked();
    }
  };

  return (
    <section className="py-[56px] md:py-[76px] relative z-10" id="try">
      {/* Subtle deep emerald ambient lighting */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[450px] w-full max-w-[900px] mx-auto rounded-full blur-[150px] opacity-20 -z-10"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(52,211,153,0.15) 0%, rgba(16,185,129,0.08) 50%, transparent 70%)",
        }}
      />

      <div className="max-w-[1100px] mx-auto px-[16px] sm:px-[24px]">
        {/* Head */}
        <div className="text-center max-w-[560px] mx-auto mb-[40px] sm:mb-[48px]">
          <Pill icon="code">Live Interactive Sandbox</Pill>
          <h2 className="text-[26px] sm:text-[34px] md:text-[40px] font-heading font-medium tracking-[-0.025em] leading-[1.2] mt-4 mb-3 text-white text-balance">
            Send a test submission <br className="hidden sm:inline" />
            <span className="text-zinc-400">and watch it land live in your CRM.</span>
          </h2>
          <p className="text-zinc-400 font-p font-normal mt-3 text-[13.5px] sm:text-[14.5px] leading-[1.65] max-w-[520px] mx-auto text-pretty">
            Pick your frontend syntax below. Hit the test submission button to simulate an inbound POST request with automated spam inspection.
          </p>
        </div>

        {/* Dual Sandbox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-[14px]">
          {/* Left: Code Terminal */}
          <div className="rounded-[18px] border border-white/[0.09] bg-[#1c1c1c] shadow-[0_16px_45px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between relative group">
            {/* Top specular edge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent pointer-events-none" />

            <div>
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02] flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  {/* macOS dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="h-3 w-[1px] bg-white/[0.1]" />
                  {/* Language Tabs */}
                  <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => setActiveTab("html")}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[11px] font-sans transition-all cursor-pointer",
                        activeTab === "html" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium shadow-sm" : "text-zinc-400 hover:text-white"
                      )}
                    >
                      HTML Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("js")}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[11px] font-sans transition-all cursor-pointer",
                        activeTab === "js" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium shadow-sm" : "text-zinc-400 hover:text-white"
                      )}
                    >
                      fetch (POST)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("curl")}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[11px] font-sans transition-all cursor-pointer",
                        activeTab === "curl" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium shadow-sm" : "text-zinc-400 hover:text-white"
                      )}
                    >
                      cURL
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopySnippet}
                  aria-label="Copy code snippet"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/[0.08] hover:border-emerald-500/30 bg-white/[0.03] hover:bg-white/[0.06] text-[11px] text-zinc-300 hover:text-white transition-all cursor-pointer select-none"
                >
                  <Icon name={copied ? "chk" : "copy"} className="w-3 h-3 text-zinc-300" />
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Code Display */}
              <div className="p-4 font-sans text-[11.5px] leading-[1.75] text-zinc-300 overflow-x-auto min-h-[220px]">
                <pre className="whitespace-pre">{SNIPPETS[activeTab]}</pre>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="px-4 py-2.5 border-t border-white/[0.06] bg-[#141414] text-[11px] text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-2 font-sans">
                <span className="text-zinc-500">Target Endpoint:</span>
                <span className="text-emerald-400 font-medium">POST /v1/leads</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-sans text-[10.5px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                x-api-key authorized
              </span>
            </div>
          </div>

          {/* Right: Workspace CRM Dashboard Simulator */}
          <div className="rounded-[18px] border border-white/[0.09] bg-[#1c1c1c] shadow-[0_16px_45px_rgba(0,0,0,0.6)] p-[22px] flex flex-col justify-between relative group">
            {/* Top specular edge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-emerald-500/15 border border-emerald-500/30 grid place-items-center text-emerald-300 text-[11px] font-semibold">
                    A
                  </span>
                  <div>
                    <span className="text-[13px] font-medium text-white block leading-tight">Acme Workspace CRM</span>
                    <span className="text-[10px] text-zinc-400 font-sans">key: sln_live_acme_••••</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-sans flex items-center gap-1.5 justify-end bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Intake Active
                  </span>
                </div>
              </div>

              {/* Feed Stats Bar */}
              <div className="flex items-center justify-between mb-3 text-[11px] text-zinc-300 bg-[#141414] p-2 rounded-lg border border-white/[0.06] shadow-inner">
                <span className="font-sans text-zinc-400">Telemetry Feed</span>
                <span className="space-x-2 font-sans text-[10.5px]">
                  <span>
                    <b className="text-emerald-400 font-semibold tabular-nums">{kept}</b> delivered
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span>
                    <b className="text-zinc-400 font-semibold tabular-nums">{blocked}</b> spam blocked
                  </span>
                </span>
              </div>

              {/* Lead Feed Items */}
              <ul className="space-y-2 min-h-[170px]">
                {feedItems.map((item) => (
                  <li
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-lg border bg-[#141414] text-[11.5px] transition-all",
                      item.status === "ok"
                        ? "border-emerald-500/20 hover:border-emerald-500/40"
                        : "border-white/[0.06] hover:border-white/[0.14]",
                      item.isNew && "bg-emerald-500/[0.06] ring-1 ring-emerald-500/25"
                    )}
                  >
                    <Avatar size={22} index={item.avatarIndex} alt={item.email} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-[11.5px] truncate">{item.name}</span>
                        <span className="text-[9.5px] text-zinc-500 font-sans">{item.time}</span>
                      </div>
                      <span className="truncate text-zinc-400 text-[10px] block font-sans">{item.email}</span>
                    </div>

                    <em
                      className={cn(
                        "ml-auto not-italic text-[9.5px] py-0.5 px-2 rounded-full font-sans border whitespace-nowrap font-medium",
                        item.status === "ok"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-white/[0.03] text-zinc-400 border-white/[0.08]"
                      )}
                    >
                      {item.reason}
                    </em>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inbound Simulator CTA */}
            <Button
              id="send"
              variant="solid"
              onClick={handleSendTestLead}
              className="mt-4 w-full justify-center py-2.5 text-[12.5px] shadow-[0_0_24px_rgba(52,211,153,0.25)] hover:shadow-[0_0_28px_rgba(52,211,153,0.4)]"
            >
              <Icon name="bolt" className="w-3.5 h-3.5 text-black" />
              <span>Simulate Inbound POST Lead</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

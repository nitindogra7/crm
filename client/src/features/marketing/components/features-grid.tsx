"use client";

import React from "react";
import { Pill, Avatar } from "./ui";
import { Icon } from "./icons";

export function FeaturesGrid() {
  return (
    <section id="features" className="py-[56px] md:py-[76px] relative z-10">
      {/* Subtle deep emerald ambient lighting */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/3 -translate-y-1/2 h-[500px] w-full max-w-[900px] mx-auto rounded-full blur-[150px] opacity-20 -z-10"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(52,211,153,0.15) 0%, rgba(16,185,129,0.08) 50%, transparent 70%)",
        }}
      />

      <div className="max-w-[1100px] mx-auto px-[16px] sm:px-[24px]">
        {/* Head */}
        <div className="text-center max-w-[560px] mx-auto mb-[40px] sm:mb-[48px]">
          <Pill icon="shield">Engineered for Scale</Pill>
          <h2 className="text-[26px] sm:text-[34px] md:text-[40px] font-heading font-medium tracking-[-0.025em] leading-[1.2] mt-4 mb-3 text-white text-balance">
            Everything your form pipeline needs <br className="hidden sm:inline" />
            <span className="text-zinc-400">with zero backend servers to build.</span>
          </h2>
          <p className="text-zinc-400 font-p font-normal mt-3 text-[13.5px] sm:text-[14.5px] leading-[1.65] max-w-[520px] mx-auto text-pretty">
            From automated spam filtering to multi-channel webhooks, Salenova replaces complex backend form infrastructure with one secure endpoint.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
          {/* Card 1: Intelligent Multi-Layer Spam Shield (Large 2 Cols) */}
          <div className="md:col-span-2 rounded-[18px] border border-white/[0.09] hover:border-emerald-500/35 bg-[#1c1c1c] hover:bg-[#232323] p-[24px] md:p-[28px] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(52,211,153,0.1)] group relative">
            {/* Top specular edge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400 group-hover:border-emerald-500/40 group-hover:shadow-[0_0_16px_rgba(52,211,153,0.25)] transition-all">
                  <Icon name="shield" className="w-[18px] h-[18px]" />
                </span>
                <span className="text-[10.5px] font-sans text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Zero Captchas Required
                </span>
              </div>

              <h3 className="text-[18px] font-heading font-medium tracking-tight text-white mb-2 group-hover:text-white transition-colors">
                Intelligent Multi-Layer Spam Shield
              </h3>
              <p className="text-zinc-400 font-p font-normal text-[13px] leading-[1.65] max-w-[520px] mb-5">
                Never lose a prospective lead to annoying puzzle captchas. Silent honeypots, disposable email detection, and IP reputation heuristics screen out bot crawlers in milliseconds.
              </p>
            </div>

            {/* Interactive Visual Widget */}
            <div className="rounded-xl border border-white/[0.06] bg-[#141414] p-3.5 font-sans shadow-inner">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.05] text-[11px] text-zinc-300">
                <span className="font-sans text-zinc-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Salenova Heuristics Engine
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-sans text-[10.5px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Active • 0 False Drops
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/25 hover:bg-emerald-500/[0.03] transition-colors">
                  <span className="text-[10px] text-zinc-500 block mb-0.5 font-sans">Silent Honeypot</span>
                  <span className="text-[12px] text-white font-medium flex items-center gap-1.5">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400" /> Active Trap
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/25 hover:bg-emerald-500/[0.03] transition-colors">
                  <span className="text-[10px] text-zinc-500 block mb-0.5 font-sans">Domain MX Verify</span>
                  <span className="text-[12px] text-white font-medium flex items-center gap-1.5">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400" /> DNS Validated
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/25 hover:bg-emerald-500/[0.03] transition-colors">
                  <span className="text-[10px] text-zinc-500 block mb-0.5 font-sans">Rate Limiter</span>
                  <span className="text-[12px] text-white font-medium flex items-center gap-1.5">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400" /> Token Bucket
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/25 hover:bg-emerald-500/[0.03] transition-colors">
                  <span className="text-[10px] text-zinc-500 block mb-0.5 font-sans">Disposable Filter</span>
                  <span className="text-[12px] text-white font-medium flex items-center gap-1.5">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400" /> 18k Domains
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Instant Form Ingestion */}
          <div className="rounded-[18px] border border-white/[0.09] hover:border-emerald-500/35 bg-[#1c1c1c] hover:bg-[#232323] p-[24px] md:p-[28px] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(52,211,153,0.1)] group relative">
            {/* Top specular edge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400 group-hover:border-emerald-500/40 group-hover:shadow-[0_0_16px_rgba(52,211,153,0.25)] transition-all">
                  <Icon name="cpu" className="w-[18px] h-[18px]" />
                </span>
                <span className="text-[10.5px] font-sans text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-medium">
                  Zero Backend
                </span>
              </div>

              <h3 className="text-[18px] font-heading font-medium tracking-tight text-white mb-2 group-hover:text-white transition-colors">
                Instant Form Ingestion
              </h3>
              <p className="text-zinc-400 font-p font-normal text-[13px] leading-[1.65] mb-5">
                Handles CORS headers, automated preflights, and JSON or FormData payloads. Connect plain HTML forms, React, or Webflow with zero server logic.
              </p>
            </div>

            {/* Code Chip */}
            <div className="rounded-xl border border-white/[0.06] bg-[#141414] p-3.5 font-sans text-[11px] text-zinc-300 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-zinc-500 text-[10px]">
                <span>REQUEST METHOD</span>
                <span className="text-emerald-400 font-sans text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">200 OK</span>
              </div>
              <div className="text-white font-medium truncate flex items-center gap-2">
                <span className="text-emerald-400 font-bold">POST</span>
                <span>/v1/leads</span>
              </div>
              <div className="text-zinc-500 truncate text-[10.5px]">Host: api.salenova.com</div>
              <div className="text-emerald-300/80 truncate text-[10.5px]">x-api-key: sln_live_••••</div>
            </div>
          </div>

          {/* Card 3: Real-Time Routing */}
          <div className="rounded-[18px] border border-white/[0.09] hover:border-emerald-500/35 bg-[#1c1c1c] hover:bg-[#232323] p-[24px] md:p-[28px] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(52,211,153,0.1)] group relative">
            {/* Top specular edge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400 group-hover:border-emerald-500/40 group-hover:shadow-[0_0_16px_rgba(52,211,153,0.25)] transition-all">
                  <Icon name="hook" className="w-[18px] h-[18px]" />
                </span>
                <span className="text-[10.5px] font-sans text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-medium">
                  Sub-200ms
                </span>
              </div>

              <h3 className="text-[18px] font-heading font-medium tracking-tight text-white mb-2 group-hover:text-white transition-colors">
                Multi-Channel Routing
              </h3>
              <p className="text-zinc-400 font-p font-normal text-[13px] leading-[1.65] mb-5">
                Receive formatted email alerts instantly. Forward leads to Slack, Discord, Zapier, or your external CRM via signed webhooks with exponential backoff.
              </p>
            </div>

            {/* Delivery Pipeline Visual */}
            <div className="rounded-xl border border-white/[0.06] bg-[#141414] p-3.5 font-sans text-[11px] space-y-2 shadow-inner">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <span className="text-zinc-200 flex items-center gap-2">
                  <Icon name="mail" className="w-3.5 h-3.5 text-emerald-400" /> Immediate Email Alert
                </span>
                <span className="text-emerald-400 font-sans text-[10px]">Delivered</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <span className="text-zinc-200 flex items-center gap-2">
                  <Icon name="hook" className="w-3.5 h-3.5 text-emerald-400" /> Signed Webhook
                </span>
                <span className="text-emerald-400 font-sans text-[10px]">200 OK • 0 Retries</span>
              </div>
            </div>
          </div>

          {/* Card 4: Organisation Workspaces (Large 2 Cols) */}
          <div className="md:col-span-2 rounded-[18px] border border-white/[0.09] hover:border-emerald-500/35 bg-[#1c1c1c] hover:bg-[#232323] p-[24px] md:p-[28px] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(52,211,153,0.1)] group relative">
            {/* Top specular edge */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400 group-hover:border-emerald-500/40 group-hover:shadow-[0_0_16px_rgba(52,211,153,0.25)] transition-all">
                  <Icon name="brief" className="w-[18px] h-[18px]" />
                </span>
                <span className="text-[10.5px] font-sans text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-medium">
                  Team Hub
                </span>
              </div>

              <h3 className="text-[18px] font-heading font-medium tracking-tight text-white mb-2 group-hover:text-white transition-colors">
                Workspaces & Scoped API Credentials
              </h3>
              <p className="text-zinc-400 font-p font-normal text-[13px] leading-[1.65] max-w-[520px] mb-5">
                Organise staging and production environments with scoped API keys. Invite team members with role-based access and export inquiries via CSV or REST API anytime.
              </p>
            </div>

            {/* Workspace Hub Preview */}
            <div className="rounded-xl border border-white/[0.06] bg-[#141414] p-3.5 font-sans shadow-inner">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 grid place-items-center text-emerald-300 text-[11px] font-semibold">
                    A
                  </span>
                  <div>
                    <span className="text-[13px] font-medium text-white block leading-tight">Acme Production Workspace</span>
                    <span className="text-[10.5px] text-zinc-400 font-sans">key: sln_live_acme_••••</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <Avatar size={24} index={0} alt="Member 1" />
                    <Avatar size={24} index={1} alt="Member 2" />
                    <Avatar size={24} index={2} alt="Member 3" />
                  </div>
                  <span className="text-[10.5px] text-emerald-300 font-sans bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    3 Active Seats
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

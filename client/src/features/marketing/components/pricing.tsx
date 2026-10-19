"use client";

import React, { useState } from "react";
import { Icon } from "./icons";
import { Pill, Button } from "./ui";
import { cn } from "@/shared/lib/utils";

export function Pricing() {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section className="py-[56px] md:py-[76px] relative z-10" id="pricing">
      {/* Subtle Sapphire Atmospheric Aura */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] rounded-full blur-[140px] opacity-15"
          style={{
            background: "radial-gradient(ellipse at center, rgba(52,211,153,0.20) 0%, rgba(16,185,129,0.10) 50%, transparent 75%)",
          }}
        />
      </div>

      <div className="max-w-[1100px] mx-auto px-[16px] sm:px-[24px]">
        {/* Head */}
        <div className="text-center max-w-[560px] mx-auto mb-[40px] sm:mb-[48px]">
          <Pill icon="layers">Transparent Pricing</Pill>
          <h2 className="text-[26px] sm:text-[34px] md:text-[40px] font-heading font-medium tracking-[-0.025em] leading-[1.2] mt-4 mb-3 text-white text-balance">
            Simple, honest pricing in INR <br className="hidden sm:inline" />
            <span className="text-zinc-400">with zero hidden overages or surprise fees.</span>
          </h2>
          <p className="text-zinc-400 font-p font-normal mt-3 text-[13.5px] sm:text-[14.5px] leading-[1.65] max-w-[520px] mx-auto text-pretty">
            Start free for side projects. Scale smoothly as your client inquiries and organization workspaces grow.
          </p>

          {/* Monthly / Yearly Switcher */}
          <div className="inline-flex border border-white/[0.08] rounded-full p-[3px] mt-[24px] bg-[#141414] shadow-inner">
            <button
              type="button"
              onClick={() => setIsMonthly(true)}
              className={cn(
                "font-sans text-[12px] rounded-full py-[5px] px-[16px] cursor-pointer transition-all duration-200 select-none",
                isMonthly
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => setIsMonthly(false)}
              className={cn(
                "font-sans text-[12px] rounded-full py-[5px] px-[16px] cursor-pointer transition-all duration-200 select-none flex items-center gap-2",
                !isMonthly
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <span>Annual billing</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-sans font-medium">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px] items-stretch">
          {/* Plan 1: Free */}
          <div className="rounded-[18px] p-[26px_22px] flex flex-col justify-between border border-white/[0.08] hover:border-emerald-500/30 bg-[#1c1c1c] hover:bg-[#232323] backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-emerald-400/30 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-medium text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] grid place-items-center">
                    <Icon name="bolt" className="w-3 h-3 text-zinc-300" />
                  </span>
                  Free Tier
                </span>
                <span className="text-[10.5px] text-zinc-400 font-sans bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.08]">
                  Free Forever
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 text-[34px] font-heading font-medium tracking-tight leading-none mb-3 text-white">
                <Icon name="rupee" className="w-[18px] h-[18px] text-zinc-400 self-center -mt-0.5" />
                <span className="tabular-nums">0</span>
                <span className="text-[11px] font-sans text-zinc-400 ml-1">INR</span>
                <span className="text-[12px] text-zinc-500 ml-1 font-normal font-sans">/ mo</span>
              </div>

              <p className="text-zinc-400 font-p font-normal text-[12.5px] leading-[1.6] mb-5">
                Perfect for static sites, landing pages, and developer side projects.
              </p>

              <Button href="/sign-up?plan=free" className="w-full justify-center mb-5 py-[8.5px] text-[12px] hover:border-emerald-500/40">
                Get started free
              </Button>

              <div className="pt-4 border-t border-white/[0.06]">
                <div className="text-[10.5px] font-sans text-zinc-500 uppercase tracking-wider mb-2.5">Included:</div>
                <ul className="space-y-2.5 text-[12px] text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>1 organisation workspace</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>Scoped workspace API key</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>100 submissions / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>Real-time CRM dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>Silent spam heuristics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Plan 2: Pro (Elevated Emerald Centerpiece) */}
          <div className="rounded-[18px] p-[26px_22px] flex flex-col justify-between border border-emerald-500/40 bg-gradient-to-b from-[#222222] to-[#181818] shadow-[0_16px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Top Specular Edge */}
            <div className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-medium text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/25 grid place-items-center">
                    <Icon name="layers" className="w-3.5 h-3.5 text-emerald-400" />
                  </span>
                  Pro Plan
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-400 text-black font-semibold shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                  Most Popular
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 text-[34px] font-heading font-medium tracking-tight leading-none mb-3 text-white">
                <Icon name="rupee" className="w-[18px] h-[18px] text-zinc-300 self-center -mt-0.5" />
                <span className="tabular-nums font-semibold">{isMonthly ? "499" : "399"}</span>
                <span className="text-[11px] font-sans text-zinc-300 ml-1">INR</span>
                <span className="text-[12px] text-zinc-400 ml-1 font-normal font-sans">/ mo</span>
              </div>

              <p className="text-zinc-300 font-p font-normal text-[12.5px] leading-[1.6] mb-5">
                For growing startups, agencies, and businesses scaling client inbounds.
              </p>

              <Button
                href="/sign-up?plan=pro"
                variant="solid"
                className="w-full justify-center mb-5 py-[8.5px] text-[12px] font-semibold shadow-[0_0_20px_rgba(52,211,153,0.25)] hover:shadow-[0_0_25px_rgba(52,211,153,0.4)]"
              >
                Upgrade to Pro
              </Button>

              <div className="pt-4 border-t border-white/[0.08]">
                <div className="text-[10.5px] font-sans text-emerald-300 uppercase tracking-wider mb-2.5 font-medium">Everything in Free, plus:</div>
                <ul className="space-y-2.5 text-[12px] text-white">
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>Up to 5 organisation workspaces</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>Unlimited forms & scoped API keys</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>5,000 submissions / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>Signed webhooks & Slack alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>REST API & CSV export</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Plan 3: Studio */}
          <div className="rounded-[18px] p-[26px_22px] flex flex-col justify-between border border-white/[0.08] hover:border-emerald-500/30 bg-[#1c1c1c] hover:bg-[#232323] backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-emerald-400/30 transition-all" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-medium text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] grid place-items-center">
                    <Icon name="brief" className="w-3 h-3 text-zinc-300" />
                  </span>
                  Studio Tier
                </span>
                <span className="text-[10.5px] text-zinc-400 font-sans bg-white/[0.03] px-2 py-0.5 rounded-full border border-white/[0.08]">
                  Agencies
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 text-[34px] font-heading font-medium tracking-tight leading-none mb-3 text-white">
                <Icon name="rupee" className="w-[18px] h-[18px] text-zinc-400 self-center -mt-0.5" />
                <span className="tabular-nums">{isMonthly ? "1,299" : "999"}</span>
                <span className="text-[11px] font-sans text-zinc-400 ml-1">INR</span>
                <span className="text-[12px] text-zinc-500 ml-1 font-normal font-sans">/ mo</span>
              </div>

              <p className="text-zinc-400 font-p font-normal text-[12.5px] leading-[1.6] mb-5">
                Unlimited scale for agencies managing multiple client pipelines.
              </p>

              <Button href="/sign-up?plan=studio" className="w-full justify-center mb-5 py-[8.5px] text-[12px] hover:border-emerald-500/40">
                Get Studio Plan
              </Button>

              <div className="pt-4 border-t border-white/[0.06]">
                <div className="text-[10.5px] font-sans text-zinc-500 uppercase tracking-wider mb-2.5">Everything in Pro, plus:</div>
                <ul className="space-y-2.5 text-[12px] text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>Unlimited workspaces & team seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>50,000 submissions / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>Client notification routing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>Dedicated IP & high-volume quota</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    <span>Priority 24/7 engineering support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

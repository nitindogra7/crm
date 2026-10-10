"use client";

import React, { useState } from "react";
import { Icon } from "./icons";
import { Pill, Button } from "./ui";
import { cn } from "@/shared/lib/utils";

export function Pricing() {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section className="pt-0 pb-[80px] md:pb-[96px]" id="pricing">
      <div className="max-w-[1040px] mx-auto px-[16px] sm:px-[24px]">
        {/* Head */}
        <div className="text-center mb-[52px]">
          <Pill icon="layers">Pricing for everyone</Pill>
          <h2 className="text-[clamp(26px,3.4vw,38px)] font-extralight tracking-[-0.04em] leading-[1.1] mt-[20px] text-white">
            Simple and transparent pricing
          </h2>
          <p className="text-[#8c8c8c] mt-[14px] text-[12.5px] max-w-[420px] mx-auto leading-[1.7]">
            Start free for side projects. Upgrade when your business inquiries scale.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex border border-white/[0.08] rounded-full p-[3px] mt-[18px] bg-white/[0.02]">
            <button
              type="button"
              onClick={() => setIsMonthly(true)}
              className={cn(
                "font-sans text-[11px] rounded-full py-[5px] px-[16px] cursor-pointer transition-all duration-300",
                isMonthly
                  ? "bg-[linear-gradient(180deg,#2a2a2a,#161616)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-[#8c8c8c] hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsMonthly(false)}
              className={cn(
                "font-sans text-[11px] rounded-full py-[5px] px-[16px] cursor-pointer transition-all duration-300",
                !isMonthly
                  ? "bg-[linear-gradient(180deg,#2a2a2a,#161616)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                  : "text-[#8c8c8c] hover:text-white"
              )}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px] max-w-[420px] md:max-w-none mx-auto items-stretch">
          {/* Plan 1: Free (With Frosted Glass Hover Effect) */}
          <div className="group relative rounded-[16px] p-[26px_24px] flex flex-col border border-white/[0.08] bg-[linear-gradient(150deg,rgba(255,255,255,0.07),rgba(255,255,255,0.012)_38%,rgba(255,255,255,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_50px_-24px_#000] backdrop-blur-xl transition-all duration-500 ease-out hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.07)_100%)] hover:border-white/30 hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.35),inset_0_0_24px_0_rgba(255,255,255,0.05),0_0_30px_rgba(255,255,255,0.06)] hover:-translate-y-[4px] overflow-hidden">
            {/* Top specular reflection bevel on hover */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-[16px]" />

            <div className="flex items-center gap-[9px] text-[12.5px] font-normal mb-[16px] text-white">
              <span className="w-[24px] h-[24px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_5px_rgba(255,255,255,0.025),0_0_0_6px_rgba(255,255,255,0.08)] text-white">
                <Icon name="bolt" className="w-[11px] h-[11px]" />
              </span>
              Free
            </div>

            <div className="text-[32px] font-thin tracking-[-0.05em] leading-none mb-[16px] text-white">
              $<span className="tabular-nums">0</span>
              <small className="text-[10px] text-[#565656] tracking-normal font-light ml-[5px]">
                per month
              </small>
            </div>

            <Button href="/signup?plan=free" className="w-full mb-[16px]">
              Get started free
            </Button>

            <div className="text-center text-[#444] text-[13px] mb-[12px] relative">
              <span className="absolute top-1/2 left-0 w-[42%] h-[1px] bg-white/[0.08]" />
              +
              <span className="absolute top-1/2 right-0 w-[42%] h-[1px] bg-white/[0.08]" />
            </div>

            <ul className="list-none grid gap-[10px] text-[#8c8c8c] text-[11.5px]">
              <li className="flex items-center gap-[9px]">
                <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                  <Icon name="chk" className="w-[7px] h-[7px]" />
                </i>
                Up to 3 active forms
              </li>
              <li className="flex items-center gap-[9px]">
                <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                  <Icon name="chk" className="w-[7px] h-[7px]" />
                </i>
                100 submissions / month
              </li>
              <li className="flex items-center gap-[9px]">
                <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                  <Icon name="chk" className="w-[7px] h-[7px]" />
                </i>
                Instant email notifications
              </li>
              <li className="flex items-center gap-[9px]">
                <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                  <Icon name="chk" className="w-[7px] h-[7px]" />
                </i>
                Invisible spam filtering
              </li>
            </ul>
          </div>

          {/* Plan 2: Pro (Middle Card - Revolving Glowing Line ONLY, NO Glass Effect) */}
          <div className="relative rounded-[16px] p-[1.5px] overflow-hidden order-first md:order-none transition-all duration-400 hover:-translate-y-[3px] shadow-[0_24px_50px_-24px_#000]">
            {/* Revolving Glowing Line */}
            <div
              className="absolute -inset-[150%] aspect-square m-auto pointer-events-none animate-[spin_4s_linear_infinite]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, transparent 260deg, rgba(255,255,255,0.15) 290deg, rgba(255,255,255,0.7) 325deg, #ffffff 350deg, transparent 360deg)",
              }}
            />
            {/* Diffused Glow Blur behind revolving line */}
            <div
              className="absolute -inset-[150%] aspect-square m-auto pointer-events-none blur-[10px] opacity-80 animate-[spin_4s_linear_infinite]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, transparent 260deg, rgba(255,255,255,0.2) 290deg, rgba(255,255,255,0.9) 330deg, #ffffff 350deg, transparent 360deg)",
              }}
            />

            {/* Inner Pro Card Content (Solid dark background with NO glass hover effect) */}
            <div className="relative h-full w-full rounded-[14.5px] p-[26px_24px] flex flex-col bg-[linear-gradient(150deg,rgba(32,32,32,0.98),rgba(12,12,12,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="flex items-center gap-[9px] text-[12.5px] font-normal mb-[16px] text-white">
                <span className="w-[24px] h-[24px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_5px_rgba(255,255,255,0.025),0_0_0_6px_rgba(255,255,255,0.08)] text-white">
                  <Icon name="layers" className="w-[11px] h-[11px]" />
                </span>
                Pro
                <em className="ml-auto not-italic text-[9px] bg-white text-black rounded-full py-[1px] px-[8px] font-medium shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                  Most Popular
                </em>
              </div>

              <div className="text-[32px] font-thin tracking-[-0.05em] leading-none mb-[16px] text-white">
                $<span className="tabular-nums">{isMonthly ? "15" : "12"}</span>
                <small className="text-[10px] text-[#565656] tracking-normal font-light ml-[5px]">
                  per month
                </small>
              </div>

              <Button href="/signup?plan=pro" variant="solid" className="w-full mb-[16px]">
                Upgrade to Pro
              </Button>

              <div className="text-center text-[#444] text-[13px] mb-[12px] relative">
                <span className="absolute top-1/2 left-0 w-[42%] h-[1px] bg-white/[0.08]" />
                +
                <span className="absolute top-1/2 right-0 w-[42%] h-[1px] bg-white/[0.08]" />
              </div>

              <ul className="list-none grid gap-[10px] text-[#8c8c8c] text-[11.5px]">
                <li className="flex items-center gap-[9px]">
                  <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                    <Icon name="chk" className="w-[7px] h-[7px]" />
                  </i>
                  Unlimited forms
                </li>
                <li className="flex items-center gap-[9px]">
                  <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                    <Icon name="chk" className="w-[7px] h-[7px]" />
                  </i>
                  5,000 submissions / month
                </li>
                <li className="flex items-center gap-[9px]">
                  <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                    <Icon name="chk" className="w-[7px] h-[7px]" />
                  </i>
                  Signed webhooks & Slack alerts
                </li>
                <li className="flex items-center gap-[9px]">
                  <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                    <Icon name="chk" className="w-[7px] h-[7px]" />
                  </i>
                  Spam inspection & rescue
                </li>
                <li className="flex items-center gap-[9px]">
                  <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                    <Icon name="chk" className="w-[7px] h-[7px]" />
                  </i>
                  REST API & CSV export
                </li>
              </ul>
            </div>
          </div>

          {/* Plan 3: Studio (With Frosted Glass Hover Effect) */}
          <div className="group relative rounded-[16px] p-[26px_24px] flex flex-col border border-white/[0.08] bg-[linear-gradient(150deg,rgba(255,255,255,0.07),rgba(255,255,255,0.012)_38%,rgba(255,255,255,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_50px_-24px_#000] backdrop-blur-xl transition-all duration-500 ease-out hover:bg-[linear-gradient(145deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.07)_100%)] hover:border-white/30 hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.35),inset_0_0_24px_0_rgba(255,255,255,0.05),0_0_30px_rgba(255,255,255,0.06)] hover:-translate-y-[4px] overflow-hidden">
            {/* Top specular reflection bevel on hover */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-[16px]" />

            <div className="flex items-center gap-[9px] text-[12.5px] font-normal mb-[16px] text-white">
              <span className="w-[24px] h-[24px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_5px_rgba(255,255,255,0.025),0_0_0_6px_rgba(255,255,255,0.08)] text-white">
                <Icon name="brief" className="w-[11px] h-[11px]" />
              </span>
              Studio
            </div>

            <div className="text-[32px] font-thin tracking-[-0.05em] leading-none mb-[16px] text-white">
              $<span className="tabular-nums">{isMonthly ? "49" : "39"}</span>
              <small className="text-[10px] text-[#565656] tracking-normal font-light ml-[5px]">
                per month
              </small>
            </div>

            <Button href="/signup?plan=studio" className="w-full mb-[16px]">
              Contact sales
            </Button>

            <div className="text-center text-[#444] text-[13px] mb-[12px] relative">
              <span className="absolute top-1/2 left-0 w-[42%] h-[1px] bg-white/[0.08]" />
              +
              <span className="absolute top-1/2 right-0 w-[42%] h-[1px] bg-white/[0.08]" />
            </div>

            <ul className="list-none grid gap-[10px] text-[#8c8c8c] text-[11.5px]">
              <li className="flex items-center gap-[9px]">
                <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                  <Icon name="chk" className="w-[7px] h-[7px]" />
                </i>
                Unlimited client domains
              </li>
              <li className="flex items-center gap-[9px]">
                <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                  <Icon name="chk" className="w-[7px] h-[7px]" />
                </i>
                50,000 submissions / month
              </li>
              <li className="flex items-center gap-[9px]">
                <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                  <Icon name="chk" className="w-[7px] h-[7px]" />
                </i>
                Client notification routing
              </li>
              <li className="flex items-center gap-[9px]">
                <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                  <Icon name="chk" className="w-[7px] h-[7px]" />
                </i>
                Dedicated IP & high-volume quotas
              </li>
              <li className="flex items-center gap-[9px]">
                <i className="w-[14px] h-[14px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#666,#1a1a1a)] border border-white/[0.17] grid place-items-center flex-none text-white">
                  <Icon name="chk" className="w-[7px] h-[7px]" />
                </i>
                Priority 24/7 engineering support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

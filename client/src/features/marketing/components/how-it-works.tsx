import React from "react";
import { Pill } from "./ui";

interface StepItem {
  num: string;
  badge: string;
  codePrefix: string;
  codeHighlight: string;
  title: string;
  desc: string;
}

const STEPS: StepItem[] = [
  {
    num: "01",
    badge: "Workspace Hub",
    codePrefix: "workspace:",
    codeHighlight: "\"acme-corp\"",
    title: "Create your workspace",
    desc: "Sign up in 30 seconds and configure your organisation hub. Organize client projects, teammates, and multiple forms.",
  },
  {
    num: "02",
    badge: "API Provisioning",
    codePrefix: "x-api-key:",
    codeHighlight: "sln_live_••••c1",
    title: "Get your API key",
    desc: "Instantly provision a scoped, secure API key. Zero server management, database setup, or secret rotation required.",
  },
  {
    num: "03",
    badge: "Universal POST",
    codePrefix: "POST /v1/leads",
    codeHighlight: "[200 OK]",
    title: "Connect any form",
    desc: "Point plain HTML <form action=\"...\">, React, Webflow, or cURL directly to Salenova with your API key.",
  },
  {
    num: "04",
    badge: "Live Telemetry",
    codePrefix: "lead.created",
    codeHighlight: "→ CRM Inbox",
    title: "Ingest & manage leads",
    desc: "Every submission is screened for spam in real time and delivered straight to your unified CRM inbox with alerts.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-[56px] md:py-[76px] relative z-10" id="how-it-works">
      {/* Subtle deep emerald ambient lighting */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[400px] w-full max-w-[850px] mx-auto rounded-full blur-[140px] opacity-20 -z-10"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(52,211,153,0.15) 0%, rgba(16,185,129,0.08) 50%, transparent 70%)",
        }}
      />

      <div className="max-w-[1100px] mx-auto px-[16px] sm:px-[24px]">
        {/* Section Heading */}
        <div className="text-center max-w-[560px] mx-auto mb-[40px] sm:mb-[48px]">
          <Pill icon="bolt">Simple 4-Step Pipeline</Pill>
          <h2 className="text-[26px] sm:text-[34px] md:text-[40px] font-heading font-medium tracking-[-0.025em] leading-[1.2] mt-4 mb-3 text-white text-balance">
            From signup to verified leads <br className="hidden sm:inline" />
            <span className="text-zinc-400">in less than sixty seconds.</span>
          </h2>
          <p className="text-zinc-400 font-p font-normal mt-3 text-[13.5px] sm:text-[14.5px] leading-[1.65] max-w-[520px] mx-auto text-pretty">
            No packages to install, no CLI tools. Point your form to our endpoint with your API key and watch verified leads arrive live.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="group relative rounded-[16px] border border-white/[0.09] hover:border-emerald-500/35 bg-[#1c1c1c] hover:bg-[#232323] p-[22px] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(52,211,153,0.1)]"
            >
              {/* Top specular edge on hover */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                {/* Header: Step Number & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="w-7 h-7 rounded-md grid place-items-center font-sans text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/40 group-hover:shadow-[0_0_12px_rgba(52,211,153,0.3)] transition-all">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-sans px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 font-medium">
                    {step.badge}
                  </span>
                </div>

                {/* Code Chip */}
                <div className="h-[38px] mb-4 rounded-lg border border-white/[0.06] bg-[#141414] px-3 flex items-center font-sans text-[11px] overflow-hidden whitespace-nowrap shadow-inner">
                  <span className="text-zinc-600 mr-2">$</span>
                  <span className="text-zinc-300 mr-1.5">{step.codePrefix}</span>
                  <span className="text-emerald-400 font-medium">
                    {step.codeHighlight}
                  </span>
                </div>

                <h3 className="text-[15px] font-heading font-medium text-white mb-2 tracking-tight group-hover:text-white transition-colors">
                  {step.title}
                </h3>
                <p className="text-zinc-400 font-p font-normal text-[12px] leading-[1.65]">
                  {step.desc}
                </p>
              </div>

              {/* Bottom Subtle Status */}
              <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10.5px] text-zinc-500 font-sans">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Step {i + 1} of 4
                </span>
                <span className="text-zinc-500 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all">Active →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

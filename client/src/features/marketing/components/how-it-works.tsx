"use client";

import React from "react";
import { Zap, Activity, ShieldCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "1",
      badgeColor: "bg-[#14b8a6] text-white shadow-[0_0_20px_rgba(20,184,166,0.35)]",
      ringColor: "border-[#14b8a6]/20 bg-[#14b8a6]/10",
      title: "Automated Ingestion",
      desc: "Capture website inquiries automatically from forms, landing pages, and webhooks with zero manual entry.",
      icon: Zap,
    },
    {
      num: "2",
      badgeColor: "bg-[#f59e0b] text-white shadow-[0_0_20px_rgba(245,158,11,0.35)]",
      ringColor: "border-[#f59e0b]/20 bg-[#f59e0b]/10",
      title: "Real-Time Analytics",
      desc: "Gain deep live insights into pipeline velocity, response speed, conversion rates, and revenue forecasting.",
      icon: Activity,
    },
    {
      num: "3",
      badgeColor: "bg-[#8b5cf6] text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]",
      ringColor: "border-[#8b5cf6]/20 bg-[#8b5cf6]/10",
      title: "Spam Shield & Security",
      desc: "Quarantine promotional bots and malicious spam before they reach your sales team or pollute your database.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#f7f8f7] relative" id="how-it-works">
      <div className="w-[min(1160px,calc(100%-36px))] mx-auto">
        {/* Section Header (Template Style) */}
        <div className="text-center max-w-[680px] mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-[#705232] bg-[#f2e7db] border border-[#e5d0bc] mb-5 shadow-xs">
            <span>Exclusive Features</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1a2321] leading-[1.15]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Transform lead operations with{" "}
            <span
              style={{
                background: "linear-gradient(100deg, #d97706, #f59e0b 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              automation
            </span>
          </h2>
        </div>

        {/* 3 Step Interactive Workflow with connecting track */}
        <div className="relative">
          {/* Connecting Track Line (Desktop) */}
          <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[#14b8a6]/40 via-[#f59e0b]/40 to-[#8b5cf6]/40 pointer-events-none z-0" />
          <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-[2px] border-b-2 border-dashed border-[#d1dcd4] pointer-events-none z-0" />

          {/* 3 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative z-10">
            {steps.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.num}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Outer circle halo + Badge */}
                  <div
                    className={`w-16 h-16 rounded-full border flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105 ${step.ringColor}`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-bold ${step.badgeColor}`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Step Title */}
                  <h3
                    className="text-lg sm:text-xl font-semibold text-[#1a2321] mb-2.5 flex items-center gap-2 justify-center"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <span>{step.title}</span>
                  </h3>

                  {/* Step Description - simple, concise */}
                  <p className="text-xs sm:text-sm text-[#5d6967] leading-relaxed max-w-[310px]">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

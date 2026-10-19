"use client";

import React, { useState } from "react";
import { Icon } from "./icons";
import { Pill } from "./ui";
import { cn } from "@/shared/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function SpotlightCard({ children, className, style }: SpotlightCardProps) {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handlePointerLeave = () => {
    setCoords(null);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={style}
      className={cn(
        "group relative p-[22px] sm:p-[24px] rounded-[16px] border border-white/[0.09] hover:border-emerald-500/35 transition-all duration-300 overflow-hidden bg-[#1c1c1c] hover:bg-[#232323] shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(52,211,153,0.1)] flex flex-col justify-between",
        className
      )}
    >
      {/* Top subtle specular edge */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Subtle emerald green cursor spotlight */}
      {coords && (
        <div
          className="pointer-events-none absolute w-[280px] h-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-200 opacity-100"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            background: "radial-gradient(circle, rgba(52,211,153,0.14) 0%, rgba(16,185,129,0.04) 50%, transparent 70%)",
          }}
        />
      )}
      {children}
    </div>
  );
}

const BENEFITS = [
  {
    icon: "shield" as const,
    title: "Smart Spam Defense",
    desc: "Silent honeypots, disposable email filters, and IP reputation heuristics screen out bot crawlers automatically.",
    tag: "Heuristics",
  },
  {
    icon: "cpu" as const,
    title: "Zero Package Setup",
    desc: "No npm packages, CLI commands, or heavy SDKs. Connect your workspace API key to any form using standard HTTP POST.",
    tag: "Zero Config",
  },
  {
    icon: "bell" as const,
    title: "Instant Inbound Alerts",
    desc: "Formatted notifications land in your inbox in under 200ms with full submission payload context and origin details.",
    tag: "<200ms",
  },
  {
    icon: "db" as const,
    title: "Workspace CRM Stream",
    desc: "Every submission streams into your organisation's dashboard. Search leads, monitor spam drops, or export to CSV.",
    tag: "Live Stream",
  },
];

export function BenefitsCross() {
  return (
    <section className="py-[56px] md:py-[72px] relative z-10" id="benefits">
      <div className="max-w-[1100px] mx-auto px-[16px] sm:px-[24px]">
        {/* Section Heading */}
        <div className="text-center max-w-[560px] mx-auto mb-[40px] sm:mb-[48px]">
          <Pill icon="star">Why Developers Choose Salenova</Pill>
          <h2 className="text-[26px] sm:text-[34px] md:text-[40px] font-heading font-medium tracking-[-0.025em] leading-[1.2] mt-4 mb-3 text-white text-balance">
            Built for modern frontend teams <br className="hidden sm:inline" />
            <span className="text-zinc-400">and automated conversion pipelines.</span>
          </h2>
          <p className="text-zinc-400 font-p font-normal mt-3 text-[13.5px] sm:text-[14.5px] leading-[1.65] max-w-[520px] mx-auto text-pretty">
            Everything is engineered to be frictionless, reliable, and completely out of the way of your application code.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
          {BENEFITS.map((item, idx) => (
            <SpotlightCard key={idx}>
              <div>
                {/* Header: Emerald Green Icon & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-[38px] h-[38px] rounded-xl grid place-items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 transition-all group-hover:border-emerald-500/40 group-hover:shadow-[0_0_16px_rgba(52,211,153,0.25)]">
                    <Icon name={item.icon} className="w-[18px] h-[18px]" />
                  </div>
                  <span className="text-[10px] font-sans px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 font-medium">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-[15px] font-heading font-medium text-white mb-2 tracking-tight group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-400 font-p font-normal text-[12px] leading-[1.65]">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Subtle Status */}
              <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10.5px] text-zinc-500 font-sans">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Production Ready
                </span>
                <span className="text-zinc-500 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all">→</span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

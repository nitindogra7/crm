"use client";

import React, { useState } from "react";
import { Icon } from "./icons";
import { Pill, Orb } from "./ui";
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
        "group relative p-[28px_24px] text-center flex flex-col items-center min-h-[196px] rounded-[16px] border border-white/[0.08] hover:border-white/[0.17] transition-[border-color] duration-400 overflow-hidden bg-[linear-gradient(150deg,rgba(255,255,255,0.07),rgba(255,255,255,0.012)_38%,rgba(255,255,255,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_50px_-24px_#000]",
        className
      )}
    >
      {/* Spotlight highlight */}
      {coords && (
        <div
          className="pointer-events-none absolute w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-400 opacity-100"
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent 65%)",
          }}
        />
      )}
      {children}
    </div>
  );
}

export function BenefitsCross() {
  return (
    <section className="pt-[40px] md:pt-[96px] pb-[80px] md:pb-[96px]" id="benefits">
      <div className="max-w-[1040px] mx-auto px-[16px] sm:px-[24px]">
        {/* Section Heading */}
        <div className="text-center mb-[52px]">
          <Pill icon="star">Why developers choose Salenova</Pill>
          <h2 className="text-[clamp(26px,3.4vw,38px)] font-extralight tracking-[-0.04em] leading-[1.1] mt-[20px] text-white">
            Never build a form backend again
          </h2>
        </div>

        {/* Cross Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[8px]">
          {/* Subtle background radial glows on desktop */}
          <div
            className="hidden md:block absolute -inset-[60px] pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(circle at 33.3% 33.3%, rgba(255,255,255,0.09), transparent 17%), radial-gradient(circle at 66.6% 33.3%, rgba(255,255,255,0.09), transparent 17%), radial-gradient(circle at 33.3% 66.6%, rgba(255,255,255,0.09), transparent 17%), radial-gradient(circle at 66.6% 66.6%, rgba(255,255,255,0.09), transparent 17%)",
            }}
          />

          {/* Cell A (Top on desktop: col 2, row 1) */}
          <SpotlightCard className="md:col-start-2 md:row-start-1 z-10">
            <div className="w-[44px] h-[44px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_5px_rgba(255,255,255,0.025),0_0_0_6px_rgba(255,255,255,0.08)] text-white mb-[16px] flex-none">
              <Icon name="shield" className="w-[17px] h-[17px]" />
            </div>
            <h3 className="text-[12.5px] font-normal tracking-[-0.01em] mb-[6px] text-white">
              Smart Spam Filtering
            </h3>
            <p className="text-[#8c8c8c] text-[11.5px] max-w-[220px] leading-[1.6]">
              Honeypots, rate limiting, and disposable email filters catch bots before they clutter your inbox.
            </p>
          </SpotlightCard>

          {/* Cell B (Left on desktop: col 1, row 2) */}
          <SpotlightCard className="md:col-start-1 md:row-start-2 z-10">
            <div className="w-[44px] h-[44px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_5px_rgba(255,255,255,0.025),0_0_0_6px_rgba(255,255,255,0.08)] text-white mb-[16px] flex-none">
              <Icon name="cpu" className="w-[17px] h-[17px]" />
            </div>
            <h3 className="text-[12.5px] font-normal tracking-[-0.01em] mb-[6px] text-white">
              Zero Server Setup
            </h3>
            <p className="text-[#8c8c8c] text-[11.5px] max-w-[220px] leading-[1.6]">
              No Node.js boilerplate, no database connections, no SMTP configs. Just one clean endpoint.
            </p>
          </SpotlightCard>

          {/* Cell Core (Center on desktop: col 2, row 2) */}
          <div className="hidden md:flex md:col-start-2 md:row-start-2 z-10 justify-center items-center rounded-[16px] border border-white/[0.08] min-h-[196px] bg-[radial-gradient(circle,rgba(255,255,255,0.07),rgba(255,255,255,0.01)_70%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_50px_-24px_#000]">
            <div className="relative">
              {/* Outer spinning dashed ring */}
              <div className="absolute -inset-[34px] rounded-full border border-dashed border-white/10 animate-[spin_40s_linear_infinite]" />
              <Orb size={84} />
            </div>
          </div>

          {/* Cell C (Right on desktop: col 3, row 2) */}
          <SpotlightCard className="md:col-start-3 md:row-start-2 z-10">
            <div className="w-[44px] h-[44px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_5px_rgba(255,255,255,0.025),0_0_0_6px_rgba(255,255,255,0.08)] text-white mb-[16px] flex-none">
              <Icon name="bell" className="w-[17px] h-[17px]" />
            </div>
            <h3 className="text-[12.5px] font-normal tracking-[-0.01em] mb-[6px] text-white">
              Instant Email Delivery
            </h3>
            <p className="text-[#8c8c8c] text-[11.5px] max-w-[220px] leading-[1.6]">
              Formatted notifications land in your inbox in under 500ms for every real inquiry.
            </p>
          </SpotlightCard>

          {/* Cell D (Bottom on desktop: col 2, row 3) */}
          <SpotlightCard className="md:col-start-2 md:row-start-3 z-10">
            <div className="w-[44px] h-[44px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_5px_rgba(255,255,255,0.025),0_0_0_6px_rgba(255,255,255,0.08)] text-white mb-[16px] flex-none">
              <Icon name="db" className="w-[17px] h-[17px]" />
            </div>
            <h3 className="text-[12.5px] font-normal tracking-[-0.01em] mb-[6px] text-white">
              Structured Storage & APIs
            </h3>
            <p className="text-[#8c8c8c] text-[11.5px] max-w-[220px] leading-[1.6]">
              Every submission is saved securely. Search past leads, export to CSV, or trigger webhooks.
            </p>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

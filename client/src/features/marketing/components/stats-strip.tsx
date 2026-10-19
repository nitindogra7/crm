import React from "react";

export function StatsStrip() {
  const stats = [
    {
      value: "0",
      label: "servers to provision",
      sub: "100% serverless",
    },
    {
      value: "<180ms",
      label: "intake to inbox",
      sub: "real-time delivery",
    },
    {
      value: "99.98%",
      label: "spam filtered",
      sub: "zero false drops",
    },
    {
      value: "100%",
      label: "verified uptime",
      sub: "redundant edge",
    },
  ];

  return (
    <section className="py-[32px] md:py-[44px] relative z-10">
      <div className="max-w-[1100px] mx-auto px-[16px] sm:px-[24px]">
        {/* High-Tech Telemetry Bar */}
        <div className="relative rounded-[16px] border border-white/[0.09] bg-[#1c1c1c] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.07] overflow-hidden group">
          {/* Top specular edge */}
          <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent pointer-events-none" />

          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 text-center hover:bg-white/[0.025] transition-colors group/item"
            >
              {/* Telemetry status pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-sans text-emerald-300 mb-2.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{stat.sub}</span>
              </div>

              {/* Stat Value */}
              <div className="text-[28px] sm:text-[34px] font-heading font-medium tracking-tight text-white tabular-nums mb-1 leading-none group-hover/item:text-emerald-100 transition-colors">
                {stat.value}
              </div>

              {/* Stat Label */}
              <div className="text-zinc-400 font-sans text-[12px] sm:text-[12.5px] leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";

export function StatsStrip() {
  const stats = [
    {
      value: "2 mins",
      label: "To connect your first form",
      sub: "No coding required",
    },
    {
      value: "Instant",
      label: "Lead alerts to your dashboard",
      sub: "Real-time updates",
    },
    {
      value: "0",
      label: "Annoying puzzle captchas",
      sub: "Invisible spam filter",
    },
    {
      value: "100%",
      label: "Customer inquiries captured",
      sub: "Never lose a lead",
    },
  ];

  return (
    <section className="py-8 md:py-12 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-xl border border-emerald-950/70 bg-[#0E1411] shadow-[0_12px_36px_rgba(0,0,0,0.7)] grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-800/60 overflow-hidden">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 text-center hover:bg-white/[0.02] transition-colors"
            >
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10.5px] font-medium text-emerald-300 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{stat.sub}</span>
              </div>

              <div className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-white tabular-nums mb-1">
                {stat.value}
              </div>

              <div className="text-zinc-400 font-sans text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

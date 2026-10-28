"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: "emerald" | "amber" | "blue" | "rose";
}

export function StatCard({
  label,
  value,
  subtext,
  href,
  icon: Icon,
  badge,
  badgeColor = "emerald",
}: StatCardProps) {
  const badgeClasses = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  }[badgeColor];

  return (
    <Link
      href={href}
      className="group relative block p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#181818]/90 hover:bg-[#1e1e1e] hover:border-white/[0.18] transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.3)] focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          {badge && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${badgeClasses}`}
            >
              {badge}
            </span>
          )}
          <span className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/20 transition-all">
            <Icon className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-white tabular-nums">
          {value}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-zinc-400 group-hover:text-white transition-colors">
          <span>View</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {subtext && (
        <p className="text-[11.5px] text-zinc-500 mt-2 font-sans line-clamp-1">
          {subtext}
        </p>
      )}
    </Link>
  );
}

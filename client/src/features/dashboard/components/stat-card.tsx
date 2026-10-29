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
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="group relative block p-5 rounded-2xl border border-white/[0.06] bg-[#131316] hover:bg-[#16161b] hover:border-white/[0.12] transition-all duration-200 focus:outline-none"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-zinc-400 tracking-tight">
          {label}
        </span>
        <Icon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white tabular-nums">
          {value}
        </div>
        <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      {subtext && (
        <p className="text-[11.5px] text-zinc-500 mt-2 font-sans line-clamp-1">
          {subtext}
        </p>
      )}
    </Link>
  );
}


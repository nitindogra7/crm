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
      className="group relative block p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-400/80 hover:shadow-[0_8px_24px_-4px_rgba(37,99,235,0.08)] transition-all duration-200 focus:outline-none shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_-4px_rgba(0,0,0,0.02)]"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[12px] font-semibold text-slate-500 tracking-tight">
          {label}
        </span>
        <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
          <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      {subtext && (
        <p className="text-[11.5px] text-slate-400 mt-2 font-sans line-clamp-1">
          {subtext}
        </p>
      )}
    </Link>
  );
}

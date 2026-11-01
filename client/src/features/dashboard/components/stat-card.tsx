"use client";

import React from "react";
import Link from "@/shared/components/app-link";
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
      className="group flex min-w-0 flex-col rounded-3xl border border-slate-200 bg-gradient-to-b from-[#e7effb] via-[#f7fafd] to-white shadow-[inset_0_0_0_5px_white] p-4 sm:p-5 transition-colors hover:border-slate-300 hover:bg-slate-50/50"
    >
      <div className="flex min-h-10 items-start justify-between gap-2 mb-3">
        <span className="text-[13px] font-medium leading-5 text-slate-600">
          {label}
        </span>
        <div className="shrink-0 text-slate-400">
          <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="min-w-0 break-words text-2xl sm:text-3xl font-normal tracking-tight text-slate-900 tabular-nums">
          {value}
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      {subtext && (
        <p className="text-xs text-slate-500 mt-2 font-sans">
          {subtext}
        </p>
      )}
    </Link>
  );
}

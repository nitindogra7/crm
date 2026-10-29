"use client";

import React from "react";

export function LoadingBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent overflow-hidden">
      <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 animate-[loading-bar_1.5s_infinite_linear] origin-left" />
      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%) scaleX(0.2);
          }
          50% {
            transform: translateX(0%) scaleX(0.6);
          }
          100% {
            transform: translateX(100%) scaleX(0.2);
          }
        }
      `}</style>
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-36 bg-white/[0.06] rounded-xl" />
          <div className="h-4 w-56 bg-white/[0.03] rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-white/[0.05] rounded-xl" />
          <div className="h-9 w-28 bg-white/[0.08] rounded-xl" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-2xl border border-white/[0.06] bg-[#141416] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-20 bg-white/[0.05] rounded" />
              <div className="w-7 h-7 rounded-lg bg-white/[0.05]" />
            </div>
            <div className="h-8 w-16 bg-white/[0.08] rounded-lg" />
            <div className="h-3 w-28 bg-white/[0.03] rounded" />
          </div>
        ))}
      </div>

      {/* Grid: Recent Leads & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.06] bg-[#141416] p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-white/[0.04]">
            <div className="h-5 w-32 bg-white/[0.06] rounded" />
            <div className="h-4 w-16 bg-white/[0.03] rounded" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-white/[0.03] bg-white/[0.01] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-white/[0.07] rounded" />
                    <div className="h-3 w-40 bg-white/[0.03] rounded" />
                  </div>
                </div>
                <div className="h-5 w-16 bg-white/[0.04] rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-white/[0.06] bg-[#141416] p-5 sm:p-6 space-y-4">
          <div className="h-5 w-36 bg-white/[0.06] rounded" />
          <div className="h-48 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-white/[0.06] border-t-white/[0.12]" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3.5 w-full bg-white/[0.04] rounded" />
            <div className="h-3.5 w-3/4 bg-white/[0.03] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeadsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-28 bg-white/[0.06] rounded-xl" />
          <div className="h-4 w-64 bg-white/[0.03] rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-white/[0.06] rounded-xl" />
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-2xl border border-white/[0.06] bg-[#141416] flex flex-wrap gap-3">
        <div className="h-9 flex-1 min-w-[200px] bg-white/[0.04] rounded-xl" />
        <div className="h-9 w-28 bg-white/[0.04] rounded-xl" />
        <div className="h-9 w-28 bg-white/[0.04] rounded-xl" />
        <div className="h-9 w-28 bg-white/[0.04] rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#141416] overflow-hidden">
        <div className="h-10 bg-white/[0.02] border-b border-white/[0.05]" />
        <div className="divide-y divide-white/[0.04]">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-[180px]">
                <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 bg-white/[0.07] rounded" />
                  <div className="h-3 w-36 bg-white/[0.03] rounded" />
                </div>
              </div>
              <div className="h-4 w-24 bg-white/[0.04] rounded hidden sm:block" />
              <div className="h-4 w-20 bg-white/[0.04] rounded hidden md:block" />
              <div className="h-5 w-16 bg-white/[0.06] rounded-full" />
              <div className="h-4 w-24 bg-white/[0.03] rounded hidden lg:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-44 bg-white/[0.06] rounded-xl" />
          <div className="h-4 w-72 bg-white/[0.03] rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-white/[0.08] rounded-xl" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/[0.06] pb-2">
        <div className="h-8 w-24 bg-white/[0.06] rounded-xl" />
        <div className="h-8 w-24 bg-white/[0.03] rounded-xl" />
        <div className="h-8 w-28 bg-white/[0.03] rounded-xl" />
      </div>

      {/* Forms Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-white/[0.06] bg-[#141416] space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-white/[0.07] rounded" />
                <div className="h-3 w-24 bg-white/[0.03] rounded font-mono" />
              </div>
              <div className="h-5 w-12 bg-white/[0.06] rounded-full" />
            </div>
            <div className="h-8 w-full bg-white/[0.03] rounded-xl border border-white/[0.04]" />
            <div className="flex justify-between items-center pt-2 border-t border-white/[0.04]">
              <div className="h-3.5 w-16 bg-white/[0.04] rounded" />
              <div className="h-3.5 w-12 bg-white/[0.04] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpamSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 w-44 bg-white/[0.05] rounded-full" />
          <div className="h-8 w-36 bg-white/[0.06] rounded-xl" />
          <div className="h-4 w-80 bg-white/[0.03] rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-12 w-28 bg-white/[0.05] rounded-xl" />
          <div className="h-12 w-28 bg-white/[0.05] rounded-xl" />
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#141416] overflow-hidden">
        <div className="h-10 bg-white/[0.02] border-b border-white/[0.05]" />
        <div className="divide-y divide-white/[0.04]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 bg-white/[0.07] rounded" />
                <div className="h-3 w-40 bg-white/[0.03] rounded" />
              </div>
              <div className="h-4 w-28 bg-white/[0.04] rounded hidden sm:block" />
              <div className="h-5 w-24 bg-white/[0.05] rounded" />
              <div className="h-7 w-20 bg-white/[0.06] rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-white/[0.06] rounded-xl" />
          <div className="h-4 w-52 bg-white/[0.03] rounded-lg" />
        </div>
        <div className="h-9 w-28 bg-white/[0.05] rounded-xl" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-white/[0.06] bg-[#141416] space-y-3"
          >
            <div className="h-3.5 w-20 bg-white/[0.05] rounded" />
            <div className="h-7 w-16 bg-white/[0.08] rounded" />
            <div className="h-3 w-28 bg-white/[0.03] rounded" />
          </div>
        ))}
      </div>

      <div className="h-72 rounded-2xl border border-white/[0.06] bg-[#141416] p-6 space-y-4">
        <div className="h-5 w-40 bg-white/[0.06] rounded" />
        <div className="h-48 w-full bg-white/[0.02] rounded-xl" />
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-white/[0.06] rounded-xl" />
        <div className="h-4 w-72 bg-white/[0.03] rounded-lg" />
      </div>

      <div className="flex gap-2 border-b border-white/[0.06] pb-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-white/[0.04] rounded-xl" />
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-white/[0.06] bg-[#141416] space-y-4">
        <div className="h-5 w-36 bg-white/[0.06] rounded" />
        <div className="space-y-3">
          <div className="h-4 w-28 bg-white/[0.04] rounded" />
          <div className="h-9 w-full bg-white/[0.04] rounded-xl" />
          <div className="h-4 w-28 bg-white/[0.04] rounded pt-2" />
          <div className="h-9 w-full bg-white/[0.04] rounded-xl" />
        </div>
        <div className="flex justify-end pt-2">
          <div className="h-9 w-36 bg-white/[0.08] rounded-xl" />
        </div>
      </div>
    </div>
  );
}


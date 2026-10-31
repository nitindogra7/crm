"use client";

import React from "react";

export function OverviewSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-36 bg-slate-200 rounded-xl" />
          <div className="h-4 w-56 max-w-full bg-slate-100 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-slate-100 rounded-xl" />
          <div className="h-9 w-28 bg-blue-100 rounded-xl" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-20 bg-slate-200 rounded" />
              <div className="w-8 h-8 rounded-xl bg-slate-100" />
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded-lg" />
            <div className="h-3 w-28 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Grid: Recent Leads & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div className="h-5 w-32 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-100 rounded" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-3 w-40 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-5 w-16 bg-slate-100 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm p-5 sm:p-6 space-y-4">
          <div className="h-5 w-36 bg-slate-200 rounded" />
          <div className="h-48 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-slate-200 border-t-blue-500" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3.5 w-full bg-slate-100 rounded" />
            <div className="h-3.5 w-3/4 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeadsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-28 bg-slate-200 rounded-xl" />
          <div className="h-4 w-64 max-w-full bg-slate-100 rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-blue-100 rounded-xl" />
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-wrap gap-3">
        <div className="h-9 flex-1 min-w-[200px] bg-slate-100 rounded-xl" />
        <div className="h-9 w-28 bg-slate-100 rounded-xl" />
        <div className="h-9 w-28 bg-slate-100 rounded-xl" />
        <div className="h-9 w-28 bg-slate-100 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="h-10 bg-slate-50 border-b border-slate-100" />
        <div className="divide-y divide-slate-100">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-[180px]">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-36 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-4 w-24 bg-slate-100 rounded hidden sm:block" />
              <div className="h-4 w-20 bg-slate-100 rounded hidden md:block" />
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
              <div className="h-4 w-24 bg-slate-100 rounded hidden lg:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-44 bg-slate-200 rounded-xl" />
          <div className="h-4 w-72 max-w-full bg-slate-100 rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-blue-100 rounded-xl" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <div className="h-8 w-24 bg-slate-200 rounded-xl" />
        <div className="h-8 w-24 bg-slate-100 rounded-xl" />
        <div className="h-8 w-28 bg-slate-100 rounded-xl" />
      </div>

      {/* Forms Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-24 bg-slate-100 rounded font-mono" />
              </div>
              <div className="h-5 w-12 bg-slate-100 rounded-full" />
            </div>
            <div className="h-8 w-full bg-slate-50 rounded-xl border border-slate-200" />
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <div className="h-3.5 w-16 bg-slate-100 rounded" />
              <div className="h-3.5 w-12 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpamSkeleton() {
  return (
    <div className="space-y-6 animate-pulse font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 w-44 bg-slate-100 rounded-full" />
          <div className="h-8 w-36 bg-slate-200 rounded-xl" />
          <div className="h-4 w-80 max-w-full bg-slate-100 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-12 w-28 bg-slate-100 rounded-xl" />
          <div className="h-12 w-28 bg-slate-100 rounded-xl" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="h-10 bg-slate-50 border-b border-slate-100" />
        <div className="divide-y divide-slate-100">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-40 bg-slate-100 rounded" />
              </div>
              <div className="h-4 w-28 bg-slate-100 rounded hidden sm:block" />
              <div className="h-5 w-24 bg-slate-100 rounded" />
              <div className="h-7 w-20 bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse font-sans">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-slate-200 rounded-xl" />
          <div className="h-4 w-52 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-9 w-28 bg-slate-100 rounded-xl" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-3"
          >
            <div className="h-3.5 w-20 bg-slate-200 rounded" />
            <div className="h-7 w-16 bg-slate-200 rounded" />
            <div className="h-3 w-28 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      <div className="h-72 rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 space-y-4">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="h-48 w-full bg-slate-50 rounded-xl border border-slate-100" />
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl animate-pulse font-sans">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 rounded-xl" />
        <div className="h-4 w-72 max-w-full bg-slate-100 rounded-lg" />
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-slate-100 rounded-xl" />
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm space-y-4">
        <div className="h-5 w-36 bg-slate-200 rounded" />
        <div className="space-y-3">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="h-9 w-full bg-slate-100 rounded-xl" />
          <div className="h-4 w-28 bg-slate-200 rounded pt-2" />
          <div className="h-9 w-full bg-slate-100 rounded-xl" />
        </div>
        <div className="flex justify-end pt-2">
          <div className="h-9 w-36 bg-blue-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDashboard } from "../context/dashboard-context";
import {
  ShieldCheck,
  FlaskConical,
  Check,
  ChevronDown,
  Globe,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { WorkspaceEnvironment } from "@/shared/types";

interface EnvironmentSwitcherProps {
  compact?: boolean;
}

export function EnvironmentSwitcher({ compact = false }: EnvironmentSwitcherProps) {
  const {
    currentEnvironment,
    switchEnvironment,
    workspace,
    isLoading,
  } = useDashboard();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const isProd = currentEnvironment === "production";
  const hasProdOrigin = !!workspace?.productionOrigin;

  const handleSelect = async (env: WorkspaceEnvironment) => {
    setIsOpen(false);
    if (env !== currentEnvironment) {
      await switchEnvironment(env);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Switcher Button - Clerk Styled */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`group inline-flex items-center gap-2 rounded-lg font-medium text-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 select-none cursor-pointer ${
          compact ? "px-2.5 py-1.5" : "px-3 py-1.5"
        } ${
          isProd
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200/90 hover:bg-emerald-100/70 hover:border-emerald-300 shadow-2xs"
            : "bg-amber-50 text-amber-900 border border-amber-200/90 hover:bg-amber-100/70 hover:border-amber-300 shadow-2xs"
        }`}
        aria-label="Switch Environment"
      >
        {/* Pulsating Indicator Dot */}
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isProd ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isProd ? "bg-emerald-600" : "bg-amber-600"
            }`}
          />
        </span>

        {/* Environment Label */}
        <span className="font-semibold tracking-tight">
          {isProd ? "Production" : "Development"}
        </span>

        {/* Warning Icon if in Prod without configured origin */}
        {isProd && !hasProdOrigin && (
          <AlertTriangle
            className="w-3.5 h-3.5 text-amber-600 animate-pulse ml-0.5"
            aria-label="Production origin required"
          />
        )}

        {/* Caret */}
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Clerk-Style Environment Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Workspace Environment
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Isolated databases and CORS policies per mode.
            </p>
          </div>

          <div className="p-1 space-y-1">
            {/* Development Option */}
            <button
              type="button"
              onClick={() => handleSelect("development")}
              className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                !isProd
                  ? "bg-amber-50/70 text-slate-900 border border-amber-200/80"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="p-1.5 rounded-md bg-amber-100/80 text-amber-800 shrink-0 mt-0.5">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    Development
                  </span>
                  {!isProd && (
                    <Check className="w-4 h-4 text-amber-700 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Sandbox test data. Accepts submissions from any origin (localhost, previews).
                </p>
              </div>
            </button>

            {/* Production Option */}
            <button
              type="button"
              onClick={() => handleSelect("production")}
              className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                isProd
                  ? "bg-emerald-50/70 text-slate-900 border border-emerald-200/80"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="p-1.5 rounded-md bg-emerald-100/80 text-emerald-800 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    Production
                  </span>
                  {isProd && (
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Live data inbox. Mandatory origin check enforced on every request.
                </p>
              </div>
            </button>
          </div>

          {/* Production Origin Status / CTA in Footer */}
          <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {hasProdOrigin ? (
                  <span className="text-emerald-700 font-medium truncate max-w-[130px] inline-block align-bottom">
                    {workspace.productionOrigin}
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium">Origin Required</span>
                )}
              </span>
            </div>

            <Link
              href="/dashboard/settings?tab=origins"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Configure
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

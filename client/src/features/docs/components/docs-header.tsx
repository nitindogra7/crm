"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ExternalLink, ArrowRight, LayoutGrid, X } from "lucide-react";
import { DOCS_CONFIG } from "../data/docs-data";

interface DocsHeaderProps {
  currentMode: "hub" | "guide";
  onGoToHub: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function DocsHeader({
  currentMode,
  onGoToHub,
  searchQuery,
  setSearchQuery,
}: DocsHeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: Cmd+K / Ctrl+K or "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA")
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#141b18]/90 backdrop-blur-xl transition-all select-none">
      {/* Top Amber Glow Line */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#ff995e]/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Mode */}
        <div className="flex items-center gap-3 flex-none">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-all group"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <Image
                src="/favicon.ico"
                alt="Infraly"
                width={28}
                height={28}
                unoptimized
                className="w-6 h-6 object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <span
              className="font-semibold text-base sm:text-lg tracking-tight text-[#f5f7f5]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              infraly
            </span>
          </Link>

          <span className="text-[#55655e] select-none">/</span>

          <button
            type="button"
            onClick={onGoToHub}
            className={`text-xs font-mono px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
              currentMode === "hub"
                ? "bg-[#202c26] border-[#ff995e]/30 text-[#ffab76]"
                : "bg-transparent border-transparent text-[#8fa198] hover:text-[#f5f7f5] hover:bg-white/[0.04]"
            }`}
          >
            <span>Docs</span>
            <span className="text-[10px] text-[#34d399] font-medium px-1.5 py-0.2 rounded-full bg-[#34d399]/15 border border-[#34d399]/30">
              {DOCS_CONFIG.version}
            </span>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-lg hidden sm:block relative">
          <Search className="w-3.5 h-3.5 text-[#71827a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search frameworks, honeypots, REST APIs, or status codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-14 py-2 rounded-xl bg-[#111714] border border-white/[0.09] focus:border-[#ff995e]/60 text-xs text-[#f5f7f5] placeholder-[#71827a] outline-none transition-all duration-200"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-[#71827a] hover:text-[#f5f7f5]"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-[#71827a] bg-white/[0.04] border border-white/[0.08] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <span>⌘</span>K
            </kbd>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-none">
          {currentMode === "guide" ? (
            <button
              type="button"
              onClick={onGoToHub}
              className="inline-flex items-center gap-1.5 text-xs text-[#cdd8d2] hover:text-[#f5f7f5] px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-all cursor-pointer font-medium"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#ffab76]" />
              <span>All Guides Hub</span>
            </button>
          ) : (
            <Link
              href="/#product"
              className="text-xs text-[#8fa198] hover:text-[#f5f7f5] transition-colors hidden sm:inline-flex items-center gap-1.5 px-2 py-1 font-medium"
            >
              <span>Product Demo</span>
              <ExternalLink className="w-3 h-3 text-[#71827a]" />
            </Link>
          )}

          <Link
            href="/dashboard"
            className="min-h-[34px] px-3.5 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-medium text-[#2d1b09] whitespace-nowrap border border-[#f6a16b] shadow-md transition-all duration-200 hover:brightness-105 active:scale-95 cursor-pointer"
            style={{
              background: "linear-gradient(180deg, #ffb080, #f48143)",
            }}
          >
            <span>Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

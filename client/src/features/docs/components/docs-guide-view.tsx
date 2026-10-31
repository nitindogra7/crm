"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DETAILED_GUIDES,
  DOC_CATEGORIES,
  DetailedGuide,
} from "../data/docs-data";
import { TechIcon } from "./framework-icons";
import {
  Copy,
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  Terminal,
} from "lucide-react";

interface DocsGuideViewProps {
  guideId: string;
  onSelectGuide: (id: string) => void;
  onBackToHub: () => void;
}

export function DocsGuideView({
  guideId,
  onSelectGuide,
  onBackToHub,
}: DocsGuideViewProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [sidebarFilter, setSidebarFilter] = useState("");
  const [activeTocId, setActiveTocId] = useState<string>("");

  const guide: DetailedGuide =
    DETAILED_GUIDES[guideId] || DETAILED_GUIDES.react;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Scroll spy for Right Sidebar TOC
  useEffect(() => {
    const handleScroll = () => {
      const headings = guide.tableOfContents.map((toc) =>
        document.getElementById(toc.id)
      );
      const scrollPos = window.scrollY + 140;

      for (let i = headings.length - 1; i >= 0; i--) {
        const el = headings[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveTocId(guide.tableOfContents[i].id);
          return;
        }
      }
      if (guide.tableOfContents.length > 0) {
        setActiveTocId(guide.tableOfContents[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [guide]);

  // Sidebar filter
  const filteredCategories = DOC_CATEGORIES.map((cat) => ({
    ...cat,
    sections: cat.sections.filter(
      (sec) =>
        !sidebarFilter ||
        sec.title.toLowerCase().includes(sidebarFilter.toLowerCase())
    ),
  })).filter((cat) => cat.sections.length > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pb-24">
      {/* ========================================================= */}
      {/* COLUMN 1: LEFT SIDEBAR NAVIGATION                         */}
      {/* ========================================================= */}
      <aside className="lg:col-span-3 sticky top-24 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-1 scrollbar-none">
        {/* Back to Hub Button */}
        <button
          type="button"
          onClick={onBackToHub}
          className="w-full px-3.5 py-2 rounded-xl border border-white/[0.08] bg-[#141b18]/80 hover:bg-[#1a231f] text-zinc-300 hover:text-white text-xs font-medium flex items-center justify-between transition-all group shadow-sm hover:border-emerald-500/30"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:-translate-x-1 text-emerald-400 transition-transform" />
            <span>All Guides Hub</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
            ESC
          </span>
        </button>

        {/* Sidebar Search Filter */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filter documentation..."
            value={sidebarFilter}
            onChange={(e) => setSidebarFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#141b18]/80 border border-white/[0.06] focus:border-emerald-500/50 text-xs text-white placeholder-zinc-500 outline-none transition-all"
          />
        </div>

        {/* Navigation Categories */}
        <nav className="space-y-6 pt-2">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="space-y-1.5">
              <h3 className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 font-semibold px-2">
                {cat.title}
              </h3>
              <div className="space-y-0.5">
                {cat.sections.map((sec) => {
                  const isCurrent = guide.id === sec.guideId;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => sec.guideId && onSelectGuide(sec.guideId)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                        isCurrent
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold"
                          : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      {sec.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                            isCurrent
                              ? "bg-emerald-400 text-black font-semibold"
                              : "bg-white/[0.04] text-zinc-500 group-hover:text-zinc-300"
                          }`}
                        >
                          {sec.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Need an Endpoint Helper Pill */}
        <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-[#141b18]/70 space-y-2 mt-6 shadow-sm">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need a live endpoint?</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Create an inbox form in your dashboard to obtain your live slug.
          </p>
          <Link
            href="/dashboard"
            className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all text-center block shadow-sm"
          >
            Open Dashboard
          </Link>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* COLUMN 2: CENTER MAIN CONTENT                             */}
      {/* ========================================================= */}
      <main className="lg:col-span-6 space-y-8 min-w-0">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
          {guide.breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-zinc-600" />}
              {idx === 0 ? (
                <button
                  type="button"
                  onClick={onBackToHub}
                  className="hover:text-white transition-colors"
                >
                  {crumb}
                </button>
              ) : idx === guide.breadcrumbs.length - 1 ? (
                <span className="text-zinc-200 font-medium">{crumb}</span>
              ) : (
                <span className="hover:text-white transition-colors">{crumb}</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Guide Title & Subtitle */}
        <header className="space-y-3 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-[#141b18] border border-white/[0.08] grid place-items-center flex-none shadow-sm">
              <TechIcon name={guide.icon} className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-white">
                {guide.title}
              </h1>
              {guide.badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-medium inline-block mt-1">
                  {guide.badge}
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {guide.subtitle}
          </p>
        </header>

        {/* Agent Prompt Callout Box */}
        {guide.agentPrompt && (
          <div className="rounded-2xl border border-white/[0.08] bg-[#141b18]/80 p-4 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono font-medium text-zinc-300">
                  AI Agent Setup Prompt
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(guide.agentPrompt, "agent-prompt")}
                className="px-2.5 py-1 rounded-lg border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5 transition-all"
              >
                {copiedKey === "agent-prompt" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="font-mono text-[11.5px] text-zinc-300 bg-black/50 p-3 rounded-xl border border-white/[0.04] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              <code>{guide.agentPrompt}</code>
            </pre>
          </div>
        )}

        {/* Overview Paragraph */}
        {guide.overview && (
          <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2">
            <p>{guide.overview}</p>
          </div>
        )}

        {/* Numbered Step-by-Step Walkthrough */}
        <div className="space-y-10 pt-2">
          {guide.steps.map((step, idx) => {
            const stepAnchor = guide.tableOfContents[idx]?.id || `step-${step.stepNumber}`;
            return (
              <section key={step.stepNumber} id={stepAnchor} className="space-y-3.5 scroll-mt-24">
                {/* Step Header */}
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold grid place-items-center flex-none mt-0.5">
                    {step.stepNumber}
                  </span>
                  <h2 className="text-base sm:text-lg font-heading font-medium text-white tracking-tight">
                    {step.title}
                  </h2>
                </div>

                {/* Step Description */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-9">
                  {step.description}
                </p>

                {/* Optional Callout / Alert */}
                {step.callout && (
                  <div className="ml-9 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3 text-xs leading-relaxed text-zinc-300">
                    {step.callout.type === "tip" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-none mt-0.5" />
                    )}
                    {step.callout.type === "note" && (
                      <Info className="w-4 h-4 text-sky-400 flex-none mt-0.5" />
                    )}
                    {step.callout.type === "warning" && (
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-none mt-0.5" />
                    )}
                    <p>{step.callout.text}</p>
                  </div>
                )}

                {/* Code Snippet Box */}
                {step.code && (
                  <div className="ml-9 rounded-2xl border border-white/[0.08] bg-[#111714] overflow-hidden shadow-xl">
                    <div className="px-4 py-2 border-b border-white/[0.06] bg-[#141b18] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="font-mono text-[11px] text-zinc-400">
                          {step.code.filename || step.code.language}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            step.code?.snippet || "",
                            `step-code-${step.stepNumber}`
                          )
                        }
                        className="px-2.5 py-1 rounded-md border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5 transition-all"
                      >
                        {copiedKey === `step-code-${step.stepNumber}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-zinc-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 overflow-x-auto font-mono text-[12px] leading-relaxed text-zinc-200">
                      <pre>
                        <code>{step.code.snippet}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Bottom Pager (Previous / Next Guide) */}
        <div className="pt-10 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guide.prevGuide ? (
            <button
              type="button"
              onClick={() => guide.prevGuide && onSelectGuide(guide.prevGuide.id)}
              className="p-4 rounded-2xl border border-white/[0.08] bg-[#141b18]/70 hover:bg-[#1a231f] hover:border-emerald-500/35 text-left transition-all group shadow-sm"
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                Previous Guide
              </span>
              <div className="flex items-center gap-2 text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>{guide.prevGuide.title}</span>
              </div>
            </button>
          ) : (
            <div />
          )}

          {guide.nextGuide && (
            <button
              type="button"
              onClick={() => guide.nextGuide && onSelectGuide(guide.nextGuide.id)}
              className="p-4 rounded-2xl border border-white/[0.08] bg-[#141b18]/70 hover:bg-[#1a231f] hover:border-emerald-500/35 text-right transition-all group sm:col-start-2 shadow-sm"
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-1">
                Next Guide
              </span>
              <div className="flex items-center justify-end gap-2 text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                <span>{guide.nextGuide.title}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* COLUMN 3: RIGHT SIDEBAR ("ON THIS PAGE" TOC)              */}
      {/* ========================================================= */}
      <aside className="lg:col-span-3 sticky top-24 hidden lg:block space-y-6">
        <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#141b18]/70 shadow-sm">
          <h3 className="text-[10.5px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-3">
            On this page
          </h3>
          <ul className="space-y-1 text-xs">
            {guide.tableOfContents.map((toc) => {
              const isActive = activeTocId === toc.id;
              return (
                <li key={toc.id}>
                  <a
                    href={`#${toc.id}`}
                    className={`block py-1 px-2.5 rounded-lg transition-colors leading-relaxed truncate ${
                      isActive
                        ? "text-emerald-400 font-medium bg-emerald-500/10 border-l-2 border-emerald-400 pl-2.5"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {toc.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-2 text-[11px] text-zinc-400">
            <span className="font-mono text-zinc-400 block font-medium">Quick Resources</span>
            <Link
              href="/#try"
              className="flex items-center justify-between text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <span>Test in Sandbox</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-between text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <span>infraly Dashboard</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

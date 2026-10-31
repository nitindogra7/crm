"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FRAMEWORK_ITEMS,
  CORE_PLATFORM_CARDS,

  EXPLORE_MORE_CARDS,
  DOCS_CONFIG,
  FrameworkItem,
} from "../data/docs-data";
import { TechIcon } from "./framework-icons";
import {
  Copy,
  Check,
  Zap,
  ArrowRight,
  Database,
  Shield,
  Terminal,
  ExternalLink,
  Sparkles,
  ChevronDown,

  Search,
  CheckCircle2,
  Code2,
} from "lucide-react";

interface DocsHubViewProps {
  onSelectGuide: (guideId: string) => void;
  searchQuery: string;
  onClearSearch?: () => void;
}

type CategoryFilter = "all" | "frontend" | "nocode" | "backend";
type CodeSnippetTab = "html" | "react" | "curl" | "python";

const CODE_EXAMPLES: Record<
  CodeSnippetTab,
  { label: string; language: string; filename: string; code: string }
> = {
  html: {
    label: "Plain HTML5",
    language: "html",
    filename: "index.html",
    code: `<!-- 1. Point action to infraly public endpoint -->
<form action="https://api.infraly.com/api/forms-and-api/f/YOUR_SLUG" method="POST">
  <input type="text" name="name" placeholder="Full name" required />
  <input type="email" name="email" placeholder="alex@company.com" required />
  <textarea name="message" placeholder="Project details..."></textarea>

  <!-- 2. Silent honeypot anti-spam trap (invisible to real users) -->
  <input type="text" name="_gotcha" tabIndex={-1} style="display:none" autocomplete="off" />

  <!-- 3. Optional: Custom redirect on success -->
  <input type="hidden" name="_next" value="https://yoursite.com/thank-you" />

  <button type="submit">Submit Lead</button>
</form>`,
  },
  react: {
    label: "React / Next.js",
    language: "tsx",
    filename: "LeadCapture.tsx",
    code: `"use client";
import { useState } from "react";

export function LeadCaptureForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.currentTarget);

    const res = await fetch("https://api.infraly.com/api/forms-and-api/f/YOUR_SLUG", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (res.ok) setStatus("success");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Full Name" required />
      <input name="email" type="email" placeholder="Work Email" required />
      {/* Silent honeypot */}
      <input name="_gotcha" className="hidden" tabIndex={-1} />
      <button type="submit" disabled={status === "loading"}>
        {status === "success" ? "Submitted to CRM!" : "Connect with Sales"}
      </button>
    </form>
  );
}`,
  },
  curl: {
    label: "cURL & REST",
    language: "bash",
    filename: "terminal",
    code: `# Ingest a lead instantly into your infraly CRM pipeline
curl -X POST "https://api.infraly.com/api/forms-and-api/f/YOUR_SLUG" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Sarah Connor",
    "email": "sarah@cyberdyne.io",
    "company": "Cyberdyne Systems",
    "budget": "$35,000",
    "timeline": "Immediate",
    "notes": "Looking for automated inbound lead sync"
  }'`,
  },
  python: {
    label: "Python",
    language: "python",
    filename: "capture.py",
    code: `import requests

# Direct headless ingestion from backend worker or script
response = requests.post(
    "https://api.infraly.com/api/forms-and-api/f/YOUR_SLUG",
    json={
        "name": "Alex Mercer",
        "email": "alex@gentek.org",
        "role": "CTO",
        "company": "Gentek Labs",
        "teamSize": "25-50"
    }
)

print(f"Lead status: {response.status_code}") # 200 = Lead Ingested into CRM`,
  },
};

export function DocsHubView({
  onSelectGuide,
  searchQuery,
  onClearSearch,
}: DocsHubViewProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [activeCodeTab, setActiveCodeTab] = useState<CodeSnippetTab>("html");
  const [showAgentPrompt, setShowAgentPrompt] = useState(false);

  const handleCopy = (text: string, key: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const agentPromptSnippet = `Help me integrate infraly into my project:
1. Endpoint URL: ${DOCS_CONFIG.baseEndpointUrl}/<your-slug>
2. Method: POST with Content-Type application/json or FormData
3. Anti-Spam: Add silent honeypot trap: <input name="_gotcha" tabIndex={-1} className="hidden" />
4. Dynamic Fields: Pass custom fields (company, budget, timeline) directly in the body
5. Success Redirect: Include name="_next" or handle HTTP 200 JSON response`;

  // Filter frameworks
  const q = searchQuery.toLowerCase().trim();

  const filteredFrameworks = useMemo(() => {
    return FRAMEWORK_ITEMS.filter((f) => {
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "all" || f.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [q, categoryFilter]);

  const filteredCore = useMemo(() => {
    return CORE_PLATFORM_CARDS.filter((c) => {
      return (
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [q]);

  const filteredExplore = useMemo(() => {
    return EXPLORE_MORE_CARDS.filter((c) => {
      return (
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    });
  }, [q]);

  const totalResults =
    filteredFrameworks.length + filteredCore.length + filteredExplore.length;

  const renderCardIcon = (iconName: string) => {
    switch (iconName) {
      case "database":
        return <Database className="w-4 h-4 text-emerald-400" />;
      case "shield":
        return <Shield className="w-4 h-4 text-emerald-400" />;
      case "zap":
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case "curl":
      case "terminal":
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      default:
        return <Code2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getFrameworkBadge = (fw: FrameworkItem) => {
    if (fw.badge) return fw.badge;
    switch (fw.id) {
      case "react":
        return "Hooks";
      case "nextjs":
        return "App Router";
      case "vue":
        return "Composition";
      case "nuxt":
        return "SSR";
      case "svelte":
        return "SvelteKit";
      case "angular":
        return "Reactive";
      case "html":
        return "Zero JS";
      case "webflow":
        return "Visual";
      case "framer":
        return "Component";
      case "wordpress":
        return "Forms";
      case "python":
        return "Requests";
      case "nodejs":
        return "Express";
      case "curl":
        return "CLI";
      default:
        return "Guide";
    }
  };

  return (
    <div className="space-y-16 lg:space-y-20 pb-28">
      {/* Search match banner if active */}
      {q && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
          <div className="flex items-center gap-2 font-mono">
            <Search className="w-4 h-4 text-emerald-400" />
            <span>
              Found <strong>{totalResults}</strong> result{totalResults === 1 ? "" : "s"} for &quot;{searchQuery}&quot;
            </span>
          </div>
          {onClearSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="text-xs font-medium text-white hover:underline underline-offset-2"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* HERO SECTION: Minimal, Airy, High-Signal */}
      <section className="pt-2 sm:pt-4">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-zinc-300 shadow-sm backdrop-blur-md">
            <Image
              src="/favicon.ico"
              alt="Infraly"
              width={16}
              height={16}
              unoptimized
              className="w-3.5 h-3.5 object-contain"
            />
            <span className="text-white font-medium">infraly Docs</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400">Silent Anti-Spam</span>
            <span className="text-zinc-600">•</span>
            <span>Headless CRM</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium tracking-tight text-white text-balance leading-[1.15]">
            Integrate infraly into any website in minutes
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl font-normal leading-relaxed text-balance">
            Capture inbound leads directly from static HTML, React, Next.js, or any frontend stack. Built-in silent honeypot anti-spam, zero backend boilerplate.
          </p>

          {/* Action Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => onSelectGuide("react")}
              className="px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-100 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.3)] flex items-center gap-1.5 group"
            >
              <span>React Quickstart</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => onSelectGuide("html")}
              className="px-3.5 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.16] text-zinc-200 hover:text-white text-xs font-medium transition-all"
            >
              Plain HTML5 (3 mins)
            </button>
            <button
              type="button"
              onClick={() => onSelectGuide("honeypot")}
              className="px-3.5 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.16] text-zinc-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Silent Anti-Spam</span>
            </button>
            <Link
              href="/#try"
              className="px-3.5 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.16] text-zinc-200 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <span>Interactive Sandbox</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CODE & ENDPOINT SHOWCASE (The Design Engineered Centerpiece) */}
      <section className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-white/[0.08] bg-[#141b18]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Top Bar: Live Form Endpoint Pill & Tabs */}
          <div className="px-4 py-3 border-b border-white/[0.08] bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
            {/* Live Endpoint Copy Box */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold tracking-wider uppercase">
                POST
              </span>
              <code className="text-xs font-mono text-zinc-300 truncate max-w-[220px] sm:max-w-md">
                {DOCS_CONFIG.baseEndpointUrl}/&lt;YOUR_FORM_SLUG&gt;
              </code>
              <button
                type="button"
                onClick={(e) =>
                  handleCopy(
                    `${DOCS_CONFIG.baseEndpointUrl}/YOUR_FORM_SLUG`,
                    "hero-endpoint-copy",
                    e
                  )
                }
                className="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all ml-1 flex-none"
                title="Copy endpoint URL"
              >
                {copiedKey === "hero-endpoint-copy" ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Language Switcher Tabs */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/[0.06]">
              {(["html", "react", "curl", "python"] as CodeSnippetTab[]).map(
                (tab) => {
                  const isActive = activeCodeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveCodeTab(tab)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all duration-200 ${
                        isActive
                          ? "bg-white/[0.1] text-white font-medium shadow-sm"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                      }`}
                    >
                      {CODE_EXAMPLES[tab].label}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            {/* Snippet Header & Copy Action */}
            <div className="px-4 py-2 bg-black/30 border-b border-white/[0.04] flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
                <span>{CODE_EXAMPLES[activeCodeTab].filename}</span>
              </span>
              <button
                type="button"
                onClick={(e) =>
                  handleCopy(
                    CODE_EXAMPLES[activeCodeTab].code,
                    `code-${activeCodeTab}`,
                    e
                  )
                }
                className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-[11px] font-mono flex items-center gap-1.5 transition-all"
              >
                {copiedKey === `code-${activeCodeTab}` ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 sm:p-5 overflow-x-auto bg-[#111714]/95 font-mono text-[12px] sm:text-[12.5px] leading-relaxed text-zinc-300 max-h-[340px]">
              <pre className="selection:bg-emerald-500/25 selection:text-emerald-200">
                <code>{CODE_EXAMPLES[activeCodeTab].code}</code>
              </pre>
            </div>
          </div>

          {/* Bottom Guarantees Strip */}
          <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero server infrastructure</span>
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Silent honeypot anti-spam</span>
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant CRM ingestion</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectGuide(activeCodeTab === "react" ? "react" : "html")}
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 text-[11px] font-medium"
            >
              <span>View full guide</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* AI Agent Prompt Bar (Cursor / Windsurf / Claude Code) */}
        <div className="mt-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03] transition-all p-3 text-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 grid place-items-center flex-none">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <div className="min-w-0">
                <span className="text-zinc-200 font-medium">AI Agent Prompt: </span>
                <span className="text-zinc-400 truncate">
                  Building with Cursor, Windsurf, or Claude Code? Paste our one-click integration prompt.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-none">
              <button
                type="button"
                onClick={() => setShowAgentPrompt(!showAgentPrompt)}
                className="text-zinc-400 hover:text-white px-2 py-1 text-[11px] font-mono transition-colors flex items-center gap-1"
              >
                <span>{showAgentPrompt ? "Hide" : "Preview"}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    showAgentPrompt ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={(e) => handleCopy(agentPromptSnippet, "agent-prompt-bar", e)}
                className="px-2.5 py-1 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 hover:text-white text-[11px] font-mono flex items-center gap-1.5 transition-all shadow-sm"
              >
                {copiedKey === "agent-prompt-bar" ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied Prompt</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Prompt Preview */}
          {showAgentPrompt && (
            <div className="mt-3 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-zinc-400 bg-black/40 rounded-lg p-3">
              <pre className="whitespace-pre-wrap">{agentPromptSnippet}</pre>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 1: Connect a Framework (Clean Squircle Grid with Tabs) */}
      <section id="frameworks" className="space-y-6">
        {/* Section Header with Category Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-medium tracking-tight text-white">
              Connect a framework
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Select your frontend, fullstack, or no-code builder for instant copy-paste setup.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] self-start sm:self-auto">
            {(
              [
                { id: "all", label: "All", count: FRAMEWORK_ITEMS.length },
                { id: "frontend", label: "Frontend", count: 7 },
                { id: "nocode", label: "No-Code", count: 3 },
                { id: "backend", label: "Backend & API", count: 3 },
              ] as const
            ).map((tab) => {
              const active = categoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? "bg-white/[0.1] text-white shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      active
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-white/[0.06] text-zinc-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Framework Cards Grid (Design-Engineered Modern Squircles) */}
        {filteredFrameworks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-xs text-zinc-400">
            No frameworks found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {filteredFrameworks.map((fw) => (
              <button
                key={fw.id}
                type="button"
                onClick={() => onSelectGuide(fw.id)}
                className="relative p-4 rounded-2xl border border-white/[0.07] bg-[#1a231f]/60 hover:bg-[#202c26]/80 hover:border-emerald-500/40 text-left transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)] group overflow-hidden flex flex-col justify-between min-h-[110px]"
              >
                {/* Subtle top edge glow highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-emerald-400/50 transition-colors" />

                {/* Top: Icon + Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="w-10 h-10 rounded-xl bg-black/40 border border-white/[0.08] grid place-items-center flex-none group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-300 shadow-sm">
                    <TechIcon name={fw.icon} className="w-5 h-5" />
                  </span>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-colors">
                    {getFrameworkBadge(fw)}
                  </span>
                </div>

                {/* Bottom: Framework Name & Arrow Cue */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-sm font-medium text-zinc-100 group-hover:text-white transition-colors truncate">
                    {fw.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-none" />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: Platform Capabilities (Clean Bento Grid) */}
      <section id="capabilities" className="space-y-6">
        <div className="border-b border-white/[0.08] pb-4">
          <h2 className="text-xl sm:text-2xl font-heading font-medium tracking-tight text-white">
            Platform capabilities
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Built from the ground up for modern inbound lead ingestion and automated CRM routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCore.map((card) => (
            <div
              key={card.id}
              onClick={() => card.guideId && onSelectGuide(card.guideId)}
              className="p-5 rounded-2xl border border-white/[0.07] bg-[#1a231f]/60 hover:bg-[#202c26]/80 hover:border-emerald-500/30 transition-all duration-200 cursor-pointer group flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center flex-none group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
                    {renderCardIcon(card.icon)}
                  </span>
                  {card.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-400">
                      {card.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mt-1.5">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-zinc-500 group-hover:text-emerald-400 transition-colors">
                <span>View documentation</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Silent Honeypot & Protection Pipeline */}
      <section id="security" className="space-y-6">
        <div className="border-b border-white/[0.08] pb-4">
          <h2 className="text-xl sm:text-2xl font-heading font-medium tracking-tight text-white">
            Silent anti-spam engine
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Eliminate spam bots and fraudulent burner submissions without degrading conversion rates with frustrating CAPTCHAs.
          </p>
        </div>

        {/* Visual 3-Stage Pipeline Card */}
        <div className="p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#1a231f]/70 backdrop-blur-md shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 relative">
            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-white/[0.06] bg-black/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-white/[0.06] text-white text-xs font-mono font-bold grid place-items-center">
                  1
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Submission
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white">Public HTTP POST</h4>
              <p className="text-[11.5px] text-zinc-400 leading-relaxed">
                Prospect enters details. Invisible <code className="text-emerald-300 font-mono">_gotcha</code> input is ignored by humans but filled by automated web scrapers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold grid place-items-center">
                  2
                </span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                  &lt;15ms Latency
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white">Dual Verification</h4>
              <p className="text-[11.5px] text-zinc-400 leading-relaxed">
                infraly inspects the honeypot trap and cross-references the email domain against 5,000+ burner temporary mail hosts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-white/[0.06] bg-black/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-white/[0.06] text-white text-xs font-mono font-bold grid place-items-center">
                  3
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Routing
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white">Automatic Ingestion</h4>
              <p className="text-[11.5px] text-zinc-400 leading-relaxed">
                Legitimate leads are scored and stored in your CRM. Spammers receive a fake 202 Accepted status and get isolated.
              </p>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-zinc-400">CAPTCHAs Required:</span>
                <span className="text-white font-semibold">0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-zinc-400">Bot Quench Rate:</span>
                <span className="text-white font-semibold">99.4%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-zinc-400">Disposable Burner List:</span>
                <span className="text-white font-semibold">5,000+</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectGuide("honeypot")}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 group transition-colors"
            >
              <span>Read Honeypot Guide</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: Developer Reference & Guides */}
      <section id="reference" className="space-y-6">
        <div className="border-b border-white/[0.08] pb-4">
          <h2 className="text-xl sm:text-2xl font-heading font-medium tracking-tight text-white">
            Developer reference
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            HTTP response specifications, attribute checklists, and troubleshooting recipes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredExplore.map((item) => (
            <div
              key={item.id}
              onClick={() => item.guideId && onSelectGuide(item.guideId)}
              className="p-4 rounded-2xl border border-white/[0.07] bg-[#1a231f]/60 hover:bg-[#202c26]/80 hover:border-emerald-500/30 transition-all duration-200 cursor-pointer group flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div>
                <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center mb-3 group-hover:scale-105 transition-transform">
                  {renderCardIcon(item.icon)}
                </span>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11.5px] text-zinc-400 leading-relaxed mt-1.5">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-zinc-500 group-hover:text-emerald-400 transition-colors">
                <span>View specification</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Footer Strip */}
      <section className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Open infraly Dashboard</span>
          </Link>
          <span className="text-zinc-700">•</span>
          <Link href="/#try" className="hover:text-white transition-colors">
            Interactive Form Sandbox
          </Link>
        </div>
        <div>
          <span>infraly Ingestion Engine {DOCS_CONFIG.version}</span>
        </div>
      </section>
    </div>
  );
}

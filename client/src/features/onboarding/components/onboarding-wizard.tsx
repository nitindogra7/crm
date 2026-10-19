"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  ArrowRight,
  Check,
  Copy,
  Terminal,
  Shield,
  Zap,
  Sparkles,
  Users,
  User,
  Building,
  Send,
  RefreshCw,
} from "lucide-react";
import { Icon } from "@/features/marketing/components/icons";

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "workspace"
  );
}

const USE_CASES = [
  { id: "saas", label: "SaaS & Web App", icon: Zap },
  { id: "agency", label: "Agency & Client Sites", icon: Building },
  { id: "leads", label: "Landing Pages & Leads", icon: Sparkles },
  { id: "personal", label: "Personal Projects", icon: User },
];

const AVATAR_TONES = [
  { id: "zinc", bg: "bg-zinc-800", border: "border-zinc-700", text: "text-white" },
  { id: "emerald", bg: "bg-emerald-950/60", border: "border-emerald-700/60", text: "text-emerald-300" },
  { id: "slate", bg: "bg-slate-800", border: "border-slate-700", text: "text-slate-200" },
  { id: "white", bg: "bg-white", border: "border-white", text: "text-black" },
];

export function OnboardingWizard() {
  const { user } = useUser();
  const router = useRouter();

  const suggestedName = user?.firstName ? `${user.firstName}'s Team` : "Acme Studio";

  // Form Fields
  const [name, setName] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false);
  const [avatarTone, setAvatarTone] = useState("zinc");
  const [useCase, setUseCase] = useState("saas");
  const [teamSize, setTeamSize] = useState<"team" | "solo">("team");

  // Code Tab & Copy State
  const [activeCodeTab, setActiveCodeTab] = useState<"html" | "curl" | "react">("html");
  const [copied, setCopied] = useState(false);

  // Live Ping Simulator State
  const [isSendingPing, setIsSendingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{
    status: number;
    latency: number;
  } | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const activeName = name.trim() || suggestedName;
  const activeSlug = hasManuallyEditedSlug ? customSlug : slugify(activeName);
  const endpointUrl = `https://api.salenova.com/v1/f/${activeSlug}`;
  const initial = (activeName.charAt(0) || "W").toUpperCase();
  const selectedTone = AVATAR_TONES.find((t) => t.id === avatarTone) || AVATAR_TONES[0];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!hasManuallyEditedSlug) {
      setCustomSlug(slugify(val || suggestedName));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasManuallyEditedSlug(true);
    setCustomSlug(slugify(e.target.value));
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(endpointUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendPing = () => {
    setIsSendingPing(true);
    setTimeout(() => {
      setIsSendingPing(false);
      setPingResult({
        status: 200,
        latency: Math.floor(Math.random() * 6) + 11, // 11-16ms
      });
    }, 500);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeName.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#ffffff", "#e4e4e7", "#10b981", "#71717a"],
      });
    } catch {
      // Safe fallback
    }

    await new Promise((resolve) => setTimeout(resolve, 750));
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  // Keyboard shortcut: Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess || isSubmitting) return;
      if (e.key === "Enter" && !e.shiftKey) {
        if ((e.target as HTMLElement)?.tagName === "TEXTAREA") return;
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSuccess, isSubmitting, activeName, activeSlug, teamSize, useCase]);

  return (
    <div className="min-h-screen w-full bg-[#121212] text-[#f4f4f5] flex flex-col justify-between selection:bg-white selection:text-black">
      {/* Top Header: Clean SaaS Navbar */}
      <header className="w-full border-b border-white/[0.08] bg-[#121212]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 text-white group">
              <span className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 inline-grid place-items-center text-white group-hover:border-zinc-700 transition-colors">
                <Icon name="logo" className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="font-heading font-medium tracking-tight text-[15px] text-white">
                Salenova
              </span>
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-[12px] text-zinc-400 font-sans">Workspace Setup</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>api.salenova.com</span>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <span className="text-[12px] text-zinc-400 hidden sm:inline font-sans truncate max-w-[180px]">
                  {user.primaryEmailAddress?.emailAddress || user.fullName}
                </span>
              ) : (
                <div className="w-24 h-3 rounded bg-zinc-800 animate-pulse hidden sm:inline-block" />
              )}
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Full-Width Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col justify-center">
        {isSuccess ? (
          /* Success Screen */
          <div className="w-full max-w-lg mx-auto bg-[#181818] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-6 h-6 text-emerald-400 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Ingestion Ready
              </div>
              <h1 className="text-2xl font-medium tracking-tight text-white font-heading">
                Workspace Initialized
              </h1>
              <p className="text-[13px] text-zinc-400 font-sans max-w-sm mx-auto">
                Your workspace <span className="text-white font-medium">&quot;{activeName}&quot;</span> is provisioned. Redirecting to your console...
              </p>
            </div>

            {/* Spec breakdown matching the reference screenshot */}
            <div className="bg-[#141414] border border-white/[0.06] rounded-xl p-4 text-left space-y-2.5">
              <div className="flex items-center justify-between text-[11.5px] font-mono">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Endpoint</span>
                <span className="text-zinc-300 truncate max-w-[220px]">POST /v1/f/{activeSlug}</span>
              </div>
              <div className="flex items-center justify-between text-[11.5px] font-mono">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Scope</span>
                <span className="text-zinc-300 capitalize">{teamSize} · {useCase}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11.5px] font-mono">
                <span className="text-zinc-400">Endpoint Status</span>
                <span className="text-emerald-400 font-medium">Active (Automatic SSL)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-medium text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Enter Workspace Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Single-Step Full Width Onboarding UI */
          <div className="w-full space-y-7">
            {/* Header Section */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Quick Setup · 1 Step to Launch</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white font-heading">
                Create your workspace
              </h1>
              <p className="text-[13.5px] text-zinc-400 font-sans max-w-2xl leading-relaxed">
                Workspaces manage form endpoints, team permissions, and submission routing. You can customize settings anytime.
              </p>
            </div>

            {/* Expansive Full-Width 2-Column SaaS Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column (7 cols): Configuration Form */}
              <div className="w-full lg:col-span-7 bg-[#181818] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 1. Workspace Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="workspace-name" className="block text-[12px] font-sans font-medium text-zinc-300">
                      Workspace name
                    </label>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 text-[16px] font-heading font-medium transition-all ${selectedTone.bg} ${selectedTone.border} ${selectedTone.text}`}
                      >
                        {initial}
                      </div>

                      <input
                        id="workspace-name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder={suggestedName}
                        autoFocus
                        className="flex-1 px-3.5 py-2.5 bg-[#141414] border border-white/[0.08] hover:border-white/[0.16] focus:border-emerald-500/80 rounded-xl text-white placeholder-zinc-600 text-[14px] focus:outline-none transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* 2. Workspace URL Handle */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="workspace-slug" className="block text-[12px] font-sans font-medium text-zinc-300">
                        Workspace URL handle
                      </label>
                      <span className="text-[11px] font-mono text-zinc-500">Public routing ID</span>
                    </div>

                    <div className="flex items-center rounded-xl bg-[#141414] border border-white/[0.08] hover:border-white/[0.16] focus-within:border-emerald-500/80 transition-all overflow-hidden">
                      <span className="px-3.5 py-2.5 text-[12.5px] font-mono text-zinc-500 bg-[#181818] border-r border-white/[0.08] select-none">
                        salenova.com/w/
                      </span>
                      <input
                        id="workspace-slug"
                        type="text"
                        value={activeSlug}
                        onChange={handleSlugChange}
                        placeholder="acme-studio"
                        className="flex-1 px-3.5 py-2.5 bg-transparent text-white placeholder-zinc-600 text-[13px] font-mono focus:outline-none"
                      />
                      <div className="pr-3.5 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Avatar Tone Selector */}
                  <div className="space-y-1.5 pt-0.5">
                    <label className="block text-[12px] font-sans font-medium text-zinc-300">
                      Avatar tone
                    </label>
                    <div className="flex items-center gap-2">
                      {AVATAR_TONES.map((tone) => (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => setAvatarTone(tone.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-sans transition-all ${
                            avatarTone === tone.id
                              ? "bg-zinc-800 border-zinc-600 text-white shadow-sm"
                              : "bg-[#141414] border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200"
                          }`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full border ${tone.bg} ${tone.border}`} />
                          <span className="capitalize">{tone.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Team Scope Selector */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[12px] font-sans font-medium text-zinc-300">
                      How will you use Salenova?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTeamSize("team")}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          teamSize === "team"
                            ? "bg-zinc-800/80 border-zinc-600 text-white shadow-sm"
                            : "bg-[#141414] border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 mt-0.5">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-medium text-white font-sans">With a team</div>
                          <p className="text-[11.5px] text-zinc-400 font-sans leading-relaxed">
                            Shared forms, team access controls, and collaborative webhook dispatch.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTeamSize("solo")}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                          teamSize === "solo"
                            ? "bg-zinc-800/80 border-zinc-600 text-white shadow-sm"
                            : "bg-[#141414] border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-medium text-white font-sans">Solo developer</div>
                          <p className="text-[11.5px] text-zinc-400 font-sans leading-relaxed">
                            Streamlined single-operator flow for personal websites and apps.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 4. Primary Use Case */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[12px] font-sans font-medium text-zinc-300">
                      Primary use case
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {USE_CASES.map((uc) => {
                        const IconComp = uc.icon;
                        const isSelected = useCase === uc.id;
                        return (
                          <button
                            key={uc.id}
                            type="button"
                            onClick={() => setUseCase(uc.id)}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                              isSelected
                                ? "bg-zinc-800/90 border-zinc-500 text-white shadow-sm"
                                : "bg-[#141414] border-white/[0.08] text-zinc-400 hover:border-white/[0.16] hover:text-zinc-200"
                            }`}
                          >
                            <IconComp className="w-4 h-4 text-zinc-300" />
                            <span className="text-[12px] font-medium font-sans truncate w-full">
                              {uc.label.split(" & ")[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                    <button
                      type="submit"
                      disabled={isSubmitting || !activeName.trim()}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-black bg-white hover:bg-zinc-200 text-[13px] transition-all cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Creating workspace...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Workspace</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <span className="text-[12px] text-zinc-500 font-sans text-center sm:text-left">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10.5px] font-mono">Enter ↵</kbd> to continue
                    </span>
                  </div>
                </form>
              </div>

              {/* Right Column (5 cols): Live Ingestion Sandbox & Endpoint Card */}
              <div className="w-full lg:col-span-5 bg-[#181818] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
                {/* Header Window Bar */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/60" />
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/60" />
                    </div>
                    <span className="text-[12px] font-mono text-zinc-400 pl-1 truncate max-w-[170px]">
                      salenova.com/w/{activeSlug}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Ready
                  </span>
                </div>

                {/* Live Endpoint Box */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11.5px] text-zinc-400 font-mono">
                    <span>Generated Inbound Endpoint:</span>
                    <span className="text-zinc-300 font-medium px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10.5px]">POST</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2.5 bg-[#141414] rounded-xl border border-white/[0.08]">
                    <code className="text-[12px] font-mono text-zinc-200 truncate">
                      {endpointUrl}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyEndpoint}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors flex-shrink-0 border border-zinc-700 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Code Snippets Switcher */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11.5px] font-mono">
                    <span className="text-zinc-400">Integration snippet:</span>
                    <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                      {(["html", "curl", "react"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveCodeTab(tab)}
                          className={`px-2.5 py-0.5 rounded text-[10.5px] uppercase font-mono transition-colors ${
                            activeCodeTab === tab
                              ? "bg-zinc-800 text-white font-medium shadow-sm"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#141414] rounded-xl border border-white/[0.08] font-mono text-[11.5px] overflow-x-auto text-zinc-300 leading-relaxed">
                    {activeCodeTab === "html" && (
                      <pre className="text-zinc-300">
                        {`<form action="${endpointUrl}" method="POST">
  <input type="email" name="email" required />
  <button type="submit">Submit</button>
</form>`}
                      </pre>
                    )}
                    {activeCodeTab === "curl" && (
                      <pre className="text-zinc-300">
                        {`curl -X POST ${endpointUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"email":"team@example.com"}'`}
                      </pre>
                    )}
                    {activeCodeTab === "react" && (
                      <pre className="text-zinc-300">
                        {`fetch("${endpointUrl}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});`}
                      </pre>
                    )}
                  </div>
                </div>

                {/* Simulated Inbound Event Test */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-400 uppercase tracking-wider text-[10px]">Inbound Event Preview</span>
                    <button
                      type="button"
                      onClick={handleSendPing}
                      disabled={isSendingPing}
                      className="px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10.5px] font-mono flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {isSendingPing ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Pinging...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>Send Test Ping</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-[#141414] rounded-xl border border-white/[0.08] flex items-center justify-between text-[11.5px] font-mono">
                    <div className="space-y-0.5">
                      <div className="text-zinc-200">contact_inbound</div>
                      <div className="text-zinc-500 text-[11px]">email: &quot;founder@acme.com&quot;</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pingResult ? (
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {pingResult.latency}ms
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-500 font-mono">12ms</span>
                      )}
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimal Reassurance Footer */}
                <div className="pt-1 flex items-center justify-between text-[11.5px] text-zinc-500 font-sans">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                    Instant endpoint deployment
                  </span>
                  <span>Zero server maintenance</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Bottom Footer */}
      <footer className="w-full border-t border-white/[0.08] py-4 px-4 sm:px-6 lg:px-8 text-center text-[12px] text-zinc-500 font-sans">
        Salenova · Modern form backend without the setup
      </footer>
    </div>
  );
}

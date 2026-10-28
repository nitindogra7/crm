"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "../context/dashboard-context";
import {
  X,
  Copy,
  Check,
  Send,
  Zap,
  Trash2,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";

export function FormDetailModal() {
  const {
    forms,
    selectedFormId,
    setSelectedFormId,
    updateForm,
    toggleFormEnabled,
    deleteForm,
    simulateLeadSubmission,
    addToast,
  } = useDashboard();

  const form = forms.find((f) => f.id === selectedFormId);

  const [activeTab, setActiveTab] = useState<"overview" | "fields" | "integration" | "simulate">(
    "overview"
  );

  // Edit fields
  const [prevFormId, setPrevFormId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedJs, setCopiedJs] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Adjust state during render when selected form changes (recommended React pattern)
  if (form && form.id !== prevFormId) {
    setPrevFormId(form.id);
    setFormName(form.name);
    setRedirectUrl(form.redirectUrl || "");
  }

  // Simulate submission form inputs
  const [simName, setSimName] = useState("Jane Doe");
  const [simEmail, setSimEmail] = useState("jane@acmeclient.com");
  const [simMessage, setSimMessage] = useState(
    "Hi there, we'd like to book a consultation about upgrading our client onboarding workflow."
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelectedFormId(null);
      }
    }
    if (selectedFormId) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedFormId, setSelectedFormId]);

  if (!form) return null;

  const handleCopy = (text: string, type: "endpoint" | "html" | "js" | "curl") => {
    navigator.clipboard.writeText(text);
    if (type === "endpoint") {
      setCopiedEndpoint(true);
      setTimeout(() => setCopiedEndpoint(false), 2000);
    } else if (type === "html") {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } else if (type === "js") {
      setCopiedJs(true);
      setTimeout(() => setCopiedJs(false), 2000);
    } else if (type === "curl") {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
    addToast("Copied to clipboard", "Snippet ready to paste.");
  };

  const handleSaveOverview = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm(form.id, {
      name: formName.trim() || form.name,
      redirectUrl: redirectUrl.trim() || undefined,
    });
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulateLeadSubmission(form.id, {
      name: simName,
      email: simEmail,
      message: simMessage,
      source: "Form Preview Simulation",
    });
    setActiveTab("overview");
  };

  const htmlSnippet = `<!-- 1. Standard HTML Form Pointed to Salenova Endpoint -->
<form action="${form.endpointUrl}" method="POST">
  <input type="text" name="name" placeholder="Full name" required />
  <input type="email" name="email" placeholder="work@company.com" required />
  <textarea name="message" placeholder="How can we help?"></textarea>
  
  <!-- Silent Honeypot Spam Shield (Bots will fill this, real humans will ignore) -->
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none !important;" />
  
  <button type="submit">Submit Form</button>
</form>`;

  const jsSnippet = `// 2. Fetch / Next.js / React Submission
const handleSubmit = async (data) => {
  const res = await fetch("${form.endpointUrl}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      message: data.message,
    }),
  });
  const result = await res.json();
  console.log("Salenova response:", result);
};`;

  const curlSnippet = `# 3. Direct HTTP POST cURL
curl -X POST ${form.endpointUrl} \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Alex Vance",
    "email": "alex@studio.co",
    "message": "Testing cURL integration"
  }'`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedFormId(null)}
      />

      <div className="relative w-full max-w-2xl bg-[#161616] border border-white/[0.12] rounded-2xl shadow-2xl text-white z-10 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between gap-4 flex-none bg-[#141414]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-[10.5px] font-mono border ${
                  form.enabled
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                {form.enabled ? "Active" : "Paused"}
              </span>
              <span className="text-[11px] font-mono text-zinc-500 truncate">
                slug: {form.slug}
              </span>
            </div>
            <h2 className="text-xl font-heading font-medium tracking-tight text-white truncate">
              {form.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFormEnabled(form.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                form.enabled
                  ? "border-zinc-700 text-zinc-300 hover:bg-white/[0.05]"
                  : "bg-emerald-500 text-black border-emerald-400 font-semibold"
              }`}
            >
              {form.enabled ? "Pause Form" : "Enable Form"}
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormId(null)}
              className="text-zinc-400 hover:text-white p-1.5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-white/[0.08] bg-[#141414] flex items-center gap-4 text-xs font-sans overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "border-white text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fields")}
            className={`py-3 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "fields"
                ? "border-white text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Fields ({form.fields.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("integration")}
            className={`py-3 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "integration"
                ? "border-white text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Integration & Snippet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("simulate")}
            className={`py-3 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "simulate"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-emerald-400/80 hover:text-emerald-300"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Test</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Endpoint pill */}
              <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#121212] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10.5px] font-mono uppercase text-zinc-500 block">
                    Public Submission Endpoint
                  </span>
                  <span className="font-mono text-zinc-200 text-xs truncate block mt-0.5">
                    {form.endpointUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(form.endpointUrl, "endpoint")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-200 flex-none transition-colors"
                >
                  {copiedEndpoint ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#121212]">
                  <span className="text-zinc-500 text-[11px] block font-mono">Total Submissions</span>
                  <span className="text-xl font-heading font-medium text-white mt-1 block tabular-nums">
                    {form.leadCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#121212]">
                  <span className="text-zinc-500 text-[11px] block font-mono">Spam Filtered</span>
                  <span className="text-xl font-heading font-medium text-amber-400 mt-1 block tabular-nums">
                    {form.spamCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#121212]">
                  <span className="text-zinc-500 text-[11px] block font-mono">Created On</span>
                  <span suppressHydrationWarning className="text-xs text-zinc-300 mt-1.5 block font-mono truncate">
                    <FormattedDate date={form.createdAt} format="date" />
                  </span>
                </div>
              </div>

              {/* Edit Form Settings */}
              <form onSubmit={handleSaveOverview} className="space-y-4 pt-2 border-t border-white/[0.06]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Form Settings
                </h4>

                <div>
                  <label className="block text-zinc-300 mb-1 font-medium">Display Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1 font-medium">
                    Post-Submit Redirect URL
                  </label>
                  <input
                    type="url"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="https://mysite.com/thanks"
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 font-mono text-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => deleteForm(form.id)}
                    className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Form</span>
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: FIELDS */}
          {activeTab === "fields" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white">Configured Form Fields</h4>
                  <p className="text-zinc-400 text-[11.5px] mt-0.5">
                    Submissions are automatically normalized against this schema.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#121212] overflow-hidden divide-y divide-white/[0.05]">
                <div className="grid grid-cols-12 px-4 py-2 text-[10.5px] font-mono uppercase tracking-wider text-zinc-500 bg-white/[0.02]">
                  <span className="col-span-4">Field Key</span>
                  <span className="col-span-4">Label</span>
                  <span className="col-span-2">Type</span>
                  <span className="col-span-2 text-right">Requirement</span>
                </div>
                {form.fields.map((field) => (
                  <div key={field.id} className="grid grid-cols-12 px-4 py-3 items-center text-xs">
                    <span className="col-span-4 font-mono text-zinc-200">{field.name}</span>
                    <span className="col-span-4 text-zinc-300">{field.label}</span>
                    <span className="col-span-2 font-mono text-zinc-400 text-[11px]">{field.type}</span>
                    <span className="col-span-2 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          field.required
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-white/[0.02] text-zinc-500 border-white/[0.06]"
                        }`}
                      >
                        {field.required ? "Required" : "Optional"}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INTEGRATION */}
          {activeTab === "integration" && (
            <div className="space-y-5">
              {/* Endpoint banner */}
              <div className="p-3 rounded-xl border border-white/[0.08] bg-[#121212] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase text-zinc-500">
                    HTTP Target Endpoint
                  </span>
                  <code className="text-zinc-200 block text-xs mt-0.5 truncate">
                    POST {form.endpointUrl}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(form.endpointUrl, "endpoint")}
                  className="px-2.5 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-200 transition-colors flex items-center gap-1.5 flex-none"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>

              {/* HTML Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase text-zinc-400">
                    HTML Form Snippet
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy(htmlSnippet, "html")}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedHtml ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy HTML</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl border border-white/[0.08] bg-[#101010] text-[11.5px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                  {htmlSnippet}
                </pre>
              </div>

              {/* React / JS Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase text-zinc-400">
                    JavaScript / React Fetch
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy(jsSnippet, "js")}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedJs ? (
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
                <pre className="p-3.5 rounded-xl border border-white/[0.08] bg-[#101010] text-[11.5px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                  {jsSnippet}
                </pre>
              </div>

              {/* cURL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase text-zinc-400">
                    cURL Command
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy(curlSnippet, "curl")}
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
                  >
                    {copiedCurl ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy cURL</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl border border-white/[0.08] bg-[#101010] text-[11.5px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                  {curlSnippet}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: SIMULATE TEST SUBMISSION */}
          {activeTab === "simulate" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] text-xs text-emerald-300 leading-relaxed">
                <span className="font-semibold block mb-0.5">Local Simulation Sandbox</span>
                Submitting this form injects a realistic mock lead directly into your local dashboard state and updates counts.{" "}
                <span className="text-zinc-400">
                  No actual network request is sent to the internet, and no emails are dispatched.
                </span>
              </div>

              <form onSubmit={handleSimulateSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={simEmail}
                    onChange={(e) => setSimEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={simMessage}
                    onChange={(e) => setSimMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white focus:outline-none focus:border-white/40 resize-none font-sans"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setSimName("Elena Ward");
                      setSimEmail("elena.ward@designsystem.co");
                      setSimMessage(
                        "Hi! Inquiring about enterprise tier licensing and dedicated webhook support for our 30 client brands."
                      );
                    }}
                    className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    Quick fill sample inquiry
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Simulate Test Submission</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";

export function FormDetailModal() {
  const {
    forms,
    apiKeys,
    selectedFormId,
    setSelectedFormId,
    updateFormAsync,
    toggleFormEnabledAsync,
    deleteFormAsync,
    simulateLeadSubmissionAsync,
    addToast,
  } = useDashboard();

  const apiKey = apiKeys.find((k) => !k.revoked) || null;
  const hasApiKey = !!apiKey;

  const form = forms.find((f) => f.id === selectedFormId);

  const [activeTab, setActiveTab] = useState<"overview" | "fields" | "integration" | "simulate">(
    "overview"
  );

  // Edit fields
  const [prevFormId, setPrevFormId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [allowedDomains, setAllowedDomains] = useState("");
  const [integrationSnippetType, setIntegrationSnippetType] = useState<
    "html" | "nextjs" | "node" | "curl"
  >("html");
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Adjust state during render when selected form changes (recommended React pattern)
  if (form && form.id !== prevFormId) {
    setPrevFormId(form.id);
    setFormName(form.name);
    setRedirectUrl(form.redirectUrl || "");
    setAllowedDomains(form.allowedDomains ? form.allowedDomains.join(", ") : "");
  }

  // Simulate submission form inputs
  const [simName, setSimName] = useState("Jane Doe");
  const [simEmail, setSimEmail] = useState("jane@acmeclient.com");
  const [simMessage, setSimMessage] = useState(
    "Hi there, we'd like to book a consultation about upgrading our client onboarding workflow."
  );

  // Loading states for actions
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
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

  const handleCopy = (text: string, type: "endpoint" | "snippet") => {
    navigator.clipboard.writeText(text);
    if (type === "endpoint") {
      setCopiedEndpoint(true);
      setTimeout(() => setCopiedEndpoint(false), 2000);
    } else {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
    addToast("Copied to clipboard", "Snippet ready to paste.");
  };

  const handleSaveOverview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const parsedDomains = allowedDomains
        .split(",")
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean);

      await updateFormAsync(form.id, {
        name: formName.trim() || form.name,
        redirectUrl: redirectUrl.trim() || undefined,
        allowedDomains: parsedDomains,
      });
      addToast("Form updated", "Changes saved successfully.");
    } catch {
      addToast("Error", "Failed to update form", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteForm = async () => {
    if (isDeleting) return;
    if (!window.confirm(`Are you sure you want to delete "${form.name}"?`)) return;
    setIsDeleting(true);
    try {
      await deleteFormAsync(form.id);
      setSelectedFormId(null);
    } catch {
      addToast("Error", "Failed to delete form", "error");
      setIsDeleting(false);
    }
  };

  const handleToggleForm = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      await toggleFormEnabledAsync(form.id);
    } catch {
      addToast("Error", "Failed to toggle form status", "error");
    } finally {
      setIsToggling(false);
    }
  };



  const handleSimulateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSimulating) return;
    setIsSimulating(true);
    try {
      await simulateLeadSubmissionAsync(form.id, {
        name: simName,
        email: simEmail,
        message: simMessage,
        source: "Form Preview Simulation",
      });
      setActiveTab("overview");
    } catch {
      addToast("Error", "Failed to simulate lead submission", "error");
    } finally {
      setIsSimulating(false);
    }
  };

  const apiKeyToken = hasApiKey ? apiKey.fullKeyMock : "YOUR_API_KEY_HERE";

  // 1. Direct HTML Form: Uses public form endpoint & honeypot spam protection. ZERO API KEYS EXPOSED.
  const htmlSnippet = `<!-- 1. Direct Public HTML Form (Protected by IP Rate Limiter & Honeypot) -->
<form action="${form.endpointUrl}" method="POST">
  <!-- Public Form Slug Endpoint: No secret API key needed in browser! -->
  <input type="text" name="name" placeholder="Full name" required />
  <input type="email" name="email" placeholder="work@company.com" required />
  <textarea name="message" placeholder="How can we help?"></textarea>
  
  <!-- Silent Honeypot Spam Shield (Bots fill this, real humans will not see it) -->
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none !important;" />
  
  <button type="submit">Submit Form</button>
</form>`;

  // 2. Next.js Server-Side Proxy: 100% INVISIBLE to Browser DevTools
  const nextjsSnippet = `// app/api/contact/route.ts (Server-side Route - 100% Invisible to DevTools)
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Forwards to Infraly behind the scenes using private API key
  const response = await fetch("${form.endpointUrl}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.INFRALY_API_KEY!, // Stored in .env.local
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data);
}

// In your client form, submit to "/api/contact":
// Browser DevTools ONLY sees your local "/api/contact" — Infraly is 100% hidden!`;

  // 3. Node.js / Express Backend Proxy
  const nodeSnippet = `// server.js (Express Backend Proxy)
app.post("/api/contact", async (req, res) => {
  try {
    const infralyRes = await fetch("${form.endpointUrl}", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.INFRALY_API_KEY, // Stored safely on server
      },
      body: JSON.stringify(req.body),
    });
    const result = await infralyRes.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to forward lead" });
  }
});`;

  // 4. Direct cURL with API key
  const curlSnippet = `# Direct Server-to-Server cURL with Workspace API Key
curl -X POST ${form.endpointUrl} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKeyToken}" \\
  -d '{
    "name": "Alex Vance",
    "email": "alex@studio.co",
    "message": "Testing cURL integration"
  }'`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={() => setSelectedFormId(null)}
      />

      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-900 z-10 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4 flex-none bg-slate-50/50">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-mono border font-semibold ${
                  form.enabled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {form.enabled ? "Active" : "Paused"}
              </span>
              <span className="text-[11px] font-mono text-slate-400 truncate">
                slug: {form.slug}
              </span>
            </div>
            <h2 className="text-xl font-heading font-bold tracking-tight text-slate-900 truncate">
              {form.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleForm}
              disabled={isToggling}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:opacity-60 shadow-2xs ${
                form.enabled
                  ? "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20"
              }`}
            >
              {isToggling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{form.enabled ? "Pause Form" : "Enable Form"}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormId(null)}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-slate-100 bg-white flex items-center gap-5 text-xs font-sans overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fields")}
            className={`py-3 border-b-2 font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "fields"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Fields ({form.fields.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("integration")}
            className={`py-3 border-b-2 font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "integration"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Integration & Snippet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("simulate")}
            className={`py-3 border-b-2 font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "simulate"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-blue-600"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Test</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs bg-slate-50/30">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Endpoint pill */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs">
                <div className="min-w-0">
                  <span className="text-[10.5px] font-mono uppercase text-slate-400 font-semibold block">
                    Public Submission Endpoint
                  </span>
                  <span className="font-mono text-slate-900 text-xs truncate block mt-0.5 font-semibold">
                    {form.endpointUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(form.endpointUrl, "endpoint")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 font-semibold flex-none transition-colors shadow-2xs cursor-pointer"
                >
                  {copiedEndpoint ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <span className="text-slate-400 text-[11px] block font-mono font-semibold">Total Submissions</span>
                  <span className="text-xl font-heading font-bold text-slate-900 mt-1 block tabular-nums">
                    {form.leadCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <span className="text-slate-400 text-[11px] block font-mono font-semibold">Spam Filtered</span>
                  <span className="text-xl font-heading font-bold text-amber-600 mt-1 block tabular-nums">
                    {form.spamCount}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <span className="text-slate-400 text-[11px] block font-mono font-semibold">Created On</span>
                  <span suppressHydrationWarning className="text-xs text-slate-700 mt-1.5 block font-mono truncate font-medium">
                    <FormattedDate date={form.createdAt} format="date" />
                  </span>
                </div>
              </div>

              {/* Edit Form Settings */}
              <form onSubmit={handleSaveOverview} className="space-y-4 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  Form Settings
                </h4>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Display Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 font-sans shadow-2xs transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">
                    Post-Submit Redirect URL
                  </label>
                  <input
                    type="url"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="https://mysite.com/thanks"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 font-mono text-xs shadow-2xs transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-slate-700 font-semibold">
                      Allowed Domains (Spam & Origin Shield)
                    </label>
                    <span className="text-[10.5px] font-mono text-slate-400">Comma-separated</span>
                  </div>
                  <input
                    type="text"
                    value={allowedDomains}
                    onChange={(e) => setAllowedDomains(e.target.value)}
                    placeholder="e.g. mycompany.com, app.mycompany.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 font-mono text-xs shadow-2xs transition-all"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Direct HTML form submissions are only permitted from these domains. Leave empty to allow from any domain.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleDeleteForm}
                    disabled={isDeleting || isSaving}
                    className="inline-flex items-center gap-1.5 text-rose-600 hover:text-rose-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>{isDeleting ? "Deleting..." : "Delete Form"}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving || isDeleting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: FIELDS */}
          {activeTab === "fields" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-heading font-bold text-slate-900">Configured Form Fields</h4>
                <p className="text-slate-500 text-[11.5px] mt-0.5">
                  Submissions are automatically normalized against this schema.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 shadow-2xs">
                <div className="grid grid-cols-12 px-4 py-2 text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold bg-slate-50/70">
                  <span className="col-span-4">Field Key</span>
                  <span className="col-span-4">Label</span>
                  <span className="col-span-2">Type</span>
                  <span className="col-span-2 text-right">Requirement</span>
                </div>
                {form.fields.map((field) => (
                  <div key={field.id} className="grid grid-cols-12 px-4 py-3 items-center text-xs">
                    <span className="col-span-4 font-mono text-slate-900 font-semibold">{field.name}</span>
                    <span className="col-span-4 text-slate-700 font-medium">{field.label}</span>
                    <span className="col-span-2 font-mono text-slate-500 text-[11px]">{field.type}</span>
                    <span className="col-span-2 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${
                          field.required
                            ? "bg-blue-50 text-blue-700 border-blue-200/80"
                            : "bg-slate-50 text-slate-600 border-slate-200"
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
              {/* Security Shield Callout */}
              <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 text-slate-800 shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-600 text-white flex-none mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-emerald-950">
                      Zero Private Key Leakage & Spam Protection
                    </h5>
                    <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed">
                      <strong>Direct HTML forms</strong> submit directly via your form slug without exposing secret API keys in the browser, protected by IP Rate Limiting (30/15m) and silent Honeypots.
                      <br />
                      To keep the Infraly endpoint and API keys <strong>100% invisible in browser DevTools</strong>, use the <strong>Next.js</strong> or <strong>Node.js Server Proxy</strong> below.
                    </p>
                  </div>
                </div>
              </div>

              {/* Endpoint banner */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                    Public Submission Endpoint
                  </span>
                  <code className="text-slate-900 block text-xs mt-0.5 truncate font-semibold font-mono">
                    POST {form.endpointUrl}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(form.endpointUrl, "endpoint")}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 font-semibold transition-colors flex items-center gap-1.5 flex-none cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>

              {/* Snippet Selector Tabs */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setIntegrationSnippetType("html")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      integrationSnippetType === "html"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Direct HTML Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntegrationSnippetType("nextjs")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      integrationSnippetType === "nextjs"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Next.js Server Proxy (DevTools Hidden)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntegrationSnippetType("node")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      integrationSnippetType === "node"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Node.js Express Proxy
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntegrationSnippetType("curl")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      integrationSnippetType === "curl"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    cURL / REST API
                  </button>
                </div>

                {/* Active Snippet Pre block */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold">
                      {integrationSnippetType === "html" && "HTML Form Snippet (Zero API Keys in Browser)"}
                      {integrationSnippetType === "nextjs" && "Next.js Server Action / Route (DevTools Hidden)"}
                      {integrationSnippetType === "node" && "Node.js Express Server Proxy"}
                      {integrationSnippetType === "curl" && "Direct cURL Command"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const snippet =
                          integrationSnippetType === "html"
                            ? htmlSnippet
                            : integrationSnippetType === "nextjs"
                            ? nextjsSnippet
                            : integrationSnippetType === "node"
                            ? nodeSnippet
                            : curlSnippet;
                        handleCopy(snippet, "snippet");
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-600 transition-colors font-semibold cursor-pointer"
                    >
                      {copiedSnippet ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-2xl border border-slate-800 bg-[#0f172a] text-[11.5px] font-mono text-slate-200 overflow-x-auto leading-relaxed shadow-xs">
                    {integrationSnippetType === "html" && htmlSnippet}
                    {integrationSnippetType === "nextjs" && nextjsSnippet}
                    {integrationSnippetType === "node" && nodeSnippet}
                    {integrationSnippetType === "curl" && curlSnippet}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SIMULATE TEST SUBMISSION */}
          {activeTab === "simulate" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/60 text-xs text-blue-900 leading-relaxed">
                <span className="font-semibold block mb-0.5">Local Simulation Sandbox</span>
                Submitting this form injects a realistic mock lead directly into your local dashboard state and updates counts.{" "}
                <span className="text-slate-600">
                  No actual network request is sent to the internet, and no emails are dispatched.
                </span>
              </div>

              <form onSubmit={handleSimulateSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={simName}
                    onChange={(e) => setSimName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={simEmail}
                    onChange={(e) => setSimEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={simMessage}
                    onChange={(e) => setSimMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 transition-all resize-none font-sans"
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
                    className="text-xs text-slate-500 hover:text-blue-600 font-medium underline cursor-pointer"
                  >
                    Quick fill sample inquiry
                  </button>

                  <button
                    type="submit"
                    disabled={isSimulating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70"
                  >
                    {isSimulating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{isSimulating ? "Injecting Lead..." : "Simulate Test Submission"}</span>
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

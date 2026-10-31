"use client";

import React, { useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import { FormsSkeleton } from "./dashboard-skeleton";
import {
  Plus,
  Copy,
  Check,
  FileText,
  Key,
  Search,
  Eye,
  EyeOff,
  RotateCcw,
  X,
  Loader2,
} from "lucide-react";

type ViewTab = "forms" | "key" | "integration";
type CodeLang = "curl" | "fetch" | "html" | "react" | "python";

export function FormsView() {
  const {
    forms,
    apiKeys,
    isLoading,
    createApiKeyAsync,
    regenerateApiKeyAsync,
    revokeApiKeyAsync,
    toggleFormEnabledAsync,
    setIsCreateFormOpen,
    setSelectedFormId,
    addToast,
  } = useDashboard();

  // Active workspace API key
  const apiKey = apiKeys.find((k) => !k.revoked) || null;
  const hasApiKey = !!apiKey;

  // Active top-level subtab
  const [activeTab, setActiveTab] = useState<ViewTab>("forms");

  // Forms search & copy
  const [formSearch, setFormSearch] = useState("");
  const [copiedEndpointId, setCopiedEndpointId] = useState<string | null>(null);

  // Loading states for API calls
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);
  const [isRevokingKey, setIsRevokingKey] = useState(false);
  const [togglingFormId, setTogglingFormId] = useState<string | null>(null);

  // Single API Key display state
  const [showFullKey, setShowFullKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);

  // Integration playground state
  const [selectedFormIdForCode, setSelectedFormIdForCode] = useState(forms[0]?.id || "");
  const [codeLang, setCodeLang] = useState<CodeLang>("curl");
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState(false);

  // Stats
  const totalLeads = forms.reduce((sum, f) => sum + (f.leadCount || 0), 0);

  // Filtered forms
  const filteredForms = forms.filter((f) => {
    const q = formSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      f.name.toLowerCase().includes(q) ||
      f.slug.toLowerCase().includes(q) ||
      f.fields.some((field) => field.name.toLowerCase().includes(q) || field.label.toLowerCase().includes(q))
    );
  });

  // Copy endpoint handler
  const handleCopyEndpoint = (e: React.MouseEvent, formId: string, endpoint: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(endpoint);
    setCopiedEndpointId(formId);
    addToast("Endpoint copied", "Paste into your form action attribute or server proxy.");
    setTimeout(() => setCopiedEndpointId(null), 2000);
  };

  // Copy API key handler
  const handleCopyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey.fullKeyMock);
    setCopiedKey(true);
    addToast("API Key copied", "Ready to paste into x-api-key header.");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Generate Key handler
  const handleGenerateKey = async () => {
    if (isGeneratingKey) return;
    setIsGeneratingKey(true);
    try {
      await createApiKeyAsync("Inbound Live Key");
      addToast("API Key Created", "Key created successfully.", "success");
    } catch {
      addToast("Error", "Failed to generate API key", "error");
    } finally {
      setIsGeneratingKey(false);
    }
  };

  // Regenerate Key handler
  const handleRegenerateKey = async () => {
    if (!apiKey || isRegeneratingKey) return;
    setIsRegeneratingKey(true);
    try {
      await regenerateApiKeyAsync();
      addToast("Key Regenerated", "Old key revoked, new key generated.", "success");
      setIsRegenerateModalOpen(false);
    } catch {
      addToast("Error", "Failed to regenerate API key", "error");
    } finally {
      setIsRegeneratingKey(false);
    }
  };

  // Revoke Key handler
  const handleRevokeKey = async () => {
    if (!apiKey || isRevokingKey) return;
    setIsRevokingKey(true);
    try {
      await revokeApiKeyAsync(apiKey.id);
      addToast("API Key Revoked", "Live endpoints will reject requests until a new key is created.", "info");
    } catch {
      addToast("Error", "Failed to revoke API key", "error");
    } finally {
      setIsRevokingKey(false);
    }
  };

  const handleToggleForm = async (e: React.MouseEvent, formId: string) => {
    e.stopPropagation();
    if (togglingFormId) return;
    setTogglingFormId(formId);
    try {
      await toggleFormEnabledAsync(formId);
    } catch {
      addToast("Error", "Failed to update form status", "error");
    } finally {
      setTogglingFormId(null);
    }
  };

  if (isLoading) {
    return <FormsSkeleton />;
  }

  const currentFormForCode = forms.find((f) => f.id === selectedFormIdForCode) || forms[0];
  const currentEndpoint = currentFormForCode?.endpointUrl || "https://api.infraly.com/api/v1/inbound/your-slug";
  const currentKeyMock = apiKey?.fullKeyMock || "sln_live_••••••••••••••••••••";

  const getCodeSnippet = (lang: CodeLang): string => {
    switch (lang) {
      case "curl":
        return `curl -X POST "${currentEndpoint}" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${currentKeyMock}" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "We would like to book a team demo."
  }'`;

      case "fetch":
        return `// Server-Side Route Proxy (Node.js / Next.js / Express)
// Browser DevTools only sees your local "/api/contact" — Infraly & API key remain 100% hidden!
export async function POST(req) {
  const body = await req.json();

  const response = await fetch("${currentEndpoint}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.INFRALY_API_KEY, // Loaded from server environment
    },
    body: JSON.stringify(body),
  });

  return Response.json(await response.json());
}`;

      case "html":
        return `<!-- Direct HTML5 Form Submission (Protected by IP Rate Limiter & Honeypot) -->
<!-- Uses public form slug: No secret API key leaked in browser DevTools! -->
<form action="${currentEndpoint}" method="POST">
  <input type="text" name="name" required placeholder="Full Name" />
  <input type="email" name="email" required placeholder="Work Email" />
  <textarea name="message" required placeholder="Your message..."></textarea>

  <!-- Silent Honeypot (Catches spam bots, real humans ignore it) -->
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none !important;" />

  <button type="submit">Send</button>
</form>`;

      case "react":
        return `// Next.js Server Action (100% Invisible in Browser DevTools)
// app/actions/submit-lead.ts
"use server";

export async function submitLead(formData: FormData) {
  // Runs securely on the server — never exposed in browser Network tab
  const response = await fetch("${currentEndpoint}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.INFRALY_API_KEY!,
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  return response.ok;
}`;

      case "python":
        return `import requests

ENDPOINT = "${currentEndpoint}"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "${currentKeyMock}",
}

payload = {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "message": "Project inquiry",
}

response = requests.post(ENDPOINT, json=payload, headers=headers)
print(response.json())`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet(codeLang));
    setCopiedCodeSnippet(true);
    addToast("Code copied", "Paste directly into your application.");
    setTimeout(() => setCopiedCodeSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-slate-900">
            Forms & Endpoints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">
            {forms.length} {forms.length === 1 ? "endpoint" : "endpoints"} · {totalLeads} verified submissions
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {!hasApiKey && (
            <button
              type="button"
              disabled={isGeneratingKey}
              onClick={async () => {
                await handleGenerateKey();
                setActiveTab("key");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs cursor-pointer disabled:opacity-60"
            >
              {isGeneratingKey && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isGeneratingKey ? "Generating Key..." : "Generate API Key"}</span>
            </button>
          )}

          <button
            data-tour="create-form-btn"
            type="button"
            onClick={() => setIsCreateFormOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Form</span>
          </button>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="inline-flex p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("forms")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === "forms"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Endpoints ({forms.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("key")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === "key"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>API Key</span>
            {!hasApiKey && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("integration")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === "integration"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Code & SDK
          </button>
        </div>

        {activeTab === "forms" && forms.length > 0 && (
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Showing {filteredForms.length} of {forms.length}
          </span>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FORM ENDPOINTS */}
      {/* ========================================================================= */}
      {activeTab === "forms" && (
        <div className="space-y-4">
          {/* Optional Server Key Notice */}
          {!hasApiKey && (
            <div className="p-3.5 rounded-xl border border-blue-200/80 bg-blue-50/70 flex items-center justify-between gap-3 text-xs text-blue-900">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-none" />
                <span>Workspace API key available for server-to-server integrations & backend proxies.</span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await handleGenerateKey();
                  setActiveTab("key");
                }}
                disabled={isGeneratingKey}
                className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5"
              >
                {isGeneratingKey && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>Generate Key →</span>
              </button>
            </div>
          )}

          {/* Search bar */}
          {forms.length > 3 && (
            <div className="relative max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={formSearch}
                onChange={(e) => setFormSearch(e.target.value)}
                placeholder="Search forms..."
                className="w-full pl-8.5 pr-3 py-1.5 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 transition-all"
              />
            </div>
          )}

          {/* Forms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredForms.map((form) => {
              const isCopied = copiedEndpointId === form.id;
              return (
                <div
                  key={form.id}
                  onClick={() => setSelectedFormId(form.id)}
                  className="group relative p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-400/80 hover:shadow-[0_8px_24px_-4px_rgba(37,99,235,0.08)] transition-all duration-200 shadow-xs cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Status Dot + Name + Slug */}
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-none ${
                            form.enabled ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {form.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 flex-none">
                        /{form.slug}
                      </span>
                    </div>

                    {/* Redirect & Origin Shield Info */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate font-sans">
                      {form.allowedDomains && form.allowedDomains.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 truncate">
                          Shield: {form.allowedDomains.join(", ")}
                        </span>
                      ) : (
                        <span className="truncate">
                          {form.redirectUrl
                            ? `Redirects to ${form.redirectUrl.replace(/^https?:\/\//, "")}`
                            : "Direct form endpoint"}
                        </span>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-500 font-sans">
                      <span className="text-slate-900 font-semibold">
                        {form.leadCount} <span className="text-slate-500 font-normal">leads</span>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span>
                        {form.fields.length} <span className="text-slate-500">fields</span>
                      </span>
                      {form.spamCount > 0 && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="text-amber-700 font-medium">
                            {form.spamCount} <span className="text-slate-500">quarantined</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Clean Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={(e) => handleCopyEndpoint(e, form.id, form.endpointUrl)}
                      className="inline-flex items-center gap-1.5 hover:text-blue-600 font-medium transition-colors"
                      title="Copy endpoint URL"
                    >
                      {isCopied ? (
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

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleToggleForm(e, form.id)}
                        disabled={togglingFormId === form.id}
                        className="hover:text-slate-900 transition-colors text-slate-400 hover:text-slate-700 inline-flex items-center gap-1 cursor-pointer disabled:opacity-50 font-medium"
                      >
                        {togglingFormId === form.id && (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        )}
                        <span>{form.enabled ? "Pause" : "Enable"}</span>
                      </button>

                      <span className="text-slate-400 group-hover:text-blue-600 flex items-center gap-0.5 font-semibold transition-colors">
                        Details →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredForms.length === 0 && (
            <div className="p-12 text-center rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                {formSearch ? "No matching forms found" : "No forms created yet"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {formSearch
                  ? "Try searching for a different keyword."
                  : "Create your first form to start collecting submissions."}
              </p>
              {formSearch ? (
                <button
                  type="button"
                  onClick={() => setFormSearch("")}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200/90 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Clear search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreateFormOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20"
                >
                  Create Form
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WORKSPACE API KEY */}
      {/* ========================================================================= */}
      {activeTab === "key" && (
        <div className="space-y-6 max-w-2xl">
          {!hasApiKey ? (
            <div className="p-8 text-center rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center mx-auto text-blue-600">
                <Key className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-heading font-bold text-slate-900">
                  Workspace API Key
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Generate an authorized key to protect your endpoints and authenticate incoming submissions.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  disabled={isGeneratingKey}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-70"
                >
                  {isGeneratingKey ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Key...</span>
                    </>
                  ) : (
                    <span>Generate Key</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-white space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-heading font-bold text-slate-900">
                    Workspace Inbound Key
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized for all form endpoints across your workspace.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 font-semibold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Active</span>
                </span>
              </div>

              {/* Key display box */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
                <code className="text-xs font-mono text-slate-900 truncate select-all font-semibold">
                  {showFullKey ? apiKey.fullKeyMock : `${apiKey.keyPrefix}••••••••••••••••••••`}
                </code>

                <div className="flex items-center gap-1.5 flex-none">
                  <button
                    type="button"
                    onClick={() => setShowFullKey(!showFullKey)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
                    title={showFullKey ? "Hide key" : "Show key"}
                  >
                    {showFullKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setIsRegenerateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate Key</span>
                </button>

                <button
                  type="button"
                  onClick={handleRevokeKey}
                  disabled={isRevokingKey}
                  className="text-rose-600 hover:text-rose-700 font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isRevokingKey && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>{isRevokingKey ? "Revoking..." : "Revoke"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DEVELOPER SDK */}
      {/* ========================================================================= */}
      {activeTab === "integration" && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between gap-3 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Target Form:</span>
              <select
                value={selectedFormIdForCode}
                onChange={(e) => setSelectedFormIdForCode(e.target.value)}
                disabled={forms.length === 0}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-blue-600 disabled:opacity-60 font-medium shadow-2xs"
              >
                {forms.length === 0 ? (
                  <option value="">No forms created yet</option>
                ) : (
                  forms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} (/{f.slug})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex items-center gap-1">
              {(["curl", "fetch", "html", "react", "python"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setCodeLang(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                    codeLang === lang
                      ? "bg-blue-50 text-blue-700 border border-blue-200/80 font-semibold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] overflow-hidden shadow-sm">
            <div className="p-4 overflow-x-auto text-slate-200 font-mono text-xs leading-relaxed">
              <pre className="whitespace-pre">{getCodeSnippet(codeLang)}</pre>
            </div>

            <div className="p-3 border-t border-slate-800 bg-[#1e293b] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px] truncate">
                {currentEndpoint}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
              >
                {copiedCodeSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCodeSnippet ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isRegenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-900 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-bold text-slate-900">Regenerate API Key?</h3>
              <button
                type="button"
                onClick={() => setIsRegenerateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Your existing key will stop accepting submissions immediately until you update your forms.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setIsRegenerateModalOpen(false)}
                disabled={isRegeneratingKey}
                className="px-3.5 py-2 rounded-xl border border-slate-200/90 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRegenerateKey}
                disabled={isRegeneratingKey}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
              >
                {isRegeneratingKey && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isRegeneratingKey ? "Regenerating..." : "Regenerate"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

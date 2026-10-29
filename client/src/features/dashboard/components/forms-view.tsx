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
    if (!hasApiKey) {
      addToast(
        "Endpoint copied",
        "Generate your workspace API key to authenticate submissions.",
        "info"
      );
    } else {
      addToast("Endpoint copied", "Paste into your form action or fetch request.");
    }
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

  // Selected items for code snippet
  const activeTargetForm = forms.find((f) => f.id === selectedFormIdForCode) || forms[0];
  const currentEndpoint = activeTargetForm?.endpointUrl || "https://api.salenova.com/v1/f/your-form-slug";
  const currentKeyMock = hasApiKey ? apiKey.fullKeyMock : "sln_live_YOUR_API_KEY_HERE";

  // API Action Handlers with Loading State
  const handleGenerateKey = async () => {
    if (isGeneratingKey) return;
    setIsGeneratingKey(true);
    try {
      await createApiKeyAsync();
    } catch {
      addToast("Error", "Failed to generate API key", "error");
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleRegenerateKey = async () => {
    if (isRegeneratingKey) return;
    setIsRegeneratingKey(true);
    try {
      await regenerateApiKeyAsync();
      setIsRegenerateModalOpen(false);
    } catch {
      addToast("Error", "Failed to regenerate API key", "error");
    } finally {
      setIsRegeneratingKey(false);
    }
  };

  const handleRevokeKey = async () => {
    if (isRevokingKey || !apiKey) return;
    if (
      !window.confirm(
        "Revoking will disable live submissions until a new key is generated. Proceed?"
      )
    )
      return;
    setIsRevokingKey(true);
    try {
      await revokeApiKeyAsync(apiKey.id);
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
        return `// Standard JavaScript Fetch
async function submitLead(payload) {
  const response = await fetch("${currentEndpoint}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "${currentKeyMock}",
    },
    body: JSON.stringify(payload),
  });

  return await response.json();
}`;

      case "html":
        return `<!-- Direct HTML5 form submission -->
<form action="${currentEndpoint}" method="POST">
  <input type="hidden" name="_api_key" value="${currentKeyMock}" />
  <input type="text" name="name" required placeholder="Full Name" />
  <input type="email" name="email" required placeholder="Work Email" />
  <textarea name="message" required placeholder="Your message..."></textarea>
  <button type="submit">Send</button>
</form>`;

      case "react":
        return `"use client";

export function ContactForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    await fetch("${currentEndpoint}", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "${currentKeyMock}",
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="name" required placeholder="Name" />
      <input name="email" type="email" required placeholder="Email" />
      <textarea name="message" required placeholder="Message" />
      <button type="submit">Submit</button>
    </form>
  );
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
      {/* Top Header - Apple-Grade Restraint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
            Forms & Endpoints
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
            {forms.length} {forms.length === 1 ? "endpoint" : "endpoints"} · {totalLeads} verified submissions
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!hasApiKey && (
            <button
              type="button"
              disabled={isGeneratingKey}
              onClick={async () => {
                await handleGenerateKey();
                setActiveTab("key");
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-60"
            >
              {isGeneratingKey && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isGeneratingKey ? "Generating Key..." : "Generate API Key"}</span>
            </button>
          )}

          <button
            data-tour="create-form-btn"
            type="button"
            onClick={() => setIsCreateFormOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Form</span>
          </button>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="inline-flex p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("forms")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === "forms"
                ? "bg-white/[0.08] text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Endpoints ({forms.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("key")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === "key"
                ? "bg-white/[0.08] text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>API Key</span>
            {!hasApiKey && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("integration")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === "integration"
                ? "bg-white/[0.08] text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Code & SDK
          </button>
        </div>

        {activeTab === "forms" && forms.length > 0 && (
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
            Showing {filteredForms.length} of {forms.length}
          </span>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FORM ENDPOINTS */}
      {/* ========================================================================= */}
      {activeTab === "forms" && (
        <div className="space-y-4">
          {/* Subtle Key Requirement Notice */}
          {!hasApiKey && (
            <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-none" />
                <span>Workspace API key required to authenticate live external submissions.</span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  await handleGenerateKey();
                  setActiveTab("key");
                }}
                disabled={isGeneratingKey}
                className="text-xs text-white hover:text-zinc-300 font-medium underline cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5"
              >
                {isGeneratingKey && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>Generate Key →</span>
              </button>
            </div>
          )}

          {/* Search bar */}
          {forms.length > 3 && (
            <div className="relative max-w-sm">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={formSearch}
                onChange={(e) => setFormSearch(e.target.value)}
                placeholder="Search forms..."
                className="w-full pl-8.5 pr-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
              />
            </div>
          )}

          {/* Forms Grid - Apple Minimalist Luxury */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredForms.map((form) => {
              const isCopied = copiedEndpointId === form.id;
              return (
                <div
                  key={form.id}
                  onClick={() => setSelectedFormId(form.id)}
                  className="group relative p-5 rounded-2xl border border-white/[0.06] bg-[#131316] hover:bg-[#16161b] hover:border-white/[0.14] transition-all duration-200 shadow-xs cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Status Dot + Name + Slug */}
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-none ${
                            form.enabled ? "bg-emerald-400" : "bg-zinc-600"
                          }`}
                        />
                        <h3 className="text-sm sm:text-base font-medium text-white group-hover:text-zinc-100 transition-colors truncate">
                          {form.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500 flex-none">
                        /{form.slug}
                      </span>
                    </div>

                    {/* Clean Redirect Info */}
                    <p className="text-xs text-zinc-400 truncate font-sans">
                      {form.redirectUrl
                        ? `Redirects to ${form.redirectUrl.replace(/^https?:\/\//, "")}`
                        : "Direct JSON response"}
                    </p>

                    {/* Understated Metrics (No colored border pills) */}
                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2.5 text-xs text-zinc-400 font-sans">
                      <span className="text-white font-medium">
                        {form.leadCount} <span className="text-zinc-500 font-normal">leads</span>
                      </span>
                      <span className="text-zinc-700">·</span>
                      <span>
                        {form.fields.length} <span className="text-zinc-500">fields</span>
                      </span>
                      {form.spamCount > 0 && (
                        <>
                          <span className="text-zinc-700">·</span>
                          <span className="text-zinc-400">
                            {form.spamCount} <span className="text-zinc-500">quarantined</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Clean Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-zinc-400">
                    <button
                      type="button"
                      onClick={(e) => handleCopyEndpoint(e, form.id, form.endpointUrl)}
                      className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                      title="Copy endpoint URL"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleToggleForm(e, form.id)}
                        disabled={togglingFormId === form.id}
                        className="hover:text-white transition-colors text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {togglingFormId === form.id && (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        )}
                        <span>{form.enabled ? "Pause" : "Enable"}</span>
                      </button>

                      <span className="text-zinc-300 group-hover:text-white flex items-center gap-0.5 font-medium">
                        Details →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredForms.length === 0 && (
            <div className="p-12 text-center rounded-2xl border border-white/[0.06] bg-[#131316] space-y-3">
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto text-zinc-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-white">
                {formSearch ? "No matching forms found" : "No forms created yet"}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                {formSearch
                  ? "Try searching for a different keyword."
                  : "Create your first form to start collecting submissions."}
              </p>
              {formSearch ? (
                <button
                  type="button"
                  onClick={() => setFormSearch("")}
                  className="px-3 py-1.5 rounded-xl border border-white/[0.1] text-xs text-white hover:bg-white/[0.04]"
                >
                  Clear search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreateFormOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200"
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
            <div className="p-8 text-center rounded-2xl border border-white/[0.06] bg-[#131316] space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-300">
                <Key className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-medium text-white">
                  Workspace API Key
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Generate an authorized key to protect your endpoints and authenticate incoming submissions.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  disabled={isGeneratingKey}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-70"
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
            <div className="p-6 rounded-2xl border border-white/[0.06] bg-[#131316] space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">
                    Workspace Inbound Key
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Authorized for all form endpoints across your workspace.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Active</span>
                </span>
              </div>

              {/* Key display box */}
              <div className="p-3 rounded-xl border border-white/[0.08] bg-[#0c0c0e] flex items-center justify-between gap-3">
                <code className="text-xs font-mono text-zinc-200 truncate select-all">
                  {showFullKey ? apiKey.fullKeyMock : `${apiKey.keyPrefix}••••••••••••••••••••`}
                </code>

                <div className="flex items-center gap-1.5 flex-none">
                  <button
                    type="button"
                    onClick={() => setShowFullKey(!showFullKey)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title={showFullKey ? "Hide key" : "Show key"}
                  >
                    {showFullKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
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
              <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setIsRegenerateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate Key</span>
                </button>

                <button
                  type="button"
                  onClick={handleRevokeKey}
                  disabled={isRevokingKey}
                  className="text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
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
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Target:</span>
              <select
                value={selectedFormIdForCode}
                onChange={(e) => setSelectedFormIdForCode(e.target.value)}
                disabled={forms.length === 0}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none disabled:opacity-60"
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
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                    codeLang === lang
                      ? "bg-white/[0.1] text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0c0c0e] overflow-hidden">
            <div className="p-4 overflow-x-auto text-zinc-300 font-mono text-xs leading-relaxed">
              <pre className="whitespace-pre">{getCodeSnippet(codeLang)}</pre>
            </div>

            <div className="p-3 border-t border-white/[0.04] bg-[#121215] flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[11px] truncate">
                {currentEndpoint}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-black font-medium transition-colors hover:bg-zinc-200"
              >
                {copiedCodeSnippet ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCodeSnippet ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isRegenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#141416] border border-white/[0.1] rounded-2xl p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Regenerate API Key?</h3>
              <button
                type="button"
                onClick={() => setIsRegenerateModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Your existing key will stop accepting submissions immediately until you update your forms.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setIsRegenerateModalOpen(false)}
                disabled={isRegeneratingKey}
                className="px-3 py-1.5 text-zinc-400 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRegenerateKey}
                disabled={isRegeneratingKey}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 disabled:opacity-70 cursor-pointer"
              >
                {isRegeneratingKey && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>{isRegeneratingKey ? "Regenerating..." : "Regenerate"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

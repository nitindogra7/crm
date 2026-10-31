"use client";

import { DialogLayer } from "@/shared/components/dialog-layer";
import { copyText } from "@/shared/lib/clipboard";
import styles from "./forms.module.css";
import Link from "@/shared/components/app-link";
import { useSearchParams } from "next/navigation";
import { getFormSnippet } from "./form-integration";
import { API_URL } from "@/shared/lib/api-client";
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
  ArrowUpRight,
} from "lucide-react";

type ViewTab = "forms" | "key" | "integration";
type CodeLang = "curl" | "fetch" | "html" | "react" | "python";

export function FormsView() {
  const {
    forms,
    apiKeys,
    currentEnvironment,
    workspace,
    isLoading,
    createApiKeyAsync,
    regenerateApiKeyAsync,
    revokeApiKeyAsync,
    toggleFormEnabledAsync,
    setIsCreateFormOpen,
    setSelectedFormId,
    addToast,
  } = useDashboard(["forms","apiKeys","currentEnvironment","workspace","isLoading","createApiKeyAsync","regenerateApiKeyAsync","revokeApiKeyAsync","toggleFormEnabledAsync","setIsCreateFormOpen","setSelectedFormId","addToast"]);

  // Active workspace API key matching current environment
  const apiKey =
    apiKeys.find(
      (k) =>
        !k.revoked &&
        (k.environment === currentEnvironment ||
          (currentEnvironment === "production"
            ? k.keyPrefix.includes("live")
            : k.keyPrefix.includes("test")))
    ) ||
    apiKeys.find((k) => !k.revoked) ||
    null;
  const hasApiKey = !!apiKey;

  // Active top-level subtab
  const params = useSearchParams();
  const activeTab: ViewTab = params.get("tab") === "key" ? "key" : params.get("tab") === "integration" ? "integration" : "forms";
  const setActiveTab = (tab: ViewTab) => {
    const next = new URLSearchParams(params.toString());
    next.set("tab", tab);
    window.history.pushState(null, "", "/dashboard/forms?" + next.toString());
  };

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
  const handleCopyEndpoint = async (e: React.MouseEvent, formId: string, endpoint: string) => {
    e.stopPropagation();
    if (!(await copyText(endpoint))) return;
    setCopiedEndpointId(formId);
    addToast("Endpoint copied", "Paste into your form action attribute or server proxy.");
    setTimeout(() => setCopiedEndpointId(null), 2000);
  };

  // Copy API key handler
  const handleCopyKey = async () => {
    if (!apiKey) return;
    if (!(await copyText(apiKey.fullKeyMock))) return;
    setCopiedKey(true);
    addToast("API Key copied", "Ready to paste into x-api-key header.");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Generate Key handler
  const handleGenerateKey = async () => {
    if (isGeneratingKey) return false;
    setIsGeneratingKey(true);
    try {
      const isProd = currentEnvironment === "production";
      await createApiKeyAsync(
        isProd ? "Production API Key" : "Development API Key",
        isProd ? "live" : "test",
        currentEnvironment
      );
      return true;
    } catch {
      addToast("Error", "Failed to generate API key", "error");
      return false;
    } finally {
      setIsGeneratingKey(false);
    }
  };

  // Regenerate Key handler
  const handleRegenerateKey = async () => {
    if (!apiKey || isRegeneratingKey) return;
    setIsRegeneratingKey(true);
    try {
      const isProd = currentEnvironment === "production";
      await regenerateApiKeyAsync(isProd ? "live" : "test", currentEnvironment);
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
      addToast("API Key Revoked", "Server requests using this key will be rejected. Public form endpoints keep working.", "info");
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
  const currentEndpoint = currentFormForCode?.endpointUrl || API_URL + "/api/forms-and-api/f/YOUR_FORM_SLUG";
  const getCodeSnippet = (language: CodeLang) => getFormSnippet(language, currentEndpoint);

  const handleCopyCode = async () => {
    if (!(await copyText(getCodeSnippet(codeLang)))) return;
    setCopiedCodeSnippet(true);
    addToast("Code copied", "Paste directly into your application.");
    setTimeout(() => setCopiedCodeSnippet(false), 2000);
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}><div><h1>Forms & APIs</h1><p>{forms.length} {forms.length === 1 ? "form" : "forms"} &middot; {totalLeads} submissions &middot; {currentEnvironment === "production" ? "Production" : "Development"}</p></div><button data-tour="create-form-btn" type="button" className={styles.primaryButton} onClick={() => setIsCreateFormOpen(true)}><Plus size={15} />Create form</button></header>
      <nav className={styles.tabs} aria-label="Forms sections">{([{ id: "forms", label: "Forms" }, { id: "key", label: "API key" }, { id: "integration", label: "Integration" }] as const).map(tab => <a key={tab.id} href={"/dashboard/forms?tab=" + tab.id} aria-current={activeTab === tab.id ? "page" : undefined} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); setActiveTab(tab.id); }}>{tab.label}</a>)}</nav>
      {activeTab === "forms" && <>
        {forms.length > 0 && <div className={styles.toolbar}><label className={styles.search}><Search size={15} /><span className="sr-only">Search forms</span><input type="search" placeholder="Search forms..." value={formSearch} onChange={event => setFormSearch(event.target.value)} /></label><p>{filteredForms.length} {filteredForms.length === 1 ? "form" : "forms"}</p></div>}
        <div className={styles.formGrid}>{filteredForms.map(form => <section key={form.id} className={styles.formCard}>
          <div className={styles.cardHeading}><h2><button type="button" onClick={() => setSelectedFormId(form.id)} title={form.name}>{form.name}</button></h2><span className={form.enabled ? styles.activeBadge : styles.badge}>{form.enabled ? "Active" : "Paused"}</span></div>
          <p className={styles.formSlug}>/{form.slug}</p>
          <div className={styles.endpoint}><code title={form.endpointUrl}>{form.endpointUrl}</code><button type="button" aria-label={"Copy endpoint for " + form.name} onClick={event => void handleCopyEndpoint(event, form.id, form.endpointUrl)}>{copiedEndpointId === form.id ? <Check size={15} /> : <Copy size={15} />}</button></div>
          <div className={styles.formStats}><span><strong>{form.leadCount || 0}</strong> leads</span><span>{form.fields.length} fields</span>{form.spamCount > 0 && <span>{form.spamCount} flagged</span>}</div>
          <footer className={styles.cardFooter}><button type="button" className={styles.textButton} disabled={togglingFormId !== null} onClick={event => void handleToggleForm(event, form.id)}>{togglingFormId === form.id ? "Updating..." : form.enabled ? "Pause form" : "Enable form"}</button><button type="button" className={styles.detailsButton} onClick={() => setSelectedFormId(form.id)}>View details<ArrowUpRight size={14} /></button></footer>
        </section>)}</div>
        {filteredForms.length === 0 && <div className={styles.emptyState}><FileText size={28} /><h2>{formSearch ? "No matching forms" : "Create your first form"}</h2><p>{formSearch ? "Try another name or clear your search." : "Create an endpoint, connect your website, and start receiving leads."}</p><button type="button" className={formSearch ? styles.secondaryButton : styles.primaryButton} onClick={() => formSearch ? setFormSearch("") : setIsCreateFormOpen(true)}>{formSearch ? "Clear search" : "Create form"}</button></div>}
      </>}
      {activeTab === "key" && <section className={styles.keyPanel}><header className={styles.panelHeader}><div><h2>{currentEnvironment === "production" ? "Production" : "Development"} API key</h2><p>Authenticate server-side submissions in this environment.</p></div>{hasApiKey && <span className={styles.activeBadge}>Active</span>}</header>
        {!hasApiKey ? <div className={styles.emptyState}><Key size={27} /><h3>No API key yet</h3><p>Generate a key for server integrations. Direct HTML forms use their public endpoint.</p><button type="button" className={styles.primaryButton} disabled={isGeneratingKey} onClick={() => void handleGenerateKey()}>{isGeneratingKey ? "Generating..." : "Generate API key"}</button></div> : <>
          <div className={styles.panelBody}><label className={styles.fieldLabel} htmlFor="workspace-api-key">API key</label><div className={styles.keyField}><input id="workspace-api-key" readOnly type={showFullKey ? "text" : "password"} value={apiKey.fullKeyMock || apiKey.keyPrefix} /><button type="button" aria-label={showFullKey ? "Hide API key" : "Show API key"} aria-pressed={showFullKey} onClick={() => setShowFullKey(!showFullKey)}>{showFullKey ? <EyeOff size={16} /> : <Eye size={16} />}</button><button type="button" onClick={() => void handleCopyKey()}>{copiedKey ? <Check size={15} /> : <Copy size={15} />}<span>{copiedKey ? "Copied" : "Copy"}</span></button></div><p className={styles.help}>Keep this key on your server. <Link href="/docs?guide=server">Read the integration guide</Link>.</p>
          {currentEnvironment === "production" ? <div className={styles.originRow}><div><strong>Website origin</strong><p>{workspace.productionOrigin || "Add your website before accepting production submissions."}</p></div><Link href="/dashboard/settings?tab=origins">{workspace.productionOrigin ? "Edit" : "Configure"}<ArrowUpRight size={14} /></Link></div> : <p className={styles.environmentNote}>Development keys work with test data. Production submissions remain separate.</p>}</div>
          <footer className={styles.panelActions}><button type="button" className={styles.secondaryButton} onClick={() => setIsRegenerateModalOpen(true)}><RotateCcw size={14} />Rotate key</button><button type="button" className={styles.dangerButton} disabled={isRevokingKey} onClick={() => void handleRevokeKey()}>{isRevokingKey ? "Revoking..." : "Revoke key"}</button></footer>
        </>}
      </section>}
      {activeTab === "integration" && (forms.length === 0 ? <div className={styles.emptyState}><FileText size={28} /><h2>Create a form to get your code</h2><p>Your integration examples use the endpoint of the form you select.</p><button type="button" className={styles.primaryButton} onClick={() => setIsCreateFormOpen(true)}>Create form</button></div> : <section className={styles.integrationPanel}><div className={styles.integrationHeading}><div><h2>Connect your form</h2><p>Choose a form and copy an example for your project.</p></div><label className={styles.targetForm}><span>Form</span><select value={currentFormForCode?.id || ""} onChange={event => setSelectedFormIdForCode(event.target.value)}>{forms.map(form => <option key={form.id} value={form.id}>{form.name}</option>)}</select></label></div><div className={styles.codeTabs} role="group" aria-label="Code language">{(["html", "react", "fetch", "curl", "python"] as const).map(language => <button key={language} type="button" aria-pressed={codeLang === language} onClick={() => setCodeLang(language)}>{({html:"HTML",react:"React",fetch:"Server route",curl:"cURL",python:"Python"})[language]}</button>)}</div><div className={styles.codePanel}><div><span>{currentFormForCode?.name}</span><button type="button" onClick={() => void handleCopyCode()}>{copiedCodeSnippet ? <Check size={14} /> : <Copy size={14} />}{copiedCodeSnippet ? "Copied" : "Copy code"}</button></div><pre tabIndex={0} aria-label="Integration code"><code>{getCodeSnippet(codeLang)}</code></pre></div><p className={styles.integrationHelp}>HTML and React use the public endpoint. Server examples read INFRALY_API_KEY from your environment. <Link href="/docs">View documentation<ArrowUpRight size={13} /></Link></p></section>)}
      {isRegenerateModalOpen && <DialogLayer label="Rotate API key" onClose={() => { if (!isRegeneratingKey) setIsRegenerateModalOpen(false); }} className={styles.modalOverlay}><div className={styles.modalBackdrop} aria-hidden="true" onClick={() => { if (!isRegeneratingKey) setIsRegenerateModalOpen(false); }} /><div className={styles.confirmDialog}><header><h2>Rotate API key?</h2><button type="button" aria-label="Close dialog" disabled={isRegeneratingKey} onClick={() => setIsRegenerateModalOpen(false)}><X size={18} /></button></header><p>Your current key will stop working. Update your server configuration with the new key after rotating it.</p><footer><button type="button" className={styles.secondaryButton} disabled={isRegeneratingKey} onClick={() => setIsRegenerateModalOpen(false)}>Cancel</button><button type="button" className={styles.primaryButton} disabled={isRegeneratingKey} onClick={() => void handleRegenerateKey()}>{isRegeneratingKey ? "Rotating..." : "Rotate key"}</button></footer></div></DialogLayer>}
    </div>
  );
}

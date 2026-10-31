"use client";

import { DialogLayer } from "@/shared/components/dialog-layer";
import { copyText } from "@/shared/lib/clipboard";
import styles from "./form-modal.module.css";
import { getFormSnippet } from "./form-integration";
import Link from "@/shared/components/app-link";
import React, { useState, useEffect } from "react";
import { useDashboard } from "../context/dashboard-context";
import {
  X,
  Copy,
  Check,
  Send,
  Trash2,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";

export function FormDetailModal() {
  const {
    forms,
    selectedFormId,
    setSelectedFormId,
    updateFormAsync,
    toggleFormEnabledAsync,
    deleteFormAsync,
    simulateLeadSubmissionAsync,
    addToast,
  } = useDashboard(["forms","selectedFormId","setSelectedFormId","updateFormAsync","toggleFormEnabledAsync","deleteFormAsync","simulateLeadSubmissionAsync","addToast"]);


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

  const handleCopy = async (text: string, type: "endpoint" | "snippet") => {
    if (!(await copyText(text))) return;
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
        redirectUrl: redirectUrl.trim(),
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

  const snippet = getFormSnippet(integrationSnippetType === "nextjs" ? "fetch" : integrationSnippetType, form.endpointUrl);

  return (
    <DialogLayer label="Form details" onClose={()=>setSelectedFormId(null)} className={styles.overlay}>
      <div className={styles.backdrop} aria-hidden="true" onClick={()=>setSelectedFormId(null)}/>
      <div className={styles.detailDialog}>
        <header className={styles.header}><div><h2>{form.name}</h2><p>Manage this form and its integration.</p></div><button type="button" aria-label="Close dialog" onClick={()=>setSelectedFormId(null)}><X size={19}/></button></header>
        <div className={styles.statusRow}><span className={form.enabled?styles.active:styles.optional}>{form.enabled?"Active":"Paused"}</span><code>/{form.slug}</code><button type="button" className={styles.secondaryButton} disabled={isToggling} onClick={()=>void handleToggleForm()}>{isToggling?"Updating...":form.enabled?"Pause form":"Enable form"}</button></div>
        <nav className={styles.tabs} aria-label="Form detail sections">{([{id:"overview",label:"Overview"},{id:"fields",label:"Fields"},{id:"integration",label:"Code"},{id:"simulate",label:"Test"}] as const).map(tab=><button key={tab.id} type="button" aria-pressed={activeTab===tab.id} onClick={()=>setActiveTab(tab.id)}>{tab.label}</button>)}</nav>
        <div className={styles.body}>
          {activeTab==="overview"&&<>
            <div className={styles.field}><label htmlFor="form-endpoint">Endpoint URL</label><div className={styles.copyField}><input id="form-endpoint" readOnly value={form.endpointUrl}/><button type="button" aria-label="Copy endpoint URL" onClick={()=>void handleCopy(form.endpointUrl,"endpoint")}>{copiedEndpoint?<Check size={15}/>:<Copy size={15}/>}<span>{copiedEndpoint?"Copied":"Copy"}</span></button></div></div>
            <div className={styles.stats}><div><span>Leads</span><strong>{form.leadCount||0}</strong></div><div><span>Flagged</span><strong>{form.spamCount||0}</strong></div><div><span>Created</span><span className={styles.created}><FormattedDate date={form.createdAt} format="date"/></span></div></div>
            <form onSubmit={handleSaveOverview} className={styles.editForm}><div className={styles.field}><label htmlFor="edit-form-name">Form name</label><input id="edit-form-name" value={formName} onChange={event=>setFormName(event.target.value)} required maxLength={100}/></div><div className={styles.field}><label htmlFor="edit-form-redirect">Thank-you page URL</label><input id="edit-form-redirect" value={redirectUrl} onChange={event=>setRedirectUrl(event.target.value)} placeholder="https://example.com/thank-you"/><p>Optional. Used for native HTML form redirects.</p></div><div className={styles.field}><label htmlFor="edit-form-domains">Allowed domains</label><input id="edit-form-domains" value={allowedDomains} onChange={event=>setAllowedDomains(event.target.value)} placeholder="example.com, app.example.com"/><p>Separate domains with commas. Leave empty to use workspace rules.</p></div><div className={styles.editActions}><button type="button" className={styles.deleteButton} disabled={isDeleting||isSaving} onClick={()=>void handleDeleteForm()}><Trash2 size={14}/>{isDeleting?"Deleting...":"Delete form"}</button><button type="submit" className={styles.primaryButton} disabled={isSaving||isDeleting}>{isSaving?"Saving...":"Save changes"}</button></div></form>
          </>}
          {activeTab==="fields"&&<><div className={styles.sectionHeading}><h3>Form fields</h3><p>Use these fields when building your website form.</p></div><ul className={styles.fieldList}>{form.fields.map(field=><li key={field.id}><div><strong>{field.label}</strong><span>{field.name}</span></div><span className={styles.fieldType}>{field.type}</span><span className={field.required?styles.required:styles.optional}>{field.required?"Required":"Optional"}</span></li>)}</ul></>}
          {activeTab==="integration"&&<><div className={styles.sectionHeading}><h3>Integration code</h3><p>Copy an example and use this form endpoint.</p></div><div className={styles.languageTabs} role="group" aria-label="Integration language">{(["html","nextjs","node","curl"] as const).map(language=><button type="button" key={language} aria-pressed={integrationSnippetType===language} onClick={()=>setIntegrationSnippetType(language)}>{({html:"HTML",nextjs:"Next.js",node:"Node.js",curl:"cURL"})[language]}</button>)}</div><div className={styles.codeBlock}><header><span>{integrationSnippetType==="html"?"contact.html":"Server integration"}</span><button type="button" onClick={()=>void handleCopy(snippet,"snippet")}>{copiedSnippet?<Check size={14}/>:<Copy size={14}/>}<span>{copiedSnippet?"Copied":"Copy code"}</span></button></header><pre tabIndex={0} aria-label="Form integration code"><code>{snippet}</code></pre></div><p className={styles.codeHelp}>HTML uses the public endpoint. Server examples use an environment variable for the API key. <Link href="/docs?guide=server" onClick={()=>setSelectedFormId(null)}>Read the guide</Link>.</p></>}
          {activeTab==="simulate"&&<><div className={styles.sectionHeading}><h3>Send a test lead</h3><p>Add a submission to the selected form environment.</p></div><form onSubmit={handleSimulateSubmit} className={styles.editForm}><div className={styles.fieldGrid}><div className={styles.field}><label htmlFor="test-lead-name">Name</label><input id="test-lead-name" value={simName} onChange={event=>setSimName(event.target.value)} required/></div><div className={styles.field}><label htmlFor="test-lead-email">Email</label><input id="test-lead-email" type="email" value={simEmail} onChange={event=>setSimEmail(event.target.value)} required/></div></div><div className={styles.field}><label htmlFor="test-lead-message">Message</label><textarea id="test-lead-message" rows={4} value={simMessage} onChange={event=>setSimMessage(event.target.value)} required/></div><div className={styles.testActions}><button className={styles.primaryButton} type="submit" disabled={isSimulating}>{isSimulating?"Sending...":"Send test lead"}<Send size={14}/></button></div></form></>}
        </div>
      </div>
    </DialogLayer>
  );
}

"use client";

import { DialogLayer } from "@/shared/components/dialog-layer";
import styles from "./form-modal.module.css";
import Link from "@/shared/components/app-link";
import React, { useState, useEffect } from "react";
import { useDashboard } from "../context/dashboard-context";
import { FormField } from "../types";
import { WorkspaceEnvironment } from "@/shared/types";
import { X, Plus, Trash2, FlaskConical, ShieldCheck } from "lucide-react";

export function CreateFormModal() {
  const { isCreateFormOpen, setIsCreateFormOpen, createFormAsync, currentEnvironment, workspace, addToast } = useDashboard(["isCreateFormOpen","setIsCreateFormOpen","createFormAsync","currentEnvironment","workspace","addToast"]);

  const [name, setName] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [allowedDomains, setAllowedDomains] = useState("");
  const [environment, setEnvironment] = useState<WorkspaceEnvironment>(currentEnvironment || "development");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState<FormField[]>([
    { id: "f_name", name: "name", label: "Full Name", type: "text", required: true },
    { id: "f_email", name: "email", label: "Email Address", type: "email", required: true },
    { id: "f_message", name: "message", label: "Message", type: "textarea", required: true },
  ]);

  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<FormField["type"]>("text");

  const [prevOpen, setPrevOpen] = useState(isCreateFormOpen);
  if (isCreateFormOpen !== prevOpen) {
    setPrevOpen(isCreateFormOpen);
    if (isCreateFormOpen) {
      setEnvironment(currentEnvironment || "development");
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsCreateFormOpen(false);
      }
    }
    if (isCreateFormOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isCreateFormOpen, setIsCreateFormOpen]);

  if (!isCreateFormOpen) return null;

  const handleToggleRequired = (id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, required: !f.required } : f))
    );
  };

  const handleRemoveField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddField = () => {
    const clean = newFieldName.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    if (!clean) return;
    if (fields.some(field => field.name === clean)) { addToast("Field already exists", "Choose a different field name.", "error"); return; }

    const newField: FormField = {
      id: `f_${Date.now()}`,
      name: clean,
      label: newFieldName.trim(),
      type: newFieldType,
      required: false,
    };
    setFields((prev) => [...prev, newField]);
    setNewFieldName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const parsedDomains = allowedDomains
        .split(",")
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean);

      await createFormAsync({
        name: name.trim(),
        redirectUrl: redirectUrl.trim() || undefined,
        allowedDomains: parsedDomains,
        environment,
        fields,
      });

      setName("");
      setRedirectUrl("");
      setAllowedDomains("");
      setIsCreateFormOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create form";
      addToast("Error", msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogLayer label="Create form" onClose={() => { if (!isSubmitting) setIsCreateFormOpen(false); }} className={styles.overlay}>
      <div className={styles.backdrop} aria-hidden="true" onClick={() => { if (!isSubmitting) setIsCreateFormOpen(false); }} />
      <div className={styles.createDialog}>
        <header className={styles.header}><div><h2>Create a form</h2><p>Give your website a place to send submissions.</p></div><button type="button" aria-label="Close dialog" disabled={isSubmitting} onClick={() => setIsCreateFormOpen(false)}><X size={19} /></button></header>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div className={styles.field}><label htmlFor="new-form-name">Form name</label><input id="new-form-name" required maxLength={100} value={name} onChange={event => setName(event.target.value)} placeholder="Contact form" /></div>
            <fieldset className={styles.fieldset}><legend>Environment</legend><div className={styles.environmentGrid}>{([{id:"development",label:"Development",description:"For testing and previews.",icon:FlaskConical},{id:"production",label:"Production",description:"For your live website.",icon:ShieldCheck}] as const).map(option => {const Icon=option.icon;return <button type="button" key={option.id} aria-pressed={environment===option.id} className={environment===option.id?styles.selectedEnvironment:styles.environment} onClick={()=>setEnvironment(option.id)}><span><Icon size={16}/>{option.label}</span><p>{option.description}</p></button>})}</div></fieldset>
            {environment === "production" && !workspace.productionOrigin && <p className={styles.notice}>Add your website origin before accepting live submissions. <Link href="/dashboard/settings?tab=origins" onClick={()=>setIsCreateFormOpen(false)}>Open settings</Link></p>}
            <details className={styles.details}><summary>Form fields <span>{fields.length} configured</span></summary><div className={styles.detailContent}><ul className={styles.fieldList}>{fields.map(field=><li key={field.id}><div><strong>{field.label}</strong><span>{field.name} &middot; {field.type}</span></div><button type="button" aria-label={"Required: "+field.label} aria-pressed={field.required} className={field.required?styles.required:styles.optional} onClick={()=>handleToggleRequired(field.id)}>{field.required?"Required":"Optional"}</button><button type="button" className={styles.iconButton} aria-label={"Remove "+field.label} onClick={()=>handleRemoveField(field.id)}><Trash2 size={14}/></button></li>)}</ul><div className={styles.addField}><input aria-label="Custom field name" value={newFieldName} onChange={event=>setNewFieldName(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();handleAddField();}}} placeholder="Field name"/><select aria-label="Custom field type" value={newFieldType} onChange={event=>setNewFieldType(event.target.value as FormField["type"])}><option value="text">Text</option><option value="email">Email</option><option value="textarea">Text area</option><option value="tel">Phone</option><option value="number">Number</option></select><button type="button" className={styles.secondaryButton} aria-label="Add custom field" disabled={!newFieldName.trim()} onClick={handleAddField}><Plus size={16}/></button></div></div></details>
            <details className={styles.details}><summary>Advanced options</summary><div className={styles.detailContent}><div className={styles.field}><label htmlFor="new-form-redirect">Thank-you page URL</label><input id="new-form-redirect" value={redirectUrl} onChange={event=>setRedirectUrl(event.target.value)} placeholder="https://example.com/thank-you"/><p>Optional. Redirect visitors after a native HTML form submission.</p></div><div className={styles.field}><label htmlFor="new-form-domains">Allowed domains</label><input id="new-form-domains" value={allowedDomains} onChange={event=>setAllowedDomains(event.target.value)} placeholder="example.com, app.example.com"/><p>Separate domains with commas. Leave empty to use workspace rules.</p></div></div></details>
          </div>
          <footer className={styles.footer}><button type="button" className={styles.secondaryButton} disabled={isSubmitting} onClick={()=>setIsCreateFormOpen(false)}>Cancel</button><button type="submit" className={styles.primaryButton} disabled={!name.trim()||isSubmitting}>{isSubmitting?"Creating...":"Create form"}</button></footer>
        </form>
      </div>
    </DialogLayer>
  );
}

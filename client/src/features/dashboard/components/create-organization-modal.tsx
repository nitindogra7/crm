"use client";

import { DialogLayer } from "@/shared/components/dialog-layer";
import styles from "./form-modal.module.css";
import React, { useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import { X } from "lucide-react";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TONES = [{ id: "zinc", label: "Neutral", bg: "bg-slate-700" }, { id: "slate", label: "Slate", bg: "bg-slate-500" }, { id: "emerald", label: "Green", bg: "bg-emerald-600" }, { id: "white", label: "White", bg: "bg-white" }];

export function CreateOrganizationModal({
  isOpen,
  onClose,
}: CreateOrganizationModalProps) {
  const { createOrganizationAsync, addToast } = useDashboard(["createOrganizationAsync","addToast"]);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [hasEditedSlug, setHasEditedSlug] = useState(false);
  const [avatarTone, setAvatarTone] = useState("zinc");
  const [plan, setPlan] = useState("Free Tier");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!hasEditedSlug) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const candidateSlug = (
        slug.trim() ||
        name.toLowerCase().trim()
      )
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      const cleanSlug = candidateSlug || `org-${Date.now().toString(36)}`;

      await createOrganizationAsync({
        name: name.trim(),
        slug: cleanSlug,
        avatarTone,
        plan,
      });

      addToast("Organization created", `${name.trim()} workspace is ready.`);
      onClose();
      setName("");
      setSlug("");
      setHasEditedSlug(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create organization";
      addToast("Error", msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <DialogLayer label="Create workspace" onClose={()=>{if(!isSubmitting)onClose();}} className={styles.overlay}><div className={styles.backdrop} aria-hidden="true" onClick={()=>{if(!isSubmitting)onClose();}}/><div className={styles.createDialog}><header className={styles.header}><div><h2>Create a workspace</h2><p>A separate space for a client or project.</p></div><button type="button" aria-label="Close dialog" disabled={isSubmitting} onClick={onClose}><X size={19}/></button></header><form className={styles.form} onSubmit={handleSubmit}><div className={styles.body}><div className={styles.field}><label htmlFor="new-workspace-name">Workspace name</label><input id="new-workspace-name" value={name} onChange={event=>handleNameChange(event.target.value)} maxLength={100} required placeholder="Acme Studio"/></div><div className={styles.field}><label htmlFor="new-workspace-slug">Identifier</label><input id="new-workspace-slug" required maxLength={60} value={slug} onChange={event=>{setHasEditedSlug(true);setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g,""));}} placeholder="acme-studio"/><p>A short name to identify this workspace.</p></div><details className={styles.details}><summary>Workspace options</summary><div className={styles.detailContent}><fieldset className={styles.fieldset}><legend>Accent color</legend><div className={styles.tonePicker}>{TONES.map(tone=><button key={tone.id} type="button" aria-pressed={avatarTone===tone.id} onClick={()=>setAvatarTone(tone.id)}><span className={tone.bg}/>{tone.label}</button>)}</div></fieldset><fieldset className={styles.fieldset}><legend>Workspace type</legend><div className={styles.environmentGrid}>{["Free Tier","Team Workspace"].map(value=><button key={value} type="button" aria-pressed={plan===value} onClick={()=>setPlan(value)} className={plan===value?styles.selectedEnvironment:styles.environment}><span>{value==="Free Tier"?"Personal project":"Client or team"}</span></button>)}</div></fieldset></div></details></div><footer className={styles.footer}><button type="button" className={styles.secondaryButton} onClick={onClose} disabled={isSubmitting}>Cancel</button><button type="submit" className={styles.primaryButton} disabled={isSubmitting||!name.trim()}>{isSubmitting?"Creating...":"Create workspace"}</button></footer></form></div></DialogLayer>;
}

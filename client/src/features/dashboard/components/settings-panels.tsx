"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Activity, ArrowUpRight, Check, FlaskConical, Plus, ShieldCheck } from "lucide-react";
import Link from "@/shared/components/app-link";
import { useDashboard } from "../context/dashboard-context";
import { useAppStore } from "@/shared/store/use-app-store";
import { apiFetch } from "@/shared/lib/api-client";
import type { WorkspaceEnvironment } from "@/shared/types";
import styles from "./settings.module.css";

function Panel({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return <section className={styles.panel}><header className={styles.panelHeader}><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</header>{children}</section>;
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return <div className={styles.field}><label htmlFor={id}>{label}</label>{children}{hint && <p id={id + "-hint"}>{hint}</p>}</div>;
}

function Actions({ children, description }: { children: ReactNode; description?: string }) {
  return <footer className={styles.actions}>{description && <p>{description}</p>}<div>{children}</div></footer>;
}

export function GeneralSettings() {
  const { workspace, organizations, activeDashboardId, updateWorkspace, switchOrganization, setIsCreateOrgOpen, addToast } = useDashboard(["workspace", "organizations", "activeDashboardId", "updateWorkspace", "setIsCreateOrgOpen", "addToast"]);
  const { getToken } = useAuth();
  const { user } = useUser();
  const [name, setName] = useState(workspace.name);
  const [email, setEmail] = useState(workspace.ownerEmail || "");
  const [saving, setSaving] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    const changes = { name: name.trim(), ownerEmail: email.trim() };
    try {
      const token = await getToken();
      const endpoint = activeDashboardId ? "/api/dashboards/" + activeDashboardId : user?.id ? "/api/onboarding/" + user.id : null;
      if (!endpoint) throw new Error("Please sign in again to save your workspace.");
      await apiFetch(endpoint, { method: "PATCH", token, body: JSON.stringify(changes) });
      const current = useAppStore.getState();
      if (current.activeDashboardId !== activeDashboardId) return;
      updateWorkspace(changes);
      current.setOrganizations(current.organizations.map(org => org.id === activeDashboardId ? { ...org, ...changes } : org));
      addToast("Workspace updated", "Your changes have been saved.");
    } catch (error) { addToast("Changes were not saved", error instanceof Error ? error.message : "Please try again.", "error"); }
    finally { setSaving(false); }
  }

  return <>
    <Panel title="Workspace details" description="The name and contact information for this workspace.">
      <form onSubmit={save}>
        <div className={styles.fields}>
          <div className={styles.fieldGrid}>
            <Field id="settings-name" label="Workspace name"><input id="settings-name" required maxLength={100} value={name} onChange={event => setName(event.target.value)} /></Field>
            <Field id="settings-email" label="Contact email"><input id="settings-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} /></Field>
          </div>
          <Field id="settings-slug" label="Workspace identifier" hint="This identifier is set when the workspace is created."><input id="settings-slug" readOnly value={workspace.slug} aria-describedby="settings-slug-hint" className={styles.readOnly} /></Field>
        </div>
        <Actions><button className={styles.primaryButton} type="submit" disabled={saving || !name.trim()}>{saving ? "Saving..." : "Save changes"}</button></Actions>
      </form>
    </Panel>
    <Panel title="Your workspaces" description="Keep each client or project in its own workspace." action={<button className={styles.secondaryButton} type="button" onClick={() => setIsCreateOrgOpen(true)}><Plus size={15} />New workspace</button>}>
      <ul className={styles.workspaceList}>
        {(organizations.length ? organizations : [{ id: activeDashboardId || "current", name: workspace.name, slug: workspace.slug }]).map(org => {
          const active = org.id === activeDashboardId || org.slug === workspace.slug;
          return <li key={org.id}><span className={styles.workspaceAvatar}>{org.name.charAt(0).toUpperCase()}</span><div className={styles.workspaceIdentity}><strong title={org.name}>{org.name}</strong><span>/{org.slug}</span></div>{active ? <span className={styles.current}><Check size={13} />Current</span> : <button type="button" className={styles.secondaryButton} disabled={switching !== null} onClick={async () => { setSwitching(org.id); try { await switchOrganization(org.id); } catch { addToast("Could not switch workspace", "Please try again.", "error"); } finally { setSwitching(null); } }}>{switching === org.id ? "Switching..." : "Switch"}</button>}</li>;
        })}
      </ul>
    </Panel>
    <Link href="/dashboard/forms?tab=key" className={styles.relatedLink}><div><strong>API keys and form endpoints</strong><span>Manage your integrations in Forms & APIs.</span></div><ArrowUpRight size={17} /></Link>
  </>;
}

export function EnvironmentSettings() {
  const { workspace, currentEnvironment, switchEnvironment, updateProductionOriginAsync, addToast } = useDashboard(["workspace", "currentEnvironment", "addToast"]);
  const [origin, setOrigin] = useState(workspace.productionOrigin || "");
  const [previousOrigin, setPreviousOrigin] = useState(workspace.productionOrigin);
  if (previousOrigin !== workspace.productionOrigin) { setPreviousOrigin(workspace.productionOrigin); setOrigin(workspace.productionOrigin || ""); }
  const [saving, setSaving] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [testUrl, setTestUrl] = useState("");
  const [result, setResult] = useState<{ allowed: boolean; message: string } | null>(null);

  async function selectEnvironment(value: WorkspaceEnvironment) {
    if (switching || value === currentEnvironment) return;
    setSwitching(true);
    try { await switchEnvironment(value); }
    catch { addToast("Could not switch environment", "Please try again.", "error"); }
    finally { setSwitching(false); }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    let value = origin.trim();
    if (value && !/^https?:\/\//i.test(value)) value = (/^localhost(?::|$)/i.test(value) ? "http://" : "https://") + value;
    if (value) {
      try { const parsed = new URL(value); if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error(); value = parsed.origin; }
      catch { addToast("Check your website URL", "Enter a valid HTTP or HTTPS origin.", "error"); return; }
    }
    setSaving(true);
    try { await updateProductionOriginAsync(value); setOrigin(value); }
    catch (error) { addToast("Origin was not saved", error instanceof Error ? error.message : "Please try again.", "error"); }
    finally { setSaving(false); }
  }

  function testOrigin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const request = new URL(/^https?:\/\//i.test(testUrl) ? testUrl : "https://" + testUrl);
      if (!["http:", "https:"].includes(request.protocol) || request.username || request.password) throw new Error();
      const saved = workspace.productionOrigin?.trim().toLowerCase();
      if (currentEnvironment === "development") { setResult({ allowed: true, message: "Allowed by the development workspace. Your form may have additional domain rules." }); return; }
      if (!saved) { setResult({ allowed: false, message: "Save a production origin before accepting live submissions." }); return; }
      const host = new URL(saved.startsWith("http") ? saved : "https://" + saved.replace(/^\*\./, "")).hostname;
      const allowed = saved === "*" || (/^https?:\/\//.test(saved) ? request.origin.toLowerCase() === new URL(saved).origin.toLowerCase() : request.hostname === host || request.hostname.endsWith("." + host));
      setResult({ allowed, message: allowed ? "This website matches your saved workspace origin." : "This website does not match. Check the scheme, domain, and port." });
    } catch { setResult({ allowed: false, message: "Enter a valid HTTP or HTTPS website URL." }); }
  }

  return <>
    <Panel title="Environment" description="Keep test submissions separate from your live leads.">
      <div className={styles.environmentChoices} role="group" aria-label="Workspace environment">
        {([{ id: "development", title: "Development", description: "Test forms locally or on a preview site.", icon: FlaskConical }, { id: "production", title: "Production", description: "Accept live submissions from your website.", icon: ShieldCheck }] as const).map(option => {
          const Icon = option.icon;
          return <button key={option.id} type="button" className={[styles.environmentChoice, currentEnvironment === option.id ? styles.selectedChoice : ""].join(" ")} aria-pressed={currentEnvironment === option.id} disabled={switching} onClick={() => void selectEnvironment(option.id)}><span><Icon size={17} /><strong>{option.title}</strong>{currentEnvironment === option.id && <Check size={15} />}</span><p>{option.description}</p></button>;
        })}
      </div>
    </Panel>
    <Panel title="Production origin" description="The website allowed to send your live form submissions." action={<span className={workspace.productionOrigin ? styles.current : styles.mutedBadge}>{workspace.productionOrigin ? "Configured" : "Not configured"}</span>}>
      <form onSubmit={save}>
        <div className={styles.fields}><Field id="production-origin" label="Website origin" hint="Use the full origin, including https://. For example, https://example.com."><input id="production-origin" type="text" inputMode="url" autoCapitalize="none" spellCheck={false} autoComplete="url" placeholder="https://example.com" value={origin} onChange={event => setOrigin(event.target.value)} aria-describedby="production-origin-hint" /></Field>{!workspace.productionOrigin && currentEnvironment === "production" && <p className={styles.notice}>Add your website origin to start accepting production submissions.</p>}</div>
        <Actions description="Applies to production submissions in this workspace."><button className={styles.primaryButton} type="submit" disabled={saving}>{saving ? "Saving..." : "Save origin"}</button></Actions>
      </form>
    </Panel>
    <details className={styles.details}><summary>Check a website origin</summary><div><p>Preview your saved workspace rule before testing a form.</p><form onSubmit={testOrigin} className={styles.inlineForm}><Field id="origin-check" label="Website to check"><input id="origin-check" type="text" inputMode="url" placeholder="https://example.com" value={testUrl} onChange={event => { setTestUrl(event.target.value); setResult(null); }} required /></Field><button className={styles.secondaryButton} type="submit">Check origin</button></form>{result && <p role="status" className={result.allowed ? styles.successMessage : styles.notice}>{result.message}</p>}</div></details>
  </>;
}

function ComingSoonPanel({ title, description }: { title: string; description: string }) {
  return <Panel title={title} action={<span className={styles.mutedBadge}>Coming soon</span>}>
    <div className={styles.emptyState}><Activity size={25} /><h3>Not available yet</h3><p>{description}</p></div>
  </Panel>;
}

export function NotificationSettingsPanel() {
  return <ComingSoonPanel title="Email notifications" description="Email alerts and daily summaries will be available when email delivery is connected." />;
}

export function WebhookSettingsPanel() {
  return <ComingSoonPanel title="Webhook endpoint" description="Webhook configuration will be available when event delivery is connected." />;
}

export function DeliveryLogsPanel() {
  return <ComingSoonPanel title="Delivery history" description="Delivery logs will be available when email and webhook delivery are connected." />;
}

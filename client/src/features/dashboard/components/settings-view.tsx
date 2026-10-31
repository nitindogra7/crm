"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useDashboard } from "../context/dashboard-context";
import { SettingsSkeleton } from "./dashboard-skeleton";
import {
  Key,
  Bell,
  Webhook,
  Activity,
  User,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Plus,
  Check,
  Loader2,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";

type SettingsTab = "general" | "notifications" | "webhooks" | "logs";

export function SettingsView() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const {
    workspace,
    updateWorkspace,
    organizations,
    activeDashboardId,
    switchOrganization,
    setIsCreateOrgOpen,
    isLoading,
    webhook,
    updateWebhook,
    notifications,
    updateNotifications,
    deliveryLogs,
    addToast,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [switchingOrgId, setSwitchingOrgId] = useState<string | null>(null);

  // General tab state
  const [customWsName, setCustomWsName] = useState<string | null>(null);
  const [customWsOwner, setCustomWsOwner] = useState<string | null>(null);
  const wsName = customWsName !== null ? customWsName : workspace.name;
  const wsOwner = customWsOwner !== null ? customWsOwner : workspace.ownerEmail;
  const setWsName = (val: string) => setCustomWsName(val);
  const setWsOwner = (val: string) => setCustomWsOwner(val);

  // Webhook state
  const [webhookUrl, setWebhookUrl] = useState(webhook.url);

  // Notifications state
  const [alertEmail, setAlertEmail] = useState(notifications.alertEmail);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingProfile) return;
    setIsSavingProfile(true);

    const updatedName = wsName.trim() || workspace.name;
    const updatedOwner = wsOwner.trim() || workspace.ownerEmail;

    updateWorkspace({
      name: updatedName,
      ownerEmail: updatedOwner,
    });

    if (user?.id) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      try {
        const token = await getToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const syncTasks = [
          fetch(`${apiUrl}/api/onboarding/${user.id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({
              name: updatedName,
              ownerEmail: updatedOwner,
            }),
          }),
        ];

        if (activeDashboardId) {
          syncTasks.push(
            fetch(`${apiUrl}/api/forms-and-api/dashboards/${activeDashboardId}`, {
              method: "PATCH",
              headers,
              body: JSON.stringify({
                name: updatedName,
                ownerEmail: updatedOwner,
              }),
            })
          );
        }

        await Promise.all(syncTasks);
      } catch (err) {
        console.warn("Could not sync workspace update to backend database:", err);
      }
    }

    setCustomWsName(null);
    setCustomWsOwner(null);

    addToast("Settings saved", "Workspace profile successfully updated.");
    setIsSavingProfile(false);
  };

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebhook({ url: webhookUrl.trim() });
    addToast("Webhook Saved", "Payload destination updated.");
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotifications({ alertEmail: alertEmail.trim() });
    addToast("Alert Preferences Saved", "Notification email updated.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-slate-900">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">
          Configure personal workspace credentials, mock API tokens, email alerts, and webhook pipelines.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "general"
              ? "bg-white text-slate-900 border border-slate-200 font-semibold shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>General</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "notifications"
              ? "bg-white text-slate-900 border border-slate-200 font-semibold shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("webhooks")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "webhooks"
              ? "bg-white text-slate-900 border border-slate-200 font-semibold shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
          }`}
        >
          <Webhook className="w-3.5 h-3.5" />
          <span>Webhooks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "logs"
              ? "bg-white text-slate-900 border border-slate-200 font-semibold shadow-2xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Delivery Logs</span>
        </button>
      </div>

      {/* TAB 1: GENERAL */}
      {activeTab === "general" && (
        <div className="space-y-6 max-w-2xl">
          <form
            onSubmit={handleSaveGeneral}
            className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs"
          >
            <h2 className="text-base font-heading font-bold text-slate-900">
              Workspace Profile
            </h2>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                value={wsName}
                onChange={(e) => setWsName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 transition-all font-sans"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Display name shown in sidebar and endpoint breadcrumbs.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1.5">
                Workspace Slug
              </label>
              <input
                type="text"
                disabled
                value={workspace.slug}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Used in API endpoints: https://api.infraly.com/api/f/{workspace.slug}
              </p>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1.5">
                Owner Account Email
              </label>
              <input
                type="email"
                value={wsOwner}
                onChange={(e) => setWsOwner(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 transition-all font-sans"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
              >
                {isSavingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isSavingProfile ? "Saving Profile..." : "Save Workspace Profile"}</span>
              </button>
            </div>
          </form>

          {/* Organizations & Dashboards Multi-Tenancy Table */}
          <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-heading font-bold text-slate-900">
                  Organizations & Dashboards
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage multiple client or team workspaces under your account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOrgOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Organization</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/50">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] font-semibold bg-slate-100/70">
                    <th className="py-2.5 px-3.5 font-semibold">Organization</th>
                    <th className="py-2.5 px-3.5 font-semibold hidden sm:table-cell">Slug</th>
                    <th className="py-2.5 px-3.5 font-semibold">Plan</th>
                    <th className="py-2.5 px-3.5 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {organizations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 px-3.5 text-slate-600 font-medium">
                        {workspace.name} (Current Workspace)
                      </td>
                    </tr>
                  ) : (
                    organizations.map((org) => {
                      const isActive =
                        org.id === activeDashboardId || org.slug === workspace.slug;
                      return (
                        <tr key={org.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-md bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] font-bold grid place-items-center flex-none">
                                {(org.name.charAt(0) || "O").toUpperCase()}
                              </span>
                              <span className="font-semibold text-slate-900">{org.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3.5 hidden sm:table-cell font-mono text-slate-500">
                            /{org.slug}
                          </td>
                          <td className="py-3 px-3.5 text-slate-600">
                            {org.plan}
                          </td>
                          <td className="py-3 px-3.5 text-right">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-semibold">
                                <Check className="w-3 h-3" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={switchingOrgId === org.id}
                                onClick={async () => {
                                  if (switchingOrgId) return;
                                  setSwitchingOrgId(org.id);
                                  try {
                                    await switchOrganization(org.id);
                                  } finally {
                                    setSwitchingOrgId(null);
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer text-[11px] disabled:opacity-50 shadow-2xs"
                              >
                                {switchingOrgId === org.id && (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                )}
                                <span>{switchingOrgId === org.id ? "Switching..." : "Switch"}</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* API Keys Relocation Banner */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center flex-none">
                <Key className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-slate-900">API Keys & Endpoints</h4>
                <p className="text-[11.5px] text-slate-500">
                  Generate scoped API keys and inspect developer endpoints directly in Forms & APIs.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/forms"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer shadow-2xs"
            >
              <span>Open Forms & APIs</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 2: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 text-xs text-blue-900 leading-relaxed">
            <span className="text-blue-950 font-semibold block mb-0.5">
              Simulation Notice:
            </span>
            Email notification settings simulate local alert toggles. No real emails will be delivered to mailboxes.
          </div>

          <form
            onSubmit={handleSaveNotifications}
            className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs"
          >
            <h3 className="text-base font-heading font-bold text-slate-900">
              Email Alert Preferences
            </h3>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1.5">
                Alert Email Recipient
              </label>
              <input
                type="email"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 font-sans transition-all"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Instant Inbound Notifications
                  </span>
                  <span className="text-[11.5px] text-slate-500">
                    Send an alert whenever a new verified lead is captured.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailAlertsEnabled}
                  onChange={(e) =>
                    updateNotifications({ emailAlertsEnabled: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Daily Lead Digest
                  </span>
                  <span className="text-[11.5px] text-slate-500">
                    Receive a 9 AM summary of submissions received yesterday.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.dailyDigest}
                  onChange={(e) => updateNotifications({ dailyDigest: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-colors cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Spam Quarantine Alerts
                  </span>
                  <span className="text-[11.5px] text-slate-500">
                    Notify when honeypot or disposable email filters flag a submission.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.spamAlerts}
                  onChange={(e) => updateNotifications({ spamAlerts: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20 cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: WEBHOOKS */}
      {activeTab === "webhooks" && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 text-xs text-blue-900 leading-relaxed">
            <span className="text-blue-950 font-semibold block mb-0.5">
              Simulation Notice:
            </span>
            Webhook endpoints are stored in local state for UI demonstration. Live HTTP POST dispatches are simulated in the Delivery Logs tab.
          </div>

          <form
            onSubmit={handleSaveWebhook}
            className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-white space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-bold text-slate-900">Webhook Configuration</h3>
              <button
                type="button"
                onClick={() => updateWebhook({ enabled: !webhook.enabled })}
                className={`px-2.5 py-1 rounded-full text-xs font-mono border transition-colors cursor-pointer ${
                  webhook.enabled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-semibold"
                    : "bg-slate-100 text-slate-600 border-slate-200 font-medium"
                }`}
              >
                {webhook.enabled ? "Webhook Active" : "Webhook Disabled"}
              </button>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1.5">
                Payload Destination URL
              </label>
              <input
                type="url"
                required
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.yourdomain.com/webhooks/infraly"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1.5">
                Signing Secret Token
              </label>
              <input
                type="text"
                disabled
                value={webhook.secret}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Used to verify signature header <code className="text-slate-600 font-semibold">infraly-signature</code>
              </p>
            </div>

            {/* Events */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-700 block">Subscribed Events</span>
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={webhook.events.leadCreated}
                  onChange={(e) =>
                    updateWebhook({
                      events: { ...webhook.events, leadCreated: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20 cursor-pointer"
                />
                <span>lead.created (When a verified inquiry is received)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={webhook.events.spamQuarantined}
                  onChange={(e) =>
                    updateWebhook({
                      events: { ...webhook.events, spamQuarantined: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500/20 cursor-pointer"
                />
                <span>spam.quarantined (When honeypot or spam filter intercepts a payload)</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
              >
                Save Webhook
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: DELIVERY LOGS */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-500 shadow-2xs">
            Recorded audit trail of outbound email and webhook events simulated for your workspace.
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider bg-slate-50/70">
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Channel</th>
                    <th className="py-3 px-4 font-semibold">Event</th>
                    <th className="py-3 px-4 font-semibold">Destination</th>
                    <th className="py-3 px-4 font-semibold text-right">Latency</th>
                    <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deliveryLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                        No delivery logs recorded yet. Outbound webhook and email dispatch events will appear here.
                      </td>
                    </tr>
                  ) : (
                    deliveryLogs.map((log) => {
                      const isOk = log.status === "success";
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-mono border font-semibold ${
                                isOk
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                  : "bg-rose-50 text-rose-700 border-rose-200/80"
                              }`}
                            >
                              {isOk ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <XCircle className="w-3 h-3 text-rose-600" />
                              )}
                              <span>{log.statusCode || "ERR"}</span>
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono text-[11px] text-slate-800 font-semibold capitalize">
                            {log.type}
                          </td>

                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                            {log.event}
                          </td>

                          <td className="py-3 px-4 font-mono text-[11px] text-slate-600 max-w-[200px] truncate" title={log.destination}>
                            {log.destination}
                            {log.errorDetail && (
                              <span className="block text-[10px] text-rose-600 font-sans mt-0.5">
                                {log.errorDetail}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500 tabular-nums">
                            {log.latencyMs}ms
                          </td>

                          <td
                            suppressHydrationWarning
                            className="py-3 px-4 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap"
                          >
                            <FormattedDate date={log.timestamp} format="time" />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

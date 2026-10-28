"use client";

import React, { useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useDashboard } from "../context/dashboard-context";
import {
  Key,
  Bell,
  Webhook,
  Activity,
  User,
  Plus,
  Copy,
  Check,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { FormattedDate } from "./formatted-date";

type SettingsTab = "general" | "keys" | "notifications" | "webhooks" | "logs";

export function SettingsView() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const {
    workspace,
    updateWorkspace,
    apiKeys,
    createApiKey,
    revokeApiKey,
    webhook,
    updateWebhook,
    notifications,
    updateNotifications,
    deliveryLogs,
    resetDemoData,
    addToast,
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  // General tab state
  const [prevWorkspaceName, setPrevWorkspaceName] = useState(workspace.name);
  const [wsName, setWsName] = useState(workspace.name);
  const [wsOwner, setWsOwner] = useState(workspace.ownerEmail);

  if (workspace.name !== prevWorkspaceName) {
    setPrevWorkspaceName(workspace.name);
    setWsName(workspace.name);
    setWsOwner(workspace.ownerEmail);
  }

  // New API key state
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Webhook state
  const [webhookUrl, setWebhookUrl] = useState(webhook.url);

  // Notifications state
  const [alertEmail, setAlertEmail] = useState(notifications.alertEmail);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
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

        await fetch(`${apiUrl}/api/onboarding/${user.id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            name: updatedName,
            ownerEmail: updatedOwner,
          }),
        });
      } catch (err) {
        console.warn("Could not sync workspace update to backend database:", err);
      }
    }

    addToast("Settings saved", "Workspace profile successfully updated.");
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    createApiKey(newKeyName.trim() || "New API Key");
    setNewKeyName("");
    setIsCreatingKey(false);
  };

  const handleCopyKey = (keyId: string, fullKey: string) => {
    navigator.clipboard.writeText(fullKey);
    setCopiedKeyId(keyId);
    addToast("Key copied", "Mock API key copied to clipboard.");
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebhook({ url: webhookUrl.trim() });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotifications({ alertEmail: alertEmail.trim() });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-medium tracking-tight text-white">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Configure personal workspace credentials, mock API tokens, email alerts, and webhook pipelines.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-medium cursor-pointer whitespace-nowrap ${
            activeTab === "general"
              ? "bg-white/[0.08] text-white border border-white/[0.12]"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>General</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("keys")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-medium cursor-pointer whitespace-nowrap ${
            activeTab === "keys"
              ? "bg-white/[0.08] text-white border border-white/[0.12]"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>API Keys</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-medium cursor-pointer whitespace-nowrap ${
            activeTab === "notifications"
              ? "bg-white/[0.08] text-white border border-white/[0.12]"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("webhooks")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-medium cursor-pointer whitespace-nowrap ${
            activeTab === "webhooks"
              ? "bg-white/[0.08] text-white border border-white/[0.12]"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          <Webhook className="w-3.5 h-3.5" />
          <span>Webhooks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-medium cursor-pointer whitespace-nowrap ${
            activeTab === "logs"
              ? "bg-white/[0.08] text-white border border-white/[0.12]"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
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
            className="p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-4"
          >
            <h2 className="text-sm font-medium font-heading text-white">
              Workspace Profile
            </h2>

            <div>
              <label className="block text-zinc-300 text-xs font-medium mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                value={wsName}
                onChange={(e) => setWsName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/40"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Display name shown in sidebar and endpoint breadcrumbs.
              </p>
            </div>

            <div>
              <label className="block text-zinc-300 text-xs font-medium mb-1.5">
                Workspace Slug
              </label>
              <input
                type="text"
                disabled
                value={workspace.slug}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/50 border border-white/[0.06] text-xs text-zinc-500 font-mono"
              />
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                Used in API endpoints: https://api.salenova.com/v1/f/{workspace.slug}
              </p>
            </div>

            <div>
              <label className="block text-zinc-300 text-xs font-medium mb-1.5">
                Owner Account Email
              </label>
              <input
                type="email"
                value={wsOwner}
                onChange={(e) => setWsOwner(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Save Workspace Profile
              </button>
            </div>
          </form>

          {/* Reset Demo Data Danger Zone */}
          <div className="p-5 sm:p-6 rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] space-y-3">
            <div className="flex items-center gap-2 text-rose-400">
              <RotateCcw className="w-4 h-4" />
              <h3 className="text-sm font-medium font-heading">Reset Demo Data</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Restore the initial sample dataset (Portfolio Contact, Travzo Waitlist, and Demo Request forms with pre-seeded leads, spam, and delivery logs).
            </p>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset all local workspace demo state back to default?")) {
                  resetDemoData();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: API KEYS */}
      {activeTab === "keys" && (
        <div className="space-y-4 max-w-3xl">
          {/* Simulation disclaimer */}
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs text-zinc-400 leading-relaxed">
            <span className="text-zinc-200 font-medium block mb-0.5">
              Local Development Simulation Notice:
            </span>
            All API keys shown here are nonfunctional mock tokens for UI testing and prototyping. They do not grant network access to external databases.
          </div>

          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium font-heading text-white">Active Scoped API Keys</h3>
                <p className="text-[11.5px] text-zinc-400 mt-0.5">
                  Send these via the <code className="text-zinc-300">x-api-key</code> request header.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingKey(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Key</span>
              </button>
            </div>

            {/* Inline Key Creation Form */}
            {isCreatingKey && (
              <form
                onSubmit={handleCreateKey}
                className="p-3.5 rounded-xl border border-white/[0.1] bg-zinc-900 space-y-3 animate-in fade-in duration-150"
              >
                <label className="block text-xs font-medium text-zinc-300">
                  Key Description / Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Next.js Marketing Site Live"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#141414] border border-white/[0.1] text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCreatingKey(false)}
                    className="px-3 py-1.5 rounded-lg border border-white/[0.1] text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:bg-zinc-200"
                  >
                    Generate
                  </button>
                </div>
              </form>
            )}

            {/* Keys Table */}
            <div className="rounded-xl border border-white/[0.08] bg-[#121212] overflow-hidden divide-y divide-white/[0.05] text-xs">
              {apiKeys.map((key) => {
                const isCopied = copiedKeyId === key.id;
                return (
                  <div
                    key={key.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-zinc-200 truncate">{key.name}</span>
                        {key.revoked && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20">
                            Revoked
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-1 font-mono">
                        <span>{key.keyPrefix}</span>
                        <span>·</span>
                        <span suppressHydrationWarning>Created <FormattedDate date={key.createdAt} format="date" /></span>
                        <span>·</span>
                        <span>Last used {key.lastUsedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-none">
                      {!key.revoked && (
                        <button
                          type="button"
                          onClick={() => handleCopyKey(key.id, key.fullKeyMock)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] text-zinc-300 text-[11px] transition-colors"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Key</span>
                            </>
                          )}
                        </button>
                      )}

                      {!key.revoked ? (
                        <button
                          type="button"
                          onClick={() => revokeApiKey(key.id)}
                          className="px-2.5 py-1 rounded-lg border border-white/[0.08] text-rose-400 hover:bg-rose-500/10 text-[11px] transition-colors"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-zinc-600 text-[11px] italic font-mono">
                          Non-functional
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs text-zinc-400 leading-relaxed">
            <span className="text-zinc-200 font-medium block mb-0.5">
              Simulation Notice:
            </span>
            Email notification settings simulate local alert toggles. No real emails will be delivered to mailboxes.
          </div>

          <form
            onSubmit={handleSaveNotifications}
            className="p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-4"
          >
            <h3 className="text-sm font-medium font-heading text-white">
              Email Alert Preferences
            </h3>

            <div>
              <label className="block text-zinc-300 text-xs font-medium mb-1.5">
                Alert Email Recipient
              </label>
              <input
                type="email"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/40 font-sans"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-[#121212] cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-white block">
                    Instant Inbound Notifications
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Send an alert whenever a new verified lead is captured.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailAlertsEnabled}
                  onChange={(e) =>
                    updateNotifications({ emailAlertsEnabled: e.target.checked })
                  }
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-[#121212] cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-white block">
                    Daily Lead Digest
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Receive a 9 AM summary of submissions received yesterday.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.dailyDigest}
                  onChange={(e) => updateNotifications({ dailyDigest: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-[#121212] cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-white block">
                    Spam Quarantine Alerts
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Notify when honeypot or disposable email filters flag a submission.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.spamAlerts}
                  onChange={(e) => updateNotifications({ spamAlerts: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: WEBHOOKS */}
      {activeTab === "webhooks" && (
        <div className="space-y-4 max-w-2xl">
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs text-zinc-400 leading-relaxed">
            <span className="text-zinc-200 font-medium block mb-0.5">
              Simulation Notice:
            </span>
            Webhook endpoints are stored in local state for UI demonstration. Live HTTP POST dispatches are simulated in the Delivery Logs tab.
          </div>

          <form
            onSubmit={handleSaveWebhook}
            className="p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-[#181818]/90 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium font-heading text-white">Webhook Configuration</h3>
              <button
                type="button"
                onClick={() => updateWebhook({ enabled: !webhook.enabled })}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                  webhook.enabled
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                {webhook.enabled ? "Webhook Active" : "Webhook Disabled"}
              </button>
            </div>

            <div>
              <label className="block text-zinc-300 text-xs font-medium mb-1.5">
                Payload Destination URL
              </label>
              <input
                type="url"
                required
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.yourdomain.com/webhooks/salenova"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-white/40 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-300 text-xs font-medium mb-1.5">
                Signing Secret Token
              </label>
              <input
                type="text"
                disabled
                value={webhook.secret}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900/50 border border-white/[0.06] text-xs text-zinc-500 font-mono"
              />
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                Used to verify signature header <code className="text-zinc-400">salenova-signature</code>
              </p>
            </div>

            {/* Events */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-medium text-zinc-300 block">Subscribed Events</span>
              <label className="flex items-center gap-2.5 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={webhook.events.leadCreated}
                  onChange={(e) =>
                    updateWebhook({
                      events: { ...webhook.events, leadCreated: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <span>lead.created (When a verified inquiry is received)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={webhook.events.spamQuarantined}
                  onChange={(e) =>
                    updateWebhook({
                      events: { ...webhook.events, spamQuarantined: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <span>spam.quarantined (When honeypot or spam filter intercepts a payload)</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white text-black font-medium text-xs hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Save Webhook
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: DELIVERY LOGS */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-xs text-zinc-400">
            Recorded audit trail of outbound email and webhook events simulated for your workspace.
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#181818]/90 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-zinc-500 font-mono text-[10.5px] uppercase tracking-wider bg-white/[0.01]">
                    <th className="py-3 px-4 font-normal">Status</th>
                    <th className="py-3 px-4 font-normal">Channel</th>
                    <th className="py-3 px-4 font-normal">Event</th>
                    <th className="py-3 px-4 font-normal">Destination</th>
                    <th className="py-3 px-4 font-normal text-right">Latency</th>
                    <th className="py-3 px-4 font-normal text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {deliveryLogs.map((log) => {
                    const isOk = log.status === "success";
                    return (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono border ${
                              isOk
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}
                          >
                            {isOk ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            <span>{log.statusCode || "ERR"}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-zinc-300 capitalize">
                          {log.type}
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                          {log.event}
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 max-w-[200px] truncate" title={log.destination}>
                          {log.destination}
                          {log.errorDetail && (
                            <span className="block text-[10px] text-rose-400 font-sans mt-0.5">
                              {log.errorDetail}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right font-mono text-[11px] text-zinc-400 tabular-nums">
                          {log.latencyMs}ms
                        </td>

                        <td
                          suppressHydrationWarning
                          className="py-3 px-4 text-right font-mono text-[11px] text-zinc-400 whitespace-nowrap"
                        >
                          <FormattedDate date={log.timestamp} format="time" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

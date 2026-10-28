"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { useAppStore, useStats } from "@/shared/store";
import { apiFetch } from "@/shared/lib/api-client";
import type {
  FormItem,
  ApiKeyItem,
  LeadItem,
  SpamItem,
  OrganizationDashboard,
  LeadStatus,
} from "@/shared/types";
import { CreateOrganizationModal } from "../components/create-organization-modal";

interface DashboardContextType {
  // Direct access to state & store
  organizations: OrganizationDashboard[];
  activeDashboardId: string | null;
  isLoading: boolean;
  isCreateOrgOpen: boolean;
  setIsCreateOrgOpen: (open: boolean) => void;

  // Multi-organization operations
  switchOrganization: (id: string) => Promise<void>;
  createOrganizationAsync: (input: {
    name: string;
    slug: string;
    avatarTone?: string;
    plan?: string;
  }) => Promise<OrganizationDashboard>;

  // Form operations
  createFormAsync: (input: {
    name: string;
    redirectUrl?: string;
    fields?: FormItem["fields"];
  }) => Promise<FormItem>;
  updateFormAsync: (id: string, updates: Partial<FormItem>) => Promise<void>;
  toggleFormEnabledAsync: (id: string) => Promise<void>;
  deleteFormAsync: (id: string) => Promise<void>;

  // API Key operations
  createApiKeyAsync: (name?: string, env?: "live" | "test") => Promise<ApiKeyItem>;
  regenerateApiKeyAsync: () => Promise<ApiKeyItem>;
  revokeApiKeyAsync: (id?: string) => Promise<void>;

  // Leads & Spam operations
  simulateLeadSubmissionAsync: (
    formId: string,
    payload: {
      name: string;
      email: string;
      message: string;
      source?: string;
      extraFields?: Record<string, string>;
    }
  ) => Promise<void>;
  updateLeadStatusAsync: (id: string, status: LeadStatus) => Promise<void>;
  rescueSpamLeadAsync: (spamId: string) => Promise<void>;
  refreshDashboardData: () => Promise<void>;
}

const Context = createContext<DashboardContextType | null>(null);

export interface DashboardProviderProps {
  children: React.ReactNode;
  initialWorkspace?: {
    name?: string;
    slug?: string;
    ownerEmail?: string | null;
    teamSize?: string;
    avatarTone?: string;
    createdAt?: string;
  } | null;
}

export function DashboardProvider({
  children,
  initialWorkspace,
}: DashboardProviderProps) {
  const { getToken } = useAuth();
  const store = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const isInitializedRef = useRef(false);

  // Sync initial workspace name if empty
  useEffect(() => {
    if (
      initialWorkspace &&
      initialWorkspace.name &&
      (!store.workspace ||
        store.workspace.name === "Acme Studio" ||
        store.workspace.name === "My Workspace")
    ) {
      store.initWorkspace({
        name: initialWorkspace.name,
        slug: initialWorkspace.slug || "",
        ownerEmail: initialWorkspace.ownerEmail || "",
        teamSize: initialWorkspace.teamSize === "solo" ? "solo" : "team",
        avatarTone: initialWorkspace.avatarTone || "zinc",
      });
    }
  }, [initialWorkspace, store]);

  // Load all user's organizations / dashboards from backend
  const loadDashboards = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await apiFetch<{
        success: boolean;
        data: OrganizationDashboard[];
      }>("/api/forms-and-api/dashboards", { token });

      if (res.success && res.data && res.data.length > 0) {
        store.setOrganizations(res.data);

        // Find active organization or pick first
        const currentActive =
          store.activeDashboardId &&
          res.data.find((d) => d.id === store.activeDashboardId);

        const targetOrg = currentActive || res.data[0];

        if (store.activeDashboardId !== targetOrg.id) {
          store.setActiveDashboardId(targetOrg.id);
        }

        store.updateWorkspace({
          id: targetOrg.id,
          name: targetOrg.name,
          slug: targetOrg.slug,
          ownerEmail: targetOrg.ownerEmail || "",
          plan: targetOrg.plan || "Free Tier",
          avatarTone: targetOrg.avatarTone || "zinc",
          createdAt: targetOrg.createdAt,
        });

        return targetOrg.id;
      }
    } catch (err) {
      console.warn("Could not fetch dashboards from backend:", err);
    }
    return null;
  }, [getToken, store]);

  // Load specific organization's forms, keys, leads, and spam
  const loadDashboardData = useCallback(
    async (dashboardId: string) => {
      try {
        const token = await getToken();

        const [formsRes, keysRes, leadsRes, spamRes] = await Promise.all([
          apiFetch<{ success: boolean; data: FormItem[] }>(
            `/api/forms-and-api/forms?dashboardId=${dashboardId}`,
            { token }
          ).catch(() => ({ success: false, data: [] })),

          apiFetch<{ success: boolean; data: ApiKeyItem[] }>(
            `/api/forms-and-api/keys?dashboardId=${dashboardId}`,
            { token }
          ).catch(() => ({ success: false, data: [] })),

          apiFetch<{ success: boolean; data: LeadItem[] }>(
            `/api/forms-and-api/leads?dashboardId=${dashboardId}`,
            { token }
          ).catch(() => ({ success: false, data: [] })),

          apiFetch<{ success: boolean; data: SpamItem[] }>(
            `/api/forms-and-api/spam?dashboardId=${dashboardId}`,
            { token }
          ).catch(() => ({ success: false, data: [] })),
        ]);

        if (formsRes.success && formsRes.data) {
          store.setForms(formsRes.data);
        }
        if (keysRes.success && keysRes.data) {
          store.setApiKeys(keysRes.data);
        }
        if (leadsRes.success && leadsRes.data) {
          store.setLeads(leadsRes.data);
        }
        if (spamRes.success && spamRes.data) {
          store.setSpam(spamRes.data);
        }
      } catch (err) {
        console.warn("Failed loading dashboard data:", err);
      }
    },
    [getToken, store]
  );

  // Initialize on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    async function init() {
      setIsLoading(true);
      const activeId = await loadDashboards();
      if (activeId) {
        await loadDashboardData(activeId);
      }
      setIsLoading(false);
    }

    init();
  }, [loadDashboards, loadDashboardData]);

  // Switch organization
  const switchOrganization = useCallback(
    async (id: string) => {
      const org = store.organizations.find((o) => o.id === id);
      if (!org) return;

      setIsLoading(true);
      store.setActiveDashboardId(id);
      store.updateWorkspace({
        id: org.id,
        name: org.name,
        slug: org.slug,
        ownerEmail: org.ownerEmail || "",
        plan: org.plan || "Free Tier",
        avatarTone: org.avatarTone || "zinc",
        createdAt: org.createdAt,
      });

      await loadDashboardData(id);
      setIsLoading(false);
      store.addToast("Workspace switched", `Now viewing ${org.name}.`);
    },
    [store, loadDashboardData]
  );

  // Create organization
  const createOrganizationAsync = useCallback(
    async (input: {
      name: string;
      slug: string;
      avatarTone?: string;
      plan?: string;
    }) => {
      const token = await getToken();
      const res = await apiFetch<{
        success: boolean;
        data: OrganizationDashboard;
      }>("/api/forms-and-api/dashboards", {
        method: "POST",
        token,
        body: JSON.stringify(input),
      });

      if (!res.success || !res.data) {
        throw new Error("Failed to create organization");
      }

      const newOrg = res.data;
      store.setOrganizations([...store.organizations, newOrg]);
      await switchOrganization(newOrg.id);
      return newOrg;
    },
    [getToken, store, switchOrganization]
  );

  // Form operations
  const createFormAsync = useCallback(
    async (input: {
      name: string;
      redirectUrl?: string;
      fields?: FormItem["fields"];
    }) => {
      const token = await getToken();
      const res = await apiFetch<{ success: boolean; data: FormItem }>(
        "/api/forms-and-api/forms",
        {
          method: "POST",
          token,
          body: JSON.stringify({
            ...input,
            dashboardId: store.activeDashboardId || undefined,
          }),
        }
      );

      if (!res.success || !res.data) {
        throw new Error("Failed to create form");
      }

      const form = res.data;
      store.setForms([
        form,
        ...store.forms.filter((f) => f.id !== form.id && !f.id.startsWith("form_")),
      ]);
      store.addToast("Form created", `Endpoint generated for ${form.name}.`);
      return form;
    },
    [getToken, store]
  );

  const updateFormAsync = useCallback(
    async (id: string, updates: Partial<FormItem>) => {
      store.updateForm(id, updates);
      try {
        const token = await getToken();
        await apiFetch(`/api/forms-and-api/forms/${id}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(updates),
        });
      } catch (err) {
        console.warn("Could not sync form update to backend:", err);
      }
    },
    [getToken, store]
  );

  const toggleFormEnabledAsync = useCallback(
    async (id: string) => {
      const target = store.forms.find((f) => f.id === id);
      if (!target) return;
      const nextState = !target.enabled;
      store.toggleFormEnabled(id);

      try {
        const token = await getToken();
        await apiFetch(`/api/forms-and-api/forms/${id}`, {
          method: "PATCH",
          token,
          body: JSON.stringify({ enabled: nextState }),
        });
      } catch (err) {
        console.warn("Could not toggle form state on server:", err);
      }
    },
    [getToken, store]
  );

  const deleteFormAsync = useCallback(
    async (id: string) => {
      store.deleteForm(id);
      store.addToast("Form deleted", "Endpoint decommissioned.");
      try {
        const token = await getToken();
        await apiFetch(`/api/forms-and-api/forms/${id}`, {
          method: "DELETE",
          token,
        });
      } catch (err) {
        console.warn("Could not delete form on server:", err);
      }
    },
    [getToken, store]
  );

  // API Key operations
  const createApiKeyAsync = useCallback(
    async (name: string = "Live API Key", env: "live" | "test" = "live") => {
      const token = await getToken();
      const res = await apiFetch<{ success: boolean; data: ApiKeyItem }>(
        "/api/forms-and-api/keys",
        {
          method: "POST",
          token,
          body: JSON.stringify({
            dashboardId: store.activeDashboardId || undefined,
            name,
            env,
          }),
        }
      );

      if (!res.success || !res.data) {
        throw new Error("Failed to create API key");
      }

      const key = res.data;
      store.setApiKeys([
        key,
        ...store.apiKeys.filter((k) => k.id !== key.id && !k.id.startsWith("key_") && !k.revoked),
      ]);
      store.addToast("API Key created", "Ready to authenticate requests.");
      return key;
    },
    [getToken, store]
  );

  const regenerateApiKeyAsync = useCallback(async () => {
    const token = await getToken();
    const res = await apiFetch<{ success: boolean; data: ApiKeyItem }>(
      "/api/forms-and-api/keys/regenerate",
      {
        method: "POST",
        token,
        body: JSON.stringify({
          dashboardId: store.activeDashboardId || undefined,
        }),
      }
    );

    if (!res.success || !res.data) {
      throw new Error("Failed to regenerate API key");
    }

    const key = res.data;
    store.setApiKeys([key]);
    store.addToast(
      "API Key rotated",
      "Prior key has been permanently invalidated."
    );
    return key;
  }, [getToken, store]);

  const revokeApiKeyAsync = useCallback(
    async (id?: string) => {
      const keyId = id || store.apiKeys.find((k) => !k.revoked)?.id || store.apiKeys[0]?.id;
      if (!keyId) return;

      store.revokeApiKey(keyId);
      try {
        const token = await getToken();
        await apiFetch(`/api/forms-and-api/keys/${keyId}/revoke`, {
          method: "POST",
          token,
        });
        if (store.activeDashboardId) {
          loadDashboardData(store.activeDashboardId);
        }
      } catch (err) {
        console.warn("Could not revoke key on backend:", err);
      }
    },
    [getToken, store, loadDashboardData]
  );

  // Leads & Spam
  const simulateLeadSubmissionAsync = useCallback(
    async (
      formId: string,
      payload: {
        name: string;
        email: string;
        message: string;
        source?: string;
        extraFields?: Record<string, string>;
      }
    ) => {
      store.simulateLeadSubmission(formId, payload);
      try {
        const token = await getToken();
        await apiFetch("/api/forms-and-api/simulate", {
          method: "POST",
          token,
          body: JSON.stringify({
            formId,
            dashboardId: store.activeDashboardId || undefined,
            name: payload.name,
            email: payload.email,
            message: payload.message,
            source: payload.source || "Sandbox Simulator",
            extraFields: payload.extraFields,
          }),
        });

        // Refresh leads & form counts
        if (store.activeDashboardId) {
          loadDashboardData(store.activeDashboardId);
        }
      } catch (err) {
        console.warn("Simulation failed on server:", err);
      }
    },
    [getToken, store, loadDashboardData]
  );

  const updateLeadStatusAsync = useCallback(
    async (id: string, status: LeadStatus) => {
      store.updateLeadStatus(id, status);
      try {
        const token = await getToken();
        await apiFetch(`/api/forms-and-api/leads/${id}/status`, {
          method: "PATCH",
          token,
          body: JSON.stringify({ status }),
        });
      } catch (err) {
        console.warn("Failed updating lead status on backend:", err);
      }
    },
    [getToken, store]
  );

  const rescueSpamLeadAsync = useCallback(
    async (spamId: string) => {
      store.rescueSpamLead(spamId);
      try {
        const token = await getToken();
        await apiFetch(`/api/forms-and-api/spam/${spamId}/rescue`, {
          method: "POST",
          token,
        });
        if (store.activeDashboardId) {
          loadDashboardData(store.activeDashboardId);
        }
      } catch (err) {
        console.warn("Failed rescuing spam record:", err);
      }
    },
    [getToken, store, loadDashboardData]
  );

  const refreshDashboardData = useCallback(async () => {
    if (store.activeDashboardId) {
      await loadDashboardData(store.activeDashboardId);
    }
  }, [store.activeDashboardId, loadDashboardData]);

  const value: DashboardContextType = {
    organizations: store.organizations,
    activeDashboardId: store.activeDashboardId,
    isLoading,
    isCreateOrgOpen,
    setIsCreateOrgOpen,
    switchOrganization,
    createOrganizationAsync,
    createFormAsync,
    updateFormAsync,
    toggleFormEnabledAsync,
    deleteFormAsync,
    createApiKeyAsync,
    regenerateApiKeyAsync,
    revokeApiKeyAsync,
    simulateLeadSubmissionAsync,
    updateLeadStatusAsync,
    rescueSpamLeadAsync,
    refreshDashboardData,
  };

  return (
    <Context.Provider value={value}>
      {children}
      <CreateOrganizationModal
        isOpen={isCreateOrgOpen}
        onClose={() => setIsCreateOrgOpen(false)}
      />
    </Context.Provider>
  );
}

export function useDashboard() {
  const store = useAppStore();
  const stats = useStats();
  const context = useContext(Context);

  return {
    ...store,
    stats,
    ...(context || {
      organizations: store.organizations,
      activeDashboardId: store.activeDashboardId,
      isLoading: false,
      isCreateOrgOpen: false,
      setIsCreateOrgOpen: () => {},
      switchOrganization: async () => {},
      createOrganizationAsync: async () => ({} as OrganizationDashboard),
      createFormAsync: async () => ({} as FormItem),
      updateFormAsync: async () => {},
      toggleFormEnabledAsync: async () => {},
      deleteFormAsync: async () => {},
      createApiKeyAsync: async () => ({} as ApiKeyItem),
      regenerateApiKeyAsync: async () => ({} as ApiKeyItem),
      revokeApiKeyAsync: async () => {},
      simulateLeadSubmissionAsync: async () => {},
      updateLeadStatusAsync: async () => {},
      rescueSpamLeadAsync: async () => {},
      refreshDashboardData: async () => {},
    }),
    // Seamless wrappers
    addForm: (input: {
      name: string;
      redirectUrl?: string;
      fields?: FormItem["fields"];
    }) => {
      const localForm = store.addForm(input);
      if (context?.createFormAsync) {
        context.createFormAsync(input).catch((e) => {
          console.warn("Backend form creation error:", e);
        });
      }
      return localForm;
    },
    updateForm: (id: string, updates: Partial<FormItem>) => {
      store.updateForm(id, updates);
      if (context?.updateFormAsync) {
        context.updateFormAsync(id, updates).catch((e) => {
          console.warn("Backend form update error:", e);
        });
      }
    },
    toggleFormEnabled: (id: string) => {
      store.toggleFormEnabled(id);
      if (context?.toggleFormEnabledAsync) {
        context.toggleFormEnabledAsync(id).catch((e) => {
          console.warn("Backend form toggle error:", e);
        });
      }
    },
    deleteForm: (id: string) => {
      store.deleteForm(id);
      if (context?.deleteFormAsync) {
        context.deleteFormAsync(id).catch((e) => {
          console.warn("Backend form delete error:", e);
        });
      }
    },
    createApiKey: (name?: string, env?: "live" | "test") => {
      const localKey = store.createApiKey(name, env);
      if (context?.createApiKeyAsync) {
        context.createApiKeyAsync(name, env).catch((e) => {
          console.warn("Backend API key generation error:", e);
        });
      }
      return localKey;
    },
    regenerateApiKey: () => {
      const localKey = store.regenerateApiKey();
      if (context?.regenerateApiKeyAsync) {
        context.regenerateApiKeyAsync().catch((e) => {
          console.warn("Backend API key regeneration error:", e);
        });
      }
      return localKey;
    },
    revokeApiKey: (id?: string) => {
      store.revokeApiKey(id);
      if (context?.revokeApiKeyAsync) {
        context.revokeApiKeyAsync(id).catch((e) => {
          console.warn("Backend API key revocation error:", e);
        });
      }
    },
  };
}

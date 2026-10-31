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
  WorkspaceEnvironment,
} from "@/shared/types";
import { CreateOrganizationModal } from "../components/create-organization-modal";

interface DashboardContextType {
  // Direct access to state & store
  organizations: OrganizationDashboard[];
  activeDashboardId: string | null;
  currentEnvironment: WorkspaceEnvironment;
  isLoading: boolean;
  isCreateOrgOpen: boolean;
  setIsCreateOrgOpen: (open: boolean) => void;

  // Environment & Origin operations (Clerk-style)
  switchEnvironment: (env: WorkspaceEnvironment) => Promise<void>;
  updateProductionOriginAsync: (origin: string) => Promise<void>;

  // Multi-organization operations
  switchOrganization: (id: string) => Promise<void>;
  createOrganizationAsync: (input: {
    name: string;
    slug: string;
    avatarTone?: string;
    plan?: string;
    productionOrigin?: string;
  }) => Promise<OrganizationDashboard>;

  // Form operations
  createFormAsync: (input: {
    name: string;
    redirectUrl?: string;
    environment?: WorkspaceEnvironment;
    allowedDomains?: string[];
    fields?: FormItem["fields"];
  }) => Promise<FormItem>;
  updateFormAsync: (id: string, updates: Partial<FormItem>) => Promise<void>;
  toggleFormEnabledAsync: (id: string) => Promise<void>;
  deleteFormAsync: (id: string) => Promise<void>;

  // API Key operations
  createApiKeyAsync: (
    name?: string,
    env?: "live" | "test",
    environment?: WorkspaceEnvironment
  ) => Promise<ApiKeyItem>;
  regenerateApiKeyAsync: (
    env?: "live" | "test",
    environment?: WorkspaceEnvironment
  ) => Promise<ApiKeyItem>;
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
  deleteLeadAsync: (id: string) => Promise<void>;
  batchDeleteLeadsAsync: (ids: string[]) => Promise<void>;
  batchUpdateLeadStatusAsync: (ids: string[], status: LeadStatus) => Promise<void>;
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
    productionOrigin?: string | null;
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

  // Initialize workspace from props if provided
  useEffect(() => {
    if (initialWorkspace?.name) {
      store.initWorkspace({
        name: initialWorkspace.name,
        slug: initialWorkspace.slug || "",
        ownerEmail: initialWorkspace.ownerEmail || "",
        teamSize: initialWorkspace.teamSize === "solo" ? "solo" : "team",
        avatarTone: initialWorkspace.avatarTone || "zinc",
      });
      if (initialWorkspace.productionOrigin) {
        store.updateWorkspace({ productionOrigin: initialWorkspace.productionOrigin });
      }
    }
  }, [initialWorkspace, store]);

  // Load specific organization's forms, keys, leads, and spam filtered by environment
  const loadDashboardData = useCallback(
    async (dashboardId: string, envOverride?: WorkspaceEnvironment) => {
      try {
        const token = await getToken();
        const activeEnv = envOverride || store.currentEnvironment || "development";

        const [formsRes, keysRes, leadsRes, spamRes] = await Promise.all([
          apiFetch<{ success: boolean; data: FormItem[] }>(
            `/api/forms-and-api/forms?dashboardId=${dashboardId}&environment=${activeEnv}`,
            { token }
          ).catch(() => ({ success: false, data: [] })),

          apiFetch<{ success: boolean; data: ApiKeyItem[] }>(
            `/api/forms-and-api/keys?dashboardId=${dashboardId}&environment=${activeEnv}`,
            { token }
          ).catch(() => ({ success: false, data: [] })),

          apiFetch<{ success: boolean; data: LeadItem[] }>(
            `/api/leads?dashboardId=${dashboardId}&environment=${activeEnv}`,
            { token }
          ).catch(() => ({ success: false, data: [] })),

          apiFetch<{ success: boolean; data: SpamItem[] }>(
            `/api/forms-and-api/spam?dashboardId=${dashboardId}&environment=${activeEnv}`,
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

        const env = targetOrg.activeEnvironment || store.currentEnvironment || "development";
        store.setCurrentEnvironment(env);

        store.updateWorkspace({
          id: targetOrg.id,
          name: targetOrg.name,
          slug: targetOrg.slug,
          ownerEmail: targetOrg.ownerEmail || "",
          plan: targetOrg.plan || "Free Tier",
          avatarTone: targetOrg.avatarTone || "zinc",
          productionOrigin: targetOrg.productionOrigin || null,
          allowedOrigins: targetOrg.allowedOrigins || [],
          activeEnvironment: env,
          createdAt: targetOrg.createdAt,
        });

        return { id: targetOrg.id, env };
      }
    } catch (err) {
      console.warn("Could not fetch dashboards from backend:", err);
    }
    return null;
  }, [getToken, store]);

  // Initialize on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    async function init() {
      setIsLoading(true);
      const active = await loadDashboards();
      if (active) {
        await loadDashboardData(active.id, active.env);
      }
      setIsLoading(false);
    }

    init();
  }, [loadDashboards, loadDashboardData]);

  // Switch Environment (Clerk-style Development <-> Production toggle)
  const switchEnvironment = useCallback(
    async (env: WorkspaceEnvironment) => {
      store.setCurrentEnvironment(env);
      store.updateWorkspace({ activeEnvironment: env });

      if (store.activeDashboardId) {
        setIsLoading(true);
        await loadDashboardData(store.activeDashboardId, env);

        // Persist activeEnvironment to backend
        try {
          const token = await getToken();
          await apiFetch(`/api/forms-and-api/dashboards/${store.activeDashboardId}`, {
            method: "PATCH",
            token,
            body: JSON.stringify({ activeEnvironment: env }),
          });
        } catch (err) {
          console.warn("Could not sync activeEnvironment to backend:", err);
        }

        setIsLoading(false);
        store.addToast(
          `Switched to ${env === "production" ? "Production" : "Development"} Mode`,
          env === "production"
            ? "Now inspecting live production data. Origin verification is strictly enforced."
            : "Now inspecting sandbox test data. Requests from any origin are permitted.",
          "info"
        );
      }
    },
    [store, loadDashboardData, getToken]
  );

  // Update Production Origin
  const updateProductionOriginAsync = useCallback(
    async (origin: string) => {
      if (!store.activeDashboardId) return;
      const token = await getToken();
      const trimmed = origin.trim();

      const res = await apiFetch<{
        success: boolean;
        data: OrganizationDashboard;
      }>(`/api/forms-and-api/dashboards/${store.activeDashboardId}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ productionOrigin: trimmed || null }),
      });

      if (res.success && res.data) {
        store.updateWorkspace({ productionOrigin: res.data.productionOrigin });
        store.setOrganizations(
          store.organizations.map((org) =>
            org.id === store.activeDashboardId
              ? { ...org, productionOrigin: res.data.productionOrigin }
              : org
          )
        );
        store.addToast(
          "Production Origin Saved",
          trimmed
            ? `Production origin '${trimmed}' is now verified and active for server CORS.`
            : "Production origin cleared.",
          "success"
        );
      }
    },
    [store, getToken]
  );

  // Switch organization
  const switchOrganization = useCallback(
    async (id: string) => {
      const org = store.organizations.find((o) => o.id === id);
      if (!org) return;

      setIsLoading(true);
      store.setActiveDashboardId(id);
      const orgEnv = org.activeEnvironment || "development";
      store.setCurrentEnvironment(orgEnv);

      store.updateWorkspace({
        id: org.id,
        name: org.name,
        slug: org.slug,
        ownerEmail: org.ownerEmail || "",
        plan: org.plan || "Free Tier",
        avatarTone: org.avatarTone || "zinc",
        productionOrigin: org.productionOrigin || null,
        allowedOrigins: org.allowedOrigins || [],
        activeEnvironment: orgEnv,
        createdAt: org.createdAt,
      });

      await loadDashboardData(id, orgEnv);
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
      productionOrigin?: string;
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
      environment?: WorkspaceEnvironment;
      allowedDomains?: string[];
      fields?: FormItem["fields"];
    }) => {
      const token = await getToken();
      const targetEnv = input.environment || store.currentEnvironment || "development";

      const res = await apiFetch<{ success: boolean; data: FormItem }>(
        "/api/forms-and-api/forms",
        {
          method: "POST",
          token,
          body: JSON.stringify({
            ...input,
            dashboardId: store.activeDashboardId || undefined,
            environment: targetEnv,
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
      store.addToast("Form created", `Endpoint generated for ${form.name} in ${targetEnv} mode.`);
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
    async (
      name?: string,
      env?: "live" | "test",
      environment?: WorkspaceEnvironment
    ) => {
      const token = await getToken();
      const targetEnv = environment || store.currentEnvironment || "development";
      const keyEnv = env || (targetEnv === "production" ? "live" : "test");
      const defaultName = targetEnv === "production" ? "Production API Key" : "Development API Key";

      const res = await apiFetch<{ success: boolean; data: ApiKeyItem }>(
        "/api/forms-and-api/keys",
        {
          method: "POST",
          token,
          body: JSON.stringify({
            dashboardId: store.activeDashboardId || undefined,
            name: name || defaultName,
            env: keyEnv,
            environment: targetEnv,
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
      store.addToast("API Key created", `New ${targetEnv} API Key ready to authenticate.`);
      return key;
    },
    [getToken, store]
  );

  const regenerateApiKeyAsync = useCallback(
    async (env?: "live" | "test", environment?: WorkspaceEnvironment) => {
      const token = await getToken();
      const targetEnv = environment || store.currentEnvironment || "development";
      const keyEnv = env || (targetEnv === "production" ? "live" : "test");

      const res = await apiFetch<{ success: boolean; data: ApiKeyItem }>(
        "/api/forms-and-api/keys/regenerate",
        {
          method: "POST",
          token,
          body: JSON.stringify({
            dashboardId: store.activeDashboardId || undefined,
            env: keyEnv,
            environment: targetEnv,
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
        `Prior ${targetEnv} key has been permanently invalidated.`
      );
      return key;
    },
    [getToken, store]
  );

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
      const targetEnv = store.currentEnvironment || "development";
      store.simulateLeadSubmission(formId, payload);
      try {
        const token = await getToken();
        await apiFetch("/api/leads/simulate", {
          method: "POST",
          token,
          body: JSON.stringify({
            formId,
            dashboardId: store.activeDashboardId || undefined,
            environment: targetEnv,
            name: payload.name,
            email: payload.email,
            message: payload.message,
            source: payload.source || "Sandbox Simulator",
            extraFields: payload.extraFields,
          }),
        });

        // Refresh leads & form counts
        if (store.activeDashboardId) {
          await loadDashboardData(store.activeDashboardId, targetEnv);
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
        await apiFetch(`/api/leads/${id}/status`, {
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

  const deleteLeadAsync = useCallback(
    async (id: string) => {
      store.deleteLead(id);
      try {
        const token = await getToken();
        await apiFetch(`/api/leads/${id}`, {
          method: "DELETE",
          token,
        });
      } catch (err) {
        console.warn("Failed deleting lead on backend:", err);
        store.addToast("Sync notice", "Could not sync deletion with server.", "error");
      }
    },
    [getToken, store]
  );

  const batchDeleteLeadsAsync = useCallback(
    async (ids: string[]) => {
      store.deleteLeads(ids);
      try {
        const token = await getToken();
        await apiFetch(`/api/leads/bulk-delete`, {
          method: "POST",
          token,
          body: JSON.stringify({
            ids,
            dashboardId: store.activeDashboardId || undefined,
          }),
        });
      } catch (err) {
        console.warn("Failed batch deleting leads on backend:", err);
        store.addToast("Sync notice", "Could not sync batch deletion with server.", "error");
      }
    },
    [getToken, store]
  );

  const batchUpdateLeadStatusAsync = useCallback(
    async (ids: string[], status: LeadStatus) => {
      store.batchUpdateLeadStatus(ids, status);
      try {
        const token = await getToken();
        await apiFetch(`/api/leads/bulk-status`, {
          method: "POST",
          token,
          body: JSON.stringify({
            ids,
            status,
            dashboardId: store.activeDashboardId || undefined,
          }),
        });
      } catch (err) {
        console.warn("Failed batch updating lead status on backend:", err);
        store.addToast("Sync notice", "Could not sync status update with server.", "error");
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
      await loadDashboardData(store.activeDashboardId, store.currentEnvironment);
    }
  }, [store.activeDashboardId, store.currentEnvironment, loadDashboardData]);

  const value: DashboardContextType = {
    organizations: store.organizations,
    activeDashboardId: store.activeDashboardId,
    currentEnvironment: store.currentEnvironment || "development",
    isLoading,
    isCreateOrgOpen,
    setIsCreateOrgOpen,
    switchEnvironment,
    updateProductionOriginAsync,
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
    deleteLeadAsync,
    batchDeleteLeadsAsync,
    batchUpdateLeadStatusAsync,
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
      currentEnvironment: (store.currentEnvironment || "development") as WorkspaceEnvironment,
      isLoading: false,
      isCreateOrgOpen: false,
      setIsCreateOrgOpen: () => {},
      switchEnvironment: async () => {},
      updateProductionOriginAsync: async () => {},
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
      deleteLeadAsync: async () => {},
      batchDeleteLeadsAsync: async () => {},
      batchUpdateLeadStatusAsync: async () => {},
      rescueSpamLeadAsync: async () => {},
      refreshDashboardData: async () => {},
    }),
    // Seamless wrappers
    updateLeadStatus: (id: string, status: LeadStatus) => {
      store.updateLeadStatus(id, status);
      if (context?.updateLeadStatusAsync) {
        context.updateLeadStatusAsync(id, status).catch((e) => {
          console.warn("Backend lead status update error:", e);
        });
      }
    },
    deleteLead: (id: string) => {
      store.deleteLead(id);
      if (context?.deleteLeadAsync) {
        context.deleteLeadAsync(id).catch((e) => {
          console.warn("Backend lead delete error:", e);
        });
      }
    },
    deleteLeads: (ids: string[]) => {
      store.deleteLeads(ids);
      if (context?.batchDeleteLeadsAsync) {
        context.batchDeleteLeadsAsync(ids).catch((e) => {
          console.warn("Backend batch delete leads error:", e);
        });
      }
    },
    batchUpdateLeadStatus: (ids: string[], status: LeadStatus) => {
      store.batchUpdateLeadStatus(ids, status);
      if (context?.batchUpdateLeadStatusAsync) {
        context.batchUpdateLeadStatusAsync(ids, status).catch((e) => {
          console.warn("Backend batch lead status update error:", e);
        });
      }
    },
    addForm: (input: {
      name: string;
      redirectUrl?: string;
      environment?: WorkspaceEnvironment;
      allowedDomains?: string[];
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
    createApiKey: (
      name?: string,
      env?: "live" | "test",
      environment?: WorkspaceEnvironment
    ) => {
      const localKey = store.createApiKey(name, env);
      if (context?.createApiKeyAsync) {
        context.createApiKeyAsync(name, env, environment).catch((e) => {
          console.warn("Backend API key generation error:", e);
        });
      }
      return localKey;
    },
    regenerateApiKey: (
      env?: "live" | "test",
      environment?: WorkspaceEnvironment
    ) => {
      const localKey = store.regenerateApiKey();
      if (context?.regenerateApiKeyAsync) {
        context.regenerateApiKeyAsync(env, environment).catch((e) => {
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

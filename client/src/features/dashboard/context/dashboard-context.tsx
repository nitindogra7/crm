"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ResourceCache } from "../data/resource-cache";
import { resourcesForRoute, resourceEndpoints, type OverviewData, type AnalyticsData } from "../data/route-data";
import { useShallow } from "zustand/react/shallow";
import type { AppStoreState } from "@/shared/store/types";
import { useAuth } from "@clerk/nextjs";
import { useAppStore, useStats } from "@/shared/store";
import { optimisticUpdate } from "@/shared/lib/optimistic-update";
import { apiFetch, getApiMutationVersion } from "@/shared/lib/api-client";
import type {
  FormItem,
  ApiKeyItem,
  LeadItem,
  SpamItem,
  OrganizationDashboard,
  LeadStatus,
  WorkspaceEnvironment,
} from "@/shared/types";
const CreateOrganizationModal = dynamic(() => import("../components/create-organization-modal").then(m => m.CreateOrganizationModal), { ssr: false });

interface DashboardContextType {
  overview: OverviewData | null;
  analytics: AnalyticsData | null;
  ensureFormsLoaded: () => Promise<void>;
  // Direct access to state & store
  organizations: OrganizationDashboard[];
  activeDashboardId: string | null;
  currentEnvironment: WorkspaceEnvironment;
  isLoading: boolean;
  loadError: string | null;
  isRefreshing: boolean;
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
  const pathname = usePathname();
  const activePathRef = useRef(pathname);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadedRoute, setLoadedRoute] = useState<string | null>(null);
  const cacheRef = useRef(new ResourceCache());
  const organizations = useAppStore((state) => state.organizations);
  const activeDashboardId = useAppStore((state) => state.activeDashboardId);
  const currentEnvironment = useAppStore(
    (state) => state.currentEnvironment || "development"
  );

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const loadedScopeRef = useRef<string | null>(null);
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false);
  const isInitializedRef = useRef(false);
  const dataRequestRef = useRef(0);
  const initialWorkspaceSyncedRef = useRef<string | null>(null);

  // Initialize workspace from props if provided (runs strictly once per unique workspace name/config)
  useEffect(() => {
    if (initialWorkspace?.name) {
      const workspaceKey = `${initialWorkspace.name}_${initialWorkspace.slug || ""}_${initialWorkspace.productionOrigin || ""}`;
      if (initialWorkspaceSyncedRef.current !== workspaceKey) {
        initialWorkspaceSyncedRef.current = workspaceKey;
        const s = useAppStore.getState();
        s.initWorkspace({
          name: initialWorkspace.name,
          slug: initialWorkspace.slug || "",
          ownerEmail: initialWorkspace.ownerEmail || "",
          teamSize: initialWorkspace.teamSize === "solo" ? "solo" : "team",
          avatarTone: initialWorkspace.avatarTone || "zinc",
        });
        if (initialWorkspace.productionOrigin) {
          s.updateWorkspace({ productionOrigin: initialWorkspace.productionOrigin });
        }
      }
    }
  }, [initialWorkspace]);

  const loadDashboardData = useCallback(
    async function loadRouteData(dashboardId: string, envOverride?: WorkspaceEnvironment, force = false): Promise<void> {
      // A mutation started on a previous page must not cancel the current page's load.
      if (pathname !== activePathRef.current) return;
      const requestId = ++dataRequestRef.current;
      cacheRef.current.cancelPending();
      setIsRefreshing(true);
      setLoadError(null);
      const activeEnv = envOverride || useAppStore.getState().currentEnvironment || "development";
      const scope = dashboardId + ":" + activeEnv;
      if (loadedScopeRef.current !== scope) {
        loadedScopeRef.current = scope;
        cacheRef.current.clear();
        setOverview(null);
        setAnalytics(null);
        useAppStore.setState({ forms: [], apiKeys: [], leads: [], spam: [], selectedLeadId: null, selectedSpamId: null, selectedFormId: null });
      }
      const revision = getApiMutationVersion();
      const query = new URLSearchParams({ dashboardId, environment: activeEnv, utcOffsetMinutes: String(-new Date().getTimezoneOffset()) });
      try {
        const resources = resourcesForRoute(pathname);
        const token = resources.length ? await getToken() : null;
        if (requestId !== dataRequestRef.current) return;
        const results = await Promise.all(resources.map(async resource => {
          const endpoint = resourceEndpoints[resource] + "?" + query;
          const response = await cacheRef.current.get<{ success: boolean; data: unknown }>(endpoint, revision,
            signal => apiFetch(endpoint, { token, signal }), force);
          if (!response.success) throw new Error("Could not load " + resource);
          return { resource, data: response.data };
        }));
        if (requestId !== dataRequestRef.current) return;
        if (revision !== getApiMutationVersion()) return loadRouteData(dashboardId, activeEnv, true);
        const state = useAppStore.getState();
        if (state.activeDashboardId !== dashboardId || state.currentEnvironment !== activeEnv) return;
        for (const { resource, data } of results) {
          if (resource === "overview") {
            const value = data as OverviewData;
            setOverview(value);
            state.setForms(value.forms);
            state.setLeads(value.leads);
            cacheRef.current.seed(resourceEndpoints.forms + "?" + query, { success: true, data: value.forms }, revision);
          } else if (resource === "analytics") setAnalytics(data as AnalyticsData);
          else if (resource === "forms") state.setForms(data as FormItem[]);
          else if (resource === "keys") state.setApiKeys(data as ApiKeyItem[]);
          else if (resource === "leads") state.setLeads(data as LeadItem[]);
          else if (resource === "spam") state.setSpam(data as SpamItem[]);
        }
      } catch (error) {
        if (requestId === dataRequestRef.current) {
          console.warn("Failed loading route data:", error);
          setLoadError("Could not load this page. Please try again.");
        }
      } finally {
        if (requestId === dataRequestRef.current) {
          setIsRefreshing(false);
          setLoadedRoute(scope + ":" + pathname);
        }
      }
    }, [getToken, pathname]
  );

  const ensureFormsLoaded = useCallback(async () => {
    const state = useAppStore.getState();
    if (!state.activeDashboardId) return;
    const { activeDashboardId: dashboardId, currentEnvironment: environment } = state;
    const token = await getToken();
    const query = new URLSearchParams({ dashboardId, environment, utcOffsetMinutes: String(-new Date().getTimezoneOffset()) });
    const response = await cacheRef.current.get<{ success: boolean; data: FormItem[] }>(resourceEndpoints.forms + "?" + query, getApiMutationVersion(),
      signal => apiFetch(resourceEndpoints.forms + "?" + query, { token, signal }));
    const current = useAppStore.getState();
    if (response.success && current.activeDashboardId === dashboardId && current.currentEnvironment === environment) current.setForms(response.data);
  }, [getToken]);

  const refreshOverviewAfterWrite = useCallback(async () => {
    const state = useAppStore.getState();
    if (pathname === "/dashboard" && state.activeDashboardId) await loadDashboardData(state.activeDashboardId, state.currentEnvironment, true);
  }, [pathname, loadDashboardData]);

  // Load all user's organizations / dashboards from backend
  const loadDashboards = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await apiFetch<{
        success: boolean;
        data: OrganizationDashboard[];
      }>("/api/dashboards", { token }).catch(() => {
        setLoadError("Could not connect to your workspace. Please try again.");
        return null;
      });

      if (res && res.success && res.data && res.data.length > 0) {
        const s = useAppStore.getState();
        s.setOrganizations(res.data);

        // Find active organization or pick first
        const currentActive =
          s.activeDashboardId &&
          res.data.find((d) => d.id === s.activeDashboardId);

        const targetOrg = currentActive || res.data[0];

        if (s.activeDashboardId !== targetOrg.id) {
          s.setActiveDashboardId(targetOrg.id);
        }

        const env = targetOrg.activeEnvironment || s.currentEnvironment || "development";
        s.setCurrentEnvironment(env);

        s.updateWorkspace({
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
    } catch {
      setLoadError("Could not connect to your workspace. Please try again.");
      // Preserve the current view while retry remains available.
    }
    return null;
  }, [getToken]);

  // Initialize on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    async function init() {
      try {
        await loadDashboards();
      } catch (err) {
        console.warn("Could not sync initial dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [loadDashboards]);

  useEffect(() => {
    const request = dataRequestRef;
    const cache = cacheRef.current;
    activePathRef.current = pathname;
    if (!isLoading && activeDashboardId) void loadDashboardData(activeDashboardId, currentEnvironment);
    return () => { request.current++; cache.cancelPending(); };
  }, [activeDashboardId, currentEnvironment, loadDashboardData, isLoading, pathname]);

  // Switch Environment (Clerk-style Development <-> Production toggle)
  const switchEnvironment = useCallback(
    async (env: WorkspaceEnvironment) => {
      const s = useAppStore.getState();
      s.setCurrentEnvironment(env);
      s.updateWorkspace({ activeEnvironment: env });

      if (s.activeDashboardId) {
        // Persist the preference without blocking the freshly loaded view.
        void (async () => { try {
          const token = await getToken();
          await apiFetch(`/api/dashboards/${s.activeDashboardId}`, {
            method: "PATCH",
            token,
            body: JSON.stringify({ activeEnvironment: env }),
            invalidateResources: false,
          });
        } catch (err) {
          console.warn("Could not sync activeEnvironment to backend:", err);
        } })();
        s.addToast(
          `Switched to ${env === "production" ? "Production" : "Development"} Mode`,
          env === "production"
            ? "Now inspecting live production data. Origin verification is strictly enforced."
            : "Now inspecting sandbox test data. Requests from any origin are permitted.",
          "info"
        );
      }
    },
    [getToken]
  );

  // Update Production Origin
  const updateProductionOriginAsync = useCallback(
    async (origin: string) => {
      const s = useAppStore.getState();
      if (!s.activeDashboardId) throw new Error("Your workspace is not ready. Please reload and try again.");
      const token = await getToken();
      const trimmed = origin.trim();

      const res = await apiFetch<{
        success: boolean;
        data: OrganizationDashboard;
      }>(`/api/dashboards/${s.activeDashboardId}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ productionOrigin: trimmed || null }),
      });

      if (res.success && res.data) {
        if (s.activeDashboardId !== useAppStore.getState().activeDashboardId) return;
        const currentActiveId = s.activeDashboardId;
        s.updateWorkspace({ productionOrigin: res.data.productionOrigin });
        s.setOrganizations(
          s.organizations.map((org) =>
            org.id === currentActiveId
              ? { ...org, productionOrigin: res.data.productionOrigin }
              : org
          )
        );
        s.addToast(
          "Production Origin Saved",
          trimmed
            ? `Production origin '${trimmed}' is now verified and active for server CORS.`
            : "Production origin cleared.",
          "success"
        );
      }
    },
    [getToken]
  );

  // Switch organization
  const switchOrganization = useCallback(
    async (id: string) => {
      const s = useAppStore.getState();
      const org = s.organizations.find((o) => o.id === id);
      if (!org) return;

      s.setActiveDashboardId(id);
      const orgEnv = org.activeEnvironment || "development";
      s.setCurrentEnvironment(orgEnv);

      s.updateWorkspace({
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


      s.addToast("Workspace switched", `Now viewing ${org.name}.`);
    },
    []
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
      }>("/api/dashboards", {
        method: "POST",
        token,
        body: JSON.stringify(input),
      });

      if (!res.success || !res.data) {
        throw new Error("Failed to create organization");
      }

      const newOrg = res.data;
      const s = useAppStore.getState();
      s.setOrganizations([...s.organizations, newOrg]);
      await switchOrganization(newOrg.id);
      return newOrg;
    },
    [getToken, switchOrganization]
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
      const s = useAppStore.getState();
      const token = await getToken();
      const targetEnv = input.environment || s.currentEnvironment || "development";

      const res = await apiFetch<{ success: boolean; data: FormItem }>(
        "/api/forms",
        {
          method: "POST",
          token,
          body: JSON.stringify({
            ...input,
            dashboardId: s.activeDashboardId || undefined,
            environment: targetEnv,
          }),
        }
      );

      if (!res.success || !res.data) {
        throw new Error("Failed to create form");
      }

      const form = res.data;
      const latest = useAppStore.getState();
      if (s.activeDashboardId !== latest.activeDashboardId || targetEnv !== latest.currentEnvironment) return form;
      latest.setForms([
        form,
        ...latest.forms.filter((f) => f.id !== form.id && !f.id.startsWith("form_")),
      ]);
      latest.addToast("Form created", `Endpoint generated for ${form.name} in ${targetEnv} mode.`);
      await refreshOverviewAfterWrite();
      return form;
    },
    [getToken, refreshOverviewAfterWrite]
  );

  // Update form
  const updateFormAsync = useCallback(async (id: string, updates: Partial<FormItem>) => {
    await optimisticUpdate(() => useAppStore.setState(state => ({ forms: state.forms.map(form => form.id === id ? { ...form, ...updates } : form) })), async () => {
      const token = await getToken();
      await apiFetch("/api/forms/" + id, { method: "PATCH", token, body: JSON.stringify(updates) });
    });
    await refreshOverviewAfterWrite();
  }, [getToken, refreshOverviewAfterWrite]);

  const toggleFormEnabledAsync = useCallback(async (id: string) => {
    const form = useAppStore.getState().forms.find(item => item.id === id);
    if (form) await updateFormAsync(id, { enabled: !form.enabled });
  }, [updateFormAsync]);

  const deleteFormAsync = useCallback(async (id: string) => {
    await optimisticUpdate(() => useAppStore.setState(state => ({ forms: state.forms.filter(form => form.id !== id) })), async () => {
      const token = await getToken();
      await apiFetch("/api/forms/" + id, { method: "DELETE", token });
    });
    useAppStore.getState().addToast("Form deleted", "The endpoint has been removed.");
    await refreshOverviewAfterWrite();
  }, [getToken, refreshOverviewAfterWrite]);

  const createApiKeyAsync = useCallback(
    async (
      name?: string,
      env?: "live" | "test",
      environment?: WorkspaceEnvironment
    ) => {
      const s = useAppStore.getState();
      const token = await getToken();
      const targetEnv = environment || s.currentEnvironment || "development";
      const keyEnv = env || (targetEnv === "production" ? "live" : "test");
      const defaultName = targetEnv === "production" ? "Production API Key" : "Development API Key";

      const res = await apiFetch<{ success: boolean; data: ApiKeyItem }>(
        "/api/api-keys",
        {
          method: "POST",
          token,
          body: JSON.stringify({
            dashboardId: s.activeDashboardId || undefined,
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
      const latest = useAppStore.getState();
      if (s.activeDashboardId !== latest.activeDashboardId || targetEnv !== latest.currentEnvironment) return key;
      latest.setApiKeys([
        key,
        ...latest.apiKeys.filter((k) => k.id !== key.id && !k.id.startsWith("key_") && !k.revoked),
      ]);
      latest.addToast("API Key created", `New ${targetEnv} API Key ready to authenticate.`);
      return key;
    },
    [getToken]
  );

  const regenerateApiKeyAsync = useCallback(
    async (env?: "live" | "test", environment?: WorkspaceEnvironment) => {
      const s = useAppStore.getState();
      const token = await getToken();
      const targetEnv = environment || s.currentEnvironment || "development";
      const keyEnv = env || (targetEnv === "production" ? "live" : "test");

      const res = await apiFetch<{ success: boolean; data: ApiKeyItem }>(
        "/api/api-keys/regenerate",
        {
          method: "POST",
          token,
          body: JSON.stringify({
            dashboardId: s.activeDashboardId || undefined,
            env: keyEnv,
            environment: targetEnv,
          }),
        }
      );

      if (!res.success || !res.data) {
        throw new Error("Failed to regenerate API key");
      }

      const key = res.data;
      const latest = useAppStore.getState();
      if (s.activeDashboardId !== latest.activeDashboardId || targetEnv !== latest.currentEnvironment) return key;
      latest.setApiKeys([key]);
      latest.addToast(
        "API Key rotated",
        `Prior ${targetEnv} key has been permanently invalidated.`
      );
      return key;
    },
    [getToken]
  );

  const revokeApiKeyAsync = useCallback(async (id?: string) => {
    const keyId = id || useAppStore.getState().apiKeys.find(key => !key.revoked)?.id;
    if (!keyId) return;
    await optimisticUpdate(() => useAppStore.setState(state => ({ apiKeys: state.apiKeys.map(key => key.id === keyId ? { ...key, revoked: true } : key) })), async () => {
      const token = await getToken();
      await apiFetch("/api/api-keys/" + keyId + "/revoke", { method: "POST", token });
    });
  }, [getToken]);

  const simulateLeadSubmissionAsync = useCallback(async (formId: string, payload: {
    name: string; email: string; message: string; source?: string; extraFields?: Record<string, string>;
  }) => {
    const scope = useAppStore.getState();
    const token = await getToken();
    const response = await apiFetch<{ success: boolean; data: LeadItem }>("/api/leads/simulate", {
      method: "POST", token,
      body: JSON.stringify({ ...payload, formId, dashboardId: scope.activeDashboardId || undefined, environment: scope.currentEnvironment, source: payload.source || "Sandbox Simulator" }),
    });
    if (!response.success || !response.data) throw new Error("The test lead could not be saved.");
    const current = useAppStore.getState();
    if (scope.activeDashboardId !== current.activeDashboardId || scope.currentEnvironment !== current.currentEnvironment) return;
    useAppStore.setState(state => ({
      leads: [response.data, ...state.leads.filter(lead => lead.id !== response.data.id)],
      forms: state.forms.map(form => form.id === formId ? { ...form, leadCount: form.leadCount + 1 } : form),
    }));
    current.addToast("Test lead received", "Open Leads to inspect the saved submission.");
    if (pathname === "/dashboard" && current.activeDashboardId) await loadDashboardData(current.activeDashboardId, current.currentEnvironment, true);
  }, [getToken, pathname, loadDashboardData]);

  const updateLeadStatusAsync = useCallback(async (id: string, status: LeadStatus) => {
    await optimisticUpdate(() => useAppStore.setState(state => ({ leads: state.leads.map(lead => lead.id === id ? { ...lead, status } : lead) })), async () => {
      const token = await getToken();
      await apiFetch("/api/leads/" + id + "/status", { method: "PATCH", token, body: JSON.stringify({ status }) });
    });
    await refreshOverviewAfterWrite();
  }, [getToken, refreshOverviewAfterWrite]);

  const deleteLeadAsync = useCallback(async (id: string) => {
    const lead = useAppStore.getState().leads.find(item => item.id === id);
    await optimisticUpdate(() => useAppStore.setState(state => ({
      leads: state.leads.filter(item => item.id !== id),
      forms: state.forms.map(form => form.id === lead?.formId ? { ...form, leadCount: Math.max(0, form.leadCount - 1) } : form),
    })), async () => {
      const token = await getToken();
      await apiFetch("/api/leads/" + id, { method: "DELETE", token });
    });
    const current = useAppStore.getState();
    if (current.selectedLeadId === id) current.setSelectedLeadId(null);
    current.addToast("Lead deleted", "The lead has been removed.");
    await refreshOverviewAfterWrite();
  }, [getToken, refreshOverviewAfterWrite]);

  const batchDeleteLeadsAsync = useCallback(async (ids: string[]) => {
    const dashboardId = useAppStore.getState().activeDashboardId;
    const targets = new Set(ids);
    await optimisticUpdate(() => useAppStore.setState(state => {
      const counts = new Map<string, number>();
      state.leads.forEach(lead => { if (targets.has(lead.id)) counts.set(lead.formId, (counts.get(lead.formId) || 0) + 1); });
      return { leads: state.leads.filter(lead => !targets.has(lead.id)), forms: state.forms.map(form => counts.has(form.id) ? { ...form, leadCount: Math.max(0, form.leadCount - counts.get(form.id)! ) } : form) };
    }), async () => {
      const token = await getToken();
      await apiFetch("/api/leads/bulk-delete", { method: "POST", token, body: JSON.stringify({ ids, dashboardId: dashboardId || undefined }) });
    });
    useAppStore.getState().addToast("Leads deleted", ids.length + " leads removed.");
  }, [getToken]);

  const batchUpdateLeadStatusAsync = useCallback(async (ids: string[], status: LeadStatus) => {
    const dashboardId = useAppStore.getState().activeDashboardId;
    const targets = new Set(ids);
    await optimisticUpdate(() => useAppStore.setState(state => ({ leads: state.leads.map(lead => targets.has(lead.id) ? { ...lead, status } : lead) })), async () => {
      const token = await getToken();
      await apiFetch("/api/leads/bulk-status", { method: "POST", token, body: JSON.stringify({ ids, status, dashboardId: dashboardId || undefined }) });
    });
    useAppStore.getState().addToast("Status updated", ids.length + " leads marked " + status + ".");
  }, [getToken]);

  const rescueSpamLeadAsync = useCallback(async (spamId: string) => {
    const scope = useAppStore.getState();
    const token = await getToken();
    const response = await apiFetch<{ success: boolean; data: LeadItem }>("/api/spam/" + spamId + "/rescue", { method: "POST", token });
    if (!response.success || !response.data) throw new Error("The submission could not be rescued.");
    const current = useAppStore.getState();
    if (scope.activeDashboardId !== current.activeDashboardId || scope.currentEnvironment !== current.currentEnvironment) return;
    const target = scope.spam.find(item => item.id === spamId);
    useAppStore.setState(state => ({
      spam: state.spam.filter(item => item.id !== spamId),
      leads: [response.data, ...state.leads.filter(item => item.id !== response.data.id)],
      forms: state.forms.map(form => form.id === target?.formId ? { ...form, leadCount: form.leadCount + 1, spamCount: Math.max(0, form.spamCount - 1) } : form),
    }));
  }, [getToken]);

  const refreshDashboardData = useCallback(async () => {
    const s = useAppStore.getState();
    if (s.activeDashboardId) {
      await loadDashboardData(s.activeDashboardId, s.currentEnvironment, true);
    } else {
      setIsRefreshing(true);
      try { await loadDashboards(); }
      finally { setIsRefreshing(false); }
    }
  }, [loadDashboardData, loadDashboards]);

  const value: DashboardContextType = {
    overview,
    analytics,
    ensureFormsLoaded,
    organizations,
    activeDashboardId,
    currentEnvironment,
    isLoading: isLoading || isRefreshing || (!!activeDashboardId && loadedRoute !== activeDashboardId + ":" + currentEnvironment + ":" + pathname),
    loadError,
    isRefreshing,
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
      {isCreateOrgOpen && <CreateOrganizationModal
        isOpen={isCreateOrgOpen}
        onClose={() => setIsCreateOrgOpen(false)}
      />}
    </Context.Provider>
  );
}

export function useDashboard(keys?: readonly (keyof AppStoreState | keyof DashboardContextType | "stats")[]) {
  const store = useAppStore(useShallow((state) => keys
    ? Object.fromEntries(keys.filter(key => key in state).map(key => [key, state[key as keyof AppStoreState]])) as unknown as AppStoreState
    : state));
  const stats = useStats(!keys || keys.includes("stats"));
  const context = useContext(Context);

  return {
    ...store,
    stats,
    ...(context || {
      overview: null,
      analytics: null,
      ensureFormsLoaded: async () => {},
      organizations: store.organizations,
      activeDashboardId: store.activeDashboardId,
      currentEnvironment: (store.currentEnvironment || "development") as WorkspaceEnvironment,
      isLoading: false,
      loadError: null,
      isRefreshing: false,
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
      if (context) void context.toggleFormEnabledAsync(id).catch(() => {});
      else useAppStore.getState().toggleFormEnabled(id);
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

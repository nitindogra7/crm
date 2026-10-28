"use client";

import { useAppStore } from "./use-app-store";

export * from "./types";
export * from "./use-app-store";
export * from "./slices/workspace-slice";
export * from "./slices/forms-slice";
export * from "./slices/leads-slice";
export * from "./slices/spam-slice";
export * from "./slices/settings-slice";
export * from "./slices/ui-slice";

// Convenience hooks for granular reactivity
export const useWorkspace = () => useAppStore((state) => state.workspace);
export const useWorkspaceActions = () =>
  useAppStore((state) => ({
    updateWorkspace: state.updateWorkspace,
    initWorkspace: state.initWorkspace,
  }));

export const useForms = () => useAppStore((state) => state.forms);
export const useFormActions = () =>
  useAppStore((state) => ({
    addForm: state.addForm,
    updateForm: state.updateForm,
    toggleFormEnabled: state.toggleFormEnabled,
    deleteForm: state.deleteForm,
  }));

export const useLeads = () => useAppStore((state) => state.leads);
export const useLeadActions = () =>
  useAppStore((state) => ({
    updateLeadStatus: state.updateLeadStatus,
    simulateLeadSubmission: state.simulateLeadSubmission,
  }));

export const useSpam = () => useAppStore((state) => state.spam);
export const useSpamActions = () =>
  useAppStore((state) => ({
    rescueSpamLead: state.rescueSpamLead,
  }));

export const useToasts = () => useAppStore((state) => state.toasts);
export const useToastActions = () =>
  useAppStore((state) => ({
    addToast: state.addToast,
    removeToast: state.removeToast,
  }));

export const useStats = () => {
  const leads = useAppStore((state) => state.leads);
  const spam = useAppStore((state) => state.spam);

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const sevenDaysAgo = startOfToday - 6 * 24 * 60 * 60 * 1000;

  const leadsToday = leads.filter(
    (l) => new Date(l.receivedAt).getTime() >= startOfToday
  ).length;
  const leadsThisWeek = leads.filter(
    (l) => new Date(l.receivedAt).getTime() >= sevenDaysAgo
  ).length;

  return {
    totalLeads: leads.length,
    leadsToday,
    leadsThisWeek,
    spamFlagged: spam.length,
  };
};

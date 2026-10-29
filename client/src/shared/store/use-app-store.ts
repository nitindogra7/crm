"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceSlice } from "./slices/workspace-slice";
import { createFormsSlice } from "./slices/forms-slice";
import { createLeadsSlice } from "./slices/leads-slice";
import { createSpamSlice } from "./slices/spam-slice";
import { createSettingsSlice } from "./slices/settings-slice";
import { createUISlice } from "./slices/ui-slice";
import type { AppStoreState } from "./types";
import {
  INITIAL_WORKSPACE,
  INITIAL_FORMS,
  INITIAL_LEADS,
  INITIAL_SPAM,
  INITIAL_API_KEYS,
  INITIAL_WEBHOOK,
  INITIAL_NOTIFICATIONS,
  INITIAL_DELIVERY_LOGS,
} from "@/features/dashboard/data/mock-data";

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get, api) => ({
      ...createWorkspaceSlice(set, get, api),
      ...createFormsSlice(set, get, api),
      ...createLeadsSlice(set, get, api),
      ...createSpamSlice(set, get, api),
      ...createSettingsSlice(set, get, api),
      ...createUISlice(set, get, api),

      resetDemoData: () => {
        set({
          workspace: INITIAL_WORKSPACE,
          forms: INITIAL_FORMS,
          leads: INITIAL_LEADS,
          spam: INITIAL_SPAM,
          apiKeys: INITIAL_API_KEYS,
          webhook: INITIAL_WEBHOOK,
          notifications: INITIAL_NOTIFICATIONS,
          deliveryLogs: INITIAL_DELIVERY_LOGS,
          selectedLeadId: null,
          selectedSpamId: null,
          selectedFormId: null,
        });
        get().addToast(
          "Workspace cleared",
          "Reset all dashboard data to clean empty state."
        );
      },

      getStats: () => {
        const { leads, spam } = get();
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
      },
    }),
    {
      name: "salenova_crm_dashboard_state_v3",
      partialize: (state) => ({
        workspace: state.workspace,
        webhook: state.webhook,
        notifications: state.notifications,
      }),
    }
  )
);

import { StateCreator } from "zustand";
import { ApiKeyItem } from "@/shared/types";
import {
  INITIAL_API_KEYS,
  INITIAL_WEBHOOK,
  INITIAL_NOTIFICATIONS,
  INITIAL_DELIVERY_LOGS,
} from "@/features/dashboard/data/mock-data";
import type { AppStoreState, SettingsSlice } from "../types";

export type { SettingsSlice };

export const createSettingsSlice: StateCreator<
  AppStoreState,
  [],
  [],
  SettingsSlice
> = (set, get) => ({
  apiKeys: INITIAL_API_KEYS,
  setApiKeys: (apiKeys) => set({ apiKeys }),
  webhook: INITIAL_WEBHOOK,
  notifications: INITIAL_NOTIFICATIONS,
  deliveryLogs: INITIAL_DELIVERY_LOGS,
  createApiKey: (name = "Workspace Inbound Key", env = "live") => {
    const randomHex = Math.random().toString(36).substring(2, 10);
    const prefix = env === "test" ? "sln_test_" : "sln_live_";
    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: (name || "Workspace Inbound Key").trim(),
      keyPrefix: `${prefix}${randomHex.slice(0, 4)}...`,
      fullKeyMock: `${prefix}${randomHex}${Math.random().toString(36).substring(2, 12)}`,
      createdAt: new Date().toISOString(),
      lastUsedAt: "Never",
      revoked: false,
    };

    set(() => ({
      apiKeys: [newKey],
    }));

    get().addToast(
      "API Key Generated",
      `Your workspace API key is now active. You can now connect your forms.`,
      "success"
    );
    return newKey;
  },
  regenerateApiKey: () => {
    const randomHex = Math.random().toString(36).substring(2, 10);
    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: "Workspace Inbound Key",
      keyPrefix: `sln_live_${randomHex.slice(0, 4)}...`,
      fullKeyMock: `sln_live_${randomHex}${Math.random().toString(36).substring(2, 12)}`,
      createdAt: new Date().toISOString(),
      lastUsedAt: "Never",
      revoked: false,
    };

    set(() => ({
      apiKeys: [newKey],
    }));

    get().addToast(
      "API Key Regenerated",
      "New active key provisioned. Remember to update any external form connections.",
      "success"
    );
    return newKey;
  },
  revokeApiKey: () => {
    set(() => ({
      apiKeys: [],
    }));
    get().addToast("API Key Revoked", "Workspace key removed. Generate a new key before connecting forms.", "info");
  },
  updateWebhook: (updates) => {
    set((state) => ({
      webhook: { ...state.webhook, ...updates },
    }));
    get().addToast(
      "Webhook settings saved",
      "Webhook subscription configurations updated."
    );
  },
  updateNotifications: (updates) => {
    set((state) => ({
      notifications: { ...state.notifications, ...updates },
    }));
    get().addToast(
      "Notification preferences updated",
      "Email alert settings saved."
    );
  },
});

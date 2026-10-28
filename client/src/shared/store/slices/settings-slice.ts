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
  webhook: INITIAL_WEBHOOK,
  notifications: INITIAL_NOTIFICATIONS,
  deliveryLogs: INITIAL_DELIVERY_LOGS,
  createApiKey: (name) => {
    const randomHex = Math.random().toString(36).substring(2, 10);
    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: name.trim() || "Untitled API Key",
      keyPrefix: `sln_live_${randomHex.slice(0, 4)}...`,
      fullKeyMock: `sln_live_${randomHex}${Math.random().toString(36).substring(2, 12)}`,
      createdAt: new Date().toISOString(),
      lastUsedAt: "Never",
      revoked: false,
    };

    set((state) => ({
      apiKeys: [newKey, ...state.apiKeys],
    }));

    get().addToast(
      "API Key created",
      `Mock key "${newKey.name}" generated. Remember: all keys in demo mode are nonfunctional preview tokens.`
    );
  },
  revokeApiKey: (id) => {
    set((state) => ({
      apiKeys: state.apiKeys.map((k) => (k.id === id ? { ...k, revoked: true } : k)),
    }));
    get().addToast("API Key revoked", "Key will reject any simulated calls.", "info");
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

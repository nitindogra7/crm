import {
  FormItem,
  LeadItem,
  SpamItem,
  ApiKeyItem,
  WebhookConfig,
  DeliveryLogItem,
  WorkspaceConfig,
  NotificationSettings,
} from "../types";

export const INITIAL_WORKSPACE: WorkspaceConfig = {
  name: "My Workspace",
  slug: "my-workspace",
  ownerEmail: "",
  plan: "Free Tier",
  avatarTone: "zinc",
  createdAt: new Date().toISOString(),
};

export const INITIAL_FORMS: FormItem[] = [];

export const INITIAL_LEADS: LeadItem[] = [];

export const INITIAL_SPAM: SpamItem[] = [];

export const INITIAL_API_KEYS: ApiKeyItem[] = [];

export const INITIAL_WEBHOOK: WebhookConfig = {
  id: "wh_default",
  url: "",
  enabled: false,
  events: {
    leadCreated: true,
    spamQuarantined: false,
  },
  secret: "",
};

export const INITIAL_NOTIFICATIONS: NotificationSettings = {
  emailAlertsEnabled: true,
  alertEmail: "",
  dailyDigest: false,
  spamAlerts: true,
};

export const INITIAL_DELIVERY_LOGS: DeliveryLogItem[] = [];

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  fullKeyMock: string;
  environment?: "development" | "production";
  createdAt: string;
  lastUsedAt?: string | null;
  revoked: boolean;
}

export interface WebhookConfig {
  id: string;
  url: string;
  enabled: boolean;
  events: {
    leadCreated: boolean;
    spamQuarantined: boolean;
  };
  secret: string;
}

export interface DeliveryLogItem {
  id: string;
  type: "webhook" | "email";
  destination: string;
  event: string;
  status: "success" | "failed";
  statusCode?: number;
  latencyMs: number;
  timestamp: string;
  errorDetail?: string;
}

export interface NotificationSettings {
  emailAlertsEnabled: boolean;
  alertEmail: string;
  dailyDigest: boolean;
  spamAlerts: boolean;
}

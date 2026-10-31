import {
  WorkspaceConfig,
  OrganizationDashboard,
  FormItem,
  LeadItem,
  LeadStatus,
  SpamItem,
  ApiKeyItem,
  WebhookConfig,
  NotificationSettings,
  DeliveryLogItem,
  ToastMessage,
} from "@/shared/types";

export interface WorkspaceSlice {
  workspace: WorkspaceConfig;
  organizations: OrganizationDashboard[];
  activeDashboardId: string | null;
  updateWorkspace: (updates: Partial<WorkspaceConfig>) => void;
  initWorkspace: (config: {
    name: string;
    slug: string;
    ownerEmail: string;
    teamSize: "team" | "solo";
    avatarTone: string;
  }) => void;
  setOrganizations: (orgs: OrganizationDashboard[]) => void;
  setActiveDashboardId: (id: string) => void;
}

export interface FormsSlice {
  forms: FormItem[];
  setForms: (forms: FormItem[]) => void;
  addForm: (form: {
    name: string;
    redirectUrl?: string;
    allowedDomains?: string[];
    fields?: FormItem["fields"];
  }) => FormItem;
  updateForm: (id: string, updates: Partial<FormItem>) => void;
  toggleFormEnabled: (id: string) => void;
  deleteForm: (id: string) => void;
}

export interface LeadsSlice {
  leads: LeadItem[];
  setLeads: (leads: LeadItem[]) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  deleteLead: (id: string) => void;
  deleteLeads: (ids: string[]) => void;
  batchUpdateLeadStatus: (ids: string[], status: LeadStatus) => void;
  simulateLeadSubmission: (
    formId: string,
    payload: {
      name: string;
      email: string;
      message: string;
      source?: string;
      extraFields?: Record<string, string>;
    }
  ) => void;
}

export interface SpamSlice {
  spam: SpamItem[];
  setSpam: (spam: SpamItem[]) => void;
  rescueSpamLead: (spamId: string) => void;
}

export interface SettingsSlice {
  apiKeys: ApiKeyItem[];
  webhook: WebhookConfig;
  notifications: NotificationSettings;
  deliveryLogs: DeliveryLogItem[];
  setApiKeys: (keys: ApiKeyItem[]) => void;
  createApiKey: (name?: string, env?: "live" | "test") => ApiKeyItem;
  regenerateApiKey: () => ApiKeyItem;
  revokeApiKey: (id?: string) => void;
  updateWebhook: (updates: Partial<WebhookConfig>) => void;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
}

export interface UISlice {
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  selectedSpamId: string | null;
  setSelectedSpamId: (id: string | null) => void;
  selectedFormId: string | null;
  setSelectedFormId: (id: string | null) => void;
  isCreateFormOpen: boolean;
  setIsCreateFormOpen: (open: boolean) => void;
  isTourOpen: boolean;
  tourStep: number;
  startTour: () => void;
  closeTour: () => void;
  setTourStep: (step: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  toasts: ToastMessage[];
  addToast: (
    title: string,
    description?: string,
    variant?: "success" | "error" | "info"
  ) => void;
  removeToast: (id: string) => void;
}

export interface AppStoreExtra {
  resetDemoData: () => void;
  getStats: () => {
    totalLeads: number;
    leadsToday: number;
    leadsThisWeek: number;
    spamFlagged: number;
  };
}

export type AppStoreState = WorkspaceSlice &
  FormsSlice &
  LeadsSlice &
  SpamSlice &
  SettingsSlice &
  UISlice &
  AppStoreExtra;

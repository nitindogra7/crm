export type LeadStatus = "New" | "Contacted";

export interface LeadItem {
  id: string;
  name: string;
  email: string;
  formId: string;
  formName: string;
  source: string;
  status: LeadStatus;
  receivedAt: string;
  message: string;
  extraFields?: Record<string, string>;
  metadata?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  };
}

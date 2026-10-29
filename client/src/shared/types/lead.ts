export type LeadStatus = "New" | "Contacted" | "Qualified" | "Archived";

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

export interface LeadsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetLeadsParams {
  dashboardId?: string;
  page?: number;
  limit?: number;
  search?: string;
  formId?: string;
  source?: string;
  status?: string;
  dateRange?: "all" | "today" | "week" | "month";
}

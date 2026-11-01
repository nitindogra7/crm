import type { FormItem, LeadItem } from "@/shared/types";
export type DashboardResource = "overview" | "analytics" | "forms" | "keys" | "leads" | "spam";
export function resourcesForRoute(pathname: string): readonly DashboardResource[] {
  if (pathname === "/dashboard") return ["overview"];
  if (pathname.startsWith("/dashboard/analytics")) return ["analytics"];
  if (pathname.startsWith("/dashboard/forms")) return ["forms", "keys"];
  if (pathname.startsWith("/dashboard/leads")) return ["forms", "leads"];
  if (pathname.startsWith("/dashboard/spam")) return ["forms", "spam"];
  return [];
}
export const resourceEndpoints: Record<DashboardResource, string> = {
  overview: "/api/dashboard/overview", analytics: "/api/dashboard/analytics",
  forms: "/api/forms", keys: "/api/api-keys", leads: "/api/leads", spam: "/api/spam",
};
export interface OverviewData {
  stats: { totalLeads: number; leadsToday: number; leadsThisWeek: number; spamFlagged: number };
  leads: LeadItem[];
  forms: FormItem[];
  newLeads: number;
  formCounts: { id: string; name: string; count: number }[];
  sourceCounts: { source: string; count: number }[];
}
export interface AnalyticsData {
  forms: Pick<FormItem, "id" | "name">[];
  leads: { receivedAt: string; formId: string | null; source: string; count: number }[];
  spam: { receivedAt: string; formId: string | null; reason: string; count: number }[];
}

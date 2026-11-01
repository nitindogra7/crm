import { z } from "zod";
import { LEAD_STATUSES, WORKSPACE_ENVIRONMENTS } from "../shared/constants";

export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});
export const batchDeleteLeadsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "At least one lead ID is required"),
  dashboardId: z.string().optional(),
});
export const batchUpdateLeadStatusSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "At least one lead ID is required"),
  status: z.enum(LEAD_STATUSES),
  dashboardId: z.string().optional(),
});
export const getLeadsQuerySchema = z.object({
  dashboardId: z.string().optional(),
  environment: z.enum(WORKSPACE_ENVIRONMENTS).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  search: z.string().optional(),
  formId: z.string().optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  dateRange: z.enum(["all", "today", "week", "month"]).optional(),
});
export const simulateSubmissionSchema = z.object({
  formId: z.string().min(1, "Form ID is required"),
  dashboardId: z.string().optional(),
  environment: z.enum(WORKSPACE_ENVIRONMENTS).optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().default(""),
  source: z.string().default("Sandbox Simulator"),
  extraFields: z.record(z.string(), z.string()).optional(),
});

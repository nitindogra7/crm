import { z } from "zod";

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Archived",
] as const;

/**
 * Query schema for fetching leads with search, filters, and pagination
 */
export const getLeadsQuerySchema = z.object({
  dashboardId: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(500).optional().default(10),
  search: z.string().optional(),
  formId: z.string().optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  dateRange: z.enum(["all", "today", "week", "month"]).optional(),
});

/**
 * Schema for updating a lead's pipeline status
 */
export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

/**
 * Schema for batch updating status across multiple leads
 */
export const batchUpdateLeadStatusSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "At least one lead ID is required"),
  status: z.enum(LEAD_STATUSES),
  dashboardId: z.string().optional(),
});

/**
 * Schema for batch deleting multiple leads
 */
export const batchDeleteLeadsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "At least one lead ID is required"),
  dashboardId: z.string().optional(),
});

/**
 * Schema for simulating an incoming lead submission
 */
export const simulateLeadSchema = z.object({
  formId: z.string().min(1, "Form ID is required"),
  dashboardId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().default(""),
  source: z.string().default("Sandbox Simulator"),
  extraFields: z.record(z.string(), z.string()).optional(),
});

/**
 * Schema for creating a lead manually
 */
export const createLeadSchema = z.object({
  dashboardId: z.string().optional(),
  formId: z.string().optional().nullable(),
  formName: z.string().default("Direct / Manual Entry"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().default(""),
  source: z.string().default("Manual entry"),
  status: z.enum(LEAD_STATUSES).default("New"),
  extraFields: z.record(z.string(), z.string()).optional(),
});


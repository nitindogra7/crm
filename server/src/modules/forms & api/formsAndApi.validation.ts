import { z } from "zod";

export const AVATAR_TONES = ["zinc", "emerald", "slate", "white"] as const;
export const FIELD_TYPES = ["text", "email", "textarea", "tel", "number"] as const;
export const LEAD_STATUSES = ["New", "Contacted"] as const;
export const SPAM_DISPOSITIONS = ["Quarantined", "Rejected"] as const;

/**
 * Schema for creating a new Dashboard / Organization
 */
export const createDashboardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Organization name cannot be empty")
    .max(100, "Organization name cannot exceed 100 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug cannot be empty")
    .max(60, "Slug cannot exceed 60 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase alphanumeric characters and single hyphens"
    ),
  organizationId: z.string().trim().optional().nullable(),
  ownerEmail: z
    .union([z.string().email("Must be a valid email"), z.literal(""), z.null()])
    .optional(),
  avatarTone: z.enum(AVATAR_TONES).default("zinc"),
  plan: z.string().default("Free Tier"),
});

export const updateDashboardSchema = createDashboardSchema.partial();

/**
 * Schema for Form Field
 */
export const formFieldSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Field name is required"),
  label: z.string().min(1, "Field label is required"),
  type: z.enum(FIELD_TYPES).default("text"),
  required: z.boolean().default(false),
});

/**
 * Schema for creating a form
 */
export const createFormSchema = z.object({
  dashboardId: z.string().trim().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Form name cannot be empty")
    .max(100, "Form name cannot exceed 100 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Form slug cannot be empty")
    .max(60, "Form slug cannot exceed 60 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase alphanumeric characters and single hyphens"
    )
    .optional(),
  redirectUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val === "" || /^https?:\/\//.test(val) || val.startsWith("/"),
      { message: "Redirect URL must be a valid URL or relative path" }
    ),
  fields: z.array(formFieldSchema).optional().default([
    { id: "f1", name: "name", label: "Full Name", type: "text", required: true },
    { id: "f2", name: "email", label: "Email Address", type: "email", required: true },
    { id: "f3", name: "message", label: "Message", type: "textarea", required: true },
  ]),
});

/**
 * Schema for updating an existing form
 */
export const updateFormSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  redirectUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val === "" || /^https?:\/\//.test(val) || val.startsWith("/"),
      { message: "Redirect URL must be a valid URL or relative path" }
    ),
  enabled: z.boolean().optional(),
  fields: z.array(formFieldSchema).optional(),
});

/**
 * Schema for creating/generating an API key
 */
export const createApiKeySchema = z.object({
  dashboardId: z.string().trim().optional(),
  name: z.string().trim().default("Live API Key").optional(),
  env: z.enum(["live", "test"]).default("live").optional(),
});

/**
 * Schema for lead status updates
 */
export const updateLeadStatusSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

/**
 * Schema for testing/simulating submissions
 */
export const simulateSubmissionSchema = z.object({
  formId: z.string().min(1, "Form ID is required"),
  dashboardId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().default(""),
  source: z.string().default("Sandbox Simulator"),
  extraFields: z.record(z.string(), z.string()).optional(),
});

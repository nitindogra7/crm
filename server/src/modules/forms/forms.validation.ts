import { z } from "zod";
import { FIELD_TYPES, WORKSPACE_ENVIRONMENTS } from "../shared/constants";

function isSafeRedirect(value: string | null | undefined): boolean {
  if (!value) return true;
  if (/[\\\x00-\x1f\x7f]/.test(value)) return false;
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export const formFieldSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Field name is required"),
  label: z.string().min(1, "Field label is required"),
  type: z.enum(FIELD_TYPES).default("text"),
  required: z.boolean().default(false),
});
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
      isSafeRedirect,
      { message: "Redirect URL must be a valid URL or safe relative path" }
    ),
  environment: z.enum(WORKSPACE_ENVIRONMENTS).default("development").optional(),
  allowedDomains: z.array(z.string().trim()).optional().default([]),
  fields: z.array(formFieldSchema).optional().default([
    { id: "f1", name: "name", label: "Full Name", type: "text", required: true },
    { id: "f2", name: "email", label: "Email Address", type: "email", required: true },
    { id: "f3", name: "message", label: "Message", type: "textarea", required: true },
  ]),
});
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
      isSafeRedirect,
      { message: "Redirect URL must be a valid URL or safe relative path" }
    ),
  enabled: z.boolean().optional(),
  environment: z.enum(WORKSPACE_ENVIRONMENTS).optional(),
  allowedDomains: z.array(z.string().trim()).optional(),
  fields: z.array(formFieldSchema).optional(),
});

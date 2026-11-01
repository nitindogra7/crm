import { z } from "zod";
import { AVATAR_TONES, WORKSPACE_ENVIRONMENTS } from "../shared/constants";

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
  productionOrigin: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val === "" || /^https?:\/\//.test(val) || /^localhost(:\d+)?$/.test(val),
      { message: "Production origin must be a valid origin URL (e.g. https://mycompany.com)" }
    ),
  allowedOrigins: z.array(z.string().trim()).optional().default([]),
  activeEnvironment: z.enum(WORKSPACE_ENVIRONMENTS).default("development"),
});
export const updateDashboardSchema = createDashboardSchema.partial();

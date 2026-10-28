import { z } from "zod";

export const TEAM_SIZES = ["team", "solo"] as const;
export const USE_CASES = ["saas", "agency", "leads", "personal"] as const;
export const AVATAR_TONES = ["zinc", "emerald", "slate", "white"] as const;

/**
 * Zod schema matching the payload submitted by the frontend onboarding wizard
 * (`client/src/features/onboarding/hooks/use-onboarding-form.ts`).
 */
export const createOnboardingSchema = z.object({
  userId: z
    .string()
    .trim()
    .min(1, "User ID cannot be empty"),
  name: z
    .string()
    .trim()
    .min(1, "Workspace name cannot be empty")
    .max(100, "Workspace name cannot exceed 100 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Workspace slug cannot be empty")
    .max(60, "Workspace slug cannot exceed 60 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase alphanumeric characters and single hyphens"
    ),
  ownerEmail: z
    .string()
    .email("Owner email must be a valid email address")
    .optional()
    .nullable(),
  teamSize: z
    .enum(["team", "solo"])
    .default("team"),
  useCase: z
    .enum(["saas", "agency", "leads", "personal"])
    .default("saas"),
  avatarTone: z
    .enum(["zinc", "emerald", "slate", "white"])
    .default("zinc"),
  endpointUrl: z
    .string()
    .url("Endpoint URL must be a valid URL")
    .optional()
    .nullable(),
  isOnboarded: z.boolean().default(true).optional(),
  submittedAt: z.string().optional().nullable(),
});

/**
 * Partial schema for updating workspace/onboarding details
 */
export const updateOnboardingSchema = createOnboardingSchema
  .partial()
  .omit({ userId: true });

/**
 * Schema for querying onboarding by user ID
 */
export const getOnboardingByUserIdSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required"),
});

/**
 * Schema for querying onboarding by workspace slug
 */
export const getOnboardingBySlugSchema = z.object({
  slug: z.string().trim().min(1, "Workspace slug is required"),
});

/**
 * Schema for checking slug availability
 */
export const checkSlugAvailabilitySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Workspace slug cannot be empty")
    .max(60, "Workspace slug cannot exceed 60 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase alphanumeric characters and single hyphens"
    ),
  userId: z.string().trim().optional(),
});


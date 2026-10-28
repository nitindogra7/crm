import { z } from "zod";
import type { Onboarding } from "@prisma/client";
import {
  createOnboardingSchema,
  updateOnboardingSchema,
  getOnboardingByUserIdSchema,
  getOnboardingBySlugSchema,
  TEAM_SIZES,
  USE_CASES,
  AVATAR_TONES,
} from "./onboarding.validation";

export type TeamSize = (typeof TEAM_SIZES)[number];
export type UseCase = (typeof USE_CASES)[number];
export type AvatarTone = (typeof AVATAR_TONES)[number];

export type CreateOnboardingInput = z.infer<typeof createOnboardingSchema>;
export type UpdateOnboardingInput = z.infer<typeof updateOnboardingSchema>;
export type GetOnboardingByUserIdInput = z.infer<typeof getOnboardingByUserIdSchema>;
export type GetOnboardingBySlugInput = z.infer<typeof getOnboardingBySlugSchema>;

// Use Prisma-generated Onboarding type as the single source of truth
export type OnboardingRecord = Onboarding;

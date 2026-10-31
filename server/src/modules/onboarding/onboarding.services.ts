import { onboardingRepository, OnboardingRepository } from "./onboarding.repository";
import type {
  CreateOnboardingInput,
  UpdateOnboardingInput,
  OnboardingRecord,
} from "./onboarding.types";

export class OnboardingService {
  constructor(private readonly repository: OnboardingRepository = onboardingRepository) {}

  async completeOnboarding(
    input: CreateOnboardingInput
  ): Promise<OnboardingRecord> {
    let candidateSlug =
      input.slug ||
      input.name
        .toLowerCase()
        .trim()
        .replace(/['']/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 48) ||
      `workspace-${Date.now().toString(36)}`;

    let existingSlug = await this.repository.findBySlug(candidateSlug);
    let attempts = 0;

    // If slug is taken by another user, generate random suffix until unique
    while (existingSlug && existingSlug.userId !== input.userId && attempts < 10) {
      const suffix = Math.random().toString(36).substring(2, 6);
      candidateSlug = `${candidateSlug.slice(0, 42)}-${suffix}`;
      existingSlug = await this.repository.findBySlug(candidateSlug);
      attempts++;
    }

    // Ensure isOnboarded is true when completing onboarding flow
    const payload = {
      ...input,
      slug: candidateSlug,
      isOnboarded: input.isOnboarded ?? true,
    };

    // Use upsert so re-submitting for the same userId updates cleanly without unique constraint crash
    return this.repository.upsert(payload as CreateOnboardingInput & { slug: string });
  }

  async getOnboardingStatus(
    userId: string
  ): Promise<{ isOnboarded: boolean; onboarding: OnboardingRecord | null }> {
    const onboarding = await this.repository.findByUserId(userId);
    return {
      isOnboarded: onboarding?.isOnboarded ?? false,
      onboarding,
    };
  }

  async getByUserId(userId: string): Promise<OnboardingRecord | null> {
    return this.repository.findByUserId(userId);
  }

  async getBySlug(slug: string): Promise<OnboardingRecord | null> {
    return this.repository.findBySlug(slug);
  }

  async checkSlugAvailability(
    slug: string,
    excludeUserId?: string
  ): Promise<{ available: boolean; slug: string }> {
    const existing = await this.repository.findBySlug(slug);
    if (!existing) {
      return { available: true, slug };
    }
    // If the slug belongs to the user checking it, consider it available for them
    if (excludeUserId && existing.userId === excludeUserId) {
      return { available: true, slug };
    }
    return { available: false, slug };
  }

  async updateOnboarding(
    userId: string,
    updates: UpdateOnboardingInput
  ): Promise<OnboardingRecord | null> {
    return this.repository.updateByUserId(userId, updates);
  }
}

export const onboardingService = new OnboardingService();

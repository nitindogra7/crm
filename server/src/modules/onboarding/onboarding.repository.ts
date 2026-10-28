import { prisma } from "../../prisma";
import type {
  CreateOnboardingInput,
  UpdateOnboardingInput,
  OnboardingRecord,
} from "./onboarding.types";

export class OnboardingRepository {
  async create(data: CreateOnboardingInput): Promise<OnboardingRecord> {
    return prisma.onboarding.create({
      data: {
        userId: data.userId,
        name: data.name,
        slug: data.slug,
        ownerEmail: data.ownerEmail ?? null,
        avatarTone: data.avatarTone ?? "zinc",
        teamSize: data.teamSize ?? "team",
        useCase: data.useCase ?? "saas",
        endpointUrl: data.endpointUrl ?? null,
        isOnboarded: data.isOnboarded ?? true,
      },
    });
  }

  async upsert(data: CreateOnboardingInput): Promise<OnboardingRecord> {
    return prisma.onboarding.upsert({
      where: { userId: data.userId },
      create: {
        userId: data.userId,
        name: data.name,
        slug: data.slug,
        ownerEmail: data.ownerEmail ?? null,
        avatarTone: data.avatarTone ?? "zinc",
        teamSize: data.teamSize ?? "team",
        useCase: data.useCase ?? "saas",
        endpointUrl: data.endpointUrl ?? null,
        isOnboarded: data.isOnboarded ?? true,
      },
      update: {
        name: data.name,
        slug: data.slug,
        ...(data.ownerEmail !== undefined && { ownerEmail: data.ownerEmail }),
        ...(data.avatarTone !== undefined && { avatarTone: data.avatarTone }),
        ...(data.teamSize !== undefined && { teamSize: data.teamSize }),
        ...(data.useCase !== undefined && { useCase: data.useCase }),
        ...(data.endpointUrl !== undefined && { endpointUrl: data.endpointUrl }),
        ...(data.isOnboarded !== undefined && { isOnboarded: data.isOnboarded }),
      },
    });
  }

  async findByUserId(userId: string): Promise<OnboardingRecord | null> {
    return prisma.onboarding.findUnique({
      where: { userId },
    });
  }

  async findBySlug(slug: string): Promise<OnboardingRecord | null> {
    return prisma.onboarding.findUnique({
      where: { slug },
    });
  }

  async updateByUserId(
    userId: string,
    data: UpdateOnboardingInput
  ): Promise<OnboardingRecord | null> {
    const existing = await this.findByUserId(userId);
    if (!existing) return null;

    return prisma.onboarding.update({
      where: { userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.ownerEmail !== undefined && { ownerEmail: data.ownerEmail }),
        ...(data.avatarTone !== undefined && { avatarTone: data.avatarTone }),
        ...(data.teamSize !== undefined && { teamSize: data.teamSize }),
        ...(data.useCase !== undefined && { useCase: data.useCase }),
        ...(data.endpointUrl !== undefined && { endpointUrl: data.endpointUrl }),
        ...(data.isOnboarded !== undefined && { isOnboarded: data.isOnboarded }),
      },
    });
  }

  async checkIsOnboarded(userId: string): Promise<boolean> {
    const record = await this.findByUserId(userId);
    return record?.isOnboarded ?? false;
  }
}

export const onboardingRepository = new OnboardingRepository();

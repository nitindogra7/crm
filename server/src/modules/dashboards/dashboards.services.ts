import crypto from "crypto";
import { WorkspaceAccessError } from "../../errors";
import { prisma } from "../../prisma";
import { apikeysRepository, type ApiKeysRepository } from "../api-keys/api-keys.repository";
import { dashboardsRepository, type DashboardsRepository } from "../dashboards/dashboards.repository";
import type { CreateDashboardInput, DashboardRecord } from "../dashboards/dashboards.types";
import { workspaceKey } from "../api-keys/workspace-key";

type Repository = Pick<ApiKeysRepository, "createApiKey"> & Pick<DashboardsRepository, "createDashboard" | "findDashboardById" | "findDashboardBySlug" | "findDashboardsByUserId" | "updateDashboard">;
const defaultRepository: Repository = {
  createApiKey: apikeysRepository.createApiKey.bind(apikeysRepository),
  createDashboard: dashboardsRepository.createDashboard.bind(dashboardsRepository),
  findDashboardById: dashboardsRepository.findDashboardById.bind(dashboardsRepository),
  findDashboardBySlug: dashboardsRepository.findDashboardBySlug.bind(dashboardsRepository),
  findDashboardsByUserId: dashboardsRepository.findDashboardsByUserId.bind(dashboardsRepository),
  updateDashboard: dashboardsRepository.updateDashboard.bind(dashboardsRepository),
};

export class DashboardsService {
  constructor(
    private readonly repository: Repository = defaultRepository,
  ) {}
  async getOrCreateDashboards(userId: string): Promise<DashboardRecord[]> {
    let dashboards = await this.repository.findDashboardsByUserId(userId);

    if (dashboards.length === 0) {
      // Check onboarding record to seed first dashboard
      const onboarding = await prisma.onboarding.findUnique({
        where: { userId },
      });

      const name = onboarding?.name || "My Workspace";
      let slug = onboarding?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // Verify slug uniqueness
      let existing = await this.repository.findDashboardBySlug(slug);
      if (existing) {
        slug = `${slug}-${crypto.randomBytes(3).toString("hex")}`;
      }

      const newDashboard = await this.repository.createDashboard({
        userId,
        name,
        slug,
        ownerEmail: onboarding?.ownerEmail || null,
        avatarTone: onboarding?.avatarTone || "zinc",
        plan: onboarding?.teamSize === "solo" ? "Free Tier" : "Team Workspace",
      });

      // Auto-provision initial workspace API Key
      await this.repository.createApiKey(workspaceKey(newDashboard.id, "Default API Key"));

      dashboards = [newDashboard];
    }

    return dashboards;
  }
  async createDashboard(
    userId: string,
    input: CreateDashboardInput
  ): Promise<DashboardRecord> {
    let candidateSlug = input.slug;
    let existing = await this.repository.findDashboardBySlug(candidateSlug);
    let attempts = 0;

    while (existing && attempts < 5) {
      candidateSlug = `${input.slug.slice(0, 45)}-${crypto.randomBytes(2).toString("hex")}`;
      existing = await this.repository.findDashboardBySlug(candidateSlug);
      attempts++;
    }

    const dashboard = await this.repository.createDashboard({
      userId,
      name: input.name,
      slug: candidateSlug,
      organizationId: input.organizationId ?? null,
      ownerEmail: input.ownerEmail ?? null,
      avatarTone: input.avatarTone ?? "zinc",
      plan: input.plan ?? "Free Tier",
      productionOrigin: input.productionOrigin ?? null,
      allowedOrigins: input.allowedOrigins ?? [],
      activeEnvironment: input.activeEnvironment ?? "development",
    });

    // Auto-create API Key for the new organization
    await this.repository.createApiKey(workspaceKey(dashboard.id, "Workspace API Key"));

    return dashboard;
  }
  async getDashboardById(
    userId: string,
    dashboardId: string
  ): Promise<DashboardRecord | null> {
    const dashboard = await this.repository.findDashboardById(dashboardId);
    if (!dashboard || dashboard.userId !== userId) {
      return null;
    }
    return dashboard;
  }
  async updateDashboard(
    userId: string,
    dashboardId: string,
    updates: Partial<CreateDashboardInput>
  ): Promise<DashboardRecord | null> {
    const dashboard = await this.getDashboardById(userId, dashboardId);
    if (!dashboard) return null;

    return this.repository.updateDashboard(dashboardId, {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.slug !== undefined && { slug: updates.slug }),
      ...(updates.ownerEmail !== undefined && { ownerEmail: updates.ownerEmail || null }),
      ...(updates.avatarTone !== undefined && { avatarTone: updates.avatarTone }),
      ...(updates.plan !== undefined && { plan: updates.plan }),
      ...(updates.productionOrigin !== undefined && { productionOrigin: updates.productionOrigin || null }),
      ...(updates.allowedOrigins !== undefined && { allowedOrigins: updates.allowedOrigins }),
      ...(updates.activeEnvironment !== undefined && { activeEnvironment: updates.activeEnvironment }),
    });
  }
  async resolveDashboardId(
    userId: string,
    providedDashboardId?: string
  ): Promise<string> {
    if (providedDashboardId) {
      const db = await this.repository.findDashboardById(providedDashboardId);
      if (db && db.userId === userId) {
        return db.id;
      }
      if (!db || db.userId !== userId) {
        throw new WorkspaceAccessError();
      }
    }
    const dashboards = await this.getOrCreateDashboards(userId);
    return dashboards[0].id;
  }
}

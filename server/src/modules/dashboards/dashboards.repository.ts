import { prisma } from "../../prisma";
import type { DashboardRecord } from "../dashboards/dashboards.types";

export class DashboardsRepository {
  async createDashboard(data: {
    userId: string;
    name: string;
    slug: string;
    organizationId?: string | null;
    ownerEmail?: string | null;
    avatarTone?: string;
    plan?: string;
    productionOrigin?: string | null;
    allowedOrigins?: string[];
    activeEnvironment?: string;
  }): Promise<DashboardRecord> {
    return prisma.dashboard.create({
      data: {
        userId: data.userId,
        name: data.name,
        slug: data.slug,
        organizationId: data.organizationId ?? null,
        ownerEmail: data.ownerEmail ?? null,
        avatarTone: data.avatarTone ?? "zinc",
        plan: data.plan ?? "Free Tier",
        productionOrigin: data.productionOrigin ?? null,
        allowedOrigins: data.allowedOrigins ?? [],
        activeEnvironment: data.activeEnvironment ?? "development",
      },
    });
  }
  async findDashboardsByUserId(userId: string): Promise<DashboardRecord[]> {
    return prisma.dashboard.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }
  async findDashboardById(id: string): Promise<DashboardRecord | null> {
    return prisma.dashboard.findUnique({
      where: { id },
    });
  }
  async findDashboardBySlug(slug: string): Promise<DashboardRecord | null> {
    return prisma.dashboard.findUnique({
      where: { slug },
    });
  }
  async updateDashboard(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      ownerEmail: string | null;
      avatarTone: string;
      plan: string;
      productionOrigin: string | null;
      allowedOrigins: string[];
      activeEnvironment: string;
    }>
  ): Promise<DashboardRecord> {
    return prisma.dashboard.update({
      where: { id },
      data,
    });
  }
}
export const dashboardsRepository = new DashboardsRepository();

import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import type { ApiKeyRecord } from "../api-keys/api-keys.types";

export class ApiKeysRepository {
  async createApiKey(data: {
    dashboardId: string;
    name: string;
    key: string;
    keyPrefix: string;
    environment?: string;
    fullKeyMock?: string | null;
  }): Promise<ApiKeyRecord> {
    return prisma.apiKey.create({
      data: {
        dashboardId: data.dashboardId,
        name: data.name,
        key: data.key,
        keyPrefix: data.keyPrefix,
        environment: data.environment ?? (data.keyPrefix.includes("live") ? "production" : "development"),
        fullKeyMock: data.fullKeyMock ?? data.key,
        revoked: false,
      },
    });
  }
  async findApiKeysByDashboardId(dashboardId: string, environment?: string): Promise<ApiKeyRecord[]> {
    const where: Prisma.ApiKeyWhereInput = { dashboardId, revoked: false };
    if (environment) {
      where.environment = environment;
    }
    return prisma.apiKey.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }
  async findApiKeyByKey(key: string): Promise<ApiKeyRecord | null> {
    return prisma.apiKey.findUnique({
      where: { key },
    });
  }
  async revokeApiKey(id: string): Promise<ApiKeyRecord> {
    return prisma.apiKey.update({
      where: { id },
      data: { revoked: true },
    });
  }
  async revokeAllActiveKeysForDashboard(dashboardId: string, environment?: string): Promise<void> {
    const where: Prisma.ApiKeyWhereInput = { dashboardId, revoked: false };
    if (environment) {
      where.environment = environment;
    }
    await prisma.apiKey.updateMany({
      where,
      data: { revoked: true },
    });
  }
  async touchApiKeyLastUsed(id: string): Promise<void> {
    const now = new Date();
    // The database predicate also suppresses duplicate writes from concurrent requests.
    await prisma.apiKey.updateMany({
      where: { id, revoked: false, OR: [
        { lastUsedAt: null },
        { lastUsedAt: { lte: new Date(now.getTime() - 60_000) } },
      ] },
      data: { lastUsedAt: now },
    });
  }
}
export const apikeysRepository = new ApiKeysRepository();

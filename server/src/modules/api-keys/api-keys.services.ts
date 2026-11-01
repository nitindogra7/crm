import crypto from "crypto";
import { prisma } from "../../prisma";
import { apikeysRepository, type ApiKeysRepository } from "../api-keys/api-keys.repository";
import type { ApiKeyRecord } from "../api-keys/api-keys.types";
import { DashboardsService } from "../dashboards/dashboards.services";

type Repository = Pick<ApiKeysRepository, "createApiKey" | "findApiKeysByDashboardId" | "revokeAllActiveKeysForDashboard" | "revokeApiKey">;
const defaultRepository: Repository = {
  createApiKey: apikeysRepository.createApiKey.bind(apikeysRepository),
  findApiKeysByDashboardId: apikeysRepository.findApiKeysByDashboardId.bind(apikeysRepository),
  revokeAllActiveKeysForDashboard: apikeysRepository.revokeAllActiveKeysForDashboard.bind(apikeysRepository),
  revokeApiKey: apikeysRepository.revokeApiKey.bind(apikeysRepository),
};

export class ApiKeysService {
  constructor(
    private readonly repository: Repository = defaultRepository,
    private readonly dashboards: DashboardsService = new DashboardsService(),
  ) {}
  async getApiKeys(userId: string, dashboardId?: string, environment?: string): Promise<ApiKeyRecord[]> {
    const targetDashboardId = await this.dashboards.resolveDashboardId(userId, dashboardId);
    return this.repository.findApiKeysByDashboardId(targetDashboardId, environment);
  }
  async generateApiKey(
    userId: string,
    dashboardId?: string,
    name?: string,
    env: "live" | "test" = "test",
    environment?: string
  ): Promise<ApiKeyRecord> {
    const targetDashboardId = await this.dashboards.resolveDashboardId(userId, dashboardId);
    const resolvedEnv = environment === "production" ? "live" : environment === "development" ? "test" : env;
    const prefix = `sln_${resolvedEnv}_`;
    const randomHex = crypto.randomBytes(16).toString("hex");
    const fullKey = `${prefix}${randomHex}`;
    const keyEnv = resolvedEnv === "live" ? "production" : "development";
    const defaultName = keyEnv === "production" ? "Production API Key" : "Development API Key";

    return this.repository.createApiKey({
      dashboardId: targetDashboardId,
      name: name || defaultName,
      key: fullKey,
      keyPrefix: prefix,
      environment: keyEnv,
      fullKeyMock: fullKey,
    });
  }
  async regenerateApiKey(
    userId: string,
    dashboardId?: string,
    env: "live" | "test" = "test",
    environment?: string
  ): Promise<ApiKeyRecord> {
    const targetDashboardId = await this.dashboards.resolveDashboardId(userId, dashboardId);
    const resolvedEnv = environment === "production" ? "live" : environment === "development" ? "test" : env;
    const keyEnv = resolvedEnv === "live" ? "production" : "development";

    // Revoke previous keys for that environment
    await this.repository.revokeAllActiveKeysForDashboard(targetDashboardId, keyEnv);
    // Create new one
    return this.generateApiKey(userId, targetDashboardId, undefined, resolvedEnv, keyEnv);
  }
  async revokeApiKey(userId: string, apiKeyId: string): Promise<boolean> {
    // Validate ownership
    const key = await prisma.apiKey.findUnique({
      where: { id: apiKeyId },
      include: { dashboard: true },
    });
    if (!key || key.dashboard.userId !== userId) {
      return false;
    }
    await this.repository.revokeApiKey(apiKeyId);
    return true;
  }
}

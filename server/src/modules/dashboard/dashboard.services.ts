import { DashboardsService } from "../dashboards/dashboards.services";
import { DashboardRepository } from "./dashboard.repository";

export class DashboardService {
  constructor(private readonly repository = new DashboardRepository(), private readonly dashboards = new DashboardsService()) {}
  async overview(userId: string, dashboardId: string, environment: string, utcOffsetMinutes?: number) {
    const id = await this.dashboards.resolveDashboardId(userId, dashboardId);
    return this.repository.overview(id, environment, utcOffsetMinutes);
  }
  async analytics(userId: string, dashboardId: string, environment: string, utcOffsetMinutes: number) {
    const id = await this.dashboards.resolveDashboardId(userId, dashboardId);
    return this.repository.analytics(id, environment, utcOffsetMinutes);
  }
}

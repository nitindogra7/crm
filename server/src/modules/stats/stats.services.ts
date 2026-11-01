import { statsRepository, type StatsRepository } from "../stats/stats.repository";
import { DashboardsService } from "../dashboards/dashboards.services";

type Repository = Pick<StatsRepository, "getStats">;
const defaultRepository: Repository = {
  getStats: statsRepository.getStats.bind(statsRepository),
};

export class StatsService {
  constructor(
    private readonly repository: Repository = defaultRepository,
    private readonly dashboards: DashboardsService = new DashboardsService(),
  ) {}
  async getStats(
    userId: string,
    dashboardId?: string,
    environment?: string
  ): Promise<{
    totalLeads: number;
    leadsToday: number;
    leadsThisWeek: number;
    spamFlagged: number;
  }> {
    const targetDashboardId = await this.dashboards.resolveDashboardId(userId, dashboardId);
    return this.repository.getStats(targetDashboardId, environment);
  }
}

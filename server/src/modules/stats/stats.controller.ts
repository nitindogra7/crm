import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { WorkspaceAccessError } from "../../errors";
import { StatsService } from "./stats.services";

export class StatsController {
  constructor(private readonly service: Pick<StatsService, "getStats"> = new StatsService()) {}
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboardId = req.query.dashboardId as string | undefined;
      const environment = req.query.environment as string | undefined;
      const stats = await this.service.getStats(userId, dashboardId, environment);

      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error getting stats:", error);
      res.status(500).json({ success: false, error: "Failed to retrieve dashboard stats" });
    }
  };
}
export const statsController = new StatsController();

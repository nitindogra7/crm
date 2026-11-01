import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { WorkspaceAccessError } from "../../errors";
import { SpamService } from "./spam.services";

export class SpamController {
  constructor(private readonly service: Pick<SpamService, "getSpam" | "rescueSpamLead"> = new SpamService()) {}
  getSpam = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboardId = req.query.dashboardId as string | undefined;
      const environment = req.query.environment as string | undefined;
      const spam = await this.service.getSpam(userId, dashboardId, environment);

      res.status(200).json({ success: true, data: spam });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error getting quarantined spam:", error);
      res.status(500).json({ success: false, error: "Failed to retrieve spam records" });
    }
  };
  rescueSpam = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const id = String(req.params.id);
      const rescued = await this.service.rescueSpamLead(userId, id);

      if (!rescued) {
        res.status(404).json({ success: false, error: "Spam record not found" });
        return;
      }

      res.status(200).json({ success: true, data: rescued });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error rescuing spam record:", error);
      res.status(500).json({ success: false, error: "Failed to rescue spam record" });
    }
  };
}
export const spamController = new SpamController();

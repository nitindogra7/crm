import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { ZodError } from "zod";
import { WorkspaceAccessError } from "../../errors";
import { createDashboardSchema, updateDashboardSchema } from "../dashboards/dashboards.validation";
import { DashboardsService } from "./dashboards.services";

export class DashboardsController {
  constructor(private readonly service: Pick<DashboardsService, "createDashboard" | "getOrCreateDashboards" | "updateDashboard"> = new DashboardsService()) {}
  getDashboards = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboards = await this.service.getOrCreateDashboards(userId);
      res.status(200).json({ success: true, data: dashboards });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error retrieving dashboards:", error);
      res.status(500).json({ success: false, error: "Failed to load dashboards" });
    }
  };
  createDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const validated = createDashboardSchema.parse(req.body);
      const dashboard = await this.service.createDashboard(userId, validated);

      res.status(201).json({ success: true, data: dashboard });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.issues.map((i) => i.message),
        });
        return;
      }
      console.error("Error creating dashboard:", error);
      res.status(500).json({ success: false, error: "Failed to create dashboard" });
    }
  };
  updateDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const id = String(req.params.id);
      const validated = updateDashboardSchema.parse(req.body);
      const updated = await this.service.updateDashboard(userId, id, validated);

      if (!updated) {
        res.status(404).json({ success: false, error: "Dashboard not found or access denied" });
        return;
      }

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.issues.map((i) => i.message),
        });
        return;
      }
      console.error("Error updating dashboard:", error);
      res.status(500).json({ success: false, error: "Failed to update dashboard" });
    }
  };
}
export const dashboardsController = new DashboardsController();

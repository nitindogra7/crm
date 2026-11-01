import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { ZodError } from "zod";
import { WorkspaceAccessError } from "../../errors";
import { DashboardService } from "./dashboard.services";
import { dashboardQuerySchema } from "./dashboard.validation";
const service = new DashboardService();
function readDashboard(kind: "overview" | "analytics") {
  return async (req: Request, res: Response) => {
    try {
      const userId = getAuth(req).userId;
      if (!userId) { res.status(401).json({ success: false, error: "Unauthorized" }); return; }
      const query = dashboardQuerySchema.parse(req.query);
      const data = kind === "overview"
        ? await service.overview(userId, query.dashboardId, query.environment, query.utcOffsetMinutes)
        : await service.analytics(userId, query.dashboardId, query.environment, query.utcOffsetMinutes);
      res.setHeader("Cache-Control", "private, no-store");
      res.json({ success: true, data });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) { res.status(403).json({ success: false, error: error.message }); return; }
      if (error instanceof ZodError) { res.status(400).json({ success: false, error: "Invalid dashboard query" }); return; }
      console.error("Dashboard read failed:", error);
      res.status(500).json({ success: false, error: "Failed to load dashboard" });
    }
  };
}
export const dashboardController = { overview: readDashboard("overview"), analytics: readDashboard("analytics") };

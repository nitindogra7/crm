import { Router } from "express";
import { dashboardsController } from "./dashboards.controller";

export const dashboardsRouter = Router();
dashboardsRouter.get("/", dashboardsController.getDashboards);
dashboardsRouter.post("/", dashboardsController.createDashboard);
dashboardsRouter.patch("/:id", dashboardsController.updateDashboard);

import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
export const dashboardRouter = Router();
dashboardRouter.get("/overview", dashboardController.overview);
dashboardRouter.get("/analytics", dashboardController.analytics);

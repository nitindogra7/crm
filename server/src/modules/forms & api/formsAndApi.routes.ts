// Historical URLs delegate to domain routers.
import { Router } from "express";
import { dashboardsRouter } from "../dashboards/dashboards.routes";
import { formsRouter } from "../forms/forms.routes";
import { apikeysRouter } from "../api-keys/api-keys.routes";
import { spamRouter } from "../spam/spam.routes";
import { statsRouter } from "../stats/stats.routes";
import { ingestionRouter } from "../ingestion/ingestion.routes";
import { legacyleadsController } from "../leads/legacy-leads.controller";
export const formsAndApiRouter = Router();
formsAndApiRouter.use("/dashboards", dashboardsRouter);
formsAndApiRouter.use("/forms", formsRouter);
formsAndApiRouter.use("/keys", apikeysRouter);
formsAndApiRouter.use("/spam", spamRouter);
formsAndApiRouter.use("/stats", statsRouter);
formsAndApiRouter.post("/simulate", legacyleadsController.simulateSubmission);
formsAndApiRouter.use(ingestionRouter);
export default formsAndApiRouter;

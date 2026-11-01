import { Router } from "express";
import { statsController } from "./stats.controller";

export const statsRouter = Router();
statsRouter.get("/", statsController.getStats);

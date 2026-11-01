import { Router } from "express";
import { spamController } from "./spam.controller";

export const spamRouter = Router();
spamRouter.get("/", spamController.getSpam);
spamRouter.post("/:id/rescue", spamController.rescueSpam);

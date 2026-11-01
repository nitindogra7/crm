import { Router } from "express";
import { formsController } from "./forms.controller";

export const formsRouter = Router();
formsRouter.get("/", formsController.getForms);
formsRouter.post("/", formsController.createForm);
formsRouter.get("/:id", formsController.getFormById);
formsRouter.patch("/:id", formsController.updateForm);
formsRouter.delete("/:id", formsController.deleteForm);

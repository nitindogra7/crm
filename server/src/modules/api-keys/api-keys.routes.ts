import { Router } from "express";
import { apikeysController } from "./api-keys.controller";

export const apikeysRouter = Router();
apikeysRouter.get("/", apikeysController.getApiKeys);
apikeysRouter.post("/", apikeysController.createApiKey);
apikeysRouter.post("/regenerate", apikeysController.regenerateApiKey);
apikeysRouter.post("/:id/revoke", apikeysController.revokeApiKey);
apikeysRouter.delete("/:id", apikeysController.revokeApiKey);

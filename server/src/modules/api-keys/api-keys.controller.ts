import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { WorkspaceAccessError } from "../../errors";
import { createApiKeySchema } from "../api-keys/api-keys.validation";
import { ApiKeysService } from "./api-keys.services";

export class ApiKeysController {
  constructor(private readonly service: Pick<ApiKeysService, "generateApiKey" | "getApiKeys" | "regenerateApiKey" | "revokeApiKey"> = new ApiKeysService()) {}
  getApiKeys = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboardId = req.query.dashboardId as string | undefined;
      const environment = req.query.environment as string | undefined;
      const keys = await this.service.getApiKeys(userId, dashboardId, environment);

      res.status(200).json({ success: true, data: keys });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error getting API keys:", error);
      res.status(500).json({ success: false, error: "Failed to retrieve API keys" });
    }
  };
  createApiKey = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const validated = createApiKeySchema.parse(req.body);
      const key = await this.service.generateApiKey(
        userId,
        validated.dashboardId,
        validated.name,
        validated.env,
        validated.environment
      );

      res.status(201).json({ success: true, data: key });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error creating API key:", error);
      res.status(500).json({ success: false, error: "Failed to generate API key" });
    }
  };
  regenerateApiKey = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboardId = req.body?.dashboardId as string | undefined;
      const env = req.body?.env as "live" | "test" | undefined;
      const environment = req.body?.environment as string | undefined;
      const newKey = await this.service.regenerateApiKey(userId, dashboardId, env, environment);

      res.status(200).json({ success: true, data: newKey });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error regenerating API key:", error);
      res.status(500).json({ success: false, error: "Failed to regenerate API key" });
    }
  };
  revokeApiKey = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const id = String(req.params.id);
      const revoked = await this.service.revokeApiKey(userId, id);
      if (!revoked) {
        res.status(404).json({ success: false, error: "API key not found" });
        return;
      }

      res.status(200).json({ success: true, message: "API key revoked" });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error revoking API key:", error);
      res.status(500).json({ success: false, error: "Failed to revoke API key" });
    }
  };
}
export const apikeysController = new ApiKeysController();

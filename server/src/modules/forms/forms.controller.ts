import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { ZodError } from "zod";
import { WorkspaceAccessError } from "../../errors";
import { createFormSchema, updateFormSchema } from "../forms/forms.validation";
import { FormsService } from "./forms.services";

export class FormsController {
  constructor(private readonly service: Pick<FormsService, "createForm" | "deleteForm" | "getFormById" | "getForms" | "updateForm"> = new FormsService()) {}
  getForms = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboardId = req.query.dashboardId as string | undefined;
      const environment = req.query.environment as string | undefined;
      const forms = await this.service.getForms(userId, dashboardId, environment);

      res.status(200).json({ success: true, data: forms });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error fetching forms:", error);
      res.status(500).json({ success: false, error: "Failed to fetch forms" });
    }
  };
  getFormById = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const id = String(req.params.id);
      const form = await this.service.getFormById(userId, id);
      if (!form) {
        res.status(404).json({ success: false, error: "Form not found" });
        return;
      }

      res.status(200).json({ success: true, data: form });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error fetching form:", error);
      res.status(500).json({ success: false, error: "Failed to retrieve form" });
    }
  };
  createForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const validated = createFormSchema.parse(req.body);
      const form = await this.service.createForm(userId, validated);

      res.status(201).json({ success: true, data: form });
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
      console.error("Error creating form:", error);
      res.status(500).json({ success: false, error: "Failed to create form" });
    }
  };
  updateForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const id = String(req.params.id);
      const validated = updateFormSchema.parse(req.body);
      const updated = await this.service.updateForm(userId, id, validated);

      if (!updated) {
        res.status(404).json({ success: false, error: "Form not found or access denied" });
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
      console.error("Error updating form:", error);
      res.status(500).json({ success: false, error: "Failed to update form" });
    }
  };
  deleteForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const id = String(req.params.id);
      const deleted = await this.service.deleteForm(userId, id);
      if (!deleted) {
        res.status(404).json({ success: false, error: "Form not found or access denied" });
        return;
      }

      res.status(200).json({ success: true, message: "Form deleted successfully" });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error deleting form:", error);
      res.status(500).json({ success: false, error: "Failed to delete form" });
    }
  };
}
export const formsController = new FormsController();

import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { ZodError } from "zod";
import { WorkspaceAccessError } from "../../errors";
import { batchDeleteLeadsSchema, batchUpdateLeadStatusSchema, getLeadsQuerySchema, simulateSubmissionSchema, updateLeadStatusSchema } from "../leads/legacy-leads.validation";
import { LegacyLeadsService } from "./legacy-leads.services";

export class LegacyLeadsController {
  constructor(private readonly service: Pick<LegacyLeadsService, "batchDeleteLeads" | "batchUpdateLeadStatus" | "deleteLead" | "getLeads" | "simulateLead" | "updateLeadStatus"> = new LegacyLeadsService()) {}
  simulateSubmission = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const validated = simulateSubmissionSchema.parse(req.body);
      const lead = await this.service.simulateLead(userId, validated);

      res.status(201).json({ success: true, data: lead });
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
      console.error("Error simulating lead submission:", error);
      res.status(500).json({ success: false, error: "Failed to simulate submission" });
    }
  };
  getLeads = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const query = getLeadsQuerySchema.parse(req.query);
      const result = await this.service.getLeads(userId, query);

      res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
      });
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
      console.error("Error getting leads:", error);
      res.status(500).json({ success: false, error: "Failed to retrieve leads" });
    }
  };
  deleteLead = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const id = String(req.params.id);
      const deleted = await this.service.deleteLead(userId, id);

      if (!deleted) {
        res.status(404).json({ success: false, error: "Lead not found or access denied" });
        return;
      }

      res.status(200).json({ success: true, message: "Lead deleted successfully" });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error deleting lead:", error);
      res.status(500).json({ success: false, error: "Failed to delete lead" });
    }
  };
  batchDeleteLeads = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const validated = batchDeleteLeadsSchema.parse(req.body);
      const result = await this.service.batchDeleteLeads(
        userId,
        validated.ids,
        validated.dashboardId
      );

      res.status(200).json({
        success: true,
        message: `${result.count} lead(s) deleted successfully`,
        data: { count: result.count },
      });
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
      console.error("Error batch deleting leads:", error);
      res.status(500).json({ success: false, error: "Failed to delete leads" });
    }
  };
  batchUpdateLeadStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const validated = batchUpdateLeadStatusSchema.parse(req.body);
      const result = await this.service.batchUpdateLeadStatus(
        userId,
        validated.ids,
        validated.status,
        validated.dashboardId
      );

      res.status(200).json({
        success: true,
        message: `${result.count} lead(s) updated to ${validated.status}`,
        data: { count: result.count },
      });
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
      console.error("Error batch updating lead status:", error);
      res.status(500).json({ success: false, error: "Failed to update lead status" });
    }
  };
  updateLeadStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const id = String(req.params.id);
      const validated = updateLeadStatusSchema.parse(req.body);
      const updated = await this.service.updateLeadStatus(userId, id, validated.status);

      if (!updated) {
        res.status(404).json({ success: false, error: "Lead not found" });
        return;
      }

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error updating lead status:", error);
      res.status(500).json({ success: false, error: "Failed to update lead status" });
    }
  };
}
export const legacyleadsController = new LegacyLeadsController();

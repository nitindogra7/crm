import type { Request, Response } from "express";
import { ZodError } from "zod";
import { getAuth } from "@clerk/express";
import { leadsService, LeadsService } from "./leads.services";
import {
  getLeadsQuerySchema,
  updateLeadStatusSchema,
  batchDeleteLeadsSchema,
  batchUpdateLeadStatusSchema,
  simulateLeadSchema,
} from "./leads.validation";

export class LeadsController {
  constructor(
    private readonly service: LeadsService = leadsService
  ) {}

  getLeads = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboardId = req.query.dashboardId as string | undefined;
      const environment = req.query.environment as string | undefined;
      const isPaginationRequested =
        req.query.page !== undefined || req.query.limit !== undefined;

      // If neither page nor limit nor filter is requested, return all leads for dashboard store
      if (
        !isPaginationRequested &&
        !req.query.search &&
        !req.query.formId &&
        !req.query.source &&
        !req.query.status &&
        !req.query.dateRange
      ) {
        const items = await this.service.getAllLeads(userId, dashboardId, environment);
        res.status(200).json({
          success: true,
          data: items,
          pagination: {
            total: items.length,
            page: 1,
            limit: items.length,
            totalPages: 1,
          },
        });
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

  getLeadById = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const id = String(req.params.id);
      const lead = await this.service.getLeadById(userId, id);

      if (!lead) {
        res.status(404).json({ success: false, error: "Lead not found" });
        return;
      }

      res.status(200).json({ success: true, data: lead });
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ success: false, error: "Failed to retrieve lead" });
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
        res.status(404).json({ success: false, error: "Lead not found or access denied" });
        return;
      }

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.issues.map((i) => i.message),
        });
        return;
      }
      console.error("Error updating lead status:", error);
      res.status(500).json({ success: false, error: "Failed to update lead status" });
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

  simulateLead = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const validated = simulateLeadSchema.parse(req.body);
      const lead = await this.service.simulateLead(userId, validated);

      res.status(201).json({ success: true, data: lead });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.issues.map((i) => i.message),
        });
        return;
      }
      console.error("Error simulating lead submission:", error);
      res.status(500).json({ success: false, error: "Failed to simulate lead" });
    }
  };
}

export const leadsController = new LeadsController();


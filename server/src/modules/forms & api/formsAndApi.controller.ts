import type { Request, Response } from "express";
import { ZodError } from "zod";
import { getAuth } from "@clerk/express";
import { formsAndApiService, FormsAndApiService } from "./formsAndApi.services";
import {
  createDashboardSchema,
  updateDashboardSchema,
  createFormSchema,
  updateFormSchema,
  createApiKeySchema,
  updateLeadStatusSchema,
  batchDeleteLeadsSchema,
  batchUpdateLeadStatusSchema,
  getLeadsQuerySchema,
  simulateSubmissionSchema,
} from "./formsAndApi.validation";

export class FormsAndApiController {
  constructor(
    private readonly service: FormsAndApiService = formsAndApiService
  ) {}

  // ==========================================
  // DASHBOARDS / ORGANIZATIONS
  // ==========================================

  getDashboards = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboards = await this.service.getOrCreateDashboards(userId);
      res.status(200).json({ success: true, data: dashboards });
    } catch (error) {
      console.error("Error retrieving dashboards:", error);
      res.status(500).json({ success: false, error: "Failed to load dashboards" });
    }
  };

  createDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const validated = createDashboardSchema.parse(req.body);
      const dashboard = await this.service.createDashboard(userId, validated);

      res.status(201).json({ success: true, data: dashboard });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.issues.map((i) => i.message),
        });
        return;
      }
      console.error("Error creating dashboard:", error);
      res.status(500).json({ success: false, error: "Failed to create dashboard" });
    }
  };

  updateDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const id = String(req.params.id);
      const validated = updateDashboardSchema.parse(req.body);
      const updated = await this.service.updateDashboard(userId, id, validated);

      if (!updated) {
        res.status(404).json({ success: false, error: "Dashboard not found or access denied" });
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
      console.error("Error updating dashboard:", error);
      res.status(500).json({ success: false, error: "Failed to update dashboard" });
    }
  };

  // ==========================================
  // FORMS
  // ==========================================

  getForms = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboardId = req.query.dashboardId as string | undefined;
      const forms = await this.service.getForms(userId, dashboardId);

      res.status(200).json({ success: true, data: forms });
    } catch (error) {
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
      console.error("Error deleting form:", error);
      res.status(500).json({ success: false, error: "Failed to delete form" });
    }
  };

  // ==========================================
  // API KEYS
  // ==========================================

  getApiKeys = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboardId = req.query.dashboardId as string | undefined;
      const keys = await this.service.getApiKeys(userId, dashboardId);

      res.status(200).json({ success: true, data: keys });
    } catch (error) {
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
        validated.env
      );

      res.status(201).json({ success: true, data: key });
    } catch (error) {
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
      const newKey = await this.service.regenerateApiKey(userId, dashboardId);

      res.status(200).json({ success: true, data: newKey });
    } catch (error) {
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
      console.error("Error revoking API key:", error);
      res.status(500).json({ success: false, error: "Failed to revoke API key" });
    }
  };

  // ==========================================
  // PUBLIC FORM SUBMISSION INGESTION
  // ==========================================

  submitForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawSlug =
        req.params.slug ||
        req.body?.formSlug ||
        req.body?._slug ||
        req.body?.slug ||
        req.query.formSlug ||
        req.query.slug;
      const formSlug = rawSlug ? String(rawSlug) : undefined;

      const rawFormId =
        req.params.formId ||
        req.body?._formId ||
        req.body?.formId ||
        req.query.formId ||
        req.query._formId;
      const formId = rawFormId ? String(rawFormId) : undefined;

      const apiKey =
        (req.headers["x-api-key"] as string) ||
        (req.query.api_key as string) ||
        (req.query.apiKey as string) ||
        (req.body?._api_key as string) ||
        (req.body?.apiKey as string) ||
        (req.headers.authorization?.replace(/^Bearer\s+/i, ""));

      const clientIp =
        (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        "127.0.0.1";

      const result = await this.service.ingestSubmission({
        formSlug,
        formId,
        apiKey,
        body: req.body || {},
        headers: req.headers,
        ip: clientIp,
      });

      // If submission originated from a standard HTML form and has redirectUrl
      const isJson = req.headers["content-type"]?.includes("application/json");
      const isHtmlForm =
        !isJson &&
        (req.headers["content-type"]?.includes("application/x-www-form-urlencoded") ||
          req.headers["content-type"]?.includes("multipart/form-data") ||
          (req.headers.accept?.includes("text/html") && !req.headers.accept?.includes("application/json")));

      if (isHtmlForm && result.redirectUrl) {
        res.redirect(302, result.redirectUrl);
        return;
      }

      // If submitted via browser HTML form without custom redirect, present a polished confirmation card
      if (isHtmlForm && result.status === "success" && req.headers.accept?.includes("text/html")) {
        res.status(200).send(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Submission Received</title>
              <style>
                body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; padding: 1.5rem; box-sizing: border-box; }
                .card { background: white; padding: 2.5rem; border-radius: 1.25rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); max-width: 440px; width: 100%; text-align: center; border: 1px solid #e2e8f0; }
                .icon { width: 48px; height: 48px; background: #ecfdf5; color: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 22px; font-weight: bold; }
                h1 { font-size: 1.25rem; color: #0f172a; margin: 0 0 0.5rem; font-weight: 700; }
                p { color: #64748b; font-size: 0.95rem; line-height: 1.5; margin: 0 0 1.5rem; }
                .btn { display: inline-block; padding: 0.65rem 1.25rem; background: #2563eb; color: white; border-radius: 0.75rem; text-decoration: none; font-weight: 600; font-size: 0.875rem; }
                .btn:hover { background: #1d4ed8; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="icon">✓</div>
                <h1>Submission Received</h1>
                <p>Thank you! Your information has been securely received.</p>
                <a href="javascript:history.back()" class="btn">Return to previous page</a>
              </div>
            </body>
          </html>
        `);
        return;
      }

      const statusCode =
        result.statusCode ||
        (result.status === "success"
          ? 200
          : result.status === "quarantined"
            ? 202
            : 400);

      res.status(statusCode).json({
        success: result.status === "success",
        ...result,
      });
    } catch (error) {
      console.error("Error processing form submission:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process submission",
      });
    }
  };

  // ==========================================
  // SIMULATION & LEADS & SPAM
  // ==========================================

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
      console.error("Error updating lead status:", error);
      res.status(500).json({ success: false, error: "Failed to update lead status" });
    }
  };

  getSpam = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboardId = req.query.dashboardId as string | undefined;
      const spam = await this.service.getSpam(userId, dashboardId);

      res.status(200).json({ success: true, data: spam });
    } catch (error) {
      console.error("Error getting quarantined spam:", error);
      res.status(500).json({ success: false, error: "Failed to retrieve spam records" });
    }
  };

  rescueSpam = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const id = String(req.params.id);
      const rescued = await this.service.rescueSpamLead(userId, id);

      if (!rescued) {
        res.status(404).json({ success: false, error: "Spam record not found" });
        return;
      }

      res.status(200).json({ success: true, data: rescued });
    } catch (error) {
      console.error("Error rescuing spam record:", error);
      res.status(500).json({ success: false, error: "Failed to rescue spam record" });
    }
  };

  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const auth = getAuth(req);
      const userId = auth?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const dashboardId = req.query.dashboardId as string | undefined;
      const stats = await this.service.getStats(userId, dashboardId);

      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ success: false, error: "Failed to retrieve dashboard stats" });
    }
  };
}

export const formsAndApiController = new FormsAndApiController();

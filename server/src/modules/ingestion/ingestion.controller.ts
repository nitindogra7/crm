import type { Request, Response } from "express";
import { WorkspaceAccessError } from "../../errors";
import { IngestionService } from "./ingestion.services";

export class IngestionController {
  constructor(private readonly service: Pick<IngestionService, "ingestSubmission"> = new IngestionService()) {}
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

      const clientIp = req.ip || req.socket.remoteAddress || "127.0.0.1";

      const result = await this.service.ingestSubmission({
        formSlug,
        formId,
        apiKey,
        body: req.body || {},
        headers: req.headers,
        ip: clientIp,
        context: res.locals.ingestionContext,
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
                <div class="icon">&#10003;</div>
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
      if (error instanceof WorkspaceAccessError) {
        res.status(403).json({ success: false, error: error.message });
        return;
      }
      console.error("Error processing form submission:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process submission",
      });
    }
  };
}
export const ingestionController = new IngestionController();

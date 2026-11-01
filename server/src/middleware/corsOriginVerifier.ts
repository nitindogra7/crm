import type { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";

/**
 * Normalizes an origin or referer string:
 * - strips trailing slashes
 * - extracts lowercase protocol + host (or plain hostname)
 */
export function normalizeOrigin(raw?: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  try {
    const url = new URL(trimmed);
    return `${url.protocol}//${url.host}`.toLowerCase();
  } catch {
    // If not a full URL, strip protocol & trailing slashes
    return trimmed.toLowerCase().replace(/\/+$/, "");
  }
}

/**
 * Extracts pure domain hostname without port or scheme
 */
export function extractHostname(raw?: string | null): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    return url.hostname.toLowerCase();
  } catch {
    return trimmed
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .replace(/:\d+$/, "");
  }
}

/**
 * Checks whether request origin or referer matches the allowed origin pattern
 */
export function matchesAllowedOrigin(
  requestOriginOrReferer: string,
  allowedOriginPattern: string
): boolean {
  if (!requestOriginOrReferer || !allowedOriginPattern) return false;

  let request: URL;
  try {
    request = new URL(requestOriginOrReferer);
    if (!["http:", "https:"].includes(request.protocol) || request.username || request.password) {
      return false;
    }
  } catch {
    return false;
  }

  const allowed = allowedOriginPattern.trim().toLowerCase();
  if (allowed === "*") return true;

  // A configured URL includes its scheme and port in the allowlist.
  if (/^https?:\/\//.test(allowed)) {
    return request.origin.toLowerCase() === normalizeOrigin(allowed);
  }

  const hostname = request.hostname.toLowerCase();
  const allowedHost = extractHostname(allowed);
  const rootDomain = allowedHost.startsWith("*.") ? allowedHost.slice(2) : allowedHost;
  if (!rootDomain) return false;
  return hostname === rootDomain || hostname.endsWith(`.${rootDomain}`);
}

/**
 * Production-grade dynamic CORS & Origin Verification middleware for public forms & lead endpoints
 */
export async function dynamicFormCorsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const originHeader = (Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin) || "";
  const refererHeader = (Array.isArray(req.headers.referer) ? req.headers.referer[0] : req.headers.referer) || "";
  const incomingOrigin = originHeader || refererHeader;
  res.vary("Origin");
  res.setHeader("Cache-Control", "no-store");

  // Extract form identifier from params or URL path
  // Routes: /api/forms-and-api/f/:slug, /api/forms/f/:slug, /api/v1/f/:slug, /api/f/:slug,
  //         /api/forms-and-api/submit/:formId, /api/forms/submit/:formId
  let formSlug: string | undefined = req.params?.slug as string | undefined;
  let formId: string | undefined = req.params?.formId as string | undefined;

  if (!formSlug && !formId) {
    const matchSlug = req.path.match(/\/(?:f)\/([a-zA-Z0-9_-]+)/);
    if (matchSlug) {
      formSlug = matchSlug[1];
    }
    const matchId = req.path.match(/\/submit\/([a-zA-Z0-9_-]+)/);
    if (matchId) {
      formId = matchId[1];
    }
  }

  // Extract API Key from headers or body
  const apiKey =
    (req.headers["x-api-key"] as string) ||
    (req.body?.apiKey as string) ||
    (req.body?._api_key as string) ||
    (req.query.api_key as string) ||
    (req.query.apiKey as string) ||
    (req.headers.authorization?.replace(/^Bearer\s+/i, ""));

  try {
    let targetEnvironment = "development";
    let productionOrigin: string | null = null;
    let allowedOriginsList: string[] = [];
    let formAllowedDomains: string[] = [];

    const context: import("../modules/ingestion/ingestion-context").IngestionContext = {};
    res.locals.ingestionContext = context;

    // 1. If form slug or ID exists, lookup form and its parent dashboard
    if (formSlug || formId) {
      const form = formId
        ? await prisma.form.findUnique({
            where: { id: formId },
            include: { dashboard: true },
          })
        : await prisma.form.findFirst({
            where: { slug: formSlug },
            include: { dashboard: true },
          });

      if (form) {
        context.form = form;
        targetEnvironment = form.environment || "development";
        productionOrigin = form.dashboard?.productionOrigin || null;
        allowedOriginsList = form.dashboard?.allowedOrigins || [];
        formAllowedDomains = form.allowedDomains || [];
      }
    } else if (apiKey) {
      // 2. If submitted via API Key (e.g. /api/v1/leads), inspect the key and workspace
      const keyRecord = await prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: { dashboard: true },
      });

      if (keyRecord) {
        context.apiKey = keyRecord;
        targetEnvironment = keyRecord.environment || (keyRecord.keyPrefix.includes("live") ? "production" : "development");
        productionOrigin = keyRecord.dashboard?.productionOrigin || null;
        allowedOriginsList = keyRecord.dashboard?.allowedOrigins || [];
      }
    }

    // ==========================================
    // DEVELOPMENT MODE
    // ==========================================
    // In development mode, requests can come from anywhere (* or reflection)
    if (targetEnvironment === "development") {
      const allowOrigin = incomingOrigin ? normalizeOrigin(incomingOrigin) : "*";
      res.setHeader("Access-Control-Allow-Origin", allowOrigin);
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key, Accept");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("X-Environment", "development");

      if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
      }
      return next();
    }

    // ==========================================
    // PRODUCTION MODE
    // ==========================================
    // In production mode, Origin configuration is strictly mandatory.
    // Origin must be verified against workspace productionOrigin and allowed domains.
    res.setHeader("X-Environment", "production");

    // Check if mandatory production origin is set
    if (!productionOrigin) {
      res.status(403).json({
        success: false,
        status: "rejected",
        error: "Production Origin Required",
        message:
          "This workspace is running in Production mode, but no Production Origin has been configured. " +
          "It is mandatory to enter your verified website origin in Workspace Settings before accepting live submissions.",
      });
      return;
    }

    // Combine all permitted origins for this workspace & form
    const validOrigins = [
      productionOrigin,
      ...allowedOriginsList,
      ...formAllowedDomains,
    ].filter(Boolean) as string[];

    // If request has no Origin/Referer:
    // Only permit server-to-server calls that have a verified API Key
    if (!incomingOrigin) {
      if (apiKey) {
        // Authenticated backend-to-backend request with live API Key
        res.setHeader("Access-Control-Allow-Origin", normalizeOrigin(productionOrigin));
        return next();
      }

      res.status(403).json({
        success: false,
        status: "rejected",
        error: "CORS Origin Missing",
        message:
          "In production mode, web form submissions must include a valid Origin or Referer header matching your registered production origin.",
      });
      return;
    }

    // Verify if incoming origin matches any allowed origin
    const isAllowed = validOrigins.some((allowed) =>
      matchesAllowedOrigin(incomingOrigin, allowed)
    );

    if (!isAllowed) {
      const extracted = extractHostname(incomingOrigin);
      res.status(403).json({
        success: false,
        status: "rejected",
        error: "CORS Origin Denied",
        message: `Origin '${extracted || incomingOrigin}' is not permitted for this production workspace. Expected origin: '${productionOrigin}'.`,
      });
      return;
    }

    // Origin is verified and matched! Inject dynamic CORS headers
    const matchedAllowOrigin = normalizeOrigin(incomingOrigin);
    res.setHeader("Access-Control-Allow-Origin", matchedAllowOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key, Accept");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }

    return next();
  } catch (error) {
    console.error("Error in dynamicFormCorsMiddleware:", error);
    return next(error);
  }
}

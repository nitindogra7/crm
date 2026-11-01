import { Prisma } from "@prisma/client";
import { matchesAllowedOrigin } from "../../middleware/corsOriginVerifier";
import { prisma } from "../../prisma";
import { apikeysRepository, type ApiKeysRepository } from "../api-keys/api-keys.repository";
import type { ApiKeyRecord } from "../api-keys/api-keys.types";
import { dashboardsRepository, type DashboardsRepository } from "../dashboards/dashboards.repository";
import { formsRepository, type FormsRepository } from "../forms/forms.repository";
import type { FormRecord } from "../forms/forms.types";
import type { IngestSubmissionResult } from "../ingestion/ingestion.types";
import { legacyleadsRepository, type LegacyLeadsRepository } from "../leads/legacy-leads.repository";
import { spamRepository, type SpamRepository } from "../spam/spam.repository";

type Repository = Pick<ApiKeysRepository, "findApiKeyByKey" | "touchApiKeyLastUsed"> & Pick<DashboardsRepository, "findDashboardById"> & Pick<FormsRepository, "findFormByGlobalSlug" | "findFormById"> & Pick<LegacyLeadsRepository, "createLead"> & Pick<SpamRepository, "createSpam">;
const defaultRepository: Repository = {
  findApiKeyByKey: apikeysRepository.findApiKeyByKey.bind(apikeysRepository),
  touchApiKeyLastUsed: apikeysRepository.touchApiKeyLastUsed.bind(apikeysRepository),
  findDashboardById: dashboardsRepository.findDashboardById.bind(dashboardsRepository),
  findFormByGlobalSlug: formsRepository.findFormByGlobalSlug.bind(formsRepository),
  findFormById: formsRepository.findFormById.bind(formsRepository),
  createLead: legacyleadsRepository.createLead.bind(legacyleadsRepository),
  createSpam: spamRepository.createSpam.bind(spamRepository),
};

export class IngestionService {
  constructor(
    private readonly repository: Repository = defaultRepository,
  ) {}
  async ingestSubmission(params: {
    formSlug?: string;
    formId?: string;
    apiKey?: string;
    body: Record<string, unknown>;
    headers: Record<string, string | string[] | undefined>;
    ip?: string;
  }): Promise<IngestSubmissionResult> {
    const { formSlug, formId, apiKey, body, headers, ip } = params;

    // 1. Identify target form and/or API Key authentication
    let verifiedApiKey: ApiKeyRecord | null = null;
    let targetDashboardId: string | null = null;

    if (apiKey) {
      verifiedApiKey = await this.repository.findApiKeyByKey(apiKey);
      if (!verifiedApiKey || verifiedApiKey.revoked) {
        return {
          status: "rejected",
          statusCode: 401,
          message: "Invalid, expired, or revoked API key",
        };
      }
      await this.repository.touchApiKeyLastUsed(verifiedApiKey.id);
      targetDashboardId = verifiedApiKey.dashboardId;
    }

    // Look up form by ID or Slug
    let form: FormRecord | null = null;
    if (formId) {
      form = await this.repository.findFormById(formId);
    } else if (formSlug) {
      form = await this.repository.findFormByGlobalSlug(formSlug);
    }

    if ((formId || formSlug) && !form) {
      return { status: "rejected", statusCode: 404, message: "Target form not found" };
    }

    if (form && verifiedApiKey && form.environment !== verifiedApiKey.environment) {
      return {
        status: "rejected",
        statusCode: 403,
        message: "API key environment does not match the target form",
      };
    }

    // If form is found, verify API key alignment (if apiKey provided) and check if enabled
    if (form) {
      if (verifiedApiKey && verifiedApiKey.dashboardId !== form.dashboardId) {
        return {
          status: "rejected",
          statusCode: 403,
          message: "API key does not belong to the target form's workspace",
        };
      }

      if (!form.enabled) {
        return {
          status: "rejected",
          statusCode: 403,
          message: "Form submissions are currently paused by workspace owner",
        };
      }

      targetDashboardId = form.dashboardId;
    }

    // Determine target environment: inherited from Form or ApiKey, defaulting to development
    const targetEnvironment =
      form?.environment ||
      verifiedApiKey?.environment ||
      (verifiedApiKey?.keyPrefix?.includes("live") ? "production" : "development");

    const targetDashboard = targetDashboardId
      ? await this.repository.findDashboardById(targetDashboardId)
      : null;

    // ==========================================
    // PRODUCTION MODE STRICT ORIGIN VERIFICATION
    // ==========================================
    if (targetEnvironment === "production") {
      const prodOrigin = targetDashboard?.productionOrigin;
      if (!prodOrigin) {
        return {
          status: "rejected",
          statusCode: 403,
          message:
            "Production Origin Required: This workspace is running in Production mode, but no Production Origin has been configured in Settings. Submissions are rejected until a production origin is registered.",
        };
      }

      // Origin and referer headers
      const originHeader = (Array.isArray(headers.origin) ? headers.origin[0] : headers.origin) || "";
      const refHeader =
        (Array.isArray(headers.referer) ? headers.referer[0] : headers.referer) ||
        (Array.isArray(headers.referrer) ? headers.referrer[0] : headers.referrer) ||
        "";

      let requestHost = "";
      try {
        if (originHeader) {
          requestHost = new URL(originHeader).hostname.toLowerCase();
        } else if (refHeader && refHeader !== "Direct") {
          requestHost = new URL(refHeader).hostname.toLowerCase();
        }
      } catch {
        requestHost = "";
      }

      // If neither origin nor referer is provided, check if it's an authenticated backend API call with live key
      if (!originHeader && !refHeader) {
        if (!verifiedApiKey) {
          return {
            status: "rejected",
            statusCode: 403,
            message:
              "Origin Missing: Production web form submissions must include a valid Origin or Referer header matching your production origin.",
          };
        }
      } else {
        // Collect all authorized origins/domains
        const allowedPool = [
          prodOrigin,
          ...(targetDashboard?.allowedOrigins || []),
          ...(form?.allowedDomains || []),
        ];

        const isAllowed = allowedPool.some((allowed) =>
          matchesAllowedOrigin(originHeader || refHeader, allowed || "")
        );

        if (!isAllowed) {
          return {
            status: "rejected",
            statusCode: 403,
            message: `Origin Denied: Submissions from origin domain '${requestHost || "unspecified"}' are rejected in production mode. Configured production origin is '${prodOrigin}'.`,
          };
        }
      }
    } else {
      // In development mode, check optional per-form allowedDomains whitelist if explicitly configured
      if (form && form.allowedDomains && form.allowedDomains.length > 0 && !verifiedApiKey) {
        const originHeader = (Array.isArray(headers.origin) ? headers.origin[0] : headers.origin) || "";
        const refHeader =
          (Array.isArray(headers.referer) ? headers.referer[0] : headers.referer) ||
          (Array.isArray(headers.referrer) ? headers.referrer[0] : headers.referrer) ||
          "";

        let requestDomain = "";
        try {
          if (originHeader) {
            requestDomain = new URL(originHeader).hostname.toLowerCase();
          } else if (refHeader && refHeader !== "Direct") {
            requestDomain = new URL(refHeader).hostname.toLowerCase();
          }
        } catch {
          requestDomain = "";
        }

        const isOriginAllowed = form.allowedDomains.some((allowed) =>
          matchesAllowedOrigin(originHeader || refHeader, allowed)
        );

        if (!isOriginAllowed) {
          return {
            status: "rejected",
            statusCode: 403,
            message: `Submissions from domain '${requestDomain || "unspecified"}' are not permitted. Please add this domain to the form's Allowed Domains in your settings.`,
          };
        }
      }
    }

    // If neither form nor valid API key is present, reject as endpoint not found
    if (!form && !targetDashboardId) {
      return {
        status: "rejected",
        statusCode: 404,
        message: "Target form endpoint or API key not found",
      };
    }

    // Credentials authenticate the request; they must not become customer data.
    const storedPayload = Object.fromEntries(
      Object.entries(body).filter(([key]) => !["_api_key", "apiKey", "api_key"].includes(key))
    );

    // 2. Extract core fields & honeypots
    const honeypotTriggers = ["_gotcha", "_hp", "honeypot", "website_url_check", "bot_field"];
    let isHoneypotTriggered = false;
    let triggerReason = "";

    for (const hp of honeypotTriggers) {
      if (body[hp] !== undefined && body[hp] !== "" && body[hp] !== null) {
        isHoneypotTriggered = true;
        triggerReason = `Honeypot filled (${hp})`;
        break;
      }
    }

    // Time-trap bot check: real humans take more than 1.2s to fill a form
    const formTimeRaw = body._form_time ?? body._timestamp ?? body._render_time;
    if (formTimeRaw) {
      const renderTimestamp = Number(formTimeRaw);
      if (!isNaN(renderTimestamp) && renderTimestamp > 0) {
        const elapsedMs = Date.now() - renderTimestamp;
        if (elapsedMs < 1200 && elapsedMs > 0) {
          isHoneypotTriggered = true;
          triggerReason = triggerReason || `Rapid submission speed (${elapsedMs}ms, bot suspected)`;
        }
      }
    }

    // Extract name, email, message safely (handling non-string types without crashing)
    const rawName = body.name ?? body.fullName ?? body.senderName;
    const senderName =
      typeof rawName === "string" && rawName.trim()
        ? rawName.trim()
        : "Anonymous Contact";

    const rawEmail = body.email ?? body.senderEmail ?? body.workEmail;
    const senderEmail = typeof rawEmail === "string" ? rawEmail.trim() : "";

    const rawMessage = body.message ?? body.inquiry ?? body.comment;
    const message = typeof rawMessage === "string" ? rawMessage : "";

    // Heuristics: Email presence, syntax validation, disposable domains
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = senderEmail ? emailRegex.test(senderEmail) : false;

    if (!senderEmail) {
      isHoneypotTriggered = true;
      triggerReason = triggerReason || "Missing contact email address";
    } else if (!isValidEmail) {
      isHoneypotTriggered = true;
      triggerReason = triggerReason || "Invalid email format";
    } else {
      const disposableDomains = [
        "mailinator.com",
        "guerrillamail.com",
        "tempmail.com",
        "10minutemail.com",
        "trashmail.com",
      ];
      const emailParts = senderEmail.split("@");
      const emailDomain = emailParts[1]?.toLowerCase();
      if (emailDomain && disposableDomains.includes(emailDomain)) {
        isHoneypotTriggered = true;
        triggerReason = "Disposable email address detected";
      }
    }

    const userAgentHeader = headers["user-agent"];
    const userAgent = Array.isArray(userAgentHeader) ? userAgentHeader[0] : userAgentHeader || "Unknown";
    const refHeader = headers["referer"] || headers["referrer"];
    const referrer = Array.isArray(refHeader) ? refHeader[0] : refHeader || "Direct";
    const xffHeader = headers["x-forwarded-for"];
    const clientIp = ip || (Array.isArray(xffHeader) ? xffHeader[0] : (xffHeader as string)) || "127.0.0.1";

    const metadata = {
      ip: clientIp,
      userAgent,
      referrer,
    };

    // Prototype pollution prevention: block dangerous object keys
    const dangerousKeys = ["__proto__", "constructor", "prototype"];
    const coreKeys = [
      "name",
      "fullName",
      "senderName",
      "email",
      "senderEmail",
      "workEmail",
      "message",
      "inquiry",
      "comment",
      "_gotcha",
      "_hp",
      "honeypot",
      "_api_key",
      "apiKey",
      "api_key",
      "website_url_check",
      "formId",
      "_formId",
      "formSlug",
      "slug",
      "_slug",
      "dashboardId",
    ];

    const extraFields: Record<string, string> = Object.create(null);
    for (const [k, v] of Object.entries(body)) {
      if (
        !dangerousKeys.includes(k) &&
        !coreKeys.includes(k) &&
        v !== undefined &&
        v !== null &&
        v !== ""
      ) {
        extraFields[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
      }
    }

    // 3. If flagged as spam -> quarantine in Spam table
    if (isHoneypotTriggered) {
      let spamId: string | undefined;
      if (form) {
        const [spam] = await prisma.$transaction([
          prisma.spam.create({
            data: {
              dashboardId: targetDashboardId!,
              formId: form.id,
              formName: form.name,
              senderName,
              senderEmail: senderEmail || "unknown@unverified.net",
              disposition: "Quarantined",
              reason: triggerReason || "Suspicious submission payload",
              messageSnippet: message.slice(0, 200),
              rawPayload: storedPayload as Prisma.InputJsonValue,
              triggerRule: triggerReason || "heuristics",
              environment: targetEnvironment,
              metadata,
            },
          }),
          prisma.form.update({
            where: { id: form.id },
            data: { spamCount: { increment: 1 } },
          }),
        ]);
        spamId = spam.id;
      } else {
        const spam = await this.repository.createSpam({
          dashboardId: targetDashboardId!,
          formId: null,
          formName: "API Ingestion",
          senderName,
          senderEmail: senderEmail || "unknown@unverified.net",
          disposition: "Quarantined",
          reason: triggerReason || "Suspicious submission payload",
          messageSnippet: message.slice(0, 200),
          rawPayload: storedPayload as Prisma.InputJsonValue,
          triggerRule: triggerReason || "heuristics",
          environment: targetEnvironment,
          metadata,
        });
        spamId = spam.id;
      }

      return {
        status: "quarantined",
        statusCode: 202,
        spamId: verifiedApiKey ? spamId : undefined, // do not leak internal database IDs to anonymous visitors
        redirectUrl: form?.redirectUrl || undefined,
        message: "Submission received and quarantined for security inspection",
      };
    }

    // 4. Clean submission -> save to Leads table
    const source =
      body.source && typeof body.source === "string"
        ? body.source
        : (headers["referer"] as string)
          ? "Web Referral"
          : verifiedApiKey
            ? "API Integration"
            : "Website embed";

    let createdLeadId: string | undefined;
    if (form) {
      const [lead] = await prisma.$transaction([
        prisma.lead.create({
          data: {
            dashboardId: targetDashboardId!,
            formId: form.id,
            formName: form.name,
            name: senderName,
            email: senderEmail,
            message,
            source,
            status: "New",
            environment: targetEnvironment,
            extraFields: Object.keys(extraFields).length > 0 ? extraFields : undefined,
            metadata,
          },
        }),
        prisma.form.update({
          where: { id: form.id },
          data: { leadCount: { increment: 1 } },
        }),
      ]);
      createdLeadId = lead.id;
    } else {
      const lead = await this.repository.createLead({
        dashboardId: targetDashboardId!,
        formId: null,
        formName: "API Ingestion",
        name: senderName,
        email: senderEmail,
        message,
        source,
        status: "New",
        environment: targetEnvironment,
        extraFields: Object.keys(extraFields).length > 0 ? extraFields : undefined,
        metadata,
      });
      createdLeadId = lead.id;
    }

    return {
      status: "success",
      statusCode: 200,
      leadId: verifiedApiKey ? createdLeadId : undefined, // do not leak internal database IDs to anonymous visitors
      redirectUrl: form?.redirectUrl || undefined,
      message: "Lead captured successfully",
    };
  }
}

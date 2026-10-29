import crypto from "crypto";
import { prisma } from "../../prisma";
import { Prisma } from "@prisma/client";
import { formsAndApiRepository, FormsAndApiRepository } from "./formsAndApi.repository";
import type {
  CreateDashboardInput,
  CreateFormInput,
  UpdateFormInput,
  SimulateSubmissionInput,
  DashboardRecord,
  FormRecord,
  ApiKeyRecord,
  LeadRecord,
  SpamRecord,
  LeadStatus,
  GetLeadsQueryInput,
  IngestSubmissionResult,
} from "./formsAndApi.types";

export class FormsAndApiService {
  constructor(
    private readonly repository: FormsAndApiRepository = formsAndApiRepository
  ) {}

  // ==========================================
  // DASHBOARD / ORGANIZATIONS
  // ==========================================

  /**
   * Retrieves all organizations/dashboards for the user.
   * If none exist, auto-provisions one from existing Onboarding record or defaults.
   */
  async getOrCreateDashboards(userId: string): Promise<DashboardRecord[]> {
    let dashboards = await this.repository.findDashboardsByUserId(userId);

    if (dashboards.length === 0) {
      // Check onboarding record to seed first dashboard
      const onboarding = await prisma.onboarding.findUnique({
        where: { userId },
      });

      const name = onboarding?.name || "My Workspace";
      let slug = onboarding?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // Verify slug uniqueness
      let existing = await this.repository.findDashboardBySlug(slug);
      if (existing) {
        slug = `${slug}-${crypto.randomBytes(3).toString("hex")}`;
      }

      const newDashboard = await this.repository.createDashboard({
        userId,
        name,
        slug,
        ownerEmail: onboarding?.ownerEmail || null,
        avatarTone: onboarding?.avatarTone || "zinc",
        plan: onboarding?.teamSize === "solo" ? "Free Tier" : "Team Workspace",
      });

      // Auto-provision initial workspace API Key
      await this.generateApiKey(userId, newDashboard.id, "Default API Key", "live");

      dashboards = [newDashboard];
    }

    return dashboards;
  }

  async createDashboard(
    userId: string,
    input: CreateDashboardInput
  ): Promise<DashboardRecord> {
    let candidateSlug = input.slug;
    let existing = await this.repository.findDashboardBySlug(candidateSlug);
    let attempts = 0;

    while (existing && attempts < 5) {
      candidateSlug = `${input.slug.slice(0, 45)}-${crypto.randomBytes(2).toString("hex")}`;
      existing = await this.repository.findDashboardBySlug(candidateSlug);
      attempts++;
    }

    const dashboard = await this.repository.createDashboard({
      userId,
      name: input.name,
      slug: candidateSlug,
      organizationId: input.organizationId ?? null,
      ownerEmail: input.ownerEmail ?? null,
      avatarTone: input.avatarTone ?? "zinc",
      plan: input.plan ?? "Free Tier",
    });

    // Auto-create API Key for the new organization
    await this.generateApiKey(userId, dashboard.id, "Workspace API Key", "live");

    return dashboard;
  }

  async getDashboardById(
    userId: string,
    dashboardId: string
  ): Promise<DashboardRecord | null> {
    const dashboard = await this.repository.findDashboardById(dashboardId);
    if (!dashboard || dashboard.userId !== userId) {
      return null;
    }
    return dashboard;
  }

  async updateDashboard(
    userId: string,
    dashboardId: string,
    updates: Partial<CreateDashboardInput>
  ): Promise<DashboardRecord | null> {
    const dashboard = await this.getDashboardById(userId, dashboardId);
    if (!dashboard) return null;

    return this.repository.updateDashboard(dashboardId, {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.slug !== undefined && { slug: updates.slug }),
      ...(updates.ownerEmail !== undefined && { ownerEmail: updates.ownerEmail || null }),
      ...(updates.avatarTone !== undefined && { avatarTone: updates.avatarTone }),
      ...(updates.plan !== undefined && { plan: updates.plan }),
    });
  }

  private async resolveDashboardId(
    userId: string,
    providedDashboardId?: string
  ): Promise<string> {
    if (providedDashboardId) {
      const db = await this.repository.findDashboardById(providedDashboardId);
      if (db && db.userId === userId) {
        return db.id;
      }
      if (db && db.userId !== userId) {
        throw new Error("Access denied: You do not have access to this workspace");
      }
    }
    const dashboards = await this.getOrCreateDashboards(userId);
    return dashboards[0].id;
  }

  // ==========================================
  // FORMS
  // ==========================================

  async createForm(userId: string, input: CreateFormInput): Promise<FormRecord> {
    const dashboardId = await this.resolveDashboardId(userId, input.dashboardId);

    const baseSlug =
      input.slug ||
      input.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      "form";

    let finalSlug = baseSlug;
    let existing = await this.repository.findFormByGlobalSlug(finalSlug);
    let counter = 1;

    while (existing) {
      finalSlug = `${baseSlug}-${counter}`;
      existing = await this.repository.findFormByGlobalSlug(finalSlug);
      counter++;
    }

    const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const endpointUrl = `${backendUrl}/api/forms-and-api/f/${finalSlug}`;

    return this.repository.createForm({
      dashboardId,
      name: input.name,
      slug: finalSlug,
      endpointUrl,
      redirectUrl: input.redirectUrl || null,
      fields: input.fields || [],
    });
  }

  async getForms(userId: string, dashboardId?: string): Promise<FormRecord[]> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    return this.repository.findFormsByDashboardId(targetDashboardId);
  }

  async getFormById(userId: string, formId: string): Promise<FormRecord | null> {
    const form = await this.repository.findFormById(formId);
    if (!form) return null;
    const dashboard = await this.repository.findDashboardById(form.dashboardId);
    if (!dashboard || dashboard.userId !== userId) return null;
    return form;
  }

  async updateForm(
    userId: string,
    formId: string,
    updates: UpdateFormInput
  ): Promise<FormRecord | null> {
    const form = await this.getFormById(userId, formId);
    if (!form) return null;

    let newEndpointUrl = form.endpointUrl;
    let finalSlug = form.slug;
    if (updates.slug && updates.slug !== form.slug) {
      let candidateSlug = updates.slug;
      let existing = await this.repository.findFormByGlobalSlug(candidateSlug);
      let counter = 1;
      while (existing && existing.id !== formId) {
        candidateSlug = `${updates.slug}-${counter}`;
        existing = await this.repository.findFormByGlobalSlug(candidateSlug);
        counter++;
      }
      finalSlug = candidateSlug;
      const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      newEndpointUrl = `${backendUrl}/api/forms-and-api/f/${finalSlug}`;
    }

    return this.repository.updateForm(formId, {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.slug !== undefined && { slug: finalSlug, endpointUrl: newEndpointUrl }),
      ...(updates.enabled !== undefined && { enabled: updates.enabled }),
      ...(updates.redirectUrl !== undefined && { redirectUrl: updates.redirectUrl ? updates.redirectUrl : null }),
      ...(updates.fields !== undefined && { fields: updates.fields }),
    });
  }

  async deleteForm(userId: string, formId: string): Promise<boolean> {
    const form = await this.getFormById(userId, formId);
    if (!form) return false;
    await this.repository.deleteForm(formId);
    return true;
  }

  // ==========================================
  // API KEYS
  // ==========================================

  async getApiKeys(userId: string, dashboardId?: string): Promise<ApiKeyRecord[]> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    return this.repository.findApiKeysByDashboardId(targetDashboardId);
  }

  async generateApiKey(
    userId: string,
    dashboardId?: string,
    name: string = "Live API Key",
    env: "live" | "test" = "live"
  ): Promise<ApiKeyRecord> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    const prefix = `sln_${env}_`;
    const randomHex = crypto.randomBytes(16).toString("hex");
    const fullKey = `${prefix}${randomHex}`;

    return this.repository.createApiKey({
      dashboardId: targetDashboardId,
      name,
      key: fullKey,
      keyPrefix: prefix,
      fullKeyMock: fullKey,
    });
  }

  async regenerateApiKey(
    userId: string,
    dashboardId?: string
  ): Promise<ApiKeyRecord> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    // Revoke previous keys
    await this.repository.revokeAllActiveKeysForDashboard(targetDashboardId);
    // Create new one
    return this.generateApiKey(userId, targetDashboardId, "Live API Key", "live");
  }

  async revokeApiKey(userId: string, apiKeyId: string): Promise<boolean> {
    // Validate ownership
    const key = await prisma.apiKey.findUnique({
      where: { id: apiKeyId },
      include: { dashboard: true },
    });
    if (!key || key.dashboard.userId !== userId) {
      return false;
    }
    await this.repository.revokeApiKey(apiKeyId);
    return true;
  }

  // ==========================================
  // FORM INGESTION & SUBMISSIONS
  // ==========================================

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

    // If neither form nor valid API key is present, reject as endpoint not found
    if (!form && !targetDashboardId) {
      return {
        status: "rejected",
        statusCode: 404,
        message: "Target form endpoint or API key not found",
      };
    }

    // 2. Extract core fields & honeypots
    const honeypotTriggers = ["_gotcha", "_hp", "honeypot", "website_url_check"];
    let isHoneypotTriggered = false;
    let triggerReason = "";

    for (const hp of honeypotTriggers) {
      if (body[hp] !== undefined && body[hp] !== "" && body[hp] !== null) {
        isHoneypotTriggered = true;
        triggerReason = `Honeypot filled (${hp})`;
        break;
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
      const spam = await this.repository.createSpam({
        dashboardId: targetDashboardId!,
        formId: form ? form.id : null,
        formName: form ? form.name : "API Ingestion",
        senderName,
        senderEmail: senderEmail || "unknown@unverified.net",
        disposition: "Quarantined",
        reason: triggerReason || "Suspicious submission payload",
        messageSnippet: message.slice(0, 200),
        rawPayload: body as Prisma.InputJsonValue,
        triggerRule: triggerReason || "heuristics",
        metadata,
      });

      if (form) {
        await this.repository.incrementSpamCount(form.id);
      }

      return {
        status: "quarantined",
        statusCode: 202,
        spamId: verifiedApiKey ? spam.id : undefined, // do not leak internal database IDs to anonymous visitors
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

    const lead = await this.repository.createLead({
      dashboardId: targetDashboardId!,
      formId: form ? form.id : null,
      formName: form ? form.name : "API Ingestion",
      name: senderName,
      email: senderEmail,
      message,
      source,
      status: "New",
      extraFields: Object.keys(extraFields).length > 0 ? extraFields : undefined,
      metadata,
    });

    if (form) {
      await this.repository.incrementLeadCount(form.id);
    }

    return {
      status: "success",
      statusCode: 200,
      leadId: verifiedApiKey ? lead.id : undefined, // do not leak internal database IDs to anonymous visitors
      redirectUrl: form?.redirectUrl || undefined,
      message: "Lead captured successfully",
    };
  }

  async simulateLead(
    userId: string,
    input: SimulateSubmissionInput
  ): Promise<LeadRecord> {
    const dashboardId = await this.resolveDashboardId(userId, input.dashboardId);
    let validFormId: string | null = null;
    let formName = "Sandbox Simulator";

    if (input.formId) {
      const form = await this.repository.findFormById(input.formId);
      // ONLY link if form actually exists AND belongs to the user's dashboard!
      if (form && form.dashboardId === dashboardId) {
        validFormId = form.id;
        formName = form.name;
        await this.repository.incrementLeadCount(form.id);
      }
    }

    const lead = await this.repository.createLead({
      dashboardId,
      formId: validFormId,
      formName,
      name: input.name,
      email: input.email,
      message: input.message,
      source: input.source || "Sandbox Simulator",
      status: "New",
      extraFields: input.extraFields,
    });

    return lead;
  }

  // ==========================================
  // LEADS & SPAM MANAGEMENT
  // ==========================================

  async getLeads(
    userId: string,
    query?: GetLeadsQueryInput
  ): Promise<{
    items: LeadRecord[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const targetDashboardId = await this.resolveDashboardId(
      userId,
      query?.dashboardId
    );

    const result = await this.repository.findLeadsWithPagination({
      dashboardId: targetDashboardId,
      page: query?.page,
      limit: query?.limit,
      search: query?.search,
      formId: query?.formId,
      source: query?.source,
      status: query?.status,
      dateRange: query?.dateRange,
    });

    return {
      items: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getAllLeads(
    userId: string,
    dashboardId?: string
  ): Promise<LeadRecord[]> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    return this.repository.findLeadsByDashboardId(targetDashboardId);
  }

  async updateLeadStatus(
    userId: string,
    leadId: string,
    status: LeadStatus
  ): Promise<LeadRecord | null> {
    const lead = await this.repository.findLeadById(leadId);
    if (!lead) return null;
    const dashboard = await this.repository.findDashboardById(lead.dashboardId);
    if (!dashboard || dashboard.userId !== userId) return null;

    return this.repository.updateLeadStatus(leadId, status);
  }

  async deleteLead(userId: string, leadId: string): Promise<boolean> {
    const lead = await this.repository.findLeadById(leadId);
    if (!lead) return false;
    const dashboard = await this.repository.findDashboardById(lead.dashboardId);
    if (!dashboard || dashboard.userId !== userId) return false;

    await this.repository.deleteLead(leadId);
    return true;
  }

  async batchDeleteLeads(
    userId: string,
    leadIds: string[],
    dashboardId?: string
  ): Promise<{ count: number }> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    const count = await this.repository.deleteLeads(targetDashboardId, leadIds);
    return { count };
  }

  async batchUpdateLeadStatus(
    userId: string,
    leadIds: string[],
    status: LeadStatus,
    dashboardId?: string
  ): Promise<{ count: number }> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    const count = await this.repository.batchUpdateLeadStatus(
      targetDashboardId,
      leadIds,
      status
    );
    return { count };
  }

  async getSpam(userId: string, dashboardId?: string): Promise<SpamRecord[]> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    return this.repository.findSpamByDashboardId(targetDashboardId);
  }

  async rescueSpamLead(userId: string, spamId: string): Promise<LeadRecord | null> {
    const spam = await this.repository.findSpamById(spamId);
    if (!spam) return null;
    const dashboard = await this.repository.findDashboardById(spam.dashboardId);
    if (!dashboard || dashboard.userId !== userId) return null;

    // Extract full message and extra fields from rawPayload if available
    let fullMessage = spam.messageSnippet;
    let extraFields: Record<string, string> | undefined = undefined;

    if (
      spam.rawPayload &&
      typeof spam.rawPayload === "object" &&
      !Array.isArray(spam.rawPayload)
    ) {
      const payload = spam.rawPayload as Record<string, unknown>;
      const rawMsg = payload.message ?? payload.inquiry ?? payload.comment;
      if (typeof rawMsg === "string" && rawMsg.trim()) {
        fullMessage = rawMsg;
      }

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
      ];

      const extracted: Record<string, string> = Object.create(null);
      for (const [k, v] of Object.entries(payload)) {
        if (
          !coreKeys.includes(k) &&
          !dangerousKeys.includes(k) &&
          v !== undefined &&
          v !== null &&
          v !== ""
        ) {
          extracted[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
        }
      }
      if (Object.keys(extracted).length > 0) {
        extraFields = extracted;
      }
    }

    // Create lead from rescued spam data
    const lead = await this.repository.createLead({
      dashboardId: spam.dashboardId,
      formId: spam.formId,
      formName: spam.formName,
      name: spam.senderName,
      email: spam.senderEmail,
      message: fullMessage,
      source: "Rescued from Quarantine",
      status: "New",
      extraFields,
      metadata: spam.metadata || undefined,
    });

    // Increment leadCount, decrement spamCount, and remove from spam
    if (spam.formId) {
      await this.repository.incrementLeadCount(spam.formId);
      await this.repository.decrementSpamCount(spam.formId);
    }
    await this.repository.deleteSpam(spam.id);

    return lead;
  }

  async getStats(
    userId: string,
    dashboardId?: string
  ): Promise<{
    totalLeads: number;
    leadsToday: number;
    leadsThisWeek: number;
    spamFlagged: number;
  }> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    return this.repository.getStats(targetDashboardId);
  }
}

export const formsAndApiService = new FormsAndApiService();

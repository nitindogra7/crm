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

    // 1. Find the target form
    let form: FormRecord | null = null;
    if (formId) {
      form = await this.repository.findFormById(formId);
    } else if (formSlug) {
      form = await this.repository.findFormByGlobalSlug(formSlug);
    }

    if (!form) {
      return {
        status: "quarantined",
        message: "Target form endpoint not found",
      };
    }

    if (!form.enabled) {
      return {
        status: "quarantined",
        message: "Form submissions are currently paused by workspace owner",
      };
    }

    // 2. Validate API key if provided, or verify against dashboard key
    let verifiedApiKey: ApiKeyRecord | null = null;
    if (apiKey) {
      verifiedApiKey = await this.repository.findApiKeyByKey(apiKey);
      if (!verifiedApiKey || verifiedApiKey.revoked || verifiedApiKey.dashboardId !== form.dashboardId) {
        return {
          status: "quarantined",
          message: "Invalid, expired, or revoked API key",
        };
      }
      await this.repository.touchApiKeyLastUsed(verifiedApiKey.id);
    }

    // 3. Extract core fields & honeypots
    const honeypotTriggers = ["_gotcha", "_hp", "honeypot", "fax", "website_url_check"];
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

    // Basic heuristic: check disposable email
    const disposableDomains = ["mailinator.com", "guerrillamail.com", "tempmail.com", "10minutemail.com"];
    const emailParts = senderEmail.includes("@") ? senderEmail.split("@") : [];
    const emailDomain = emailParts[1]?.toLowerCase();
    const isDisposableEmail = emailDomain ? disposableDomains.includes(emailDomain) : false;

    if (isDisposableEmail) {
      isHoneypotTriggered = true;
      triggerReason = "Disposable email address detected";
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

    // Separate extra fields (capture any custom string, number, or boolean fields)
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
      "fax",
      "website_url_check",
    ];
    const extraFields: Record<string, string> = {};
    for (const [k, v] of Object.entries(body)) {
      if (!coreKeys.includes(k) && v !== undefined && v !== null && v !== "") {
        extraFields[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
      }
    }

    // 4. If flagged as spam -> quarantine in Spam table
    if (isHoneypotTriggered || !senderEmail) {
      const spam = await this.repository.createSpam({
        dashboardId: form.dashboardId,
        formId: form.id,
        formName: form.name,
        senderName,
        senderEmail: senderEmail || "unknown@unverified.net",
        disposition: "Quarantined",
        reason: triggerReason || "Missing contact email or suspicious payload",
        messageSnippet: message.slice(0, 200),
        rawPayload: body as Prisma.InputJsonValue,
        triggerRule: triggerReason || "heuristics",
        metadata,
      });

      await this.repository.incrementSpamCount(form.id);

      return {
        status: "quarantined",
        spamId: spam.id,
        redirectUrl: form.redirectUrl || undefined,
        message: "Submission received and quarantined for security inspection",
      };
    }

    // 5. Clean submission -> save to Leads table
    const lead = await this.repository.createLead({
      dashboardId: form.dashboardId,
      formId: form.id,
      formName: form.name,
      name: senderName,
      email: senderEmail,
      message,
      source: (headers["referer"] as string) ? "Web Referral" : "Website embed",
      status: "New",
      extraFields: Object.keys(extraFields).length > 0 ? extraFields : undefined,
      metadata,
    });

    await this.repository.incrementLeadCount(form.id);

    return {
      status: "success",
      leadId: lead.id,
      redirectUrl: form.redirectUrl || undefined,
      message: "Lead captured successfully",
    };
  }

  async simulateLead(
    userId: string,
    input: SimulateSubmissionInput
  ): Promise<LeadRecord> {
    const dashboardId = await this.resolveDashboardId(userId, input.dashboardId);
    const form = await this.repository.findFormById(input.formId);

    const lead = await this.repository.createLead({
      dashboardId,
      formId: input.formId,
      formName: form?.name || "Quick Test Form",
      name: input.name,
      email: input.email,
      message: input.message,
      source: input.source || "Sandbox Simulator",
      status: "New",
      extraFields: input.extraFields,
    });

    if (form) {
      await this.repository.incrementLeadCount(form.id);
    }

    return lead;
  }

  // ==========================================
  // LEADS & SPAM MANAGEMENT
  // ==========================================

  async getLeads(userId: string, dashboardId?: string): Promise<LeadRecord[]> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    return this.repository.findLeadsByDashboardId(targetDashboardId);
  }

  async updateLeadStatus(
    userId: string,
    leadId: string,
    status: "New" | "Contacted"
  ): Promise<LeadRecord | null> {
    const lead = await this.repository.findLeadById(leadId);
    if (!lead) return null;
    const dashboard = await this.repository.findDashboardById(lead.dashboardId);
    if (!dashboard || dashboard.userId !== userId) return null;

    return this.repository.updateLeadStatus(leadId, status);
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

    // Create lead from spam data
    const lead = await this.repository.createLead({
      dashboardId: spam.dashboardId,
      formId: spam.formId,
      formName: spam.formName,
      name: spam.senderName,
      email: spam.senderEmail,
      message: spam.messageSnippet,
      source: "Rescued from Quarantine",
      status: "New",
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

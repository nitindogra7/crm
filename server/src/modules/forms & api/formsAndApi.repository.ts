import { prisma } from "../../prisma";
import { Prisma } from "@prisma/client";
import type {
  DashboardRecord,
  FormRecord,
  ApiKeyRecord,
  LeadRecord,
  SpamRecord,
} from "./formsAndApi.types";

export class FormsAndApiRepository {
  // ==========================================
  // DASHBOARD / ORGANIZATIONS
  // ==========================================

  async createDashboard(data: {
    userId: string;
    name: string;
    slug: string;
    organizationId?: string | null;
    ownerEmail?: string | null;
    avatarTone?: string;
    plan?: string;
  }): Promise<DashboardRecord> {
    return prisma.dashboard.create({
      data: {
        userId: data.userId,
        name: data.name,
        slug: data.slug,
        organizationId: data.organizationId ?? null,
        ownerEmail: data.ownerEmail ?? null,
        avatarTone: data.avatarTone ?? "zinc",
        plan: data.plan ?? "Free Tier",
      },
    });
  }

  async findDashboardsByUserId(userId: string): Promise<DashboardRecord[]> {
    return prisma.dashboard.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async findDashboardById(id: string): Promise<DashboardRecord | null> {
    return prisma.dashboard.findUnique({
      where: { id },
    });
  }

  async findDashboardBySlug(slug: string): Promise<DashboardRecord | null> {
    return prisma.dashboard.findUnique({
      where: { slug },
    });
  }

  async updateDashboard(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      ownerEmail: string | null;
      avatarTone: string;
      plan: string;
    }>
  ): Promise<DashboardRecord> {
    return prisma.dashboard.update({
      where: { id },
      data,
    });
  }

  // ==========================================
  // FORMS
  // ==========================================

  async createForm(data: {
    dashboardId: string;
    name: string;
    slug: string;
    endpointUrl: string;
    redirectUrl?: string | null;
    fields: Prisma.InputJsonValue;
  }): Promise<FormRecord> {
    return prisma.form.create({
      data: {
        dashboardId: data.dashboardId,
        name: data.name,
        slug: data.slug,
        endpointUrl: data.endpointUrl,
        redirectUrl: data.redirectUrl ?? null,
        fields: data.fields,
        enabled: true,
        leadCount: 0,
        spamCount: 0,
      },
    });
  }

  async findFormsByDashboardId(dashboardId: string): Promise<FormRecord[]> {
    return prisma.form.findMany({
      where: { dashboardId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findFormById(id: string): Promise<FormRecord | null> {
    return prisma.form.findUnique({
      where: { id },
    });
  }

  async findFormByDashboardAndSlug(
    dashboardId: string,
    slug: string
  ): Promise<FormRecord | null> {
    return prisma.form.findUnique({
      where: {
        dashboardId_slug: {
          dashboardId,
          slug,
        },
      },
    });
  }

  async findFormByGlobalSlug(slug: string): Promise<FormRecord | null> {
    return prisma.form.findFirst({
      where: { slug },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateForm(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      endpointUrl: string;
      enabled: boolean;
      redirectUrl: string | null;
      fields: Prisma.InputJsonValue;
    }>
  ): Promise<FormRecord> {
    return prisma.form.update({
      where: { id },
      data,
    });
  }

  async deleteForm(id: string): Promise<FormRecord> {
    return prisma.form.delete({
      where: { id },
    });
  }

  async incrementLeadCount(formId: string): Promise<void> {
    await prisma.form.update({
      where: { id: formId },
      data: { leadCount: { increment: 1 } },
    });
  }

  async incrementSpamCount(formId: string): Promise<void> {
    await prisma.form.update({
      where: { id: formId },
      data: { spamCount: { increment: 1 } },
    });
  }

  async decrementSpamCount(formId: string): Promise<void> {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { spamCount: true },
    });
    if (form && form.spamCount > 0) {
      await prisma.form.update({
        where: { id: formId },
        data: { spamCount: { decrement: 1 } },
      });
    }
  }

  // ==========================================
  // API KEYS
  // ==========================================

  async createApiKey(data: {
    dashboardId: string;
    name: string;
    key: string;
    keyPrefix: string;
    fullKeyMock?: string | null;
  }): Promise<ApiKeyRecord> {
    return prisma.apiKey.create({
      data: {
        dashboardId: data.dashboardId,
        name: data.name,
        key: data.key,
        keyPrefix: data.keyPrefix,
        fullKeyMock: data.fullKeyMock ?? data.key,
        revoked: false,
      },
    });
  }

  async findApiKeysByDashboardId(dashboardId: string): Promise<ApiKeyRecord[]> {
    return prisma.apiKey.findMany({
      where: { dashboardId, revoked: false },
      orderBy: { createdAt: "desc" },
    });
  }

  async findApiKeyByKey(key: string): Promise<ApiKeyRecord | null> {
    return prisma.apiKey.findUnique({
      where: { key },
    });
  }

  async revokeApiKey(id: string): Promise<ApiKeyRecord> {
    return prisma.apiKey.update({
      where: { id },
      data: { revoked: true },
    });
  }

  async revokeAllActiveKeysForDashboard(dashboardId: string): Promise<void> {
    await prisma.apiKey.updateMany({
      where: { dashboardId, revoked: false },
      data: { revoked: true },
    });
  }

  async touchApiKeyLastUsed(id: string): Promise<void> {
    await prisma.apiKey.update({
      where: { id },
      data: { lastUsedAt: new Date() },
    });
  }

  // ==========================================
  // LEADS
  // ==========================================

  async createLead(data: {
    dashboardId: string;
    formId?: string | null;
    formName: string;
    name: string;
    email: string;
    message?: string;
    source?: string;
    status?: string;
    extraFields?: Prisma.InputJsonValue;
    metadata?: Prisma.InputJsonValue;
  }): Promise<LeadRecord> {
    return prisma.lead.create({
      data: {
        dashboardId: data.dashboardId,
        formId: data.formId ?? null,
        formName: data.formName,
        name: data.name,
        email: data.email,
        message: data.message ?? "",
        source: data.source ?? "Website embed",
        status: data.status ?? "New",
        extraFields: data.extraFields ?? Prisma.JsonNull,
        metadata: data.metadata ?? Prisma.JsonNull,
      },
    });
  }

  async findLeadsByDashboardId(dashboardId: string): Promise<LeadRecord[]> {
    return prisma.lead.findMany({
      where: { dashboardId },
      orderBy: { receivedAt: "desc" },
    });
  }

  async findLeadById(id: string): Promise<LeadRecord | null> {
    return prisma.lead.findUnique({
      where: { id },
    });
  }

  async updateLeadStatus(id: string, status: string): Promise<LeadRecord> {
    return prisma.lead.update({
      where: { id },
      data: { status },
    });
  }

  // ==========================================
  // SPAM
  // ==========================================

  async createSpam(data: {
    dashboardId: string;
    formId?: string | null;
    formName: string;
    senderName: string;
    senderEmail: string;
    disposition?: string;
    reason: string;
    messageSnippet?: string;
    rawPayload: Prisma.InputJsonValue;
    triggerRule?: string;
    metadata?: Prisma.InputJsonValue;
  }): Promise<SpamRecord> {
    return prisma.spam.create({
      data: {
        dashboardId: data.dashboardId,
        formId: data.formId ?? null,
        formName: data.formName,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        disposition: data.disposition ?? "Quarantined",
        reason: data.reason,
        messageSnippet: data.messageSnippet ?? "",
        rawPayload: data.rawPayload,
        triggerRule: data.triggerRule ?? "honeypot",
        metadata: data.metadata ?? Prisma.JsonNull,
      },
    });
  }

  async findSpamByDashboardId(dashboardId: string): Promise<SpamRecord[]> {
    return prisma.spam.findMany({
      where: { dashboardId },
      orderBy: { receivedAt: "desc" },
    });
  }

  async findSpamById(id: string): Promise<SpamRecord | null> {
    return prisma.spam.findUnique({
      where: { id },
    });
  }

  async deleteSpam(id: string): Promise<SpamRecord> {
    return prisma.spam.delete({
      where: { id },
    });
  }

  // ==========================================
  // STATS
  // ==========================================

  async getStats(dashboardId: string): Promise<{
    totalLeads: number;
    leadsToday: number;
    leadsThisWeek: number;
    spamFlagged: number;
  }> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);

    const [totalLeads, leadsToday, leadsThisWeek, spamFlagged] = await Promise.all([
      prisma.lead.count({ where: { dashboardId } }),
      prisma.lead.count({
        where: {
          dashboardId,
          receivedAt: { gte: startOfToday },
        },
      }),
      prisma.lead.count({
        where: {
          dashboardId,
          receivedAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.spam.count({ where: { dashboardId } }),
    ]);

    return {
      totalLeads,
      leadsToday,
      leadsThisWeek,
      spamFlagged,
    };
  }
}

export const formsAndApiRepository = new FormsAndApiRepository();

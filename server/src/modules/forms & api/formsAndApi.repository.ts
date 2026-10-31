import { prisma, sqlTable } from "../../prisma";
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
    productionOrigin?: string | null;
    allowedOrigins?: string[];
    activeEnvironment?: string;
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
        productionOrigin: data.productionOrigin ?? null,
        allowedOrigins: data.allowedOrigins ?? [],
        activeEnvironment: data.activeEnvironment ?? "development",
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
      productionOrigin: string | null;
      allowedOrigins: string[];
      activeEnvironment: string;
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
    environment?: string;
    redirectUrl?: string | null;
    allowedDomains?: string[];
    fields: Prisma.InputJsonValue;
  }): Promise<FormRecord> {
    return prisma.form.create({
      data: {
        dashboardId: data.dashboardId,
        name: data.name,
        slug: data.slug,
        endpointUrl: data.endpointUrl,
        environment: data.environment ?? "development",
        redirectUrl: data.redirectUrl ?? null,
        allowedDomains: data.allowedDomains ?? [],
        fields: data.fields,
        enabled: true,
        leadCount: 0,
        spamCount: 0,
      },
    });
  }

  async findFormsByDashboardId(dashboardId: string, environment?: string): Promise<FormRecord[]> {
    const where: Prisma.FormWhereInput = { dashboardId };
    if (environment) {
      where.environment = environment;
    }
    return prisma.form.findMany({
      where,
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
      environment: string;
      redirectUrl: string | null;
      allowedDomains: string[];
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

  async decrementSpamCount(formId: string, count: number = 1): Promise<void> {
    await prisma.$executeRaw`
      UPDATE ${sqlTable("forms")}
      SET "spamCount" = GREATEST(0, "spamCount" - ${count})
      WHERE "id" = ${formId}
    `;
  }

  async decrementLeadCount(formId: string, count: number = 1): Promise<void> {
    await prisma.$executeRaw`
      UPDATE ${sqlTable("forms")}
      SET "leadCount" = GREATEST(0, "leadCount" - ${count})
      WHERE "id" = ${formId}
    `;
  }

  // ==========================================
  // API KEYS
  // ==========================================

  async createApiKey(data: {
    dashboardId: string;
    name: string;
    key: string;
    keyPrefix: string;
    environment?: string;
    fullKeyMock?: string | null;
  }): Promise<ApiKeyRecord> {
    return prisma.apiKey.create({
      data: {
        dashboardId: data.dashboardId,
        name: data.name,
        key: data.key,
        keyPrefix: data.keyPrefix,
        environment: data.environment ?? (data.keyPrefix.includes("live") ? "production" : "development"),
        fullKeyMock: data.fullKeyMock ?? data.key,
        revoked: false,
      },
    });
  }

  async findApiKeysByDashboardId(dashboardId: string, environment?: string): Promise<ApiKeyRecord[]> {
    const where: Prisma.ApiKeyWhereInput = { dashboardId, revoked: false };
    if (environment) {
      where.environment = environment;
    }
    return prisma.apiKey.findMany({
      where,
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

  async revokeAllActiveKeysForDashboard(dashboardId: string, environment?: string): Promise<void> {
    const where: Prisma.ApiKeyWhereInput = { dashboardId, revoked: false };
    if (environment) {
      where.environment = environment;
    }
    await prisma.apiKey.updateMany({
      where,
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
    environment?: string;
    extraFields?: Prisma.InputJsonValue;
    metadata?: Prisma.InputJsonValue;
  }): Promise<LeadRecord> {
    return prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          dashboardId: data.dashboardId,
          formId: data.formId ?? null,
          formName: data.formName,
          name: data.name,
          email: data.email,
          message: data.message ?? "",
          source: data.source ?? "Website embed",
          status: data.status ?? "New",
          environment: data.environment ?? "development",
          extraFields: data.extraFields ?? Prisma.JsonNull,
          metadata: data.metadata ?? Prisma.JsonNull,
        },
      });
      if (lead.formId) {
        await tx.form.update({
          where: { id: lead.formId },
          data: { leadCount: { increment: 1 } },
        });
      }
      return lead;
    });
  }

  async findLeadsByDashboardId(dashboardId: string, environment?: string): Promise<LeadRecord[]> {
    const where: Prisma.LeadWhereInput = { dashboardId };
    if (environment) {
      where.environment = environment;
    }
    return prisma.lead.findMany({
      where,
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

  async deleteLead(id: string): Promise<LeadRecord | null> {
    return prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({ where: { id } });
      if (!lead) return null;
      await tx.lead.delete({ where: { id } });
      if (lead.formId) {
        await tx.$executeRaw`
          UPDATE ${sqlTable("forms")}
          SET "leadCount" = GREATEST(0, "leadCount" - 1)
          WHERE "id" = ${lead.formId}
        `;
      }
      return lead;
    });
  }

  async deleteLeads(dashboardId: string, ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;
    return prisma.$transaction(async (tx) => {
      const deleted = await tx.$queryRaw<Array<{ formId: string | null }>>`
        DELETE FROM ${sqlTable("leads")}
        WHERE "dashboardId" = ${dashboardId} AND "id" IN (${Prisma.join(ids)})
        RETURNING "formId"
      `;
      const formCounts = new Map<string, number>();
      for (const lead of deleted) {
        if (lead.formId) formCounts.set(lead.formId, (formCounts.get(lead.formId) || 0) + 1);
      }
      // Consistent lock order avoids deadlocks when requests overlap across forms.
      for (const [formId, count] of [...formCounts].sort(([left], [right]) => left.localeCompare(right))) {
        await tx.$executeRaw`
          UPDATE ${sqlTable("forms")}
          SET "leadCount" = GREATEST(0, "leadCount" - ${count})
          WHERE "id" = ${formId}
        `;
      }
      return deleted.length;
    });
  }

  async batchUpdateLeadStatus(
    dashboardId: string,
    ids: string[],
    status: string
  ): Promise<number> {
    const result = await prisma.lead.updateMany({
      where: { id: { in: ids }, dashboardId },
      data: { status },
    });
    return result.count;
  }

  async findLeadsWithPagination(params: {
    dashboardId: string;
    environment?: string;
    page?: number;
    limit?: number;
    search?: string;
    formId?: string;
    source?: string;
    status?: string;
    dateRange?: "all" | "today" | "week" | "month";
  }): Promise<{
    items: LeadRecord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));

    const where: Prisma.LeadWhereInput = {
      dashboardId: params.dashboardId,
    };

    if (params.environment) {
      where.environment = params.environment;
    }

    if (params.formId && params.formId !== "all") {
      where.formId = params.formId;
    }

    if (params.source && params.source !== "all") {
      where.source = params.source;
    }

    if (params.status && params.status !== "all") {
      where.status = params.status;
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { message: { contains: q, mode: "insensitive" } },
      ];
    }

    if (params.dateRange && params.dateRange !== "all") {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (params.dateRange === "today") {
        where.receivedAt = { gte: startOfToday };
      } else if (params.dateRange === "week") {
        const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);
        where.receivedAt = { gte: sevenDaysAgo };
      } else if (params.dateRange === "month") {
        const thirtyDaysAgo = new Date(startOfToday.getTime() - 29 * 24 * 60 * 60 * 1000);
        where.receivedAt = { gte: thirtyDaysAgo };
      }
    }

    const [total, items] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy: { receivedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
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
    environment?: string;
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
        environment: data.environment ?? "development",
        metadata: data.metadata ?? Prisma.JsonNull,
      },
    });
  }

  async findSpamByDashboardId(dashboardId: string, environment?: string): Promise<SpamRecord[]> {
    const where: Prisma.SpamWhereInput = { dashboardId };
    if (environment) {
      where.environment = environment;
    }
    return prisma.spam.findMany({
      where,
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

  async getStats(dashboardId: string, environment?: string): Promise<{
    totalLeads: number;
    leadsToday: number;
    leadsThisWeek: number;
    spamFlagged: number;
  }> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);

    const leadWhere: Prisma.LeadWhereInput = { dashboardId };
    const spamWhere: Prisma.SpamWhereInput = { dashboardId };
    if (environment) {
      leadWhere.environment = environment;
      spamWhere.environment = environment;
    }

    const [leadStats, spamFlagged] = await Promise.all([
      prisma.$queryRaw<
        Array<{ totalLeads: number; leadsToday: number; leadsThisWeek: number }>
      >(
        environment
          ? Prisma.sql`
            SELECT
              COUNT(*)::int AS "totalLeads",
              COUNT(*) FILTER (WHERE "receivedAt" >= ${startOfToday})::int AS "leadsToday",
              COUNT(*) FILTER (WHERE "receivedAt" >= ${sevenDaysAgo})::int AS "leadsThisWeek"
            FROM ${sqlTable("leads")}
            WHERE "dashboardId" = ${dashboardId} AND "environment" = ${environment}
          `
          : Prisma.sql`
            SELECT
              COUNT(*)::int AS "totalLeads",
              COUNT(*) FILTER (WHERE "receivedAt" >= ${startOfToday})::int AS "leadsToday",
              COUNT(*) FILTER (WHERE "receivedAt" >= ${sevenDaysAgo})::int AS "leadsThisWeek"
            FROM ${sqlTable("leads")}
            WHERE "dashboardId" = ${dashboardId}
          `
      ),
      prisma.spam.count({ where: spamWhere }),
    ]);

    const stats = leadStats[0] || { totalLeads: 0, leadsToday: 0, leadsThisWeek: 0 };

    return {
      totalLeads: Number(stats.totalLeads ?? 0),
      leadsToday: Number(stats.leadsToday ?? 0),
      leadsThisWeek: Number(stats.leadsThisWeek ?? 0),
      spamFlagged,
    };
  }
}

export const formsAndApiRepository = new FormsAndApiRepository();

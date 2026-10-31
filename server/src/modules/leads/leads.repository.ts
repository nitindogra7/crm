import { prisma } from "../../prisma";
import { Prisma } from "@prisma/client";
import type { LeadRecord, PaginatedLeadsResult } from "./leads.types";

export class LeadsRepository {
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

  async findLeadById(id: string): Promise<LeadRecord | null> {
    return prisma.lead.findUnique({
      where: { id },
    });
  }

  async findLeadsByDashboardId(dashboardId: string): Promise<LeadRecord[]> {
    return prisma.lead.findMany({
      where: { dashboardId },
      orderBy: { receivedAt: "desc" },
    });
  }

  async findLeadsWithPagination(params: {
    dashboardId: string;
    page?: number;
    limit?: number;
    search?: string;
    formId?: string;
    source?: string;
    status?: string;
    dateRange?: "all" | "today" | "week" | "month";
  }): Promise<PaginatedLeadsResult> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 10));

    const where: Prisma.LeadWhereInput = {
      dashboardId: params.dashboardId,
    };

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
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
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
          UPDATE "forms"
          SET "leadCount" = GREATEST(0, "leadCount" - 1)
          WHERE "id" = ${lead.formId}
        `;
      }

      return lead;
    });
  }

  async deleteLeads(dashboardId: string, ids: string[]): Promise<number> {
    return prisma.$transaction(async (tx) => {
      const leads = await tx.lead.findMany({
        where: { id: { in: ids }, dashboardId },
        select: { formId: true },
      });

      if (leads.length === 0) return 0;

      const formCounts: Record<string, number> = {};
      for (const lead of leads) {
        if (lead.formId) {
          formCounts[lead.formId] = (formCounts[lead.formId] || 0) + 1;
        }
      }

      const deleteResult = await tx.lead.deleteMany({
        where: { id: { in: ids }, dashboardId },
      });

      for (const [formId, count] of Object.entries(formCounts)) {
        await tx.$executeRaw`
          UPDATE "forms"
          SET "leadCount" = GREATEST(0, "leadCount" - ${count})
          WHERE "id" = ${formId}
        `;
      }

      return deleteResult.count;
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

  async incrementLeadCount(formId: string): Promise<void> {
    await prisma.form.update({
      where: { id: formId },
      data: { leadCount: { increment: 1 } },
    });
  }

  async decrementLeadCount(formId: string, count: number = 1): Promise<void> {
    await prisma.$executeRaw`
      UPDATE "forms"
      SET "leadCount" = GREATEST(0, "leadCount" - ${count})
      WHERE "id" = ${formId}
    `;
  }
}

export const leadsRepository = new LeadsRepository();


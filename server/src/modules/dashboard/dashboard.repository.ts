import { Prisma } from "@prisma/client";
import { prisma, sqlTable } from "../../prisma";
import { FormsRepository } from "../forms/forms.repository";
import { StatsRepository } from "../stats/stats.repository";

export class DashboardRepository {
  async overview(dashboardId: string, environment: string, utcOffsetMinutes?: number) {
    const where = { dashboardId, environment };
    const [stats, forms, leads, sources, formCounts, newLeads] = await Promise.all([
      new StatsRepository().getStats(dashboardId, environment, utcOffsetMinutes),
      new FormsRepository().findFormsByDashboardId(dashboardId, environment),
      prisma.lead.findMany({ where, orderBy: [{ receivedAt: "desc" }, { id: "desc" }], take: 6 }),
      prisma.lead.groupBy({ by: ["source"], where, _count: { _all: true } }),
      prisma.lead.groupBy({ by: ["formId"], where, _count: { _all: true } }),
      prisma.lead.count({ where: { ...where, status: "New" } }),
    ]);
    const counts = new Map(formCounts.map(row => [row.formId, row._count._all]));
    return {
      stats, forms, leads, newLeads,
      sourceCounts: sources.map(row => ({ source: row.source, count: row._count._all })).sort((a, b) => b.count - a.count),
      formCounts: forms.map(form => ({ id: form.id, name: form.name, count: counts.get(form.id) || 0 })).sort((a, b) => b.count - a.count),
    };
  }

  async analytics(dashboardId: string, environment: string, utcOffsetMinutes: number) {
    // Group in the browser's local hours, including time zones with half/quarter-hour offsets.
    const start = new Date(Date.now() - 91 * 24 * 60 * 60 * 1000);
    const offset = Prisma.sql`${utcOffsetMinutes} * INTERVAL '1 minute'`;
    const [forms, leads, spam] = await Promise.all([
      prisma.form.findMany({ where: { dashboardId, environment }, select: { id: true, name: true }, orderBy: { createdAt: "desc" } }),
      prisma.$queryRaw<Array<{ receivedAt: Date; formId: string | null; source: string; count: number }>>(Prisma.sql`
        SELECT date_trunc('hour', "receivedAt" + ${offset}) - ${offset} AS "receivedAt",
          "formId", "source", COUNT(*)::int AS "count"
        FROM ${sqlTable("leads")}
        WHERE "dashboardId" = ${dashboardId} AND "environment" = ${environment} AND "receivedAt" >= ${start}
        GROUP BY 1, "formId", "source" ORDER BY 1
      `),
      prisma.$queryRaw<Array<{ receivedAt: Date; formId: string | null; reason: string; count: number }>>(Prisma.sql`
        SELECT date_trunc('hour', "receivedAt" + ${offset}) - ${offset} AS "receivedAt",
          "formId", "reason", COUNT(*)::int AS "count"
        FROM ${sqlTable("spam")}
        WHERE "dashboardId" = ${dashboardId} AND "environment" = ${environment} AND "receivedAt" >= ${start}
        GROUP BY 1, "formId", "reason" ORDER BY 1
      `),
    ]);
    return { forms, leads, spam };
  }
}

import { Prisma } from "@prisma/client";
import { prisma, sqlTable } from "../../prisma";
import { FormsRepository } from "../forms/forms.repository";
import { statsWindow } from "../stats/stats-window";

export class DashboardRepository {
  async overview(dashboardId: string, environment: string, utcOffsetMinutes?: number) {
    const where = { dashboardId, environment };
    const { startOfToday, sevenDaysAgo } = statsWindow(utcOffsetMinutes);
    const [groups, forms, leads] = await Promise.all([
      prisma.$queryRaw<Array<{ grouping: number; source: string | null; formId: string | null; count: number;
        leadsToday: number; leadsThisWeek: number; newLeads: number; spamFlagged: number;
      }>>(Prisma.sql`
        SELECT GROUPING("source", "formId") AS "grouping", "source", "formId", COUNT(*)::int AS "count",
          COUNT(*) FILTER (WHERE "receivedAt" >= ${startOfToday})::int AS "leadsToday",
          COUNT(*) FILTER (WHERE "receivedAt" >= ${sevenDaysAgo})::int AS "leadsThisWeek",
          COUNT(*) FILTER (WHERE "status" = 'New')::int AS "newLeads",
          (SELECT COUNT(*)::int FROM ${sqlTable("spam")} WHERE "dashboardId" = ${dashboardId}
            AND "environment" = ${environment}) AS "spamFlagged"
        FROM ${sqlTable("leads")} WHERE "dashboardId" = ${dashboardId} AND "environment" = ${environment}
        GROUP BY GROUPING SETS ((), ("source"), ("formId"))
      `),
      new FormsRepository().findFormsByDashboardId(dashboardId, environment),
      prisma.lead.findMany({ where, orderBy: [{ receivedAt: "desc" }, { id: "desc" }], take: 6 }),
    ]);
    const totals = groups.find(row => row.grouping === 3)!;
    const counts = new Map(groups.filter(row => row.grouping === 2).map(row => [row.formId, row.count]));
    return {
      stats: { totalLeads: totals.count, leadsToday: totals.leadsToday,
        leadsThisWeek: totals.leadsThisWeek, spamFlagged: totals.spamFlagged },
      forms, leads, newLeads: totals.newLeads,
      sourceCounts: groups.filter(row => row.grouping === 1).map(row => ({
        source: row.source!, count: row.count,
      })).sort((a, b) => b.count - a.count),
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

import { Prisma } from "@prisma/client";
import { prisma, sqlTable } from "../../prisma";

export class StatsRepository {
  async getStats(dashboardId: string, environment?: string, utcOffsetMinutes?: number): Promise<{
    totalLeads: number;
    leadsToday: number;
    leadsThisWeek: number;
    spamFlagged: number;
  }> {
    const now = new Date();
    const shifted = new Date(now.getTime() + (utcOffsetMinutes || 0) * 60_000);
    const startOfToday = utcOffsetMinutes === undefined
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
      : new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - utcOffsetMinutes * 60_000);
    const sevenDaysAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);

    const spamWhere: Prisma.SpamWhereInput = { dashboardId };
    if (environment) {
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
export const statsRepository = new StatsRepository();

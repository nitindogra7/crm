import { Prisma } from "@prisma/client";
import { prisma, sqlTable } from "../../prisma";
import { statsWindow } from "./stats-window";
export class StatsRepository {
  async getStats(dashboardId: string, environment?: string, utcOffsetMinutes?: number) {
    const { startOfToday, sevenDaysAgo } = statsWindow(utcOffsetMinutes);
    const env = environment ? Prisma.sql` AND "environment" = ${environment}` : Prisma.empty;
    const [stats] = await prisma.$queryRaw<Array<{ totalLeads: number; leadsToday: number; leadsThisWeek: number; spamFlagged: number }>>(Prisma.sql`
      SELECT COUNT(*)::int AS "totalLeads",
        COUNT(*) FILTER (WHERE "receivedAt" >= ${startOfToday})::int AS "leadsToday",
        COUNT(*) FILTER (WHERE "receivedAt" >= ${sevenDaysAgo})::int AS "leadsThisWeek",
        (SELECT COUNT(*)::int FROM ${sqlTable("spam")} WHERE "dashboardId" = ${dashboardId} ${env}) AS "spamFlagged"
      FROM ${sqlTable("leads")} WHERE "dashboardId" = ${dashboardId} ${env}
    `);
    return stats ?? { totalLeads: 0, leadsToday: 0, leadsThisWeek: 0, spamFlagged: 0 };
  }
}
export const statsRepository = new StatsRepository();

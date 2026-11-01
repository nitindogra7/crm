import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma, sqlTable } from "../src/prisma";
import { performance } from "node:perf_hooks";
import { statsWindow } from "../src/modules/stats/stats-window";
import { DashboardService } from "../src/modules/dashboard/dashboard.services";
import { WorkspaceAccessError } from "../src/errors";

async function main() {
  const suffix = randomUUID(); const userId = "dashboard_qa_" + suffix;
  const service = new DashboardService();
  const dashboard = await prisma.dashboard.create({ data: { userId, name: "Read model QA", slug: "read-qa-" + suffix } });
  try {
    const empty = await service.overview(userId, dashboard.id, "development");
    assert.deepEqual(empty.stats, { totalLeads: 0, leadsToday: 0, leadsThisWeek: 0, spamFlagged: 0 });
    assert.deepEqual(empty.sourceCounts, []); assert.deepEqual(empty.formCounts, []);
    assert.equal(empty.newLeads, 0);
    const form = await prisma.form.create({ data: { dashboardId: dashboard.id, name: "QA form", slug: "read-form-" + suffix, endpointUrl: "http://localhost", environment: "development" } });
    const receivedAt = new Date(); receivedAt.setUTCMinutes(17, 0, 0);
    await prisma.lead.createMany({ data: Array.from({ length: 12 }, (_, index) => ({
      dashboardId: dashboard.id, formId: form.id, formName: form.name, name: "Lead " + index,
      email: "qa@example.com", source: "Website", status: index < 3 ? "New" : "Qualified", receivedAt,
    })) });
    await prisma.lead.create({ data: { dashboardId: dashboard.id, formName: "API", name: "Production", email: "live@example.com", environment: "production" } });
    await prisma.spam.createMany({ data: Array.from({ length: 4 }, () => ({ dashboardId: dashboard.id, formId: form.id, formName: form.name, senderName: "Bot", senderEmail: "bot@example.com", reason: "Honeypot filled", rawPayload: { secret: "must not reach analytics" }, receivedAt })) });
    const overview = await service.overview(userId, dashboard.id, "development");
    assert.equal(overview.stats.totalLeads, 12); assert.equal(overview.stats.spamFlagged, 4);
    assert.equal(overview.leads.length, 6); assert.equal(overview.newLeads, 3);
    assert.equal(overview.formCounts[0].count, 12); assert.equal(overview.sourceCounts[0].count, 12);
    assert.equal("spam" in overview, false); assert.equal("apiKeys" in overview, false);
    const analytics = await service.analytics(userId, dashboard.id, "development", 330);
    assert.equal(analytics.leads.length, 1); assert.equal(analytics.leads[0].count, 12);
    assert.equal(analytics.spam.length, 1); assert.equal(analytics.spam[0].count, 4);
    assert.equal(analytics.leads[0].receivedAt.getUTCMinutes(), 30);
    assert.equal("email" in analytics.leads[0], false); assert.equal("rawPayload" in analytics.spam[0], false);
    const production = await service.overview(userId, dashboard.id, "production");
    assert.equal(production.stats.totalLeads, 1); assert.equal(production.stats.spamFlagged, 0);
    await assert.rejects(service.overview("another-user", dashboard.id, "development"), WorkspaceAccessError);
    await assert.rejects(service.analytics("another-user", dashboard.id, "development", 330), WorkspaceAccessError);
    // Informational benchmark: both paths include ownership checks, excluding HTTP/token verification.
    if (process.env.BENCHMARK_API === "1") {
      const where = { dashboardId: dashboard.id, environment: "development" };
      const { startOfToday, sevenDaysAgo } = statsWindow();
      const baseline = async () => {
        await prisma.dashboard.findUnique({ where: { id: dashboard.id } });
        return Promise.all([
          prisma.$queryRaw`SELECT COUNT(*)::int,
            COUNT(*) FILTER (WHERE "receivedAt" >= ${startOfToday})::int,
            COUNT(*) FILTER (WHERE "receivedAt" >= ${sevenDaysAgo})::int
            FROM ${sqlTable("leads")} WHERE "dashboardId" = ${dashboard.id} AND "environment" = 'development'`,
          prisma.spam.count({ where }),
          prisma.form.findMany({ where, orderBy: { createdAt: "desc" } }),
          prisma.lead.findMany({ where, orderBy: [{ receivedAt: "desc" }, { id: "desc" }], take: 6 }),
          prisma.lead.groupBy({ by: ["source"], where, _count: { _all: true } }),
          prisma.lead.groupBy({ by: ["formId"], where, _count: { _all: true } }),
          prisma.lead.count({ where: { ...where, status: "New" } }),
        ]);
      };
      const optimized = () => service.overview(userId, dashboard.id, "development");
      await baseline(); await optimized();
      const before: number[] = []; const after: number[] = [];
      for (let sample = 0; sample < 12; sample++) {
        for (const [fn, values] of (sample % 2 ? [[optimized, after], [baseline, before]] : [[baseline, before], [optimized, after]]) as Array<[() => Promise<unknown>, number[]]>) {
          const started = performance.now(); await fn(); values.push(performance.now() - started);
        }
      }
      const summary = (values: number[]) => {
        const sorted = [...values].sort((a, b) => a - b);
        return { samples: values.length, meanMs: +(values.reduce((a,b) => a+b, 0) / values.length).toFixed(1),
          p50Ms: +sorted[Math.ceil(sorted.length * 0.5) - 1].toFixed(1), p95Ms: +sorted[Math.ceil(sorted.length * 0.95) - 1].toFixed(1) };
      };
      const ping: number[] = [];
      for (let i = 0; i < 6; i++) { const start = performance.now(); await prisma.$queryRaw`SELECT 1`; ping.push(performance.now() - start); }
      console.log("[BENCHMARK] Small-fixture service overview; excludes HTTP/token verification:", JSON.stringify({ before: summary(before), after: summary(after), databaseRoundTrip: summary(ping) }));
    }
    console.log("[PASS] Dashboard read models: bounded recent leads, accurate totals, compact analytics, time zones, environment and tenant isolation");
  } finally { await prisma.dashboard.delete({ where: { id: dashboard.id } }); await prisma.$disconnect(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

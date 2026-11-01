import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/prisma";
import { DashboardService } from "../src/modules/dashboard/dashboard.services";
import { WorkspaceAccessError } from "../src/errors";

async function main() {
  const suffix = randomUUID(); const userId = "dashboard_qa_" + suffix;
  const service = new DashboardService();
  const dashboard = await prisma.dashboard.create({ data: { userId, name: "Read model QA", slug: "read-qa-" + suffix } });
  try {
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
    console.log("[PASS] Dashboard read models: bounded recent leads, accurate totals, compact analytics, time zones, environment and tenant isolation");
  } finally { await prisma.dashboard.delete({ where: { id: dashboard.id } }); await prisma.$disconnect(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

import assert from "node:assert/strict";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { app } from "../src/app";
import { prisma } from "../src/prisma";
import { formsAndApiService } from "../src/modules/forms & api/formsAndApi.services";
import { leadsService } from "../src/modules/leads/leads.services";
import { leadsRepository } from "../src/modules/leads/leads.repository";
import { formsAndApiRepository } from "../src/modules/forms & api/formsAndApi.repository";
import { matchesAllowedOrigin, dynamicFormCorsMiddleware } from "../src/middleware/corsOriginVerifier";
import { createFormSchema } from "../src/modules/forms & api/formsAndApi.validation";
import type { Request, Response } from "express";

async function main() {
  let passed = 0;
  function check(condition: unknown, message: string) {
    assert.ok(condition, message);
    console.log("[PASS] " + message);
    passed++;
  }
  const suffix = randomUUID();
  const userId = "production_qa_" + suffix;
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const baseUrl = "http://127.0.0.1:" + (server.address() as { port: number }).port;
  try {
    const dashboard = await prisma.dashboard.create({
      data: { userId, name: "Production QA", slug: "qa-" + suffix, productionOrigin: "https://example.com" },
    });
    const form = await prisma.form.create({
      data: { dashboardId: dashboard.id, name: "Contact", slug: "contact-" + suffix, endpointUrl: baseUrl, environment: "production" },
    });
    const devKey = await prisma.apiKey.create({
      data: { dashboardId: dashboard.id, name: "Dev", key: "sln_test_" + suffix, environment: "development" },
    });
    const liveKey = await prisma.apiKey.create({
      data: { dashboardId: dashboard.id, name: "Live", key: "sln_live_" + suffix, environment: "production" },
    });
    const payload = { name: "QA", email: "qa@example.com", message: "Please contact me" };

    const getSubmission = await fetch(baseUrl + "/api/v1/leads");
    check(getSubmission.status === 405, "GET requests cannot create submissions");
    for (const redirectUrl of ["//attacker.test", "/\\attacker.test", "https://", "javascript:alert(1)"]) {
      check(!createFormSchema.safeParse({ name: "QA", redirectUrl }).success, "Unsafe redirects are rejected: " + redirectUrl);
    }

    const malformed = await fetch(baseUrl + "/api/v1/leads", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: "{broken",
    });
    check(malformed.status === 400, "Malformed JSON returns 400");
    check((await malformed.json()).error === "Invalid request body", "Parser errors do not echo request data");
    const oversized = await fetch(baseUrl + "/api/v1/leads", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: "x".repeat(1024 * 1024) }),
    });
    check(oversized.status === 413, "Oversized payload returns 413");

    const mismatch = await formsAndApiService.ingestSubmission({ formId: form.id, apiKey: devKey.key, body: payload, headers: {} });
    check(mismatch.statusCode === 403, "Development keys cannot submit to production forms");
    const missing = await formsAndApiService.ingestSubmission({ formId: "missing-" + suffix, apiKey: liveKey.key, body: payload, headers: {} });
    check(missing.statusCode === 404, "A mistyped form ID does not create an unlinked lead");
    const wrongScheme = await formsAndApiService.ingestSubmission({ formId: form.id, body: payload, headers: { origin: "http://example.com" } });
    check(wrongScheme.statusCode === 403, "Production origin includes its HTTPS scheme");
    check(!matchesAllowedOrigin("https://example.com:8443", "https://example.com"), "An unexpected origin port is denied");
    check(!matchesAllowedOrigin("https://example.com.attacker.test", "example.com"), "Hostname suffix attacks are denied");
    check(matchesAllowedOrigin("https://shop.example.com", "*.example.com"), "Explicit wildcard domains allow subdomains");
    check(!matchesAllowedOrigin("javascript:alert(1)", "*"), "Non-HTTP origins are denied");

    const preflight = await fetch(baseUrl + "/api/f/" + form.slug, {
      method: "OPTIONS", headers: { Origin: "https://example.com", "Access-Control-Request-Method": "POST" },
    });
    check(preflight.status === 204 && preflight.headers.get("vary")?.includes("Origin"), "Dynamic CORS responses vary by origin");
    check(preflight.headers.get("cache-control") === "no-store", "Origin decisions are not cached");

    const quarantined = await formsAndApiService.ingestSubmission({
      apiKey: liveKey.key,
      body: { ...payload, _gotcha: "bot", _api_key: liveKey.key, apiKey: liveKey.key, api_key: liveKey.key },
      headers: {},
    });
    const spam = await prisma.spam.findUniqueOrThrow({ where: { id: quarantined.spamId } });
    check(!JSON.stringify(spam.rawPayload).includes(liveKey.key), "Quarantine payloads do not retain API credentials");
    const rescued = await formsAndApiService.rescueSpamLead(userId, spam.id);
    check(!JSON.stringify(rescued?.extraFields).includes(liveKey.key), "Rescuing spam does not expose credentials as lead fields");

    const before = await prisma.form.findUniqueOrThrow({ where: { id: form.id } });
    const simulated = await leadsService.simulateLead(userId, { dashboardId: dashboard.id, formId: form.id, ...payload, source: "QA" });
    check(simulated.environment === "production", "Lead simulator inherits its form's environment");
    const after = await prisma.form.findUniqueOrThrow({ where: { id: form.id } });
    check(after.leadCount === before.leadCount + 1, "Simulation increments the form counter exactly once");

    for (const service of [formsAndApiService, leadsService]) {
      await assert.rejects(() => service.getAllLeads(userId, "missing-" + suffix), /Access denied/);
      check(true, "Unknown workspace IDs fail instead of falling back to another workspace");
    }

    // Fail the counter update after insertion to verify that the lead also rolls back.
    const originalTransaction = prisma.$transaction.bind(prisma);
    const failure = new Error("Injected counter failure");
    try {
      prisma.$transaction = ((callback: (tx: unknown) => Promise<unknown>) => originalTransaction(async (tx) => {
        const wrapped = new Proxy(tx, {
          get(target, key) {
            if (key === "form") return { update: async () => { throw failure; } };
            return Reflect.get(target, key);
          },
        });
        return callback(wrapped);
      })) as typeof prisma.$transaction;
      for (const repository of [leadsRepository, formsAndApiRepository]) {
        await assert.rejects(() => repository.createLead({ dashboardId: dashboard.id, formId: form.id, formName: form.name, ...payload }), /Injected counter failure/);
      }
    } finally {
      prisma.$transaction = originalTransaction;
    }
    check(await prisma.lead.count({ where: { formId: form.id } }) === 1, "Both lead repositories roll back inserts when counter updates fail");

    for (const repository of [leadsRepository, formsAndApiRepository]) {
      const entries = await Promise.all([1, 2].map(() => repository.createLead({
        dashboardId: dashboard.id, formId: form.id, formName: form.name, ...payload,
      })));
      const ids = entries.map((lead) => lead.id);
      const results = await Promise.all([repository.deleteLeads(dashboard.id, ids), repository.deleteLeads(dashboard.id, ids)]);
      check(results.reduce((sum, count) => sum + count, 0) === 2, "Overlapping bulk deletes report only rows actually removed");
      const counted = await prisma.form.findUniqueOrThrow({ where: { id: form.id } });
      check(counted.leadCount === 1, "Overlapping bulk deletes preserve the counter for surviving leads");
    }

    const htmlSubmission = await fetch(baseUrl + "/api/f/" + form.slug, {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ...payload, _api_key: liveKey.key }).toString(),
    });
    check(htmlSubmission.status === 200, "Production HTML forms accept valid API credentials in the body");

    const originalLookup = prisma.form.findFirst;
    try {
      prisma.form.findFirst = (async () => { throw new Error("Injected lookup failure"); }) as typeof prisma.form.findFirst;
      let forwardedError: unknown;
      let forwarded = false;
      await dynamicFormCorsMiddleware(
        { path: "/api/f/test", headers: {}, params: {}, query: {} } as Request,
        { vary() {}, setHeader() {} } as unknown as Response,
        (error?: unknown) => { forwarded = true; forwardedError = error; }
      );
      check(forwarded && forwardedError instanceof Error, "Origin lookup failures reach the error handler");
    } finally {
      prisma.form.findFirst = originalLookup;
    }

    await assert.rejects(() => prisma.form.create({ data: { dashboardId: dashboard.id, slug: form.slug, name: "Duplicate", endpointUrl: baseUrl } }));
    const otherDashboard = await prisma.dashboard.create({ data: { userId, name: "Other", slug: "other-" + suffix } });
    await assert.rejects(() => prisma.form.create({ data: { dashboardId: otherDashboard.id, slug: form.slug, name: "Duplicate", endpointUrl: baseUrl } }));
    check(true, "Public form slugs are unique across workspaces");
    await assert.rejects(() => prisma.form.update({ where: { id: form.id }, data: { leadCount: -1 } }));
    check(true, "Database prevents negative counters");
    await assert.rejects(() => prisma.form.update({ where: { id: form.id }, data: { environment: "invalid" } }));
    check(true, "Database prevents invalid environments");
    console.log("PRODUCTION QA: " + passed + " PASSED");
  } finally {
    await prisma.dashboard.deleteMany({ where: { userId } });
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await prisma.$disconnect();
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });

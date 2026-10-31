import http from "http";
import { app } from "../src/app";
import { prisma, sqlTable } from "../src/prisma";
import { formsAndApiService } from "../src/modules/forms & api/formsAndApi.services";
import { leadsService } from "../src/modules/leads/leads.services";

async function runRegressionTests() {
  console.log("=== STARTING PERFORMANCE OPTIMIZATION REGRESSION TESTS ===");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: unknown) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (details) console.error("Details:", details);
      failed++;
    }
  }

  const timestamp = Date.now();
  const testUserA = `perf_reg_a_${timestamp}`;
  const testUserB = `perf_reg_b_${timestamp}`;

  const server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });
  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    // -------------------------------------------------------------
    // SETUP
    // -------------------------------------------------------------
    const dashboardA = await prisma.dashboard.create({
      data: {
        userId: testUserA,
        name: "Perf Regression Workspace A",
        slug: `perf-reg-a-${timestamp}`,
      },
    });

    const dashboardB = await prisma.dashboard.create({
      data: {
        userId: testUserB,
        name: "Perf Regression Workspace B",
        slug: `perf-reg-b-${timestamp}`,
      },
    });

    const formA = await prisma.form.create({
      data: {
        dashboardId: dashboardA.id,
        name: "Regression Contact Form",
        slug: `reg-form-a-${timestamp}`,
        endpointUrl: `${baseUrl}/api/forms-and-api/f/reg-form-a-${timestamp}`,
        enabled: true,
      },
    });

    // -------------------------------------------------------------
    // TEST 1: Fast-path Health Check
    // -------------------------------------------------------------
    const healthRes = await fetch(`${baseUrl}/health`);
    assert(healthRes.status === 200, "1.1 /health returns HTTP 200");
    const healthData = (await healthRes.json()) as any;
    assert(healthData.ok === true, "1.2 /health returns { ok: true }");

    // -------------------------------------------------------------
    // TEST 2: Stats Aggregation via Single Query
    // -------------------------------------------------------------
    // Seed 5 leads for User A (3 today, 2 older)
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

    await prisma.lead.createMany({
      data: [
        {
          dashboardId: dashboardA.id,
          formId: formA.id,
          formName: formA.name,
          name: "Lead 1",
          email: "l1@a.com",
          receivedAt: now,
        },
        {
          dashboardId: dashboardA.id,
          formId: formA.id,
          formName: formA.name,
          name: "Lead 2",
          email: "l2@a.com",
          receivedAt: now,
        },
        {
          dashboardId: dashboardA.id,
          formId: formA.id,
          formName: formA.name,
          name: "Lead 3",
          email: "l3@a.com",
          receivedAt: now,
        },
        {
          dashboardId: dashboardA.id,
          formId: formA.id,
          formName: formA.name,
          name: "Lead 4",
          email: "l4@a.com",
          receivedAt: twoDaysAgo,
        },
        {
          dashboardId: dashboardA.id,
          formId: formA.id,
          formName: formA.name,
          name: "Lead 5",
          email: "l5@a.com",
          receivedAt: tenDaysAgo,
        },
      ],
    });

    // Seed 2 spam records
    await prisma.spam.createMany({
      data: [
        {
          dashboardId: dashboardA.id,
          formId: formA.id,
          formName: formA.name,
          senderName: "Spam 1",
          senderEmail: "s1@spam.com",
          reason: "Honeypot filled",
          rawPayload: {},
        },
        {
          dashboardId: dashboardA.id,
          formId: formA.id,
          formName: formA.name,
          senderName: "Spam 2",
          senderEmail: "s2@spam.com",
          reason: "Disposable email",
          rawPayload: {},
        },
      ],
    });

    const stats = await formsAndApiService.getStats(testUserA, dashboardA.id);
    assert(stats.totalLeads === 5, "2.1 stats.totalLeads is 5", stats);
    assert(stats.leadsToday === 3, "2.2 stats.leadsToday is 3", stats);
    assert(stats.leadsThisWeek === 4, "2.3 stats.leadsThisWeek is 4", stats);
    assert(stats.spamFlagged === 2, "2.4 stats.spamFlagged is 2", stats);

    // -------------------------------------------------------------
    // TEST 3: Tenant Isolation via Relation Query
    // -------------------------------------------------------------
    const leadA = await prisma.lead.findFirst({ where: { dashboardId: dashboardA.id } });
    assert(!!leadA, "3.1 Lead found for User A");

    const lookupByUserB = await leadsService.getLeadById(testUserB, leadA!.id);
    assert(lookupByUserB === null, "3.2 User B CANNOT read User A's lead using optimized relation query");

    const updateByUserB = await leadsService.updateLeadStatus(testUserB, leadA!.id, "Qualified");
    assert(updateByUserB === null, "3.3 User B CANNOT update User A's lead using optimized relation query");

    const deleteByUserB = await leadsService.deleteLead(testUserB, leadA!.id);
    assert(deleteByUserB === false, "3.4 User B CANNOT delete User A's lead using optimized relation query");

    // -------------------------------------------------------------
    // TEST 4: Atomic Concurrency & Counter Integrity
    // -------------------------------------------------------------
    // Update initial form count to 10
    await prisma.form.update({
      where: { id: formA.id },
      data: { leadCount: 10, spamCount: 5 },
    });

    // Concurrently decrement leadCount by 1 ten times
    const decrementPromises = Array.from({ length: 10 }, () =>
      prisma.$executeRaw`
        UPDATE ${sqlTable("forms")}
        SET "leadCount" = GREATEST(0, "leadCount" - 1)
        WHERE "id" = ${formA.id}
      `
    );
    await Promise.all(decrementPromises);

    const formAfterDec = await prisma.form.findUnique({ where: { id: formA.id } });
    assert(formAfterDec?.leadCount === 0, "4.1 Atomic decrements under concurrency reached exactly 0 without race condition", formAfterDec?.leadCount);

    // Decrement once more to verify GREATEST(0, ...) never underflows below 0
    await prisma.$executeRaw`
      UPDATE ${sqlTable("forms")}
      SET "leadCount" = GREATEST(0, "leadCount" - 1)
      WHERE "id" = ${formA.id}
    `;
    const formFloor = await prisma.form.findUnique({ where: { id: formA.id } });
    assert(formFloor?.leadCount === 0, "4.2 leadCount does not underflow below 0");

    // -------------------------------------------------------------
    // TEST 5: Transactional Spam Rescue
    // -------------------------------------------------------------
    const spamToRescue = await prisma.spam.create({
      data: {
        dashboardId: dashboardA.id,
        formId: formA.id,
        formName: formA.name,
        senderName: "Rescued Lead",
        senderEmail: "rescued@company.com",
        reason: "False positive",
        messageSnippet: "Important business proposal",
        rawPayload: { message: "Important business proposal full message", company: "BigCorp" },
      },
    });

    await prisma.form.update({
      where: { id: formA.id },
      data: { spamCount: 1, leadCount: 0 },
    });

    const rescued = await formsAndApiService.rescueSpamLead(testUserA, spamToRescue.id);
    assert(!!rescued, "5.1 Spam successfully rescued");
    assert(rescued?.name === "Rescued Lead", "5.2 Rescued lead name matches");
    assert(rescued?.message === "Important business proposal full message", "5.3 Full message recovered");

    const spamCheck = await prisma.spam.findUnique({ where: { id: spamToRescue.id } });
    assert(spamCheck === null, "5.4 Quarantined spam deleted atomically");

    const formAfterRescue = await prisma.form.findUnique({ where: { id: formA.id } });
    assert(formAfterRescue?.leadCount === 1, "5.5 Form leadCount incremented atomically");
    assert(formAfterRescue?.spamCount === 0, "5.6 Form spamCount decremented atomically");

  } finally {
    console.log("Cleaning up regression test data...");
    await prisma.dashboard.deleteMany({ where: { userId: { in: [testUserA, testUserB] } } });
    await prisma.$disconnect();
    server.close();
  }

  console.log("\n==========================================");
  console.log(`REGRESSION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runRegressionTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

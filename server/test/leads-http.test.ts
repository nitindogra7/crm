import http from "http";
import { app } from "../src/app";
import { prisma } from "../src/prisma";

async function runHttpTests() {
  console.log("=== STARTING HTTP ROUTE INTEGRATION TESTS ===");
  const server = http.createServer(app);
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
  const testUserId = `http_qa_user_${timestamp}`;

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;

  let formReads = 0; let keyReads = 0; let dashboardReads = 0;
  const originalFormRead = prisma.form.findFirst;
  const originalKeyRead = prisma.apiKey.findUnique;
  const originalDashboardRead = prisma.dashboard.findUnique;
  prisma.form.findFirst = ((...args: any[]) => { formReads++; return (originalFormRead as any)(...args); }) as typeof originalFormRead;
  prisma.apiKey.findUnique = ((...args: any[]) => { keyReads++; return (originalKeyRead as any)(...args); }) as typeof originalKeyRead;
  prisma.dashboard.findUnique = ((...args: any[]) => { dashboardReads++; return (originalDashboardRead as any)(...args); }) as typeof originalDashboardRead;
  try {
    // Setup dashboard & API key
    const dashboard = await prisma.dashboard.create({
      data: {
        userId: testUserId,
        name: "HTTP QA Workspace",
        slug: `http-qa-${timestamp}`,
      },
    });

    const form = await prisma.form.create({
      data: {
        dashboardId: dashboard.id,
        name: "Newsletter Form",
        slug: `newsletter-${timestamp}`,
        endpointUrl: `${baseUrl}/api/forms-and-api/f/newsletter-${timestamp}`,
        enabled: true,
      },
    });

    const apiKey = await prisma.apiKey.create({
      data: {
        dashboardId: dashboard.id,
        name: "Live API Key",
        key: `sln_live_http_test_${timestamp}`,
        keyPrefix: "sln_live_",
      },
    });

    // -------------------------------------------------------------
    // HTTP TEST 1: Public Form POST via /api/forms-and-api/f/:slug
    // -------------------------------------------------------------
    const res1 = await fetch(`${baseUrl}/api/forms-and-api/f/${form.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "HTTP User",
        email: "httpuser@example.com",
        message: "Testing HTTP endpoint",
      }),
    });

    assert(formReads === 1 && dashboardReads === 0, "Public POST reuses CORS form/workspace lookup");
    assert(/^app;dur=\d+\.\d+$/.test(res1.headers.get("server-timing") || ""), "Server-Timing includes application duration");
    assert(res1.status === 200, "1.1 Form submission HTTP status 200");
    const data1 = (await res1.json()) as any;
    assert(data1.success === true, "1.2 Form submission success is true");
    assert(data1.leadId === undefined, "1.3 Internal leadId is NOT leaked to anonymous HTTP caller");
    assert(
      res1.headers.get("access-control-allow-origin") === "*",
      "1.4 Public form endpoint allows CORS origin *"
    );

    // -------------------------------------------------------------
    // HTTP TEST 2: Public Form GET (info status endpoint)
    // -------------------------------------------------------------
    const res2 = await fetch(`${baseUrl}/api/forms-and-api/f/${form.slug}`);
    assert(res2.status === 200, "2.1 Public GET returns 200 info");
    const data2 = (await res2.json()) as any;
    assert(data2.slug === form.slug, "2.2 Public GET returns active slug");

    // -------------------------------------------------------------
    // HTTP TEST 3: Direct API Ingestion via /api/v1/leads with x-api-key
    // -------------------------------------------------------------
    const res3 = await fetch(`${baseUrl}/api/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey.key,
      },
      body: JSON.stringify({
        name: "API Developer",
        email: "apidev@example.com",
        message: "Captured from external app",
      }),
    });

    assert(keyReads === 1 && dashboardReads === 0, "API-key POST reuses CORS key/workspace lookup");
    assert(res3.status === 200, "3.1 /api/v1/leads HTTP status 200 with API key");
    const data3 = (await res3.json()) as any;
    assert(data3.success === true, "3.2 /api/v1/leads success true");
    assert(typeof data3.leadId === "string", "3.3 /api/v1/leads returns leadId to authenticated API client");

    // -------------------------------------------------------------
    // HTTP TEST 4: Direct API Ingestion via /v1/leads with Invalid Key -> 401
    // -------------------------------------------------------------
    const res4 = await fetch(`${baseUrl}/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "bad_key",
      },
      body: JSON.stringify({
        name: "Bad Guy",
        email: "bad@test.com",
      }),
    });

    assert(res4.status === 401, "4.1 Invalid API key returns HTTP 401 Unauthorized");
    const data4 = (await res4.json()) as any;
    assert(data4.success === false, "4.2 Response success is false");
    assert(data4.status === "rejected", "4.3 Status is 'rejected'");

    // -------------------------------------------------------------
    // HTTP TEST 5: Public Aliases /api/v1/f/:slug and /api/f/:slug
    // -------------------------------------------------------------
    const res5 = await fetch(`${baseUrl}/api/v1/f/${form.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Alias User",
        email: "alias@example.com",
        message: "Testing alias endpoint",
      }),
    });
    assert(res5.status === 200, "5.1 /api/v1/f/:slug alias works and returns HTTP 200");

    const res6 = await fetch(`${baseUrl}/api/f/${form.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Short Alias User",
        email: "shortalias@example.com",
        message: "Testing short alias",
      }),
    });
    assert(res6.status === 200, "5.2 /api/f/:slug alias works and returns HTTP 200");

  } catch (err) {
    console.error("HTTP QA TEST ERROR:", err);
    failed++;
  } finally {
    prisma.form.findFirst = originalFormRead;
    prisma.apiKey.findUnique = originalKeyRead;
    prisma.dashboard.findUnique = originalDashboardRead;
    console.log("Cleaning up HTTP test data...");
    await prisma.lead.deleteMany({
      where: { dashboard: { userId: testUserId } },
    });
    await prisma.form.deleteMany({
      where: { dashboard: { userId: testUserId } },
    });
    await prisma.apiKey.deleteMany({
      where: { dashboard: { userId: testUserId } },
    });
    await prisma.dashboard.deleteMany({
      where: { userId: testUserId },
    });
    await prisma.$disconnect();
    server.close();
  }

  console.log("\n==========================================");
  console.log(`HTTP TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runHttpTests();


import http from "http";
import { app } from "../src/app";
import { prisma } from "../src/prisma";
import { formsAndApiService } from "../src/modules/forms & api/formsAndApi.services";

async function runSecurityTests() {
  console.log("=== STARTING SECURITY, SPAM & RATE LIMIT TESTS ===");
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
  const testUserId = `sec_qa_user_${timestamp}`;

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const dashboard = await prisma.dashboard.create({
      data: {
        userId: testUserId,
        name: "Security QA Workspace",
        slug: `sec-qa-${timestamp}`,
      },
    });

    const apiKey = await prisma.apiKey.create({
      data: {
        dashboardId: dashboard.id,
        name: "Security QA Key",
        key: `sln_live_sec_test_${timestamp}`,
        fullKeyMock: `sln_live_sec_test_${timestamp}`,
      },
    });

    // 1. Form with Domain Whitelist
    const whitelistedForm = await prisma.form.create({
      data: {
        dashboardId: dashboard.id,
        name: "Domain Restricted Form",
        slug: `domain-form-${timestamp}`,
        endpointUrl: `${baseUrl}/api/forms-and-api/f/domain-form-${timestamp}`,
        enabled: true,
        allowedDomains: ["clientcompany.com", "partner.io", "localhost:3000"],
      },
    });

    // Test 1.1: Browser submission from unlisted domain -> Rejected with 403
    const rejectedSubmission = await formsAndApiService.ingestSubmission({
      formSlug: whitelistedForm.slug,
      body: { name: "Attacker", email: "attacker@random.com", message: "Trying to submit" },
      headers: {
        origin: "https://evil-site.com",
        "user-agent": "Mozilla/5.0",
      },
    });
    assert(rejectedSubmission.status === "rejected", "1.1 Submission from unauthorized domain rejected");
    assert(rejectedSubmission.statusCode === 403, "1.2 Status code is 403 Forbidden");

    // Test 1.2: Browser submission from whitelisted domain -> Accepted with 200
    const allowedSubmission = await formsAndApiService.ingestSubmission({
      formSlug: whitelistedForm.slug,
      body: { name: "Legit Customer", email: "client@clientcompany.com", message: "Hi there" },
      headers: {
        origin: "https://clientcompany.com",
        "user-agent": "Mozilla/5.0",
      },
    });
    assert(allowedSubmission.status === "success", "1.3 Submission from authorized domain accepted");
    assert(allowedSubmission.statusCode === 200, "1.4 Status code is 200 OK");

    // Test 1.3: Subdomain matching (e.g. app.clientcompany.com)
    const subdomainSubmission = await formsAndApiService.ingestSubmission({
      formSlug: whitelistedForm.slug,
      body: { name: "Subdomain Lead", email: "sub@clientcompany.com", message: "From portal" },
      headers: {
        origin: "https://portal.clientcompany.com",
        "user-agent": "Mozilla/5.0",
      },
    });
    assert(subdomainSubmission.status === "success", "1.5 Subdomain of authorized domain accepted");

    // Test 1.4: Server-to-server submission with API Key bypasses domain restrictions
    const serverToApiSubmission = await formsAndApiService.ingestSubmission({
      formSlug: whitelistedForm.slug,
      apiKey: apiKey.key,
      body: { name: "Server Integration", email: "server@internal.com", message: "API call" },
      headers: {
        "user-agent": "Node-Fetch/3.0",
      },
    });
    assert(serverToApiSubmission.status === "success", "1.6 Server-to-server API key bypasses domain check");

    // Test 1.5: Port matching (e.g. origin http://localhost:3000 matches allowedDomains entry)
    const localhostSubmission = await formsAndApiService.ingestSubmission({
      formSlug: whitelistedForm.slug,
      body: { name: "Local Developer", email: "dev@localhost.test", message: "Local dev test" },
      headers: {
        origin: "http://localhost:3000",
        "user-agent": "Mozilla/5.0",
      },
    });
    assert(localhostSubmission.status === "success", "1.7 Localhost with port matched successfully");

    // Test 1.6: Browser HTML form submission without redirect returns formatted HTML response
    const htmlFormRes = await fetch(`${baseUrl}/api/forms-and-api/f/${whitelistedForm.slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html",
        Origin: "https://clientcompany.com",
      },
      body: new URLSearchParams({
        name: "Webflow Visitor",
        email: "webflow@clientcompany.com",
        message: "Hello from direct HTML form",
      }).toString(),
    });
    assert(htmlFormRes.status === 200, "1.8 HTML form returns status 200");
    const htmlBody = await htmlFormRes.text();
    assert(htmlBody.includes("Submission Received"), "1.9 HTML confirmation page rendered for direct browser form");

    // 2. Bot Time-Trap Defense (Speed bot submitting in <1200ms)
    const botSubmission = await formsAndApiService.ingestSubmission({
      formSlug: whitelistedForm.slug,
      body: {
        name: "Lightning Bot",
        email: "fastbot@target.com",
        message: "Bot message",
        _form_time: String(Date.now() - 300), // Rendered 300ms ago -> Bot!
      },
      headers: {
        origin: "https://clientcompany.com",
        "user-agent": "Mozilla/5.0 Bot",
      },
    });
    assert(botSubmission.status === "quarantined", "2.1 Rapid bot submission (<1.2s) quarantined as spam");
    assert(botSubmission.statusCode === 202, "2.2 Quarantined bot returns 202 without revealing detection");

    // 3. Human submission with valid form_time (>2000ms) -> Success
    const humanSubmission = await formsAndApiService.ingestSubmission({
      formSlug: whitelistedForm.slug,
      body: {
        name: "Human Contact",
        email: "human@clientcompany.com",
        message: "Took 3 seconds to type this",
        _form_time: String(Date.now() - 3500), // Rendered 3.5s ago -> Human
      },
      headers: {
        origin: "https://clientcompany.com",
        "user-agent": "Mozilla/5.0 Human",
      },
    });
    assert(humanSubmission.status === "success", "3.1 Human submission with normal speed accepted");

    // 4. Rate Limiter HTTP integration check
    // We make 8 requests rapidly from the same IP to test the burst limiter
    let rateLimitedCount = 0;
    for (let i = 0; i < 9; i++) {
      const res = await fetch(`${baseUrl}/api/forms-and-api/f/${whitelistedForm.slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-test-bypass": "none", // Do not bypass
          Origin: "https://clientcompany.com",
        },
        body: JSON.stringify({
          name: `Flood User ${i}`,
          email: `flood${i}@clientcompany.com`,
          message: "Rapid burst",
        }),
      });
      if (res.status === 429) {
        rateLimitedCount++;
      }
    }
    // Since burst limiter limit is 6 within 10s (or in test when bypass is none), at least one was 429
    assert(rateLimitedCount > 0, "4.1 Burst spam limiter actively blocks rapid automated requests with HTTP 429");

  } finally {
    // Cleanup
    await prisma.spam.deleteMany({ where: { dashboard: { userId: testUserId } } });
    await prisma.lead.deleteMany({ where: { dashboard: { userId: testUserId } } });
    await prisma.form.deleteMany({ where: { dashboard: { userId: testUserId } } });
    await prisma.apiKey.deleteMany({ where: { dashboard: { userId: testUserId } } });
    await prisma.dashboard.deleteMany({ where: { userId: testUserId } });
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  console.log(`\n==========================================`);
  console.log(`SECURITY TESTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});


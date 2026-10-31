import http from "node:http";
import { app } from "../src/app";
import { prisma } from "../src/prisma";

async function runEnvironmentVerifierTests() {
  console.log("=== STARTING CLERK-STYLE ENVIRONMENT & ORIGIN VERIFICATION TESTS ===");
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
  const testUserId = `user_env_test_${timestamp}`;

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}`;

  // 1. Create a workspace with a configured production origin
  const dashboard = await prisma.dashboard.create({
    data: {
      userId: testUserId,
      name: "Acme Corp Environment Test",
      slug: `acme-env-${timestamp}`,
      productionOrigin: "https://acme.com",
      allowedOrigins: ["https://acme.com", "https://checkout.acme.com"],
      activeEnvironment: "development",
    },
  });

  // 2. Create a Development Form
  const devForm = await prisma.form.create({
    data: {
      dashboardId: dashboard.id,
      name: "Dev Contact Form",
      slug: `dev-form-${timestamp}`,
      endpointUrl: `http://localhost:4000/api/forms-and-api/f/dev-form-${timestamp}`,
      environment: "development",
      enabled: true,
      fields: [
        { id: "f1", name: "name", label: "Full Name", type: "text", required: true },
        { id: "f2", name: "email", label: "Email", type: "email", required: true },
        { id: "f3", name: "message", label: "Message", type: "textarea", required: true },
      ],
    },
  });

  // 3. Create a Production Form
  const prodForm = await prisma.form.create({
    data: {
      dashboardId: dashboard.id,
      name: "Live Production Form",
      slug: `prod-form-${timestamp}`,
      endpointUrl: `http://localhost:4000/api/forms-and-api/f/prod-form-${timestamp}`,
      environment: "production",
      enabled: true,
      fields: [
        { id: "f1", name: "name", label: "Full Name", type: "text", required: true },
        { id: "f2", name: "email", label: "Email", type: "email", required: true },
        { id: "f3", name: "message", label: "Message", type: "textarea", required: true },
      ],
    },
  });

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Development Form allows requests from localhost with CORS reflected
    // -------------------------------------------------------------------------
    const devRes = await fetch(`${baseUrl}/api/forms-and-api/f/${devForm.slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "http://localhost:5173",
      },
      body: JSON.stringify({
        name: "Developer Alice",
        email: "alice@local.test",
        message: "Testing in development environment on localhost.",
      }),
    });
    const devBody = await devRes.json();
    assert(devRes.status === 200, "1.1 Dev submission succeeds with HTTP 200");
    assert(devBody.success === true, "1.2 Dev submission success is true");
    assert(
      devRes.headers.get("access-control-allow-origin") === "http://localhost:5173",
      "1.3 Dev submission reflects Origin in Access-Control-Allow-Origin header"
    );

    // -------------------------------------------------------------------------
    // TEST 2: Production Form accepts request from verified production origin
    // -------------------------------------------------------------------------
    const prodAllowedRes = await fetch(`${baseUrl}/api/forms-and-api/f/${prodForm.slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://acme.com",
      },
      body: JSON.stringify({
        name: "Production Customer",
        email: "client@acme.com",
        message: "Legitimate customer submission from production website.",
      }),
    });
    const prodAllowedBody = await prodAllowedRes.json();
    assert(prodAllowedRes.status === 200, "2.1 Production request from valid origin returns 200");
    assert(prodAllowedBody.success === true, "2.2 Production request success is true");
    assert(
      prodAllowedRes.headers.get("access-control-allow-origin") === "https://acme.com",
      "2.3 Production response has Access-Control-Allow-Origin: https://acme.com"
    );

    // -------------------------------------------------------------------------
    // TEST 3: Production Form REJECTS request from unauthorized origin with HTTP 403
    // -------------------------------------------------------------------------
    const prodBlockedRes = await fetch(`${baseUrl}/api/forms-and-api/f/${prodForm.slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://malicious-spammer-site.xyz",
      },
      body: JSON.stringify({
        name: "Evil Spoofer",
        email: "spoofer@evil.com",
        message: "Trying to submit from an unauthorized website.",
      }),
    });
    const prodBlockedBody = await prodBlockedRes.json();
    assert(prodBlockedRes.status === 403, "3.1 Production request from unauthorized origin returns HTTP 403");
    assert(prodBlockedBody.success === false, "3.2 Error response success is false");
    assert(prodBlockedBody.status === "rejected", "3.3 Status is rejected");
    assert(
      /not permitted for this production workspace/i.test(prodBlockedBody.message),
      "3.4 Error message explains origin mismatch"
    );

    // -------------------------------------------------------------------------
    // TEST 4: Production Form REJECTS browser requests missing Origin/Referer header
    // -------------------------------------------------------------------------
    const prodNoOriginRes = await fetch(`${baseUrl}/api/forms-and-api/f/${prodForm.slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name: "Anonymous Caller",
        email: "anon@unknown.com",
        message: "No origin or referer header provided.",
      }),
    });
    const prodNoOriginBody = await prodNoOriginRes.json();
    assert(prodNoOriginRes.status === 403, "4.1 Production submission without origin returns HTTP 403");
    assert(prodNoOriginBody.status === "rejected", "4.2 Status is rejected");
    assert(
      /Origin or Referer header/i.test(prodNoOriginBody.message),
      "4.3 Error message states Origin or Referer header is required"
    );

    // -------------------------------------------------------------------------
    // TEST 5: Production Form Preflight OPTIONS request sets CORS headers
    // -------------------------------------------------------------------------
    const optionsRes = await fetch(`${baseUrl}/api/forms-and-api/f/${prodForm.slug}`, {
      method: "OPTIONS",
      headers: {
        "Origin": "https://acme.com",
        "Access-Control-Request-Method": "POST",
      },
    });
    assert(optionsRes.status === 204, "5.1 OPTIONS preflight returns HTTP 204 No Content");
    assert(
      optionsRes.headers.get("access-control-allow-origin") === "https://acme.com",
      "5.2 OPTIONS preflight allows verified origin"
    );
    assert(
      optionsRes.headers.get("access-control-allow-credentials") === "true",
      "5.3 OPTIONS preflight sets allow-credentials: true"
    );

    // -------------------------------------------------------------------------
    // TEST 6: Strict Data Isolation between Development and Production
    // -------------------------------------------------------------------------
    const devLeadsInDb = await prisma.lead.findMany({
      where: { dashboardId: dashboard.id, environment: "development" },
    });
    const prodLeadsInDb = await prisma.lead.findMany({
      where: { dashboardId: dashboard.id, environment: "production" },
    });

    assert(devLeadsInDb.length === 1, "6.1 Exactly 1 lead exists in development partition");
    assert(prodLeadsInDb.length === 1, "6.2 Exactly 1 lead exists in production partition");
    assert(devLeadsInDb[0].name === "Developer Alice", "6.3 Dev lead data matches Alice");
    assert(prodLeadsInDb[0].name === "Production Customer", "6.4 Prod lead data matches Customer");

    console.log("\n==========================================");
    console.log(`ENVIRONMENT & ORIGIN RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==========================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } finally {
    // Cleanup
    await prisma.lead.deleteMany({ where: { dashboardId: dashboard.id } });
    await prisma.form.deleteMany({ where: { dashboardId: dashboard.id } });
    await prisma.dashboard.delete({ where: { id: dashboard.id } });
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

runEnvironmentVerifierTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});

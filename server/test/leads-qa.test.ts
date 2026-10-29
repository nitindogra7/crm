import { prisma } from "../src/prisma";
import { formsAndApiService } from "../src/modules/forms & api/formsAndApi.services";
import { leadsService } from "../src/modules/leads/leads.services";

async function runQATests() {
  console.log("=== STARTING LEADS CAPTURE QA TEST SUITE ===");
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
  const testUserA = `qa_user_a_${timestamp}`;
  const testUserB = `qa_user_b_${timestamp}`;

  try {
    // -------------------------------------------------------------
    // SETUP: Create Dashboards and Forms for User A and User B
    // -------------------------------------------------------------
    const dashboardA = await prisma.dashboard.create({
      data: {
        userId: testUserA,
        name: "Acme QA Workspace",
        slug: `acme-qa-${timestamp}`,
      },
    });

    const dashboardB = await prisma.dashboard.create({
      data: {
        userId: testUserB,
        name: "Beta QA Workspace",
        slug: `beta-qa-${timestamp}`,
      },
    });

    const formA = await prisma.form.create({
      data: {
        dashboardId: dashboardA.id,
        name: "Contact Sales",
        slug: `contact-sales-${timestamp}`,
        endpointUrl: `http://localhost:4000/api/forms-and-api/f/contact-sales-${timestamp}`,
        enabled: true,
      },
    });

    const apiKeyA = await prisma.apiKey.create({
      data: {
        dashboardId: dashboardA.id,
        name: "Test API Key",
        key: `sln_live_test_qa_${timestamp}`,
        keyPrefix: "sln_live_",
      },
    });

    // -------------------------------------------------------------
    // TEST 1: Clean Public Form Submission (Anonymous)
    // -------------------------------------------------------------
    const cleanSubResult = await formsAndApiService.ingestSubmission({
      formSlug: formA.slug,
      body: {
        name: "Alice Smith",
        email: "alice@acme.com",
        message: "Interested in the enterprise plan",
        budget: "$5,000",
      },
      headers: { "user-agent": "Mozilla/5.0 QA Tester" },
      ip: "192.168.1.100",
    });

    assert(cleanSubResult.status === "success", "1.1 Clean submission accepted with status success");
    assert(cleanSubResult.statusCode === 200, "1.2 Clean submission returns HTTP 200 status code");
    assert(cleanSubResult.leadId === undefined, "1.3 Internal leadId is NOT leaked to anonymous submitters");

    const updatedFormA1 = await prisma.form.findUnique({ where: { id: formA.id } });
    assert(updatedFormA1?.leadCount === 1, "1.4 Form leadCount incremented by 1");

    const createdLead = await prisma.lead.findFirst({
      where: { dashboardId: dashboardA.id, email: "alice@acme.com" },
    });
    assert(!!createdLead, "1.5 Lead persisted in Leads database table");
    assert(createdLead?.name === "Alice Smith", "1.6 Lead name matches");
    assert(
      (createdLead?.extraFields as Record<string, string>)?.budget === "$5,000",
      "1.7 Custom extra field 'budget' captured properly"
    );

    // -------------------------------------------------------------
    // TEST 2: Honeypot Detection & Silent Quarantine
    // -------------------------------------------------------------
    const honeypotResult = await formsAndApiService.ingestSubmission({
      formSlug: formA.slug,
      body: {
        name: "Spam Bot",
        email: "bot@spammer.net",
        message: "Cheap pharmaceuticals",
        _gotcha: "I am a bot",
      },
      headers: {},
    });

    assert(honeypotResult.status === "quarantined", "2.1 Honeypot caught and quarantined");
    assert(honeypotResult.statusCode === 202, "2.2 Honeypot returns status 202 (accepted silently)");
    assert(honeypotResult.spamId === undefined, "2.3 Internal spamId is NOT leaked to anonymous bot");

    const updatedFormA2 = await prisma.form.findUnique({ where: { id: formA.id } });
    assert(updatedFormA2?.spamCount === 1, "2.4 Form spamCount incremented to 1");

    const spamRecord = await prisma.spam.findFirst({
      where: { dashboardId: dashboardA.id, senderEmail: "bot@spammer.net" },
    });
    assert(!!spamRecord, "2.5 Spam entry stored in spam quarantine table");
    assert(spamRecord?.reason.includes("Honeypot"), "2.6 Spam reason identifies honeypot trigger");

    // -------------------------------------------------------------
    // TEST 3: Disposable Email Detection
    // -------------------------------------------------------------
    const disposableResult = await formsAndApiService.ingestSubmission({
      formSlug: formA.slug,
      body: {
        name: "Disposable Guy",
        email: "throwaway123@mailinator.com",
        message: "Testing disposable email",
      },
      headers: {},
    });

    assert(disposableResult.status === "quarantined", "3.1 Disposable email address quarantined");
    const dispSpam = await prisma.spam.findFirst({
      where: { senderEmail: "throwaway123@mailinator.com" },
    });
    assert(
      dispSpam?.reason === "Disposable email address detected",
      "3.2 Reason marked as disposable email detected"
    );

    // -------------------------------------------------------------
    // TEST 4: Invalid Email Syntax Quarantined
    // -------------------------------------------------------------
    const invalidEmailResult = await formsAndApiService.ingestSubmission({
      formSlug: formA.slug,
      body: {
        name: "No Email Guy",
        email: "not-a-valid-email",
        message: "Garbage syntax",
      },
      headers: {},
    });

    assert(invalidEmailResult.status === "quarantined", "4.1 Invalid email syntax quarantined");
    const invalidSpam = await prisma.spam.findFirst({
      where: { senderEmail: "not-a-valid-email" },
    });
    assert(
      invalidSpam?.reason === "Invalid email format",
      "4.2 Reason marked as invalid email format"
    );

    // -------------------------------------------------------------
    // TEST 5: Prototype Pollution Prevention
    // -------------------------------------------------------------
    const protoPayload = JSON.parse(
      '{"name":"Safe User","email":"safe@user.com","message":"Hello","__proto__":{"polluted":true},"constructor":{"bad":1}}'
    );
    await formsAndApiService.ingestSubmission({
      formSlug: formA.slug,
      body: protoPayload,
      headers: {},
    });

    // Check if Object.prototype was polluted
    assert((Object.prototype as any).polluted === undefined, "5.1 Object.prototype was NOT polluted");
    const safeLead = await prisma.lead.findFirst({
      where: { email: "safe@user.com" },
    });
    assert(!!safeLead, "5.2 Safe lead created cleanly");

    // -------------------------------------------------------------
    // TEST 6: Direct API Capture with API Key (No Form Specified)
    // -------------------------------------------------------------
    const apiResult = await formsAndApiService.ingestSubmission({
      apiKey: apiKeyA.key,
      body: {
        name: "Direct API Lead",
        email: "directapi@partner.org",
        message: "Captured via REST API key",
        customTier: "Platinum",
      },
      headers: {},
    });

    assert(apiResult.status === "success", "6.1 API Key capture succeeds without formId");
    assert(apiResult.statusCode === 200, "6.2 API Key capture returns 200");
    assert(typeof apiResult.leadId === "string", "6.3 API Key capture returns leadId to authenticated developer");

    const apiLead = await prisma.lead.findUnique({
      where: { id: apiResult.leadId },
    });
    assert(apiLead?.dashboardId === dashboardA.id, "6.4 API Lead associated with correct dashboard");
    assert(apiLead?.source === "API Integration", "6.5 API Lead source marked as API Integration");
    assert(apiLead?.formId === null, "6.6 API Lead formId is null when no form is specified");

    // Test with invalid API key
    const badKeyResult = await formsAndApiService.ingestSubmission({
      apiKey: "invalid_key_xyz",
      body: { name: "Hacker", email: "hacker@test.com" },
      headers: {},
    });
    assert(badKeyResult.status === "rejected", "6.7 Invalid API key rejected");
    assert(badKeyResult.statusCode === 401, "6.8 Invalid API key returns HTTP 401");

    // -------------------------------------------------------------
    // TEST 7: Cross-Tenant Multi-Tenancy & Authorization Checks
    // -------------------------------------------------------------
    // User B tries to view User A's lead
    const crossLeadView = await leadsService.getLeadById(testUserB, createdLead!.id);
    assert(crossLeadView === null, "7.1 User B CANNOT read User A's lead");

    // User B tries to update User A's lead status
    const crossUpdate = await leadsService.updateLeadStatus(testUserB, createdLead!.id, "Contacted");
    assert(crossUpdate === null, "7.2 User B CANNOT update User A's lead status");

    // User B tries to delete User A's lead
    const crossDelete = await leadsService.deleteLead(testUserB, createdLead!.id);
    assert(crossDelete === false, "7.3 User B CANNOT delete User A's lead");

    const formABeforeSim = await prisma.form.findUnique({ where: { id: formA.id } });
    const initialLeadCount = formABeforeSim?.leadCount ?? 0;

    // User B attempts to simulate a lead pointing to User A's form
    const simulatedLead = await leadsService.simulateLead(testUserB, {
      formId: formA.id, // form belongs to User A!
      name: "Simulator Cross Tenant",
      email: "sim@crosstenant.com",
      message: "Testing cross tenant simulator",
    });

    assert(
      simulatedLead.dashboardId === dashboardB.id,
      "7.4 Simulated lead belongs to User B's dashboard"
    );
    assert(
      simulatedLead.formId === null,
      "7.5 User B CANNOT attach simulated lead to User A's form"
    );

    const formACheck = await prisma.form.findUnique({ where: { id: formA.id } });
    assert(
      formACheck?.leadCount === initialLeadCount,
      "7.6 User A's form leadCount was NOT incremented by User B's simulation"
    );

    // Simulation with non-existent / mock form ID does NOT crash with PostgreSQL foreign key violation
    const mockFormSim = await leadsService.simulateLead(testUserA, {
      formId: "mock_non_existent_form_id",
      name: "Mock Form Test",
      email: "mock@test.com",
      message: "Testing mock id",
    });
    assert(mockFormSim.formId === null, "7.7 Mock form ID safely handled as null without crashing");

    // -------------------------------------------------------------
    // TEST 8: All Leads Query vs Paginated Query
    // -------------------------------------------------------------
    const allLeads = await leadsService.getAllLeads(testUserA, dashboardA.id);
    assert(allLeads.length >= 3, "8.1 getAllLeads retrieves all leads for dashboard store");

    const paginatedLeads = await leadsService.getLeads(testUserA, {
      dashboardId: dashboardA.id,
      page: 1,
      limit: 2,
    });
    assert(paginatedLeads.items.length === 2, "8.2 Paginated leads respect limit of 2");
    assert(paginatedLeads.pagination.total >= 3, "8.3 Pagination total is accurate");
    assert(paginatedLeads.pagination.totalPages >= 2, "8.4 Pagination totalPages calculated correctly");

    // -------------------------------------------------------------
    // TEST 9: Bulk Status Update & Bulk Delete (Scoped to Dashboard)
    // -------------------------------------------------------------
    const leadIds = allLeads.map((l) => l.id);
    const bulkStatusResult = await leadsService.batchUpdateLeadStatus(
      testUserA,
      leadIds,
      "Qualified",
      dashboardA.id
    );
    assert(bulkStatusResult.count >= 3, "9.1 Bulk update changed status of leads");

    const checkUpdated = await leadsService.getAllLeads(testUserA, dashboardA.id);
    assert(
      checkUpdated.every((l) => l.status === "Qualified"),
      "9.2 All updated leads have status 'Qualified'"
    );

    const bulkDeleteResult = await leadsService.batchDeleteLeads(
      testUserA,
      leadIds,
      dashboardA.id
    );
    assert(bulkDeleteResult.count >= 3, "9.3 Bulk delete deleted user's leads");

    const remainingLeads = await leadsService.getAllLeads(testUserA, dashboardA.id);
    assert(remainingLeads.length === 0, "9.4 Zero leads remaining after bulk delete");

    // -------------------------------------------------------------
    // TEST 10: Spam Rescue Recovers Full Message & Extra Fields
    // -------------------------------------------------------------
    const longMessage = "This is a legitimate long message that got accidentally marked as spam because of heuristic rule. " + "x".repeat(300);
    const rescueTestSpam = await formsAndApiService.ingestSubmission({
      formSlug: formA.slug,
      body: {
        name: "Rescuable Contact",
        email: "goodperson@gmail.com",
        message: longMessage,
        companyName: "Acme Corp",
        _gotcha: "accidental",
      },
      headers: {},
    });

    assert(rescueTestSpam.status === "quarantined", "10.1 Spam created for rescue test");
    const spamToRescue = await prisma.spam.findFirst({
      where: { senderEmail: "goodperson@gmail.com" },
    });
    assert(!!spamToRescue, "10.2 Spam record found in DB");

    const rescuedLead = await formsAndApiService.rescueSpamLead(testUserA, spamToRescue!.id);
    assert(!!rescuedLead, "10.3 Spam successfully rescued as lead");
    assert(rescuedLead?.name === "Rescuable Contact", "10.4 Rescued lead name matches");
    assert(rescuedLead?.message === longMessage, "10.5 Rescued lead recovered FULL long message");
    assert(
      (rescuedLead?.extraFields as Record<string, string>)?.companyName === "Acme Corp",
      "10.6 Rescued lead recovered custom extra field 'companyName'"
    );

  } catch (error) {
    console.error("FATAL ERROR IN QA TEST SUITE:", error);
    failed++;
  } finally {
    // Cleanup QA test data
    console.log("Cleaning up test data...");
    await prisma.spam.deleteMany({
      where: { dashboard: { userId: { in: [testUserA, testUserB] } } },
    });
    await prisma.lead.deleteMany({
      where: { dashboard: { userId: { in: [testUserA, testUserB] } } },
    });
    await prisma.form.deleteMany({
      where: { dashboard: { userId: { in: [testUserA, testUserB] } } },
    });
    await prisma.apiKey.deleteMany({
      where: { dashboard: { userId: { in: [testUserA, testUserB] } } },
    });
    await prisma.dashboard.deleteMany({
      where: { userId: { in: [testUserA, testUserB] } },
    });
    await prisma.$disconnect();
  }

  console.log("\n==========================================");
  console.log(`QA TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runQATests();


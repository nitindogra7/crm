import { Router } from "express";
import { formsAndApiController } from "./formsAndApi.controller";

const router: Router = Router();

// ==========================================
// DASHBOARDS / MULTI-ORGANIZATION ROUTES
// ==========================================
router.get("/dashboards", formsAndApiController.getDashboards);
router.post("/dashboards", formsAndApiController.createDashboard);
router.patch("/dashboards/:id", formsAndApiController.updateDashboard);

// ==========================================
// FORMS ROUTES
// ==========================================
router.get("/forms", formsAndApiController.getForms);
router.post("/forms", formsAndApiController.createForm);
router.get("/forms/:id", formsAndApiController.getFormById);
router.patch("/forms/:id", formsAndApiController.updateForm);
router.delete("/forms/:id", formsAndApiController.deleteForm);

// ==========================================
// API KEYS ROUTES
// ==========================================
router.get("/keys", formsAndApiController.getApiKeys);
router.post("/keys", formsAndApiController.createApiKey);
router.post("/keys/regenerate", formsAndApiController.regenerateApiKey);
router.post("/keys/:id/revoke", formsAndApiController.revokeApiKey);
router.delete("/keys/:id", formsAndApiController.revokeApiKey);

// ==========================================
// PUBLIC INGESTION & SUBMISSION (NO CLERK TOKEN NEEDED)
// ==========================================
router.get("/f/:slug", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Salenova Form Endpoint is active. Submit submissions via POST.",
    slug: req.params.slug,
  });
});
router.post("/f/:slug", formsAndApiController.submitForm);
router.post("/submit/:formId", formsAndApiController.submitForm);
router.post("/simulate", formsAndApiController.simulateSubmission);

// ==========================================
// LEADS & SPAM & STATS ROUTES
// ==========================================
router.get("/leads", formsAndApiController.getLeads);
router.patch("/leads/:id/status", formsAndApiController.updateLeadStatus);

router.get("/spam", formsAndApiController.getSpam);
router.post("/spam/:id/rescue", formsAndApiController.rescueSpam);

router.get("/stats", formsAndApiController.getStats);

export { router as formsAndApiRouter };
export default router;

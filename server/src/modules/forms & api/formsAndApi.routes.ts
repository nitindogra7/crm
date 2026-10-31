import { Router } from "express";
import { formsAndApiController } from "./formsAndApi.controller";
import { publicFormRateLimiter, publicFormBurstLimiter } from "../../middleware/rateLimiter";

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
    message: "Infraly Form Endpoint is active. Submit submissions via POST.",
    slug: req.params.slug,
  });
});
router.post("/f/:slug", publicFormBurstLimiter, publicFormRateLimiter, formsAndApiController.submitForm);
router.post("/submit/:formId", publicFormBurstLimiter, publicFormRateLimiter, formsAndApiController.submitForm);
router.post("/simulate", formsAndApiController.simulateSubmission);

// ==========================================
// SPAM & STATS ROUTES
// ==========================================
router.get("/spam", formsAndApiController.getSpam);
router.post("/spam/:id/rescue", formsAndApiController.rescueSpam);

router.get("/stats", formsAndApiController.getStats);

export { router as formsAndApiRouter };
export default router;

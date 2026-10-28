import { Router } from "express";
import { onboardingController } from "./onboarding.controller";

const router: Router = Router();

// POST /api/onboarding - Complete onboarding and save workspace details
router.post("/", onboardingController.create);

// GET /api/onboarding/status?userId=... - Check if user is onboarded
router.get("/status", onboardingController.getStatus);

// GET /api/onboarding/check-slug?slug=... - Check if slug is available
router.get("/check-slug", onboardingController.checkSlug);

// GET /api/onboarding/:userId - Retrieve onboarding profile for user
router.get("/:userId", onboardingController.getByUserId);

// PATCH /api/onboarding/:userId - Update workspace profile
router.patch("/:userId", onboardingController.update);

export { router as onboardingRouter };
export default router;

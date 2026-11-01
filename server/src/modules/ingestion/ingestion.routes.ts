import { Router } from "express";
import { publicFormBurstLimiter, publicFormRateLimiter } from "../../middleware/rateLimiter";
import { ingestionController } from "./ingestion.controller";

export const ingestionRouter = Router();
ingestionRouter.get("/f/:slug", (req, res) => {
  res.status(200).json({ success: true, message: "Infraly Form Endpoint is active. Submit submissions via POST.", slug: req.params.slug });
});
ingestionRouter.post("/f/:slug", publicFormBurstLimiter, publicFormRateLimiter, ingestionController.submitForm);
ingestionRouter.post("/submit/:formId", publicFormBurstLimiter, publicFormRateLimiter, ingestionController.submitForm);

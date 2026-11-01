import { z } from "zod";
export const dashboardQuerySchema = z.object({
  dashboardId: z.string().min(1),
  environment: z.enum(["development", "production"]).default("development"),
  utcOffsetMinutes: z.coerce.number().int().min(-840).max(840).default(0),
});

import { z } from "zod";
import { WORKSPACE_ENVIRONMENTS } from "../shared/constants";

export const createApiKeySchema = z.object({
  dashboardId: z.string().trim().optional(),
  name: z.string().trim().default("Development API Key").optional(),
  env: z.enum(["live", "test"]).default("test").optional(),
  environment: z.enum(WORKSPACE_ENVIRONMENTS).optional(),
});

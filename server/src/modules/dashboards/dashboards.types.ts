import type { Dashboard } from "@prisma/client";
import type { z } from "zod";
import { AVATAR_TONES } from "../shared/constants";
import { createDashboardSchema, updateDashboardSchema } from "./dashboards.validation";

export type AvatarTone = (typeof AVATAR_TONES)[number];
export type CreateDashboardInput = z.infer<typeof createDashboardSchema>;
export type UpdateDashboardInput = z.infer<typeof updateDashboardSchema>;
export type DashboardRecord = Dashboard;

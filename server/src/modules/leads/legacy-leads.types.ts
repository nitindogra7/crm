import type { Lead } from "@prisma/client";
import type { z } from "zod";
import { LEAD_STATUSES } from "../shared/constants";
import { batchDeleteLeadsSchema, batchUpdateLeadStatusSchema, getLeadsQuerySchema, simulateSubmissionSchema, updateLeadStatusSchema } from "./legacy-leads.validation";

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type BatchDeleteLeadsInput = z.infer<typeof batchDeleteLeadsSchema>;
export type BatchUpdateLeadStatusInput = z.infer<typeof batchUpdateLeadStatusSchema>;
export type GetLeadsQueryInput = z.infer<typeof getLeadsQuerySchema>;
export type SimulateSubmissionInput = z.infer<typeof simulateSubmissionSchema>;
export type LeadRecord = Lead;

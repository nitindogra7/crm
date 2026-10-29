import { z } from "zod";
import type { Lead } from "@prisma/client";
import {
  LEAD_STATUSES,
  getLeadsQuerySchema,
  updateLeadStatusSchema,
  batchUpdateLeadStatusSchema,
  batchDeleteLeadsSchema,
  simulateLeadSchema,
  createLeadSchema,
} from "./leads.validation";

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type GetLeadsQueryInput = z.infer<typeof getLeadsQuerySchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type BatchUpdateLeadStatusInput = z.infer<typeof batchUpdateLeadStatusSchema>;
export type BatchDeleteLeadsInput = z.infer<typeof batchDeleteLeadsSchema>;
export type SimulateLeadInput = z.infer<typeof simulateLeadSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export type LeadRecord = Lead;

export interface LeadsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedLeadsResult {
  items: LeadRecord[];
  pagination: LeadsPagination;
}


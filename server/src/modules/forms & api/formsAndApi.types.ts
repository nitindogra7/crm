import { z } from "zod";
import type {
  Dashboard,
  Form,
  ApiKey,
  Lead,
  Spam,
} from "@prisma/client";
import {
  createDashboardSchema,
  updateDashboardSchema,
  formFieldSchema,
  createFormSchema,
  updateFormSchema,
  createApiKeySchema,
  updateLeadStatusSchema,
  batchDeleteLeadsSchema,
  batchUpdateLeadStatusSchema,
  getLeadsQuerySchema,
  simulateSubmissionSchema,
  FIELD_TYPES,
  AVATAR_TONES,
  LEAD_STATUSES,
  SPAM_DISPOSITIONS,
} from "./formsAndApi.validation";

export type AvatarTone = (typeof AVATAR_TONES)[number];
export type FieldType = (typeof FIELD_TYPES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type SpamDisposition = (typeof SPAM_DISPOSITIONS)[number];

export type CreateDashboardInput = z.infer<typeof createDashboardSchema>;
export type UpdateDashboardInput = z.infer<typeof updateDashboardSchema>;
export type FormFieldInput = z.infer<typeof formFieldSchema>;
export type CreateFormInput = z.infer<typeof createFormSchema>;
export type UpdateFormInput = z.infer<typeof updateFormSchema>;
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type BatchDeleteLeadsInput = z.infer<typeof batchDeleteLeadsSchema>;
export type BatchUpdateLeadStatusInput = z.infer<typeof batchUpdateLeadStatusSchema>;
export type GetLeadsQueryInput = z.infer<typeof getLeadsQuerySchema>;
export type SimulateSubmissionInput = z.infer<typeof simulateSubmissionSchema>;

export type DashboardRecord = Dashboard;
export type FormRecord = Form;
export type ApiKeyRecord = ApiKey;
export type LeadRecord = Lead;
export type SpamRecord = Spam;

export interface FormSubmissionPayload {
  name?: string;
  email?: string;
  message?: string;
  [key: string]: unknown;
}

export interface IngestSubmissionResult {
  status: "success" | "quarantined" | "rejected";
  statusCode?: number;
  leadId?: string;
  spamId?: string;
  redirectUrl?: string;
  message: string;
}

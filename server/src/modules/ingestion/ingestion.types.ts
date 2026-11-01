
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

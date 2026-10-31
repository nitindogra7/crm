export type SpamDisposition = "Quarantined" | "Rejected";

export interface SpamItem {
  id: string;
  senderName: string;
  senderEmail: string;
  formId: string;
  formName: string;
  environment?: "development" | "production";
  receivedAt: string;
  disposition: SpamDisposition;
  reason: "Honeypot filled" | "Repetitive content" | "Disposable email" | "Rate limit exceeded" | string;
  messageSnippet: string;
  rawPayload: Record<string, unknown>;
  triggerRule: string;
  metadata?: {
    ip?: string;
    userAgent?: string;
  };
}

import type { ApiKey, Dashboard, Form } from "@prisma/client";

// Server records reused only within this request.
export interface IngestionContext {
  form?: Form & { dashboard: Dashboard };
  apiKey?: ApiKey & { dashboard: Dashboard };
}

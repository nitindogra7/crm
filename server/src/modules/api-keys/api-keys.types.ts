import type { ApiKey } from "@prisma/client";
import type { z } from "zod";
import { createApiKeySchema } from "./api-keys.validation";

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type ApiKeyRecord = ApiKey;

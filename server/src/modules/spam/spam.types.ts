import type { Spam } from "@prisma/client";
import { SPAM_DISPOSITIONS } from "../shared/constants";

export type SpamDisposition = (typeof SPAM_DISPOSITIONS)[number];
export type SpamRecord = Spam;

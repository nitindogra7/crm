import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import type { SpamRecord } from "../spam/spam.types";

export class SpamRepository {
  async createSpam(data: {
    dashboardId: string;
    formId?: string | null;
    formName: string;
    senderName: string;
    senderEmail: string;
    disposition?: string;
    reason: string;
    messageSnippet?: string;
    rawPayload: Prisma.InputJsonValue;
    triggerRule?: string;
    environment?: string;
    metadata?: Prisma.InputJsonValue;
  }): Promise<SpamRecord> {
    return prisma.spam.create({
      data: {
        dashboardId: data.dashboardId,
        formId: data.formId ?? null,
        formName: data.formName,
        senderName: data.senderName,
        senderEmail: data.senderEmail,
        disposition: data.disposition ?? "Quarantined",
        reason: data.reason,
        messageSnippet: data.messageSnippet ?? "",
        rawPayload: data.rawPayload,
        triggerRule: data.triggerRule ?? "honeypot",
        environment: data.environment ?? "development",
        metadata: data.metadata ?? Prisma.JsonNull,
      },
    });
  }
  async findSpamByDashboardId(dashboardId: string, environment?: string): Promise<SpamRecord[]> {
    const where: Prisma.SpamWhereInput = { dashboardId };
    if (environment) {
      where.environment = environment;
    }
    return prisma.spam.findMany({
      where,
      orderBy: { receivedAt: "desc" },
    });
  }
  async findSpamById(id: string): Promise<SpamRecord | null> {
    return prisma.spam.findUnique({
      where: { id },
    });
  }
  async deleteSpam(id: string): Promise<SpamRecord> {
    return prisma.spam.delete({
      where: { id },
    });
  }
}
export const spamRepository = new SpamRepository();

import { prisma, sqlTable } from "../../prisma";
import type { LeadRecord } from "../leads/legacy-leads.types";
import { spamRepository, type SpamRepository } from "../spam/spam.repository";
import type { SpamRecord } from "../spam/spam.types";
import { DashboardsService } from "../dashboards/dashboards.services";

type Repository = Pick<SpamRepository, "findSpamByDashboardId">;
const defaultRepository: Repository = {
  findSpamByDashboardId: spamRepository.findSpamByDashboardId.bind(spamRepository),
};

export class SpamService {
  constructor(
    private readonly repository: Repository = defaultRepository,
    private readonly dashboards: DashboardsService = new DashboardsService(),
  ) {}
  async getSpam(userId: string, dashboardId?: string, environment?: string): Promise<SpamRecord[]> {
    const targetDashboardId = await this.dashboards.resolveDashboardId(userId, dashboardId);
    return this.repository.findSpamByDashboardId(targetDashboardId, environment);
  }
  async rescueSpamLead(userId: string, spamId: string): Promise<LeadRecord | null> {
    const spam = await prisma.spam.findFirst({
      where: { id: spamId, dashboard: { userId } },
    });
    if (!spam) return null;

    // Extract full message and extra fields from rawPayload if available
    let fullMessage = spam.messageSnippet;
    let extraFields: Record<string, string> | undefined = undefined;

    if (
      spam.rawPayload &&
      typeof spam.rawPayload === "object" &&
      !Array.isArray(spam.rawPayload)
    ) {
      const payload = spam.rawPayload as Record<string, unknown>;
      const rawMsg = payload.message ?? payload.inquiry ?? payload.comment;
      if (typeof rawMsg === "string" && rawMsg.trim()) {
        fullMessage = rawMsg;
      }

      const dangerousKeys = ["__proto__", "constructor", "prototype"];
      const coreKeys = [
        "name",
        "fullName",
        "senderName",
        "email",
        "senderEmail",
        "workEmail",
        "message",
        "inquiry",
        "comment",
        "_gotcha",
        "_hp",
        "honeypot",
        "_api_key",
        "apiKey",
      "api_key",
      ];

      const extracted: Record<string, string> = Object.create(null);
      for (const [k, v] of Object.entries(payload)) {
        if (
          !coreKeys.includes(k) &&
          !dangerousKeys.includes(k) &&
          v !== undefined &&
          v !== null &&
          v !== ""
        ) {
          extracted[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
        }
      }
      if (Object.keys(extracted).length > 0) {
        extraFields = extracted;
      }
    }

    // Atomically create lead, adjust form counts, and delete quarantined spam
    return prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          dashboardId: spam.dashboardId,
          formId: spam.formId,
          formName: spam.formName,
          name: spam.senderName,
          email: spam.senderEmail,
          message: fullMessage,
          source: "Rescued from Quarantine",
          status: "New",
          environment: spam.environment || "development",
          extraFields,
          metadata: spam.metadata || undefined,
        },
      });

      if (spam.formId) {
        await tx.form.update({
          where: { id: spam.formId },
          data: { leadCount: { increment: 1 } },
        });
        await tx.$executeRaw`
          UPDATE ${sqlTable("forms")}
          SET "spamCount" = GREATEST(0, "spamCount" - 1)
          WHERE "id" = ${spam.formId}
        `;
      }
      await tx.spam.delete({ where: { id: spam.id } });

      return lead;
    });
  }
}

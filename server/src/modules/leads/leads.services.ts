import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import crypto from "crypto";
import { WorkspaceAccessError } from "../../errors";
import { leadsRepository, LeadsRepository } from "./leads.repository";
import type {
  LeadRecord,
  LeadStatus,
  GetLeadsQueryInput,
  SimulateLeadInput,
  PaginatedLeadsResult,
} from "./leads.types";

export class LeadsService {
  constructor(
    private readonly repository: LeadsRepository = leadsRepository
  ) {}

  /**
   * Resolves the target dashboard for the user. If none exists, provisions one from onboarding.
   */
  async resolveDashboardId(
    userId: string,
    providedDashboardId?: string
  ): Promise<string> {
    if (providedDashboardId) {
      const db = await prisma.dashboard.findUnique({
        where: { id: providedDashboardId },
      });
      if (db && db.userId === userId) {
        return db.id;
      }
      if (!db || db.userId !== userId) {
        throw new WorkspaceAccessError();
      }
    }

    // Try finding user's dashboards
    const existing = await prisma.dashboard.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    if (existing) {
      return existing.id;
    }

    // Seed if none exist
    const onboarding = await prisma.onboarding.findUnique({
      where: { userId },
    });
    const name = onboarding?.name || "My Workspace";
    let slug = onboarding?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const slugTaken = await prisma.dashboard.findUnique({ where: { slug } });
    if (slugTaken) {
      slug = `${slug}-${crypto.randomBytes(3).toString("hex")}`;
    }

    const created = await prisma.dashboard.create({
      data: {
        userId,
        name,
        slug,
        ownerEmail: onboarding?.ownerEmail || null,
        avatarTone: onboarding?.avatarTone || "zinc",
        plan: onboarding?.teamSize === "solo" ? "Free Tier" : "Team Workspace",
      },
    });

    return created.id;
  }

  /**
   * Retrieves leads for a user's dashboard with search, filters, and pagination
   */
  async getLeads(
    userId: string,
    query?: GetLeadsQueryInput
  ): Promise<PaginatedLeadsResult> {
    const dashboardId = await this.resolveDashboardId(
      userId,
      query?.dashboardId
    );

    return this.repository.findLeadsWithPagination({
      dashboardId,
      environment: query?.environment,
      page: query?.page,
      limit: query?.limit,
      search: query?.search,
      formId: query?.formId,
      source: query?.source,
      status: query?.status,
      dateRange: query?.dateRange,
    });
  }

  /**
   * Retrieves all leads for a user's dashboard (unpaginated)
   */
  async getAllLeads(
    userId: string,
    dashboardId?: string,
    environment?: string
  ): Promise<LeadRecord[]> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    return this.repository.findLeadsByDashboardId(targetDashboardId, environment);
  }

  /**
   * Retrieves a single lead by ID verifying user dashboard ownership
   */
  async getLeadById(
    userId: string,
    leadId: string
  ): Promise<LeadRecord | null> {
    return prisma.lead.findFirst({
      where: {
        id: leadId,
        dashboard: { userId },
      },
    });
  }

  /**
   * Updates lead pipeline status ("New", "Contacted", "Qualified", "Archived")
   */
  async updateLeadStatus(
    userId: string,
    leadId: string,
    status: LeadStatus
  ): Promise<LeadRecord | null> {
    try {
      return await prisma.lead.update({ where: { id: leadId, dashboard: { userId } }, data: { status } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") return null;
      throw error;
    }
  }

  /**
   * Deletes a lead and updates associated form metrics
   */
  async deleteLead(userId: string, leadId: string): Promise<boolean> {
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, dashboard: { userId } },
      select: { id: true },
    });
    if (!lead) return false;

    await this.repository.deleteLead(leadId);
    return true;
  }

  /**
   * Deletes multiple leads by ID in a single transaction
   */
  async batchDeleteLeads(
    userId: string,
    leadIds: string[],
    dashboardId?: string
  ): Promise<{ count: number }> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    const count = await this.repository.deleteLeads(targetDashboardId, leadIds);
    return { count };
  }

  /**
   * Bulk updates status across multiple leads
   */
  async batchUpdateLeadStatus(
    userId: string,
    leadIds: string[],
    status: LeadStatus,
    dashboardId?: string
  ): Promise<{ count: number }> {
    const targetDashboardId = await this.resolveDashboardId(userId, dashboardId);
    const count = await this.repository.batchUpdateLeadStatus(
      targetDashboardId,
      leadIds,
      status
    );
    return { count };
  }

  /**
   * Simulates an incoming lead submission into the database
   */
  async simulateLead(
    userId: string,
    input: SimulateLeadInput
  ): Promise<LeadRecord> {
    const dashboardId = await this.resolveDashboardId(userId, input.dashboardId);
    let validFormId: string | null = null;
    let formName = "Sandbox Simulator";
    let formEnvironment = "development";

    if (input.formId) {
      const form = await prisma.form.findUnique({
        where: { id: input.formId },
      });
      // ONLY link if form actually exists AND belongs to the user's dashboard!
      if (form && form.dashboardId === dashboardId) {
        validFormId = form.id;
        formName = form.name;
        formEnvironment = form.environment;
      }
    }

    const lead = await this.repository.createLead({
      dashboardId,
      formId: validFormId,
      formName,
      name: input.name,
      email: input.email,
      message: input.message,
      source: input.source || "Sandbox Simulator",
      status: "New",
      environment: validFormId ? formEnvironment : input.environment || "development",
      extraFields: input.extraFields,
    });

    return lead;
  }
}

export const leadsService = new LeadsService();


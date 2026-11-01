import { prisma } from "../../prisma";
import { formsRepository, type FormsRepository } from "../forms/forms.repository";
import { legacyleadsRepository, type LegacyLeadsRepository } from "../leads/legacy-leads.repository";
import type { GetLeadsQueryInput, LeadRecord, LeadStatus, SimulateSubmissionInput } from "../leads/legacy-leads.types";
import { DashboardsService } from "../dashboards/dashboards.services";

type Repository = Pick<FormsRepository, "findFormById"> & Pick<LegacyLeadsRepository, "batchUpdateLeadStatus" | "createLead" | "deleteLead" | "deleteLeads" | "findLeadsByDashboardId" | "findLeadsWithPagination" | "updateLeadStatus">;
const defaultRepository: Repository = {
  findFormById: formsRepository.findFormById.bind(formsRepository),
  batchUpdateLeadStatus: legacyleadsRepository.batchUpdateLeadStatus.bind(legacyleadsRepository),
  createLead: legacyleadsRepository.createLead.bind(legacyleadsRepository),
  deleteLead: legacyleadsRepository.deleteLead.bind(legacyleadsRepository),
  deleteLeads: legacyleadsRepository.deleteLeads.bind(legacyleadsRepository),
  findLeadsByDashboardId: legacyleadsRepository.findLeadsByDashboardId.bind(legacyleadsRepository),
  findLeadsWithPagination: legacyleadsRepository.findLeadsWithPagination.bind(legacyleadsRepository),
  updateLeadStatus: legacyleadsRepository.updateLeadStatus.bind(legacyleadsRepository),
};

export class LegacyLeadsService {
  constructor(
    private readonly repository: Repository = defaultRepository,
    private readonly dashboards: DashboardsService = new DashboardsService(),
  ) {}
  async simulateLead(
    userId: string,
    input: SimulateSubmissionInput
  ): Promise<LeadRecord> {
    const dashboardId = await this.dashboards.resolveDashboardId(userId, input.dashboardId);
    let validFormId: string | null = null;
    let formName = "Sandbox Simulator";
    let formEnv = "development";

    if (input.formId) {
      const form = await this.repository.findFormById(input.formId);
      // ONLY link if form actually exists AND belongs to the user's dashboard!
      if (form && form.dashboardId === dashboardId) {
        validFormId = form.id;
        formName = form.name;
        formEnv = form.environment || "development";
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
      environment: validFormId ? formEnv : input.environment || "development",
      extraFields: input.extraFields,
    });

    return lead;
  }
  async getLeads(
    userId: string,
    query?: GetLeadsQueryInput
  ): Promise<{
    items: LeadRecord[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const targetDashboardId = await this.dashboards.resolveDashboardId(
      userId,
      query?.dashboardId
    );

    const result = await this.repository.findLeadsWithPagination({
      dashboardId: targetDashboardId,
      environment: query?.environment,
      page: query?.page,
      limit: query?.limit,
      search: query?.search,
      formId: query?.formId,
      source: query?.source,
      status: query?.status,
      dateRange: query?.dateRange,
    });

    return {
      items: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }
  async getAllLeads(
    userId: string,
    dashboardId?: string,
    environment?: string
  ): Promise<LeadRecord[]> {
    const targetDashboardId = await this.dashboards.resolveDashboardId(userId, dashboardId);
    return this.repository.findLeadsByDashboardId(targetDashboardId, environment);
  }
  async updateLeadStatus(
    userId: string,
    leadId: string,
    status: LeadStatus
  ): Promise<LeadRecord | null> {
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, dashboard: { userId } },
      select: { id: true },
    });
    if (!lead) return null;

    return this.repository.updateLeadStatus(leadId, status);
  }
  async deleteLead(userId: string, leadId: string): Promise<boolean> {
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, dashboard: { userId } },
      select: { id: true },
    });
    if (!lead) return false;

    await this.repository.deleteLead(leadId);
    return true;
  }
  async batchDeleteLeads(
    userId: string,
    leadIds: string[],
    dashboardId?: string
  ): Promise<{ count: number }> {
    const targetDashboardId = await this.dashboards.resolveDashboardId(userId, dashboardId);
    const count = await this.repository.deleteLeads(targetDashboardId, leadIds);
    return { count };
  }
  async batchUpdateLeadStatus(
    userId: string,
    leadIds: string[],
    status: LeadStatus,
    dashboardId?: string
  ): Promise<{ count: number }> {
    const targetDashboardId = await this.dashboards.resolveDashboardId(userId, dashboardId);
    const count = await this.repository.batchUpdateLeadStatus(
      targetDashboardId,
      leadIds,
      status
    );
    return { count };
  }
}

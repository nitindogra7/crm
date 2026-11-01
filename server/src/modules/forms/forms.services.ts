import { dashboardsRepository, type DashboardsRepository } from "../dashboards/dashboards.repository";
import { formsRepository, type FormsRepository } from "../forms/forms.repository";
import type { CreateFormInput, FormRecord, UpdateFormInput } from "../forms/forms.types";
import { DashboardsService } from "../dashboards/dashboards.services";

type Repository = Pick<DashboardsRepository, "findDashboardById"> & Pick<FormsRepository, "createForm" | "deleteForm" | "findFormByGlobalSlug" | "findFormById" | "findFormsByDashboardId" | "updateForm">;
const defaultRepository: Repository = {
  findDashboardById: dashboardsRepository.findDashboardById.bind(dashboardsRepository),
  createForm: formsRepository.createForm.bind(formsRepository),
  deleteForm: formsRepository.deleteForm.bind(formsRepository),
  findFormByGlobalSlug: formsRepository.findFormByGlobalSlug.bind(formsRepository),
  findFormById: formsRepository.findFormById.bind(formsRepository),
  findFormsByDashboardId: formsRepository.findFormsByDashboardId.bind(formsRepository),
  updateForm: formsRepository.updateForm.bind(formsRepository),
};

export class FormsService {
  constructor(
    private readonly repository: Repository = defaultRepository,
    private readonly dashboards: DashboardsService = new DashboardsService(),
  ) {}
  async createForm(userId: string, input: CreateFormInput): Promise<FormRecord> {
    const dashboardId = await this.dashboards.resolveDashboardId(userId, input.dashboardId);

    const baseSlug =
      input.slug ||
      input.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      "form";

    let finalSlug = baseSlug;
    let existing = await this.repository.findFormByGlobalSlug(finalSlug);
    let counter = 1;

    while (existing) {
      finalSlug = `${baseSlug}-${counter}`;
      existing = await this.repository.findFormByGlobalSlug(finalSlug);
      counter++;
    }

    const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const endpointUrl = `${backendUrl}/api/forms-and-api/f/${finalSlug}`;

    return this.repository.createForm({
      dashboardId,
      name: input.name,
      slug: finalSlug,
      endpointUrl,
      environment: input.environment || "development",
      redirectUrl: input.redirectUrl || null,
      allowedDomains: input.allowedDomains || [],
      fields: input.fields || [],
    });
  }
  async getForms(userId: string, dashboardId?: string, environment?: string): Promise<FormRecord[]> {
    const targetDashboardId = await this.dashboards.resolveDashboardId(userId, dashboardId);
    return this.repository.findFormsByDashboardId(targetDashboardId, environment);
  }
  async getFormById(userId: string, formId: string): Promise<FormRecord | null> {
    const form = await this.repository.findFormById(formId);
    if (!form) return null;
    const dashboard = await this.repository.findDashboardById(form.dashboardId);
    if (!dashboard || dashboard.userId !== userId) return null;
    return form;
  }
  async updateForm(
    userId: string,
    formId: string,
    updates: UpdateFormInput
  ): Promise<FormRecord | null> {
    const form = await this.getFormById(userId, formId);
    if (!form) return null;

    let newEndpointUrl = form.endpointUrl;
    let finalSlug = form.slug;
    if (updates.slug && updates.slug !== form.slug) {
      let candidateSlug = updates.slug;
      let existing = await this.repository.findFormByGlobalSlug(candidateSlug);
      let counter = 1;
      while (existing && existing.id !== formId) {
        candidateSlug = `${updates.slug}-${counter}`;
        existing = await this.repository.findFormByGlobalSlug(candidateSlug);
        counter++;
      }
      finalSlug = candidateSlug;
      const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      newEndpointUrl = `${backendUrl}/api/forms-and-api/f/${finalSlug}`;
    }

    return this.repository.updateForm(formId, {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.slug !== undefined && { slug: finalSlug, endpointUrl: newEndpointUrl }),
      ...(updates.enabled !== undefined && { enabled: updates.enabled }),
      ...(updates.environment !== undefined && { environment: updates.environment }),
      ...(updates.redirectUrl !== undefined && { redirectUrl: updates.redirectUrl ? updates.redirectUrl : null }),
      ...(updates.allowedDomains !== undefined && { allowedDomains: updates.allowedDomains }),
      ...(updates.fields !== undefined && { fields: updates.fields }),
    });
  }
  async deleteForm(userId: string, formId: string): Promise<boolean> {
    const form = await this.getFormById(userId, formId);
    if (!form) return false;
    await this.repository.deleteForm(formId);
    return true;
  }
}

import { Prisma } from "@prisma/client";
import { prisma, sqlTable } from "../../prisma";
import type { FormRecord } from "../forms/forms.types";

export class FormsRepository {
  async createForm(data: {
    dashboardId: string;
    name: string;
    slug: string;
    endpointUrl: string;
    environment?: string;
    redirectUrl?: string | null;
    allowedDomains?: string[];
    fields: Prisma.InputJsonValue;
  }): Promise<FormRecord> {
    return prisma.form.create({
      data: {
        dashboardId: data.dashboardId,
        name: data.name,
        slug: data.slug,
        endpointUrl: data.endpointUrl,
        environment: data.environment ?? "development",
        redirectUrl: data.redirectUrl ?? null,
        allowedDomains: data.allowedDomains ?? [],
        fields: data.fields,
        enabled: true,
        leadCount: 0,
        spamCount: 0,
      },
    });
  }
  async findFormsByDashboardId(dashboardId: string, environment?: string): Promise<FormRecord[]> {
    const where: Prisma.FormWhereInput = { dashboardId };
    if (environment) {
      where.environment = environment;
    }
    return prisma.form.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }
  async findFormById(id: string): Promise<FormRecord | null> {
    return prisma.form.findUnique({
      where: { id },
    });
  }
  async findFormByDashboardAndSlug(
    dashboardId: string,
    slug: string
  ): Promise<FormRecord | null> {
    return prisma.form.findUnique({
      where: {
        dashboardId_slug: {
          dashboardId,
          slug,
        },
      },
    });
  }
  async findFormByGlobalSlug(slug: string): Promise<FormRecord | null> {
    return prisma.form.findFirst({
      where: { slug },
      orderBy: { createdAt: "desc" },
    });
  }
  async updateForm(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      endpointUrl: string;
      enabled: boolean;
      environment: string;
      redirectUrl: string | null;
      allowedDomains: string[];
      fields: Prisma.InputJsonValue;
    }>
  ): Promise<FormRecord> {
    return prisma.form.update({
      where: { id },
      data,
    });
  }
  async deleteForm(id: string): Promise<FormRecord> {
    return prisma.form.delete({
      where: { id },
    });
  }
  async incrementLeadCount(formId: string): Promise<void> {
    await prisma.form.update({
      where: { id: formId },
      data: { leadCount: { increment: 1 } },
    });
  }
  async incrementSpamCount(formId: string): Promise<void> {
    await prisma.form.update({
      where: { id: formId },
      data: { spamCount: { increment: 1 } },
    });
  }
  async decrementSpamCount(formId: string, count: number = 1): Promise<void> {
    await prisma.$executeRaw`
      UPDATE ${sqlTable("forms")}
      SET "spamCount" = GREATEST(0, "spamCount" - ${count})
      WHERE "id" = ${formId}
    `;
  }
  async decrementLeadCount(formId: string, count: number = 1): Promise<void> {
    await prisma.$executeRaw`
      UPDATE ${sqlTable("forms")}
      SET "leadCount" = GREATEST(0, "leadCount" - ${count})
      WHERE "id" = ${formId}
    `;
  }
}
export const formsRepository = new FormsRepository();

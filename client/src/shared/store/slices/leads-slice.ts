import { StateCreator } from "zustand";
import { LeadItem, DeliveryLogItem } from "@/shared/types";
import { INITIAL_LEADS } from "@/features/dashboard/data/mock-data";
import type { AppStoreState, LeadsSlice } from "../types";

export type { LeadsSlice };

export const createLeadsSlice: StateCreator<
  AppStoreState,
  [],
  [],
  LeadsSlice
> = (set, get) => ({
  leads: INITIAL_LEADS,
  setLeads: (leads) => set({ leads }),
  updateLeadStatus: (id, status) => {
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, status } : l)),
    }));
    get().addToast(
      status === "Contacted" ? "Lead marked contacted" : "Lead marked new",
      `Status changed to ${status}.`
    );
  },
  simulateLeadSubmission: (formId, payload) => {
    const { forms, leads, workspace, webhook, deliveryLogs, addToast } = get();
    const targetForm = forms.find((f) => f.id === formId) || forms[0];

    const newLead: LeadItem = {
      id: `lead_${Date.now()}`,
      name: payload.name || "Test Sender",
      email: payload.email || "test@example.com",
      formId: targetForm ? targetForm.id : "form_test",
      formName: targetForm ? targetForm.name : "Test Form",
      source: payload.source || "Simulation Sandbox",
      status: "New",
      receivedAt: new Date().toISOString(),
      message:
        payload.message || "Simulated test submission from Salenova dashboard.",
      extraFields: payload.extraFields,
      metadata: {
        ip: "127.0.0.1",
        userAgent: "Salenova-Simulator/1.0",
        referrer: "https://salenova.app/dashboard",
      },
    };

    const nextForms = forms.map((f) =>
      f.id === targetForm?.id ? { ...f, leadCount: f.leadCount + 1 } : f
    );

    const newLog1: DeliveryLogItem = {
      id: `log_${Date.now()}_1`,
      type: "email",
      destination: workspace.ownerEmail,
      event: "lead.notification",
      status: "success",
      statusCode: 250,
      latencyMs: 112,
      timestamp: new Date().toISOString(),
    };

    const newLog2: DeliveryLogItem = {
      id: `log_${Date.now()}_2`,
      type: "webhook",
      destination: webhook.url,
      event: "lead.created",
      status: webhook.enabled ? "success" : "failed",
      statusCode: webhook.enabled ? 200 : 0,
      latencyMs: 76,
      timestamp: new Date().toISOString(),
      errorDetail: webhook.enabled
        ? undefined
        : "Webhook delivery disabled in Settings",
    };

    const nextLogs = [newLog1, newLog2, ...deliveryLogs].slice(0, 50);

    set({
      forms: nextForms,
      leads: [newLead, ...leads],
      deliveryLogs: nextLogs,
    });

    addToast(
      "Test lead simulated!",
      `Added "${newLead.name}" to ${targetForm?.name || "inbox"}. (Local preview only; no actual emails sent)`
    );
  },
});

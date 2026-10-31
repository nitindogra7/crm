import { StateCreator } from "zustand";
import { LeadItem, DeliveryLogItem, LeadStatus } from "@/shared/types";
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
      `Lead marked ${status}`,
      `Status changed to ${status}.`
    );
  },
  deleteLead: (id) => {
    const { leads, forms, selectedLeadId, setSelectedLeadId, addToast } = get();
    const targetLead = leads.find((l) => l.id === id);
    if (!targetLead) return;

    if (selectedLeadId === id) {
      setSelectedLeadId(null);
    }

    const nextForms = forms.map((f) =>
      f.id === targetLead.formId
        ? { ...f, leadCount: Math.max(0, f.leadCount - 1) }
        : f
    );

    set({
      leads: leads.filter((l) => l.id !== id),
      forms: nextForms,
    });

    addToast("Lead deleted", `Removed "${targetLead.name}" from leads inbox.`);
  },
  deleteLeads: (ids) => {
    const { leads, forms, selectedLeadId, setSelectedLeadId, addToast } = get();
    if (ids.length === 0) return;

    if (selectedLeadId && ids.includes(selectedLeadId)) {
      setSelectedLeadId(null);
    }

    // Count deletions per form
    const formCounts: Record<string, number> = {};
    for (const id of ids) {
      const l = leads.find((item) => item.id === id);
      if (l && l.formId) {
        formCounts[l.formId] = (formCounts[l.formId] || 0) + 1;
      }
    }

    const nextForms = forms.map((f) => {
      const dec = formCounts[f.id] || 0;
      return dec > 0 ? { ...f, leadCount: Math.max(0, f.leadCount - dec) } : f;
    });

    const idsSet = new Set(ids);
    set({
      leads: leads.filter((l) => !idsSet.has(l.id)),
      forms: nextForms,
    });

    addToast(
      "Leads deleted",
      `Successfully removed ${ids.length} lead${ids.length > 1 ? "s" : ""}.`
    );
  },
  batchUpdateLeadStatus: (ids, status: LeadStatus) => {
    const idsSet = new Set(ids);
    set((state) => ({
      leads: state.leads.map((l) =>
        idsSet.has(l.id) ? { ...l, status } : l
      ),
    }));
    get().addToast(
      "Status updated",
      `Updated ${ids.length} lead${ids.length > 1 ? "s" : ""} to "${status}".`
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
        payload.message || "Simulated test submission from infraly dashboard.",
      extraFields: payload.extraFields,
      metadata: {
        ip: "127.0.0.1",
        userAgent: "infraly-Simulator/1.0",
        referrer: "https://infraly.app/dashboard",
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
      `Added "${newLead.name}" to ${targetForm?.name || "inbox"}.`
    );
  },
});

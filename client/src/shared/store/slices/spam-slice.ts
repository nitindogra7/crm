import { StateCreator } from "zustand";
import { LeadItem } from "@/shared/types";
import { INITIAL_SPAM } from "@/features/dashboard/data/mock-data";
import type { AppStoreState, SpamSlice } from "../types";

export type { SpamSlice };

export const createSpamSlice: StateCreator<
  AppStoreState,
  [],
  [],
  SpamSlice
> = (set, get) => ({
  spam: INITIAL_SPAM,
  rescueSpamLead: (spamId) => {
    const { spam, leads, forms, selectedSpamId, addToast } = get();
    const targetSpam = spam.find((s) => s.id === spamId);
    if (!targetSpam) return;

    const rescuedLead: LeadItem = {
      id: `lead_rescued_${Date.now()}`,
      name: targetSpam.senderName,
      email: targetSpam.senderEmail,
      formId: targetSpam.formId,
      formName: targetSpam.formName,
      source: "Rescued from Spam Shield",
      status: "New",
      receivedAt: new Date().toISOString(),
      message: targetSpam.messageSnippet || "Rescued spam submission.",
      extraFields: {
        original_reason: targetSpam.reason,
        rescued_date: new Date().toLocaleDateString(),
      },
      metadata: targetSpam.metadata,
    };

    const nextSpam = spam.filter((s) => s.id !== spamId);
    const nextLeads = [rescuedLead, ...leads];
    const nextForms = forms.map((f) => {
      if (f.id === targetSpam.formId) {
        return {
          ...f,
          leadCount: f.leadCount + 1,
          spamCount: Math.max(0, f.spamCount - 1),
        };
      }
      return f;
    });

    set({
      spam: nextSpam,
      leads: nextLeads,
      forms: nextForms,
      selectedSpamId: selectedSpamId === spamId ? null : selectedSpamId,
    });

    addToast(
      "Lead rescued!",
      `Moved "${rescuedLead.name}" to Leads with status New and adjusted counts.`
    );
  },
});

import { StateCreator } from "zustand";
import { FormItem } from "@/shared/types";
import { INITIAL_FORMS } from "@/features/dashboard/data/mock-data";
import type { AppStoreState, FormsSlice } from "../types";

export type { FormsSlice };

export const createFormsSlice: StateCreator<
  AppStoreState,
  [],
  [],
  FormsSlice
> = (set) => ({
  forms: INITIAL_FORMS,
  addForm: ({ name, redirectUrl, fields }) => {
    const slug =
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "form";

    const newForm: FormItem = {
      id: `form_${Date.now()}`,
      name,
      slug,
      endpointUrl: `https://api.salenova.com/v1/f/${slug}`,
      enabled: true,
      leadCount: 0,
      spamCount: 0,
      createdAt: new Date().toISOString(),
      redirectUrl: redirectUrl || undefined,
      fields:
        fields && fields.length > 0
          ? fields
          : [
              { id: "f1", name: "name", label: "Full Name", type: "text", required: true },
              { id: "f2", name: "email", label: "Email Address", type: "email", required: true },
              { id: "f3", name: "message", label: "Message", type: "textarea", required: true },
            ],
    };

    set((state) => ({
      forms: [newForm, ...state.forms],
    }));

    return newForm;
  },
  updateForm: (id, updates) =>
    set((state) => ({
      forms: state.forms.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  toggleFormEnabled: (id) =>
    set((state) => ({
      forms: state.forms.map((f) =>
        f.id === id ? { ...f, enabled: !f.enabled } : f
      ),
    })),
  deleteForm: (id) =>
    set((state) => ({
      forms: state.forms.filter((f) => f.id !== id),
    })),
});

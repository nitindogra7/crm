import { StateCreator } from "zustand";
import type { AppStoreState, UISlice } from "../types";

export type { UISlice };

export const createUISlice: StateCreator<
  AppStoreState,
  [],
  [],
  UISlice
> = (set) => ({
  selectedLeadId: null,
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  selectedSpamId: null,
  setSelectedSpamId: (id) => set({ selectedSpamId: id }),
  selectedFormId: null,
  setSelectedFormId: (id) => set({ selectedFormId: id }),
  isCreateFormOpen: false,
  setIsCreateFormOpen: (open) => set({ isCreateFormOpen: open }),
  toasts: [],
  addToast: (title, description, variant = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, title, description, variant }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
});

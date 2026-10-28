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
  isTourOpen: false,
  tourStep: 0,
  startTour: () => set({ isTourOpen: true, tourStep: 0 }),
  closeTour: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("salenova_tour_completed", "true");
      } catch {
        // Safe fallback for private browsing
      }
    }
    set({ isTourOpen: false });
  },
  setTourStep: (step) => set({ tourStep: step }),
  nextTourStep: () =>
    set((state) => ({ tourStep: Math.min(state.tourStep + 1, 4) })),
  prevTourStep: () =>
    set((state) => ({ tourStep: Math.max(state.tourStep - 1, 0) })),
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

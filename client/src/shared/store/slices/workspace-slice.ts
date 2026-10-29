import { StateCreator } from "zustand";
import { INITIAL_WORKSPACE } from "@/features/dashboard/data/mock-data";
import type { AppStoreState, WorkspaceSlice } from "../types";

export type { WorkspaceSlice };

export const createWorkspaceSlice: StateCreator<
  AppStoreState,
  [],
  [],
  WorkspaceSlice
> = (set) => ({
  workspace: INITIAL_WORKSPACE,
  organizations: [],
  activeDashboardId: null,
  updateWorkspace: (updates) =>
    set((state) => ({
      workspace: { ...state.workspace, ...updates },
    })),
  initWorkspace: (config) =>
    set({
      workspace: {
        name: config.name,
        slug: config.slug,
        ownerEmail: config.ownerEmail,
        plan: config.teamSize === "team" ? "Team Workspace" : "Free Tier",
        avatarTone: config.avatarTone,
        createdAt: new Date().toISOString(),
      },
    }),
  setOrganizations: (orgs) => set({ organizations: orgs }),
  setActiveDashboardId: (id) => set({ activeDashboardId: id }),
});

"use client";

import React, { useEffect } from "react";
import { useAppStore, useStats } from "@/shared/store";

export interface DashboardProviderProps {
  children: React.ReactNode;
  initialWorkspace?: {
    name?: string;
    slug?: string;
    ownerEmail?: string | null;
    teamSize?: string;
    avatarTone?: string;
    createdAt?: string;
  } | null;
}

export function DashboardProvider({
  children,
  initialWorkspace,
}: DashboardProviderProps) {
  const initWorkspace = useAppStore((state) => state.initWorkspace);
  const currentWorkspace = useAppStore((state) => state.workspace);

  useEffect(() => {
    if (
      initialWorkspace &&
      initialWorkspace.name &&
      (!currentWorkspace || currentWorkspace.name === "Acme Studio")
    ) {
      initWorkspace({
        name: initialWorkspace.name,
        slug: initialWorkspace.slug || "",
        ownerEmail: initialWorkspace.ownerEmail || "",
        teamSize: initialWorkspace.teamSize === "solo" ? "solo" : "team",
        avatarTone: initialWorkspace.avatarTone || "zinc",
      });
    }
  }, [initialWorkspace, initWorkspace, currentWorkspace]);

  return <>{children}</>;
}

export function useDashboard() {
  const store = useAppStore();
  const stats = useStats();

  return {
    ...store,
    stats,
  };
}

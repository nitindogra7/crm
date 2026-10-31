"use client";

import { DialogLayer } from "@/shared/components/dialog-layer";
import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import styles from "./dashboard-shell.module.css";
import dynamic from "next/dynamic";
import { useDashboard } from "../context/dashboard-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { ToastNotificationContainer } from "./toast-notification";
import { ProductionOriginBanner } from "./production-origin-banner";

const LeadDetailDrawer = dynamic(
  () => import("./lead-detail-drawer").then((m) => m.LeadDetailDrawer),
  { ssr: false }
);
const SpamDetailDrawer = dynamic(
  () => import("./spam-detail-drawer").then((m) => m.SpamDetailDrawer),
  { ssr: false }
);
const CreateFormModal = dynamic(
  () => import("./create-form-modal").then((m) => m.CreateFormModal),
  { ssr: false }
);
const FormDetailModal = dynamic(
  () => import("./form-detail-modal").then((m) => m.FormDetailModal),
  { ssr: false }
);
const DashboardWalkthrough = dynamic(
  () => import("./dashboard-walkthrough").then((m) => m.DashboardWalkthrough),
  { ssr: false }
);

const desktopQuery = "(min-width: 768px)";
const subscribeToViewport = (notify: () => void) => {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const getDesktopSnapshot = () => window.matchMedia(desktopQuery).matches;
const getServerDesktopSnapshot = () => true;

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { activeDashboardId, currentEnvironment, loadError, isRefreshing, refreshDashboardData } = useDashboard(["activeDashboardId", "currentEnvironment"]);
  const pathname = usePathname();
  const isDesktop = useSyncExternalStore(subscribeToViewport, getDesktopSnapshot, getServerDesktopSnapshot);
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { mainRef.current?.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setMobileMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <div className={`${styles.workspace} flex h-dvh bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-blue-500/20 selection:text-blue-900 relative`}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Desktop Sidebar */}
      {isDesktop && <div className="hidden md:flex h-full flex-none relative z-20">
        <Sidebar />
      </div>}

      {/* Mobile Navigation Drawer */}
      {!isDesktop && mobileMenuOpen && (
        <DialogLayer label="Navigation" onClose={() => setMobileMenuOpen(false)} className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col min-h-0 h-dvh max-w-xs w-full bg-white shadow-2xl border-r border-slate-200 animate-in slide-in-from-left duration-200 z-10">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </DialogLayer>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 overflow-y-auto min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
          <div className="mx-auto w-full max-w-7xl min-w-0">
            {loadError && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><p>{loadError}</p><button type="button" disabled={isRefreshing} onClick={() => void refreshDashboardData()} className="rounded-lg border border-amber-300 bg-white px-3 py-2 font-semibold hover:bg-amber-100">{isRefreshing ? "Retrying..." : "Try again"}</button></div>}
            <ProductionOriginBanner />
            <div key={`${activeDashboardId}:${currentEnvironment}`}>{children}</div>
          </div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <LeadDetailDrawer />
      <SpamDetailDrawer />
      <CreateFormModal />
      <FormDetailModal />
      <DashboardWalkthrough />
      <ToastNotificationContainer />
    </div>
  );
}

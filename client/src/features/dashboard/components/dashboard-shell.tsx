"use client";

import React, { useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import { LoadingBar } from "./dashboard-skeleton";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { ToastNotificationContainer } from "./toast-notification";
import { LeadDetailDrawer } from "./lead-detail-drawer";
import { SpamDetailDrawer } from "./spam-detail-drawer";
import { CreateFormModal } from "./create-form-modal";
import { FormDetailModal } from "./form-detail-modal";
import { DashboardWalkthrough } from "./dashboard-walkthrough";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { isLoading } = useDashboard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-zinc-100 font-sans overflow-hidden">
      {/* Global Top Loading Bar */}
      {isLoading && <LoadingBar />}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full flex-none">
        <Sidebar />
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#141414] animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
          {children}
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

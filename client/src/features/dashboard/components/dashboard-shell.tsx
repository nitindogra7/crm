"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useDashboard } from "../context/dashboard-context";
import { LoadingBar } from "./dashboard-skeleton";
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

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { isLoading } = useDashboard();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans overflow-hidden selection:bg-blue-500/20 selection:text-blue-900 relative">
      {/* Ambient Top Gradient & Subtle Technical Grid matching Marketing, Login & Onboarding */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div
          className="absolute top-0 left-0 right-0 h-[360px] pointer-events-none opacity-85"
          style={{
            background:
              "linear-gradient(to right, rgba(186, 218, 255, 0.65) 0%, rgba(206, 227, 255, 0.4) 25%, rgba(242, 237, 254, 0.25) 50%, rgba(253, 230, 244, 0.4) 75%, rgba(252, 216, 236, 0.65) 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Global Top Loading Bar */}
      {isLoading && <LoadingBar />}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full flex-none relative z-20">
        <Sidebar />
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl border-r border-slate-200 animate-in slide-in-from-left duration-200 z-10">
            <Sidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
          <ProductionOriginBanner />
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

"use client";

import { DialogLayer } from "@/shared/components/dialog-layer";
import React, { useState, useEffect } from "react";
import Link from "@/shared/components/app-link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDashboard } from "../context/dashboard-context";
import {
  Menu,
  Zap,
  Send,
  X,
  Compass,
} from "lucide-react";
import { EnvironmentSwitcher } from "./environment-switcher";

interface TopbarProps {
  onOpenMobileMenu: () => void;
  title?: string;
}

export function Topbar({ onOpenMobileMenu, title }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    workspace,
    forms,
    simulateLeadSubmissionAsync,
    addToast,
    startTour,
  } = useDashboard(["workspace","forms","simulateLeadSubmissionAsync","addToast","startTour"]);

  const getPageTitle = () => {
    if (title) return title;
    if (pathname.startsWith("/dashboard/leads")) return "Leads";
    if (pathname.startsWith("/dashboard/forms")) return "Forms & APIs";
    if (pathname.startsWith("/dashboard/analytics")) return "Analytics";
    if (pathname.startsWith("/dashboard/spam")) return "Spam Shield";
    if (pathname.startsWith("/dashboard/settings")) return "Settings";
    return "Overview";
  };

  const [tourRequested, setTourRequested] = useState(false);
  useEffect(() => {
    if (!tourRequested || pathname !== "/dashboard") return;
    let frame = 0;
    const startWhenReady = () => {
      if (document.querySelector('[data-tour="stats-overview"]')) { startTour(); setTourRequested(false); }
      else frame = requestAnimationFrame(startWhenReady);
    };
    frame = requestAnimationFrame(startWhenReady);
    return () => cancelAnimationFrame(frame);
  }, [tourRequested, pathname, startTour]);

  const [isQuickSimulateOpen, setIsQuickSimulateOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(forms[0]?.id || "");
  const [testName, setTestName] = useState("Alex Rivera");
  const [testEmail, setTestEmail] = useState("alex@designcraft.co");
  const [testMessage, setTestMessage] = useState(
    "Interested in setting up 4 client forms for our branding agency. Love the clean developer UX!"
  );

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSimulating) return;
    const targetFormId = selectedFormId || forms[0]?.id;
    if (!targetFormId) {
      addToast("No Form Available", "Create a form before simulating inbound submissions.", "error");
      return;
    }

    setIsSimulating(true);
    try {
      await simulateLeadSubmissionAsync(targetFormId, {
        name: testName,
        email: testEmail,
        message: testMessage,
        source: "Sandbox Simulator",
      });
      setIsQuickSimulateOpen(false);
    } catch {
      addToast("Error", "Failed to simulate lead submission", "error");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <>
      <header className="h-16 shrink-0 gap-3 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <Link href="/" className="md:hidden flex items-center shrink-0">
            <Image
              src="/favicon.ico"
              alt="Infraly"
              width={24}
              height={24}
              unoptimized
              className="w-5 h-5 object-contain"
            />
          </Link>

          <div className="flex min-w-0 items-center gap-2 text-[13px]">
            <span className="max-w-40 truncate text-slate-500 hidden lg:inline font-normal">{workspace.name}</span>
            <span className="text-slate-300 hidden lg:inline">/</span>
            <span className="hidden min-[400px]:block truncate text-slate-900 font-medium text-[13px]">
              {getPageTitle()}
            </span>
          </div>

          <div className="hidden sm:block ml-2">
            <EnvironmentSwitcher compact />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="sm:hidden">
            <EnvironmentSwitcher compact />
          </div>
          {/* Subtle Product Tour Button */}
          <button
            type="button"
            onClick={() => {
              if (pathname !== "/dashboard") {
                router.push("/dashboard");
                setTourRequested(true);
              } else {
                startTour();
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80 transition-all text-xs cursor-pointer shadow-2xs font-medium"
            aria-label="Start dashboard tour"
            title="Walk through the dashboard features and flow"
          >
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Tour</span>
          </button>

          {/* Clean Quick Simulation Trigger */}
          <button
            data-tour="simulate-lead-btn"
            type="button"
            onClick={() => setIsQuickSimulateOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-blue-200/80 bg-blue-50/90 hover:bg-blue-100 text-blue-700 hover:text-blue-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
            aria-label="Send a test lead"
            title="Simulate an incoming lead locally"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Simulate Lead</span>
          </button>
        </div>
      </header>

      {/* Quick Simulate Modal */}
      {isQuickSimulateOpen && (
        <DialogLayer label="Simulate a lead" onClose={() => setIsQuickSimulateOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-600 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-heading font-bold text-slate-900">Simulate Inbound Lead</h3>
                  <p className="text-[11.5px] text-slate-500">Local test; verify pipeline processing without sending real emails.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickSimulateOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSimulate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label htmlFor="topbar-field-15" className="block text-slate-700 mb-1 text-[12px] font-semibold">
                  Target Form
                </label>
                <select id="topbar-field-15"
                  value={selectedFormId || forms[0]?.id || ""}
                  onChange={(e) => setSelectedFormId(e.target.value)}
                  disabled={forms.length === 0}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 disabled:opacity-60 text-xs transition-all"
                >
                  {forms.length === 0 ? (
                    <option value="">No forms available (Create a form first)</option>
                  ) : (
                    forms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.slug})
                      </option>
                    ))
                  )}
                </select>
                {forms.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    You need at least one form before simulating inbound leads.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="topbar-field-16" className="block text-slate-700 mb-1 text-[12px] font-semibold">
                  Full Name
                </label>
                <input id="topbar-field-16"
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 text-xs transition-all"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label htmlFor="topbar-field-17" className="block text-slate-700 mb-1 text-[12px] font-semibold">
                  Email Address
                </label>
                <input id="topbar-field-17"
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 text-xs transition-all"
                  placeholder="jane@company.com"
                />
              </div>

              <div>
                <label htmlFor="topbar-field-18" className="block text-slate-700 mb-1 text-[12px] font-semibold">
                  Message Content
                </label>
                <textarea id="topbar-field-18"
                  rows={3}
                  required
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50/80 border border-slate-200/90 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 text-xs transition-all resize-none"
                  placeholder="Inquiry or feedback payload..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickSimulateOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forms.length === 0 || isSimulating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isSimulating ? (
                    <span className="sr-only">Working</span>
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isSimulating ? "Sending..." : "Send Test Submission"}</span>
                </button>
              </div>
            </form>
          </div>
        </DialogLayer>
      )}
    </>
  );
}

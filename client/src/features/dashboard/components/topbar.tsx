"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDashboard } from "../context/dashboard-context";
import {
  Menu,
  Zap,
  Send,
  X,
  Compass,
  Loader2,
} from "lucide-react";

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
  } = useDashboard();

  const getPageTitle = () => {
    if (title) return title;
    if (pathname.startsWith("/dashboard/leads")) return "Leads";
    if (pathname.startsWith("/dashboard/forms")) return "Forms & APIs";
    if (pathname.startsWith("/dashboard/analytics")) return "Analytics";
    if (pathname.startsWith("/dashboard/spam")) return "Spam Shield";
    if (pathname.startsWith("/dashboard/settings")) return "Settings";
    return "Overview";
  };

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
      <header className="h-13 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.06] bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 hidden sm:inline">{workspace.name}</span>
            <span className="text-zinc-700 hidden sm:inline">/</span>
            <span className="text-zinc-200 font-medium">
              {getPageTitle()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Subtle Product Tour Button */}
          <button
            type="button"
            onClick={() => {
              if (pathname !== "/dashboard") {
                router.push("/dashboard");
                setTimeout(() => startTour(), 250);
              } else {
                startTour();
              }
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors text-xs cursor-pointer"
            title="Walk through the dashboard features and flow"
          >
            <Compass className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Tour</span>
          </button>

          {/* Clean Quick Simulation Trigger */}
          <button
            data-tour="simulate-lead-btn"
            type="button"
            onClick={() => setIsQuickSimulateOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
            title="Simulate an incoming lead locally"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Simulate Lead</span>
          </button>
        </div>
      </header>

      {/* Quick Simulate Modal */}
      {isQuickSimulateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#181818] border border-white/[0.12] rounded-2xl p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-medium font-heading">Simulate Inbound Lead</h3>
                  <p className="text-[11px] text-zinc-400">Local test; no email or webhook is actually sent.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickSimulateOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSimulate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 text-[11px] font-mono uppercase">
                  Target Form
                </label>
                <select
                  value={selectedFormId || forms[0]?.id || ""}
                  onChange={(e) => setSelectedFormId(e.target.value)}
                  disabled={forms.length === 0}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white focus:outline-none focus:border-white/40 disabled:opacity-60"
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
                  <p className="text-[11px] text-amber-400 mt-1">
                    You need at least one form before simulating inbound leads.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 text-[11px] font-mono uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 text-[11px] font-mono uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                  placeholder="jane@company.com"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 text-[11px] font-mono uppercase">
                  Message Content
                </label>
                <textarea
                  rows={3}
                  required
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 resize-none"
                  placeholder="Inquiry or feedback payload..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickSimulateOpen(false)}
                  className="px-3 py-2 rounded-xl border border-white/[0.1] text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forms.length === 0 || isSimulating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors shadow-sm disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isSimulating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{isSimulating ? "Sending..." : "Send Test Submission"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

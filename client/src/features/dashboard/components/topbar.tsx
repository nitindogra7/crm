"use client";

import React, { useState } from "react";
import { useDashboard } from "../context/dashboard-context";
import {
  Menu,
  Zap,
  Send,
  X,
} from "lucide-react";

interface TopbarProps {
  onOpenMobileMenu: () => void;
  title?: string;
}

export function Topbar({ onOpenMobileMenu, title }: TopbarProps) {
  const {
    workspace,
    forms,
    simulateLeadSubmission,
  } = useDashboard();

  const [isQuickSimulateOpen, setIsQuickSimulateOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(forms[0]?.id || "");
  const [testName, setTestName] = useState("Alex Rivera");
  const [testEmail, setTestEmail] = useState("alex@designcraft.co");
  const [testMessage, setTestMessage] = useState(
    "Interested in setting up 4 client forms for our branding agency. Love the clean developer UX!"
  );

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    simulateLeadSubmission(selectedFormId || forms[0]?.id, {
      name: testName,
      email: testEmail,
      message: testMessage,
      source: "Sandbox Simulator",
    });
    setIsQuickSimulateOpen(false);
  };

  return (
    <>
      <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.08] bg-[#141414]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden text-zinc-400 hover:text-white p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 font-sans hidden sm:inline">{workspace.name}</span>
            <span className="text-zinc-600 hidden sm:inline">/</span>
            <span className="text-white font-medium font-sans">
              {title || "Dashboard"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Simulation Trigger */}
          <button
            type="button"
            onClick={() => setIsQuickSimulateOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] hover:bg-emerald-500/[0.14] text-emerald-400 text-xs font-medium transition-all cursor-pointer shadow-sm"
            title="Simulate an incoming lead locally"
          >
            <Zap className="w-3.5 h-3.5" />
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
                  value={selectedFormId}
                  onChange={(e) => setSelectedFormId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/[0.1] text-white focus:outline-none focus:border-white/40"
                >
                  {forms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.slug})
                    </option>
                  ))}
                </select>
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test Submission</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

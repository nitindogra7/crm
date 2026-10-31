"use client";

import React, { useState } from "react";
import { Icon } from "./icons";
import { Avatar } from "./ui";
import { cn } from "@/shared/lib/utils";

interface LeadItem {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "verified" | "quarantined";
  reason: string;
  avatarIndex: number;
  time: string;
  isNew?: boolean;
}

const SAMPLE_CUSTOMERS = [
  {
    name: "Maya Lin",
    email: "maya@studio.co",
    company: "Studio Labs",
    inquiry: "Website redesign & branding consultation",
    budget: "$8,000",
    avatarIndex: 0,
  },
  {
    name: "Dev Patel",
    email: "dev@cloudtech.io",
    company: "CloudTech",
    inquiry: "Requesting pricing for 15 team seats",
    budget: "$12,000",
    avatarIndex: 2,
  },
  {
    name: "Lena Rossi",
    email: "lena@agencypro.com",
    company: "Agency Pro",
    inquiry: "Custom quote for multi-client portal",
    budget: "$15,000",
    avatarIndex: 4,
  },
];

const SAMPLE_BOTS = [
  {
    name: "Spam Crawler 9",
    email: "crawler@scrape-harvest.net",
    company: "Unknown",
    reason: "Automated spam bot detected",
    avatarIndex: 1,
  },
  {
    name: "Burner Mailer",
    email: "throwaway@tempmail.com",
    company: "None",
    reason: "Disposable fake email address",
    avatarIndex: 3,
  },
  {
    name: "Backlink Spammer",
    email: "promo@mailinator.com",
    company: "SEO Blast",
    reason: "Blocked disposable domain",
    avatarIndex: 5,
  },
];

interface TryItProps {
  kept: number;
  blocked: number;
  onIncrementKept: () => void;
  onIncrementBlocked: () => void;
}

export function TryIt({
  kept,
  blocked,
  onIncrementKept,
  onIncrementBlocked,
}: TryItProps) {
  const [visitorType, setVisitorType] = useState<"clean" | "spam">("clean");
  const [formName, setFormName] = useState("Maya Lin");
  const [formEmail, setFormEmail] = useState("maya@studio.co");
  const [formCompany, setFormCompany] = useState("Studio Labs");
  const [formBudget, setFormBudget] = useState("$5,000 - $10,000");
  const [formMessage, setFormMessage] = useState(
    "Hi there! We would love to book a consultation to discuss our new project."
  );
  const [submittedAlert, setSubmittedAlert] = useState<string | null>(null);

  const [customerIdx, setCustomerIdx] = useState(0);
  const [botIdx, setBotIdx] = useState(0);

  const [feedItems, setFeedItems] = useState<LeadItem[]>([
    {
      id: "1",
      name: "Spam Crawler 9",
      email: "crawler@scrape-harvest.net",
      company: "Bot Script",
      status: "quarantined",
      reason: "Automated bot blocked",
      avatarIndex: 1,
      time: "Just now",
    },
    {
      id: "0",
      name: "Maya Lin",
      email: "maya@studio.co",
      company: "Studio Labs",
      status: "verified",
      reason: "Verified inquiry (Delivered)",
      avatarIndex: 0,
      time: "1m ago",
    },
  ]);

  const handleTypeChange = (type: "clean" | "spam") => {
    setVisitorType(type);
    if (type === "clean") {
      const cust = SAMPLE_CUSTOMERS[customerIdx % SAMPLE_CUSTOMERS.length];
      setFormName(cust.name);
      setFormEmail(cust.email);
      setFormCompany(cust.company);
      setFormBudget(cust.budget);
      setFormMessage(
        "Hi! We are interested in your services and would like to get a project estimate."
      );
    } else {
      const bot = SAMPLE_BOTS[botIdx % SAMPLE_BOTS.length];
      setFormName(bot.name);
      setFormEmail(bot.email);
      setFormCompany(bot.company);
      setFormBudget("Free");
      setFormMessage("Buy cheap backlinks now! Visit junk-promo-site.com/offer");
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (visitorType === "clean") {
      const newItem: LeadItem = {
        id: `${Date.now()}-${Math.random()}`,
        name: formName || "Genuine Customer",
        email: formEmail || "customer@example.com",
        company: formCompany || "Business Client",
        status: "verified",
        reason: "Verified inquiry (Delivered)",
        avatarIndex: Math.floor(Math.random() * 8),
        time: "Just now",
        isNew: true,
      };
      setFeedItems((prev) => [newItem, ...prev.slice(0, 3)]);
      onIncrementKept();
      setSubmittedAlert(`Inquiry from "${formName}" delivered to CRM inbox!`);

      // Cycle to next sample for convenience
      setCustomerIdx((prev) => prev + 1);
    } else {
      const newItem: LeadItem = {
        id: `${Date.now()}-${Math.random()}`,
        name: formName || "Spam Bot",
        email: formEmail || "bot@tempmail.com",
        company: formCompany || "Scraper",
        status: "quarantined",
        reason: "Spam blocked invisibly",
        avatarIndex: Math.floor(Math.random() * 8),
        time: "Just now",
        isNew: true,
      };
      setFeedItems((prev) => [newItem, ...prev.slice(0, 3)]);
      onIncrementBlocked();
      setSubmittedAlert(`Spam submission from "${formName}" caught and quarantined!`);

      // Cycle to next bot for convenience
      setBotIdx((prev) => prev + 1);
    }

    setTimeout(() => setSubmittedAlert(null), 3500);
  };

  const handleRescueItem = (itemId: string) => {
    setFeedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: "verified" as const,
              reason: "Restored to verified leads",
              isNew: true,
            }
          : item
      )
    );
    onIncrementKept();
  };

  return (
    <section className="py-14 md:py-20 relative z-10" id="try">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-900/60 bg-[#0E1411] text-[11px] font-medium text-emerald-400 mb-3">
            <span>[ LIVE INTERACTIVE PREVIEW ]</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-medium tracking-tight text-white leading-tight mb-3">
            See how it works in real life: <br />
            <span className="text-zinc-400">from website form to your CRM.</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            Test a form submission below. See how real inquiries land instantly in your sales inbox, while spam bots are stopped dead in their tracks.
          </p>
        </div>

        {/* Dual Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-4">
          {/* Left: Simulated Website Contact Form */}
          <div className="rounded-xl border border-zinc-800/80 bg-[#0E1411] shadow-[0_16px_45px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between">
            <div>
              {/* Browser bar */}
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-zinc-800/70 bg-[#0A0F0D]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/40" />
                  </div>
                  <span className="h-3 w-px bg-zinc-800 mx-1" />
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#070B09] border border-zinc-800 text-[10.5px] text-zinc-400">
                    <Icon name="chk" className="w-2.5 h-2.5 text-emerald-400" />
                    <span>yourwebsite.com/contact</span>
                  </div>
                </div>

                <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">
                  Step 1: Visitor Fills Form
                </span>
              </div>

              {/* Mode Selector */}
              <div className="p-3 border-b border-zinc-800/60 bg-[#090D0B] flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] text-zinc-400">Choose who is submitting:</span>
                <div className="inline-flex p-0.5 rounded-md border border-zinc-800 bg-[#070B09] text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("clean")}
                    className={cn(
                      "px-2.5 py-1 rounded transition-colors cursor-pointer font-medium flex items-center gap-1.5",
                      visitorType === "clean"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    <Icon name="chk" className="w-3 h-3 text-emerald-400" />
                    <span>Real Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("spam")}
                    className={cn(
                      "px-2.5 py-1 rounded transition-colors cursor-pointer font-medium flex items-center gap-1.5",
                      visitorType === "spam"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    <Icon name="shield" className="w-3 h-3 text-red-400" />
                    <span>Spam Bot</span>
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmitForm} className="p-4 sm:p-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 rounded-md bg-[#080C0A] border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500/60 transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 rounded-md bg-[#080C0A] border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500/60 transition-colors"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-[#080C0A] border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500/60 transition-colors"
                      placeholder="Acme Co."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                      Budget / Timeline
                    </label>
                    <input
                      type="text"
                      value={formBudget}
                      onChange={(e) => setFormBudget(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-md bg-[#080C0A] border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500/60 transition-colors"
                      placeholder="$5,000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Message / Project Details
                  </label>
                  <textarea
                    rows={2}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md bg-[#080C0A] border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500/60 transition-colors resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className={cn(
                    "w-full py-2 px-4 rounded-md text-xs font-semibold tracking-tight transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5",
                    visitorType === "clean"
                      ? "bg-emerald-500 hover:bg-emerald-400 text-[#070B09]"
                      : "bg-red-500/90 hover:bg-red-500 text-white"
                  )}
                >
                  <span>
                    {visitorType === "clean"
                      ? "Submit Customer Inquiry →"
                      : "Send Bot Spam Submission →"}
                  </span>
                </button>
              </form>
            </div>

            {/* Bottom Alert notification */}
            <div className="px-4 py-2 border-t border-zinc-800/70 bg-[#0C120F] text-xs text-zinc-400 flex items-center justify-between">
              <span className="text-[11px]">
                {submittedAlert ? (
                  <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                    <Icon name="chk" className="w-3.5 h-3.5 text-emerald-400 flex-none" />
                    {submittedAlert}
                  </span>
                ) : (
                  <span>Click submit above to test the live connection</span>
                )}
              </span>
              <span className="text-[10px] text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline">
                Instant Processing
              </span>
            </div>
          </div>

          {/* Right: infraly Workspace CRM Inbox */}
          <div className="rounded-xl border border-zinc-800/80 bg-[#0E1411] shadow-[0_16px_45px_rgba(0,0,0,0.6)] p-4 sm:p-5 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-emerald-500/15 border border-emerald-500/30 grid place-items-center text-emerald-300 text-[10px] font-bold">
                    A
                  </span>
                  <div>
                    <span className="text-xs font-medium text-zinc-100 block leading-tight">
                      Acme Sales Inbox
                    </span>
                    <span className="text-[10px] text-zinc-400">Step 2: Captured in your CRM</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10.5px] text-emerald-400 font-medium flex items-center gap-1.5 justify-end bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Active
                  </span>
                </div>
              </div>

              {/* Feed Stats Bar */}
              <div className="flex items-center justify-between mb-2.5 text-xs text-zinc-300 bg-[#080C0A] p-2.5 rounded-md border border-zinc-800/70">
                <span className="text-zinc-400 text-[11px]">Today&apos;s Lead Stream</span>
                <span className="space-x-2 text-[11px]">
                  <span>
                    <b className="text-emerald-400 font-semibold tabular-nums">{kept}</b> verified
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span>
                    <b className="text-zinc-400 font-semibold tabular-nums">{blocked}</b> spam blocked
                  </span>
                </span>
              </div>

              {/* Lead Feed Items */}
              <ul className="space-y-2 min-h-[180px]">
                {feedItems.map((item) => (
                  <li
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-md border bg-[#080C0A] text-xs transition-all",
                      item.status === "verified"
                        ? "border-emerald-500/20 hover:border-emerald-500/40"
                        : "border-red-500/20 hover:border-red-500/40",
                      item.isNew && "bg-white/[0.04] ring-1 ring-emerald-500/30 animate-pulse"
                    )}
                  >
                    <Avatar size={24} index={item.avatarIndex} alt={item.email} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-zinc-100 text-[11.5px] truncate">
                          {item.name}
                        </span>
                        <span className="text-[9.5px] text-zinc-500 font-medium">{item.time}</span>
                      </div>
                      <span className="truncate text-zinc-400 text-[10.5px] block">
                        {item.email} • {item.company}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "text-[9.5px] py-0.5 px-2 rounded border whitespace-nowrap font-medium",
                          item.status === "verified"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-300 border-red-500/20"
                        )}
                      >
                        {item.reason}
                      </span>
                      {item.status === "quarantined" && (
                        <button
                          type="button"
                          onClick={() => handleRescueItem(item.id)}
                          className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-300 border border-zinc-700 transition-colors cursor-pointer font-medium"
                          title="Restore lead to verified list"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Simulation Buttons */}
            <div className="mt-3.5 pt-3 border-t border-zinc-800/60 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleTypeChange("clean");
                  const nextLead = SAMPLE_CUSTOMERS[customerIdx % SAMPLE_CUSTOMERS.length];
                  setCustomerIdx((prev) => prev + 1);
                  const newItem: LeadItem = {
                    id: `${Date.now()}-${Math.random()}`,
                    name: nextLead.name,
                    email: nextLead.email,
                    company: nextLead.company,
                    status: "verified",
                    reason: "Verified inquiry (Delivered)",
                    avatarIndex: nextLead.avatarIndex,
                    time: "Just now",
                    isNew: true,
                  };
                  setFeedItems((prev) => [newItem, ...prev.slice(0, 3)]);
                  onIncrementKept();
                }}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-emerald-500 hover:bg-emerald-400 text-[#070B09] text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                <Icon name="chk" className="w-3.5 h-3.5" />
                <span>Simulate Good Lead</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleTypeChange("spam");
                  const nextBot = SAMPLE_BOTS[botIdx % SAMPLE_BOTS.length];
                  setBotIdx((prev) => prev + 1);
                  const newItem: LeadItem = {
                    id: `${Date.now()}-${Math.random()}`,
                    name: nextBot.name,
                    email: nextBot.email,
                    company: nextBot.company,
                    status: "quarantined",
                    reason: nextBot.reason,
                    avatarIndex: nextBot.avatarIndex,
                    time: "Just now",
                    isNew: true,
                  };
                  setFeedItems((prev) => [newItem, ...prev.slice(0, 3)]);
                  onIncrementBlocked();
                }}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-md border border-zinc-800 bg-[#0E1411] hover:bg-red-500/10 hover:border-red-500/30 text-zinc-300 hover:text-red-300 text-xs transition-all cursor-pointer font-medium"
              >
                <Icon name="shield" className="w-3.5 h-3.5 text-red-400" />
                <span>Simulate Spam Bot</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

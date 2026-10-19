"use client";

import React, { useState } from "react";
import { Icon } from "./icons";
import { Pill } from "./ui";
import { cn } from "@/shared/lib/utils";

interface FaqItem {
  q: string;
  a: string;
  defaultOpen?: boolean;
}

const FAQS: FaqItem[] = [
  {
    q: "Do I need to install any packages, CLI tools, or maintain a backend?",
    a: "No npm packages, CLI tools, or backend servers are required. Salenova is 100% zero-dependency. You simply sign up, create a workspace for your organisation, copy your API key, and send standard HTTP POST requests from plain HTML <form> tags, React, Next.js, Webflow, or cURL.",
    defaultOpen: true,
  },
  {
    q: "How does the organization workspace and API key work?",
    a: "Your organization receives a dedicated dashboard workspace. You get a scoped API key (e.g. sln_live_...) that you pass via request headers or query parameters. All inbound leads automatically route into your workspace CRM dashboard.",
  },
  {
    q: "How does spam protection work without annoying Captchas?",
    a: "We use invisible honeypot fields, IP reputation checks, rate-limiting algorithms, and disposable email detection. Real human visitors submit forms naturally without solving puzzle captchas.",
  },
  {
    q: "Can I invite team members and manage multiple forms?",
    a: "Yes. Within your organisation workspace, you can create multiple forms, track submissions in real time, invite teammates, and manage permissions from one central dashboard.",
  },
  {
    q: "Can I forward submissions to email, Slack, or my external CRM?",
    a: "Yes. Every submission triggers a formatted email notification. You can also configure signed webhooks that automatically retry with exponential backoff to sync leads with Slack, Zapier, or your external CRM.",
  },
];

export function Faq() {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggle = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="py-[56px] md:py-[76px] relative z-10" id="faq">
      <div className="max-w-[1100px] mx-auto px-[16px] sm:px-[24px]">
        {/* Head */}
        <div className="text-center max-w-[560px] mx-auto mb-[40px] sm:mb-[48px]">
          <Pill icon="plus">Frequently Asked Questions</Pill>
          <h2 className="text-[26px] sm:text-[34px] md:text-[40px] font-heading font-medium tracking-[-0.025em] leading-[1.2] mt-4 mb-3 text-white text-balance">
            Frequently asked questions <br className="hidden sm:inline" />
            <span className="text-zinc-400">and technical integration details.</span>
          </h2>
          <p className="text-zinc-400 font-p font-normal mt-3 text-[13.5px] sm:text-[14.5px] leading-[1.65] max-w-[520px] mx-auto text-pretty">
            Common questions about integrating Salenova with your frontend forms and lead pipelines.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-[700px] mx-auto space-y-2.5">
          {FAQS.map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className={cn(
                  "rounded-[16px] border transition-all duration-300 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] relative",
                  isOpen
                    ? "border-emerald-500/40 bg-[#222222]"
                    : "border-white/[0.08] hover:border-white/[0.16] bg-[#1c1c1c] hover:bg-[#232323]"
                )}
              >
                {isOpen && (
                  <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />
                )}
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left cursor-pointer flex justify-between items-center gap-4 py-4 px-5 text-[14px] font-medium text-white transition-colors group"
                >
                  <span className={cn("transition-colors", isOpen ? "text-white" : "group-hover:text-white")}>
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      "w-6 h-6 rounded-md grid place-items-center border flex-none transition-all duration-200",
                      isOpen
                        ? "rotate-45 bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "rotate-0 bg-white/[0.04] border-white/[0.08] text-zinc-400 group-hover:text-white group-hover:border-emerald-500/20"
                    )}
                  >
                    <Icon name="plus" className="w-3 h-3" />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-zinc-300 text-[12.5px] leading-[1.65] border-t border-white/[0.06] animate-[fadeIn_0.2s_ease]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

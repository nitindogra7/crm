"use client";

import React, { useState } from "react";
import { Icon } from "./icons";
import { Pill, Card } from "./ui";
import { cn } from "@/shared/lib/utils";

interface FaqItem {
  q: string;
  a: string;
  defaultOpen?: boolean;
}

const FAQS: FaqItem[] = [
  {
    q: "Do I need to build, host, or maintain a backend server?",
    a: "No. Salenova completely replaces your form backend. You simply point your HTML <form action=\"...\"> or Javascript fetch call directly to your secure Salenova endpoint.",
    defaultOpen: true,
  },
  {
    q: "How does spam protection work without annoying Captchas?",
    a: "We use invisible honeypot fields, IP reputation checks, rate-limiting algorithms, and disposable email detection. Real human visitors submit forms naturally without solving puzzle captchas.",
  },
  {
    q: "Can I forward submissions to email, Slack, or my CRM?",
    a: "Yes. Every submission triggers a formatted email alert. You can also configure signed webhooks that automatically retry with exponential backoff to sync leads with Slack, Zapier, or your CRM.",
  },
  {
    q: "What happens if my site exceeds the monthly free tier?",
    a: "We never silently drop your inquiries. We notify you at 80% and 100% usage so you have plenty of time to upgrade or export your data.",
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
    <section className="pt-0 pb-[80px] md:pb-[96px]" id="faq">
      <div className="max-w-[1040px] mx-auto px-[16px] sm:px-[24px]">
        {/* Head */}
        <div className="text-center mb-[52px]">
          <Pill icon="plus">FAQ</Pill>
          <h2 className="text-[clamp(26px,3.4vw,38px)] font-extralight tracking-[-0.04em] leading-[1.1] mt-[20px] text-white">
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-[640px] mx-auto grid gap-[10px]">
          {FAQS.map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <Card key={idx} className="px-[18px]">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left cursor-pointer flex justify-between items-center gap-[12px] py-[19px] text-[13px] font-normal text-white"
                >
                  <span>{item.q}</span>
                  <span
                    className={cn(
                      "text-[#8c8c8c] transition-transform duration-350 ease-out flex-none",
                      isOpen ? "rotate-45" : "rotate-0"
                    )}
                  >
                    <Icon name="plus" className="w-[14px] h-[14px]" />
                  </span>
                </button>
                {isOpen && (
                  <p className="text-[#8c8c8c] text-[12px] pb-[16px] max-w-[520px] leading-[1.7] animate-[fadeIn_0.3s_ease]">
                    {item.a}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

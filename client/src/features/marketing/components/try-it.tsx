"use client";

import React, { useState } from "react";
import { Icon } from "./icons";
import { Pill, Card, Avatar, Button } from "./ui";
import { cn } from "@/shared/lib/utils";

const SNIPPETS = {
  html: `<form action="https://api.salenova.com/f/abc123" method="POST">
  <input name="email" type="email" required>
  <input name="website" tabindex="-1" hidden> <!-- honeypot -->
  <button>Send</button>
</form>`,
  js: `await fetch("https://api.salenova.com/f/abc123", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "john@acme.com" })
});`,
  curl: `curl -X POST https://api.salenova.com/f/abc123 \\
  -H "Content-Type: application/json" \\
  -d '{"email":"john@acme.com"}'`,
};

type TabType = "html" | "js" | "curl";

interface LeadItem {
  id: string;
  email: string;
  status: "ok" | "no";
  reason: string;
  avatarIndex: number;
}

const LEADS_DATA: Array<{ email: string; status: "ok" | "no"; reason: string; avatarIndex: number }> = [
  { email: "maya@studio.co", status: "ok", reason: "Accepted", avatarIndex: 0 },
  { email: "bot.crawler@test.com", status: "no", reason: "Rate limit", avatarIndex: 1 },
  { email: "dev@startup.io", status: "ok", reason: "Accepted", avatarIndex: 2 },
  { email: "fake@disposable.com", status: "no", reason: "Disposable", avatarIndex: 3 },
  { email: "lena@agency.com", status: "ok", reason: "Accepted", avatarIndex: 4 },
  { email: "x7@spam.net", status: "no", reason: "Honeypot", avatarIndex: 5 },
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
  const [activeTab, setActiveTab] = useState<TabType>("html");
  const [copied, setCopied] = useState(false);
  const [leadsIndex, setLeadsIndex] = useState(2);
  const [feedItems, setFeedItems] = useState<LeadItem[]>([
    { id: "1", email: "bot.crawler@test.com", status: "no", reason: "Rate limit", avatarIndex: 1 },
    { id: "0", email: "maya@studio.co", status: "ok", reason: "Accepted", avatarIndex: 0 },
  ]);

  const handleCopySnippet = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(SNIPPETS[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleSendTestLead = () => {
    const nextLead = LEADS_DATA[leadsIndex % LEADS_DATA.length];
    setLeadsIndex((prev) => prev + 1);

    const newItem: LeadItem = {
      id: `${Date.now()}-${Math.random()}`,
      email: nextLead.email,
      status: nextLead.status,
      reason: nextLead.reason,
      avatarIndex: nextLead.avatarIndex,
    };

    setFeedItems((prev) => [newItem, ...prev.slice(0, 3)]);

    if (nextLead.status === "ok") {
      onIncrementKept();
    } else {
      onIncrementBlocked();
    }
  };

  return (
    <section className="pt-0 pb-[80px] md:pb-[96px]" id="try">
      <div className="max-w-[1040px] mx-auto px-[16px] sm:px-[24px]">
        {/* Head */}
        <div className="text-center mb-[52px]">
          <Pill icon="code">Live interactive test</Pill>
          <h2 className="text-[clamp(26px,3.4vw,38px)] font-extralight tracking-[-0.04em] leading-[1.1] mt-[20px] text-white">
            Post a form. Watch it land.
          </h2>
          <p className="text-[#8c8c8c] mt-[14px] text-[12.5px] max-w-[440px] mx-auto leading-[1.7]">
            Copy an integration snippet or send a test submission below to see how Salenova validates, inspects, and delivers data.
          </p>
        </div>

        {/* Try Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[10px]">
          {/* Left: Code Terminal */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-[4px] py-[10px] px-[12px] border-b border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveTab("html")}
                className={cn(
                  "font-sans text-[11px] rounded-full py-[4px] px-[12px] cursor-pointer transition-colors duration-300",
                  activeTab === "html" ? "bg-[#222] text-white" : "text-[#8c8c8c] hover:text-white"
                )}
              >
                HTML
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("js")}
                className={cn(
                  "font-sans text-[11px] rounded-full py-[4px] px-[12px] cursor-pointer transition-colors duration-300",
                  activeTab === "js" ? "bg-[#222] text-white" : "text-[#8c8c8c] hover:text-white"
                )}
              >
                fetch
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("curl")}
                className={cn(
                  "font-sans text-[11px] rounded-full py-[4px] px-[12px] cursor-pointer transition-colors duration-300",
                  activeTab === "curl" ? "bg-[#222] text-white" : "text-[#8c8c8c] hover:text-white"
                )}
              >
                curl
              </button>

              <button
                type="button"
                onClick={handleCopySnippet}
                aria-label="Copy snippet"
                className="ml-auto flex items-center gap-[6px] text-[11px] text-[#8c8c8c] hover:text-white transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Icon name="chk" className="w-[12px] h-[12px] text-white" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Icon name="copy" className="w-[14px] h-[14px]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="font-mono font-light text-[11px] leading-[1.9] p-[16px_18px] text-[#b9b9b9] overflow-x-auto min-h-[196px] whitespace-pre">
              {SNIPPETS[activeTab]}
            </pre>
          </Card>

          {/* Right: Live Feed Simulator */}
          <Card className="p-[16px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-[12px] text-[11px] text-[#8c8c8c]">
                <span>Inbox</span>
                <span>
                  <b className="text-white font-normal mr-1 tabular-nums">{kept}</b> kept ·{" "}
                  <b className="text-white font-normal ml-1 mr-1 tabular-nums">{blocked}</b> blocked
                </span>
              </div>

              {/* Feed items */}
              <ul className="list-none grid gap-[6px] min-h-[170px] content-start">
                {feedItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-[9px] border border-white/[0.08] rounded-[10px] p-[8px_10px] text-[11px] bg-black/40 animate-[slideDown_0.6s_cubic-bezier(0.2,0.8,0.2,1)]"
                  >
                    <Avatar size={18} index={item.avatarIndex} alt={item.email} />
                    <span className="truncate text-[#f2f2f2]">{item.email}</span>
                    <em
                      className={cn(
                        "ml-auto not-italic text-[10px] py-[1px] px-[9px] rounded-full border border-white/[0.17] whitespace-nowrap",
                        item.status === "ok"
                          ? "bg-white text-black border-white"
                          : "text-[#8c8c8c]"
                      )}
                    >
                      {item.reason}
                    </em>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              id="send"
              variant="solid"
              onClick={handleSendTestLead}
              className="mt-[12px] w-full"
            >
              Send a test lead
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}

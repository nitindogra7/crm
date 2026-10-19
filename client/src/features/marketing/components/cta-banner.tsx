"use client";

import React, { useState } from "react";
import { Icon } from "./icons";
import { Pill, Button } from "./ui";

export function CtaBanner() {
  const [copied, setCopied] = useState(false);
  const endpointSnippet = `curl -X POST https://api.salenova.com/v1/leads \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: sln_live_YOUR_WORKSPACE_KEY" \\
  -d '{"name":"Alex","email":"alex@startup.io"}'`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(endpointSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <section className="py-[56px] md:py-[80px] relative z-10">
      <div className="max-w-[1100px] mx-auto px-[16px] sm:px-[24px]">
        {/* Pure Matte Gray Architectural Card */}
        <div className="relative rounded-[20px] border border-white/[0.09] bg-[#1c1c1c] p-[44px_20px] md:p-[64px_32px] text-center shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Subtle Top Specular Edge Line */}
          <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-white/[0.14] to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-[620px] mx-auto flex flex-col items-center">
            {/* Pill */}
            <Pill icon="bolt">Instant Setup · Zero Backend Required</Pill>

            {/* Heading */}
            <h2 className="text-[26px] sm:text-[34px] md:text-[40px] font-heading font-medium tracking-[-0.025em] leading-[1.2] mt-4 mb-3 text-white text-balance">
              Start capturing verified leads <br className="hidden sm:inline" />
              <span className="text-zinc-400">in less than five minutes.</span>
            </h2>

            {/* Subtext */}
            <p className="text-zinc-400 font-p font-normal text-[13.5px] sm:text-[15px] leading-[1.65] max-w-[500px] mb-7 text-pretty">
              Create your organization workspace in seconds, grab your API key, and point any form directly to Salenova.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-[340px] sm:max-w-none">
              <Button
                href="/sign-up"
                variant="solid"
                size="default"
                className="w-full sm:w-auto py-2.5 px-6 text-[12.5px] group shadow-[0_0_20px_rgba(52,211,153,0.25)] hover:shadow-[0_0_25px_rgba(52,211,153,0.4)]"
              >
                Get started free
                <Icon name="arrow" className="w-[13px] h-[13px] transition-transform group-hover:translate-x-1" />
              </Button>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-[8px] rounded-full border border-white/[0.08] bg-[#141414] hover:bg-[#242424] hover:border-emerald-500/30 text-[12px] text-zinc-300 hover:text-white font-sans transition-all cursor-pointer select-none"
              >
                <Icon name={copied ? "chk" : "copy"} className="w-3.5 h-3.5 text-emerald-400" />
                <span>{copied ? "Copied snippet!" : "Copy cURL endpoint"}</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="flex items-center justify-center gap-4 sm:gap-5 mt-7 text-[11px] text-zinc-400 font-mono flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-medium">✓</span> No credit card required
              </span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-medium">✓</span> 100 free submissions/mo
              </span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-medium">✓</span> Live CRM dashboard
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

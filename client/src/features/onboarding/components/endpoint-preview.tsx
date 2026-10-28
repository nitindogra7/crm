"use client";

import React from "react";
import {
  Check,
  Copy,
  Terminal,
  Shield,
  Send,
  RefreshCw,
} from "lucide-react";
import { CodeTab } from "../types";

interface EndpointPreviewProps {
  activeSlug: string;
  endpointUrl: string;
  activeCodeTab: CodeTab;
  copied: boolean;
  isSendingPing: boolean;
  pingResult: { status: number; latency: number } | null;
  onCopyEndpoint: () => void;
  onSelectCodeTab: (tab: CodeTab) => void;
  onSendPing: () => void;
}

export function EndpointPreview({
  activeSlug,
  endpointUrl,
  activeCodeTab,
  copied,
  isSendingPing,
  pingResult,
  onCopyEndpoint,
  onSelectCodeTab,
  onSendPing,
}: EndpointPreviewProps) {
  return (
    <div className="w-full lg:col-span-5 bg-[#181818] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
      {/* Header Window Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/60" />
          </div>
          <span className="text-[12px] font-mono text-zinc-400 pl-1 truncate max-w-[170px]">
            salenova.com/w/{activeSlug}
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Ready
        </span>
      </div>

      {/* Live Endpoint Box */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11.5px] text-zinc-400 font-mono">
          <span>Generated Inbound Endpoint:</span>
          <span className="text-zinc-300 font-medium px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10.5px]">
            POST
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 p-2.5 bg-[#141414] rounded-xl border border-white/[0.08]">
          <code className="text-[12px] font-mono text-zinc-200 truncate">
            {endpointUrl}
          </code>
          <button
            type="button"
            onClick={onCopyEndpoint}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors flex-shrink-0 border border-zinc-700 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Snippets Switcher */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-[11.5px] font-mono">
          <span className="text-zinc-400">Integration snippet:</span>
          <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
            {(["html", "curl", "react"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onSelectCodeTab(tab)}
                className={`px-2.5 py-0.5 rounded text-[10.5px] uppercase font-mono transition-colors cursor-pointer ${
                  activeCodeTab === tab
                    ? "bg-zinc-800 text-white font-medium shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5 bg-[#141414] rounded-xl border border-white/[0.08] font-mono text-[11.5px] overflow-x-auto text-zinc-300 leading-relaxed">
          {activeCodeTab === "html" && (
            <pre className="text-zinc-300">
              {`<form action="${endpointUrl}" method="POST">
  <input type="email" name="email" required />
  <button type="submit">Submit</button>
</form>`}
            </pre>
          )}
          {activeCodeTab === "curl" && (
            <pre className="text-zinc-300">
              {`curl -X POST ${endpointUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"email":"team@example.com"}'`}
            </pre>
          )}
          {activeCodeTab === "react" && (
            <pre className="text-zinc-300">
              {`fetch("${endpointUrl}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});`}
            </pre>
          )}
        </div>
      </div>

      {/* Simulated Inbound Event Test */}
      <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-zinc-400 uppercase tracking-wider text-[10px]">
            Inbound Event Preview
          </span>
          <button
            type="button"
            onClick={onSendPing}
            disabled={isSendingPing}
            className="px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10.5px] font-mono flex items-center gap-1 border border-zinc-700 transition-colors cursor-pointer disabled:opacity-60"
          >
            {isSendingPing ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Pinging...</span>
              </>
            ) : (
              <>
                <Send className="w-3 h-3" />
                <span>Send Test Ping</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3 bg-[#141414] rounded-xl border border-white/[0.08] flex items-center justify-between text-[11.5px] font-mono">
          <div className="space-y-0.5">
            <div className="text-zinc-200">contact_inbound</div>
            <div className="text-zinc-500 text-[11px]">
              email: &quot;founder@acme.com&quot;
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pingResult ? (
              <span className="text-[11px] text-zinc-400 font-mono">
                {pingResult.latency}ms
              </span>
            ) : (
              <span className="text-[11px] text-zinc-500 font-mono">12ms</span>
            )}
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Reassurance Footer */}
      <div className="pt-1 flex items-center justify-between text-[11.5px] text-zinc-500 font-sans">
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          Instant endpoint deployment
        </span>
        <span>Zero server maintenance</span>
      </div>
    </div>
  );
}

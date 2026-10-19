import React from "react";
import { Icon } from "./icons";
import { Orb } from "./ui";

export function Footer() {
  return (
    <footer className="relative mx-[12px] sm:mx-[24px] md:mx-auto mt-[40px] md:mt-[64px] max-w-[1100px] border border-white/[0.08] border-b-0 rounded-t-[24px] px-[20px] py-[36px] md:px-[44px] md:pt-[48px] md:pb-[32px] overflow-hidden bg-[#181818]/95 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      {/* Top Specular Edge Highlight */}
      <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent pointer-events-none" />

      {/* Brand & Subtext */}
      <div className="flex items-center gap-[9px] text-[15px] font-medium mb-[10px] text-white">
        <span className="w-[24px] h-[24px] rounded-full bg-white/[0.08] border border-white/[0.14] inline-grid place-items-center flex-none text-white shadow-sm">
          <Icon name="logo" className="w-[12px] h-[12px]" />
        </span>
        <span className="font-heading tracking-tight">Salenova</span>
      </div>

      <p className="text-zinc-400 font-p font-normal text-[13px] leading-[1.65] max-w-[460px]">
        Instant lead capture and CRM pipeline for modern websites. Connect any form with a single POST request. Zero server management required.
      </p>

      {/* Columns & Status */}
      <div className="flex gap-[36px] md:gap-[72px] mt-[40px] flex-wrap items-start">
        <div className="grid gap-[9px] content-start text-zinc-400 text-[12px]">
          <b className="text-white font-medium mb-[3px] text-[13px]">Product</b>
          <a href="#benefits" className="hover:text-white transition-colors">
            Why Salenova
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features & Shield
          </a>
          <a href="#try" className="hover:text-white transition-colors">
            Interactive Sandbox
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing Plans
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            Frequently Asked
          </a>
        </div>

        <div className="grid gap-[9px] content-start text-zinc-400 text-[12px]">
          <b className="text-white font-medium mb-[3px] text-[13px]">Developers</b>
          <a href="#try" className="hover:text-white transition-colors">
            API Documentation
          </a>
          <a href="#try" className="hover:text-white transition-colors">
            cURL Reference
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Webhooks & Events
          </a>
          <a href="#" className="hover:text-white transition-colors">
            llms.txt
          </a>
        </div>

        <div className="grid gap-[9px] content-start text-zinc-400 text-[12px]">
          <b className="text-white font-medium mb-[3px] text-[13px]">Company</b>
          <a href="#" className="hover:text-white transition-colors">
            GitHub
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Twitter / X
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>

        {/* Live System Status Widget */}
        <div className="md:ml-auto">
          <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2 text-[10.5px] font-mono text-zinc-300 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>All Systems Operational</span>
            </div>
            <div className="text-[10.5px] text-zinc-500 font-mono">
              99.99% Edge Ingestion Uptime
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-[48px] text-zinc-500 text-[11px] font-mono flex items-center justify-between flex-wrap gap-2 border-t border-white/[0.05] pt-4">
        <div>© 2026 Salenova Inc. All rights reserved.</div>
        <div className="text-zinc-600">Designed for modern frontend teams</div>
      </div>

      {/* Corner metallic orb */}
      <div className="absolute right-[14px] -bottom-[22px] md:right-[30px] md:-bottom-[30px] opacity-40 md:opacity-60 pointer-events-none">
        <Orb size={100} className="w-[70px] h-[70px] md:w-[100px] md:h-[100px]" />
      </div>
    </footer>
  );
}

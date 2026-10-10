import React from "react";
import { Icon } from "./icons";
import { Orb } from "./ui";

export function Footer() {
  return (
    <footer className="relative mx-[10px] md:mx-auto mt-[20px] md:mt-[48px] max-w-[1040px] border border-white/[0.08] border-b-0 rounded-t-[22px] px-[18px] py-[32px] md:px-[44px] md:pt-[52px] md:pb-[28px] overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]">
      {/* Brand */}
      <div className="flex items-center gap-[8px] text-[13px] font-normal mb-[8px] text-white">
        <span className="w-[22px] h-[22px] rounded-full bg-[radial-gradient(circle_at_32%_26%,#555,#0a0a0a)] border border-[#3a3a3a] inline-grid place-items-center flex-none">
          <Icon name="logo" className="w-[11px] h-[11px] text-white" />
        </span>
        Salenova
      </div>

      <p className="text-[#8c8c8c] text-[13px] leading-[1.6]">
        The zero-backend form solution for landing pages and modern websites.
      </p>

      {/* Columns */}
      <div className="flex gap-[32px] md:gap-[72px] mt-[48px] flex-wrap">
        <div className="grid gap-[9px] content-start text-[#8c8c8c] text-[11.5px]">
          <b className="text-white font-normal mb-[6px]">Useful links</b>
          <a href="#benefits" className="hover:text-white transition-colors">
            Product
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </div>

        <div className="grid gap-[9px] content-start text-[#8c8c8c] text-[11.5px]">
          <b className="text-white font-normal mb-[6px]">Developers</b>
          <a href="#" className="hover:text-white transition-colors">
            Documentation
          </a>
          <a href="#" className="hover:text-white transition-colors">
            API reference
          </a>
          <a href="#" className="hover:text-white transition-colors">
            llms.txt
          </a>
        </div>

        <div className="grid gap-[9px] content-start text-[#8c8c8c] text-[11.5px]">
          <b className="text-white font-normal mb-[6px]">Follow us</b>
          <a href="#" className="hover:text-white transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-white transition-colors">
            GitHub
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-[60px] text-[#565656] text-[10.5px]">
        © 2026 Salenova. All rights reserved.
      </div>

      {/* Corner metallic orb */}
      <div className="absolute right-[14px] -bottom-[22px] md:right-[30px] md:-bottom-[30px] opacity-70 md:opacity-100">
        <Orb size={110} className="w-[76px] h-[76px] md:w-[110px] md:h-[110px]" />
      </div>
    </footer>
  );
}

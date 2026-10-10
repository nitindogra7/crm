"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icon } from "./icons";
import { Button } from "./ui";
import { cn } from "@/shared/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      id="nav"
      className={cn(
        "fixed top-[14px] left-1/2 -translate-x-1/2 z-50 flex items-center py-[5px] pr-[5px] pl-[14px] border border-white/[0.08] rounded-full bg-[rgba(12,12,12,0.65)] backdrop-blur-[18px]",
        "w-[calc(100%-24px)] md:w-auto md:max-w-[1040px] justify-between md:justify-start gap-[10px] md:gap-[26px]",
        isOpen ? "open" : ""
      )}
    >
      {/* Brand */}
      <a href="#" className="flex items-center gap-[8px] font-normal text-[12px] text-white">
        <span className="w-[22px] h-[22px] rounded-full bg-[radial-gradient(circle_at_32%_26%,#555,#0a0a0a)] border border-[#3a3a3a] inline-grid place-items-center flex-none">
          <Icon name="logo" className="w-[11px] h-[11px] text-white" />
        </span>
        <span>Salenova</span>
      </a>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-[22px] text-[11.5px] text-[#8c8c8c]">
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

      {/* Action buttons */}
      <div className="flex items-center gap-[8px]">
        <Button href="/signup" variant="solid" size="sm">
          Get started
        </Button>

        {/* Burger Button */}
        <button
          id="burger"
          type="button"
          aria-label="Menu"
          aria-expanded={isOpen}
          aria-controls="mp"
          onClick={() => setIsOpen((prev) => !prev)}
          className="grid md:hidden w-[32px] h-[32px] rounded-full border border-white/[0.17] bg-white/[0.04] text-white place-items-center cursor-pointer transition-colors hover:bg-white/[0.08]"
        >
          {isOpen ? (
            <Icon name="x" className="w-[15px] h-[15px]" />
          ) : (
            <Icon name="menu" className="w-[15px] h-[15px]" />
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div
        id="mp"
        className={cn(
          "md:hidden absolute left-0 right-0 top-[calc(100%+8px)] p-[10px] border border-white/[0.17] rounded-[20px] bg-[rgba(10,10,10,0.92)] backdrop-blur-[22px] transition-all duration-350 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-[0.98] pointer-events-none"
        )}
      >
        <a
          className="flex justify-between items-center py-[13px] px-[12px] text-[14px] border-b border-white/[0.08] text-[#ddd] hover:text-white"
          href="#benefits"
          onClick={() => setIsOpen(false)}
        >
          Product <Icon name="arrow" className="w-[14px] h-[14px]" />
        </a>
        <a
          className="flex justify-between items-center py-[13px] px-[12px] text-[14px] border-b border-white/[0.08] text-[#ddd] hover:text-white"
          href="#features"
          onClick={() => setIsOpen(false)}
        >
          Features <Icon name="arrow" className="w-[14px] h-[14px]" />
        </a>
        <a
          className="flex justify-between items-center py-[13px] px-[12px] text-[14px] border-b border-white/[0.08] text-[#ddd] hover:text-white"
          href="#pricing"
          onClick={() => setIsOpen(false)}
        >
          Pricing <Icon name="arrow" className="w-[14px] h-[14px]" />
        </a>
        <a
          className="flex justify-between items-center py-[13px] px-[12px] text-[14px] text-[#ddd] hover:text-white"
          href="#faq"
          onClick={() => setIsOpen(false)}
        >
          FAQ <Icon name="arrow" className="w-[14px] h-[14px]" />
        </a>
        <div className="pt-[10px]">
          <Button
            href="/signup"
            variant="solid"
            className="w-full py-[12px]"
            onClick={() => setIsOpen(false)}
          >
            Get started free
          </Button>
        </div>
      </div>
    </nav>
  );
}

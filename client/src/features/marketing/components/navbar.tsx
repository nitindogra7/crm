"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";
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
        "fixed top-[14px] md:top-[18px] left-1/2 -translate-x-1/2 z-50 flex items-center justify-between py-[7px] px-[12px] md:py-[8px] md:px-[20px] border border-white/[0.08] rounded-full bg-[#181818]/90 backdrop-blur-[20px] shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all",
        "w-[calc(100%-24px)] sm:w-[calc(100%-48px)] max-w-[1100px]",
        isOpen ? "open" : ""
      )}
    >
      {/* Brand (Left) */}
      <a href="#" className="flex items-center gap-[9px] text-[13.5px] text-white group flex-none">
        <span className="w-[24px] h-[24px] rounded-full bg-white/[0.08] border border-white/[0.14] inline-grid place-items-center flex-none text-white shadow-sm group-hover:scale-105 transition-transform">
          <Icon name="logo" className="w-[12px] h-[12px] text-white" />
        </span>
        <span className="font-heading font-medium tracking-tight text-[14px]">Salenova</span>
      </a>

      {/* Desktop Links (Center) */}
      <div className="hidden md:flex items-center gap-[28px] text-[13px] text-zinc-400 font-sans">
        <a href="#benefits" className="hover:text-white transition-colors">
          Product
        </a>
        <a href="#features" className="hover:text-white transition-colors">
          Features
        </a>
        <a href="#try" className="hover:text-white transition-colors">
          Sandbox
        </a>
        <a href="#pricing" className="hover:text-white transition-colors">
          Pricing
        </a>
        <a href="#faq" className="hover:text-white transition-colors">
          FAQ
        </a>
      </div>

      {/* Action buttons (Right) */}
      <div className="flex items-center gap-[10px]">
        <Show when="signed-out">
          <Link
            href="/sign-in"
            className="hidden sm:inline-block text-[12px] text-neutral-400 hover:text-white transition-colors px-1.5 font-sans"
          >
            Sign in
          </Link>
          <Button href="/sign-up" variant="solid" size="sm" className="shadow-sm">
            Get started
          </Button>
        </Show>
        <Show when="signed-in">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8 rounded-full border border-white/20 shadow-sm",
              },
            }}
          />
        </Show>

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
          "md:hidden absolute left-0 right-0 top-[calc(100%+8px)] p-[10px] border border-white/[0.17] rounded-[20px] bg-[#1c1c1c]/95 backdrop-blur-[22px] transition-all duration-350 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
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
        <Show when="signed-out">
          <div className="pt-[10px] flex flex-col gap-2">
            <Button
              href="/sign-up"
              variant="solid"
              className="w-full py-[12px]"
              onClick={() => setIsOpen(false)}
            >
              Get started free
            </Button>
            <Link
              href="/sign-in"
              className="text-center py-[10px] text-[13px] text-neutral-400 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sign in
            </Link>
          </div>
        </Show>
        <Show when="signed-in">
          <div className="pt-[14px] pb-[6px] px-[12px] flex items-center justify-between border-t border-white/[0.08] mt-[10px]">
            <span className="text-[13px] font-medium text-zinc-300">Account</span>
            <UserButton />
          </div>
        </Show>
      </div>
    </nav>
  );
}

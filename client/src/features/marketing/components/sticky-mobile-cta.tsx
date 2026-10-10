"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui";
import { cn } from "@/shared/lib/utils";

export function StickyMobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 480);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="sticky"
      className={cn(
        "flex md:hidden fixed left-[14px] right-[14px] bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-40 py-[6px] pr-[6px] pl-[16px] items-center justify-between border border-white/[0.17] rounded-full bg-[rgba(12,12,12,0.85)] backdrop-blur-[20px] text-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        show ? "translate-y-0" : "translate-y-[140%]"
      )}
    >
      <span className="text-[#8c8c8c] text-[12px] truncate mr-2 font-normal">
        Skip backend setup
      </span>
      <Button href="/signup" variant="solid" size="sm" className="flex-none">
        Get started
      </Button>
    </div>
  );
}

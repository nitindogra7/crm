"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
        "flex md:hidden fixed left-3 right-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-40 py-2 px-3 items-center justify-between border border-emerald-900/60 rounded-lg bg-[#0B0F0D]/95 backdrop-blur-md text-xs shadow-[0_8px_32px_rgba(0,0,0,0.8)] transition-transform duration-300",
        show ? "translate-y-0" : "translate-y-[140%]"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-zinc-300 text-xs font-medium">
          Capture Every Lead
        </span>
      </div>
      <Link
        href="/dashboard"
        className="px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-[#070B09] text-xs font-semibold tracking-tight transition-colors shadow-sm"
      >
        Start free trial
      </Link>
    </div>
  );
}

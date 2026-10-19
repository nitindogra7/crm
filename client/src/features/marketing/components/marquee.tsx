import React from "react";
import { Icon, IconName } from "./icons";

interface MarqueeItem {
  name: string;
  icon: IconName;
}

const ITEMS: MarqueeItem[] = [
  { name: "Next.js", icon: "db" },
  { name: "Webflow", icon: "hook" },
  { name: "Astro", icon: "astro" },
  { name: "HTML5 Forms", icon: "code" },
  { name: "Tailwind CSS", icon: "tailwind" },
  { name: "Vercel", icon: "vercel" },
  { name: "React", icon: "cpu" },
  { name: "GitHub Pages", icon: "github" },
  { name: "Framer Sites", icon: "layers" },
  { name: "Remix", icon: "bolt" },
  { name: "Nuxt.js", icon: "cpu" },
  { name: "WordPress", icon: "db" },
  { name: "Vite Apps", icon: "bolt" },
  { name: "Custom Landing Pages", icon: "cur" },
  { name: "Linear Inbound", icon: "linear" },
];

export function Marquee() {
  return (
    <div className="relative py-[20px] my-[10px]">
      {/* Subtle Micro-Header */}
      <div className="text-center mb-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-medium">
          Connects natively to your entire frontend stack
        </span>
      </div>

      <div
        className="group overflow-hidden py-[14px] border-y border-white/[0.06] relative select-none flex bg-white/[0.01]"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 15%, #000 85%, transparent)",
        }}
      >
        {/* Track 1 */}
        <div className="flex shrink-0 items-center gap-[14px] sm:gap-[18px] pr-[14px] sm:pr-[18px] animate-[marquee_36s_linear_infinite] group-hover:[animation-play-state:paused]">
          {ITEMS.map((item, index) => (
            <span
              key={`track1-${index}`}
              className="inline-flex items-center gap-[8px] px-3.5 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200 text-[12px] font-sans whitespace-nowrap cursor-default group/item"
            >
              <Icon name={item.icon} className="w-[13px] h-[13px] text-zinc-500 group-hover/item:text-zinc-200 transition-colors flex-none" />
              <span>{item.name}</span>
            </span>
          ))}
        </div>

        {/* Track 2 */}
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center gap-[14px] sm:gap-[18px] pr-[14px] sm:pr-[18px] animate-[marquee_36s_linear_infinite] group-hover:[animation-play-state:paused]"
        >
          {ITEMS.map((item, index) => (
            <span
              key={`track2-${index}`}
              className="inline-flex items-center gap-[8px] px-3.5 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all duration-200 text-[12px] font-sans whitespace-nowrap cursor-default group/item"
            >
              <Icon name={item.icon} className="w-[13px] h-[13px] text-zinc-500 group-hover/item:text-zinc-200 transition-colors flex-none" />
              <span>{item.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

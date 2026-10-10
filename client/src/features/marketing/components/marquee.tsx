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
  { name: "HTML5 Static Sites", icon: "code" },
  { name: "Tailwind CSS", icon: "tailwind" },
  { name: "Vercel", icon: "vercel" },
  { name: "Supabase", icon: "supabase" },
  { name: "GitHub Pages", icon: "github" },
  { name: "Framer Sites", icon: "layers" },
  { name: "Remix", icon: "bolt" },
  { name: "Nuxt.js", icon: "cpu" },
  { name: "WordPress", icon: "db" },
  { name: "Vite Apps", icon: "bolt" },
  { name: "Landing Pages", icon: "cur" },
  { name: "Linear", icon: "linear" },
];

export function Marquee() {
  return (
    <div
      className="group overflow-hidden py-[34px] border-y border-white/[0.08] relative select-none flex"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      {/* Track 1 */}
      <div className="flex shrink-0 items-center gap-[44px] md:gap-[56px] pr-[44px] md:pr-[56px] animate-[marquee_32s_linear_infinite] group-hover:[animation-play-state:paused] text-[#6a6a6a] text-[13px] font-medium tracking-[-0.02em]">
        {ITEMS.map((item, index) => (
          <span
            key={`track1-${index}`}
            className="flex items-center gap-[8px] transition-colors duration-300 hover:text-white cursor-default select-none whitespace-nowrap"
          >
            <Icon name={item.icon} className="w-[14px] h-[14px] flex-none" />
            {item.name}
          </span>
        ))}
      </div>

      {/* Track 2 (Duplicate for continuous infinite loop without blank pause) */}
      <div
        aria-hidden="true"
        className="flex shrink-0 items-center gap-[44px] md:gap-[56px] pr-[44px] md:pr-[56px] animate-[marquee_32s_linear_infinite] group-hover:[animation-play-state:paused] text-[#6a6a6a] text-[13px] font-medium tracking-[-0.02em]"
      >
        {ITEMS.map((item, index) => (
          <span
            key={`track2-${index}`}
            className="flex items-center gap-[8px] transition-colors duration-300 hover:text-white cursor-default select-none whitespace-nowrap"
          >
            <Icon name={item.icon} className="w-[14px] h-[14px] flex-none" />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

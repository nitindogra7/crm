import React from "react";
import { Icon, IconName } from "./icons";

interface MarqueeItem {
  name: string;
  icon: IconName;
}

const ITEMS: MarqueeItem[] = [
  { name: "WordPress", icon: "db" },
  { name: "Webflow", icon: "hook" },
  { name: "Shopify Stores", icon: "brief" },
  { name: "Squarespace", icon: "layers" },
  { name: "Wix Websites", icon: "cpu" },
  { name: "Framer", icon: "layers" },
  { name: "Custom Websites", icon: "code" },
  { name: "Landing Pages", icon: "bolt" },
  { name: "Contact Forms", icon: "chk" },
  { name: "React & Next.js", icon: "db" },
  { name: "Portfolio Sites", icon: "brief" },
  { name: "HTML Forms", icon: "code" },
  { name: "Email Alerts", icon: "bell" },
  { name: "CSV Export", icon: "layers" },
];

export function Marquee() {
  return (
    <div className="relative py-6 my-2">
      <div className="text-center mb-3">
        <span className="text-[11px] font-sans tracking-wide uppercase text-zinc-400 font-medium">
          Works seamlessly with every website builder and platform
        </span>
      </div>

      <div
        className="group overflow-hidden py-3 border-y border-emerald-950/60 bg-[#0A0F0D]/60 relative select-none flex"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        {/* Track 1 */}
        <div className="flex shrink-0 items-center gap-3 pr-3 animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused]">
          {ITEMS.map((item, index) => (
            <span
              key={`track1-${index}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-zinc-800/80 bg-[#0E1411] text-zinc-300 hover:text-white hover:border-emerald-500/30 transition-all text-xs font-sans whitespace-nowrap cursor-default group/item"
            >
              <Icon
                name={item.icon}
                className="w-3.5 h-3.5 text-zinc-400 group-hover/item:text-emerald-400 transition-colors flex-none"
              />
              <span>{item.name}</span>
            </span>
          ))}
        </div>

        {/* Track 2 */}
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center gap-3 pr-3 animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused]"
        >
          {ITEMS.map((item, index) => (
            <span
              key={`track2-${index}`}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-zinc-800/80 bg-[#0E1411] text-zinc-300 hover:text-white hover:border-emerald-500/30 transition-all text-xs font-sans whitespace-nowrap cursor-default group/item"
            >
              <Icon
                name={item.icon}
                className="w-3.5 h-3.5 text-zinc-400 group-hover/item:text-emerald-400 transition-colors flex-none"
              />
              <span>{item.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

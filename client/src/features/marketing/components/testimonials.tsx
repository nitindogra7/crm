"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Pill, Avatar } from "./ui";

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  company: string;
  avatarImg: string;
  quote: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Frontend Architect",
    company: "Freelance",
    avatarImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    quote:
      "I used to spend 2 to 3 hours on every client site setting up SendGrid, server route handlers, and environment secrets. With Salenova, I paste an endpoint and API key into the form and it works flawlessly.",
  },
  {
    id: 2,
    name: "Sarah Miller",
    role: "Co-founder",
    company: "Studio Labs",
    avatarImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    quote:
      "Other form services silently dropped submissions or charged crazy monthly fees. Salenova catches every real prospect with zero captchas while filtering out hundreds of scrapers every week.",
  },
  {
    id: 3,
    name: "Dev Patel",
    role: "Founder & Developer",
    company: "Devflow",
    avatarImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    quote:
      "Deployed my static landing page without maintaining a single server route or database table. Our first enterprise quote landed right in our inbox and CRM dashboard 10 minutes later.",
  },
];

export function Testimonials() {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="py-[56px] md:py-[76px] relative z-10" id="voices">
      <div className="max-w-[1100px] mx-auto px-[16px] sm:px-[24px] grid grid-cols-1 md:grid-cols-[1fr_1.25fr] gap-[36px] md:gap-[56px] items-start">
        {/* Left Column */}
        <div>
          <Pill icon="star">Verified Developer Feedback</Pill>
          <h2 className="text-[26px] sm:text-[34px] md:text-[40px] font-heading font-medium tracking-[-0.025em] leading-[1.2] mt-4 mb-3 text-white text-balance">
            Loved by modern builders <br className="hidden sm:inline" />
            <span className="text-zinc-400">across engineering teams and agencies.</span>
          </h2>
          <p className="text-zinc-400 font-p font-normal max-w-[420px] text-[13.5px] sm:text-[14.5px] leading-[1.65]">
            Real feedback from developers who stopped writing repetitive backend route handlers just to collect form submissions.
          </p>

          <div className="mt-[28px] md:mt-[36px] p-4 rounded-[16px] border border-white/[0.08] bg-[#1c1c1c] shadow-[0_8px_30px_rgba(0,0,0,0.5)] max-w-[320px] space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-emerald-400/30 transition-all" />
            {/* 5-Star Indicator */}
            <div className="flex items-center gap-1.5 text-amber-400/90 text-[12px]">
              <span>★★★★★</span>
              <span className="text-zinc-300 text-[12px] font-medium font-sans ml-1">4.9/5 Rating</span>
            </div>

            <div className="flex items-center gap-[14px] pt-2 border-t border-white/[0.06]">
              {/* Stacked Avatars */}
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="w-[30px] h-[30px] rounded-full overflow-hidden border-2 border-[#1c1c1c] flex-none relative"
                  >
                    <Avatar size={30} index={idx} alt="Builder" />
                  </div>
                ))}
              </div>

              <div>
                <div className="text-[22px] font-heading font-medium tracking-tight leading-none text-white tabular-nums">
                  500+
                </div>
                <span className="text-zinc-500 text-[10.5px] font-mono">active websites live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quotes Cards */}
        <div className="space-y-3">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="rounded-[16px] border border-white/[0.08] hover:border-emerald-500/30 bg-[#1c1c1c] hover:bg-[#232323] p-[20px] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group"
            >
              <div className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-white/0 group-hover:via-emerald-400/35 to-transparent transition-all" />
              <div className="flex items-center justify-between mb-[12px]">
                <div className="flex items-center gap-[10px]">
                  {imgErrors[item.id] ? (
                    <Avatar size={36} variant="square" />
                  ) : (
                    <div className="relative w-[36px] h-[36px] rounded-lg overflow-hidden border border-white/10 flex-none shadow-sm">
                      <Image
                        src={item.avatarImg}
                        alt={item.name}
                        width={36}
                        height={36}
                        unoptimized
                        onError={() => handleImgError(String(item.id))}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-[13.5px] text-white font-medium leading-tight flex items-center gap-1.5">
                      {item.name}
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" title="Verified Customer" />
                    </div>
                    <div className="text-zinc-500 text-[10.5px] font-mono mt-0.5">
                      {item.role} · <span className="text-zinc-400">{item.company}</span>
                    </div>
                  </div>
                </div>

                {/* Micro 5-Star */}
                <div className="text-amber-400/80 text-[10.5px] tracking-widest hidden sm:block">
                  ★★★★★
                </div>
              </div>

              <p className="text-zinc-300 font-p font-normal text-[12.5px] leading-[1.65] border-t border-white/[0.04] pt-[12px]">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Pill, Card, Avatar } from "./ui";

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  avatarImg: string;
  quote: string;
  isFaded?: boolean;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Freelance web designer",
    avatarImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    quote:
      "I used to spend 2 to 3 hours on every client site setting up SendGrid, server routes, and environment variables. With Salenova, I paste an endpoint into the HTML and move on.",
  },
  {
    id: 2,
    name: "Sarah Miller",
    role: "Startup founder",
    avatarImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    quote:
      "Other form services silently dropped submissions or charged crazy monthly fees. Salenova catches every real prospect while blocking hundreds of bot crawlers every week.",
  },
  {
    id: 3,
    name: "Dev Patel",
    role: "Indie hacker",
    avatarImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    quote:
      "Deployed my static landing page without building a single backend route or database. Our first enterprise inquiry landed right in my inbox 10 minutes later.",
  },
  {
    id: 4,
    name: "Maria Costa",
    role: "Agency owner",
    avatarImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    quote:
      "Managing contact forms across 15 client domains from one dashboard saves our team hours of server maintenance and troubleshooting every month.",
    isFaded: true,
  },
];

export function Testimonials() {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="pt-0 pb-[80px] md:pb-[96px]" id="voices">
      <div className="max-w-[1040px] mx-auto px-[16px] sm:px-[24px] grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-[36px] md:gap-[64px] items-start">
        {/* Left Column */}
        <div>
          <Pill icon="star">Customer stories</Pill>
          <h2 className="text-[clamp(26px,3.2vw,36px)] font-extralight tracking-[-0.04em] leading-[1.1] my-[22px] mb-[16px] text-white">
            Built for founders,<br />
            <span className="text-[#6e6e6e]">devs, and agencies</span>
          </h2>
          <p className="text-[#8c8c8c] max-w-[320px] text-[12.5px] leading-[1.7]">
            Real feedback from developers who stopped writing custom form backends.
          </p>

          <div className="flex items-center gap-[14px] mt-[28px] md:mt-[48px]">
            {/* Stacked Avatars */}
            <div className="flex">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-[34px] h-[34px] rounded-full overflow-hidden border-2 border-black flex-none relative ${
                    idx > 0 ? "-ml-[10px]" : ""
                  }`}
                >
                  <Avatar size={34} index={idx} alt="Beta builder" />
                </div>
              ))}
            </div>

            <div>
              <b className="block text-[30px] font-thin tracking-[-0.05em] leading-none text-white tabular-nums">
                500+
              </b>
              <span className="text-[#8c8c8c] text-[11.5px]">active websites</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quotes Cards */}
        <div>
          {TESTIMONIALS.map((item) => (
            <Card
              key={item.id}
              className={`group p-[24px] mb-[12px] transition-colors duration-400 hover:border-white/[0.17] ${
                item.isFaded
                  ? "opacity-40 max-h-[120px] overflow-hidden mb-0 [mask-image:linear-gradient(#000,transparent)] [-webkit-mask-image:linear-gradient(#000,transparent)]"
                  : ""
              }`}
            >
              <div className="flex items-center gap-[13px] mb-[18px]">
                {imgErrors[item.id] ? (
                  <Avatar size={42} variant="square" />
                ) : (
                  <div className="relative w-[42px] h-[42px] rounded-[12px] overflow-hidden border border-white/[0.17] flex-none">
                    <Image
                      src={item.avatarImg}
                      alt={item.name}
                      width={42}
                      height={42}
                      unoptimized
                      onError={() => handleImgError(String(item.id))}
                      className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 transition-[filter] duration-500"
                    />
                  </div>
                )}
                <div>
                  <div className="text-[13px] text-white leading-[1.3] font-normal">
                    {item.name}
                  </div>
                  <small className="block text-[#565656] text-[11px] leading-[1.4]">
                    {item.role}
                  </small>
                </div>
              </div>
              <p className="text-[#bcbcbc] text-[12.5px] leading-[1.75] border-t border-white/[0.08] pt-[18px] m-0">
                {item.quote}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

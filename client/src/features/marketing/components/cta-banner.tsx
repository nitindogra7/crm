"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icon, IconName } from "./icons";
import { Pill, Button, Orb } from "./ui";

interface FloatingCircle {
  id: string;
  icon: IconName;
  label: string;
}

const CIRCLES: FloatingCircle[] = [
  { id: "bolt", icon: "bolt", label: "Instant delivery" },
  { id: "mail", icon: "mail", label: "Email alerts" },
  { id: "lock", icon: "lock", label: "Spam shield" },
  { id: "hook", icon: "hook", label: "Webhooks" },
];

export function CtaBanner() {
  const [copied, setCopied] = useState(false);
  const commandText = "npx salenova init --form contact";
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(commandText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Free-roaming organic physics/parametric animation for the four circles
  useEffect(() => {
    let animId: number = 0;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const t = timestamp - startTime;

      // Circle 0: Bolt (upper left roaming through center and top)
      if (circleRefs.current[0]) {
        const x = 20 + 26 * Math.sin(t * 0.0006);
        const y = 36 + 28 * Math.cos(t * 0.00045);
        circleRefs.current[0].style.left = `${Math.max(5, Math.min(92, x))}%`;
        circleRefs.current[0].style.top = `${Math.max(8, Math.min(88, y))}%`;
      }

      // Circle 1: Mail (lower left roaming towards center-bottom and across)
      if (circleRefs.current[1]) {
        const x = 24 + 28 * Math.cos(t * 0.0005 + 1.2);
        const y = 68 + 24 * Math.sin(t * 0.00065 + 2.1);
        circleRefs.current[1].style.left = `${Math.max(5, Math.min(92, x))}%`;
        circleRefs.current[1].style.top = `${Math.max(8, Math.min(88, y))}%`;
      }

      // Circle 2: Lock (upper right roaming through center-top and right)
      if (circleRefs.current[2]) {
        const x = 76 + 26 * Math.sin(t * 0.00048 + 3.4);
        const y = 34 + 28 * Math.cos(t * 0.0006 + 1.5);
        circleRefs.current[2].style.left = `${Math.max(5, Math.min(92, x))}%`;
        circleRefs.current[2].style.top = `${Math.max(8, Math.min(88, y))}%`;
      }

      // Circle 3: Hook (lower right roaming towards center and lower bounds)
      if (circleRefs.current[3]) {
        const x = 78 + 26 * Math.cos(t * 0.00055 + 4.2);
        const y = 66 + 25 * Math.sin(t * 0.00042 + 0.8);
        circleRefs.current[3].style.left = `${Math.max(5, Math.min(92, x))}%`;
        circleRefs.current[3].style.top = `${Math.max(8, Math.min(88, y))}%`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className="pt-0 pb-[80px] md:pb-[96px]">
      <div className="max-w-[1040px] mx-auto px-[16px] sm:px-[24px]">
        <div
          className="relative p-[48px_18px_40px] md:p-[64px_24px_52px] text-center border border-white/[0.08] rounded-[22px] overflow-hidden min-h-[460px] md:min-h-[500px] flex flex-col justify-between"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.08), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent)",
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-60"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06), transparent 70%)",
            }}
          />

          {/* 4 Freely Moving Floating Circles with Glowing Trajectory (Z-10: Behind text) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {CIRCLES.map((circle, index) => (
              <div
                key={circle.id}
                ref={(el) => {
                  circleRefs.current[index] = el;
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform duration-200 hover:scale-125 cursor-pointer group"
                style={{
                  left: index === 0 ? "12%" : index === 1 ? "12%" : index === 2 ? "88%" : "88%",
                  top: index === 0 ? "40%" : index === 1 ? "68%" : index === 2 ? "38%" : "66%",
                }}
              >
                {/* Outer luminous glow halo */}
                <div className="absolute -inset-2 rounded-full bg-white/[0.08] blur-[8px] opacity-75 group-hover:opacity-100 transition-opacity" />

                {/* Circle badge */}
                <div className="relative w-[36px] h-[36px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.16),inset_0_1px_3px_rgba(255,255,255,0.35),0_0_0_4px_rgba(255,255,255,0.02)] text-white">
                  <Icon name={circle.icon} className="w-[14px] h-[14px] drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
                </div>
              </div>
            ))}
          </div>

          {/* Text Content & Actions (Z-20: Placed above moving circles with high-contrast text drop shadows) */}
          <div className="relative z-20 pointer-events-auto flex flex-col items-center">
            {/* Pill */}
            <div className="backdrop-blur-md bg-black/40 rounded-full inline-block">
              <Pill icon="bolt">Capture your first lead today</Pill>
            </div>

            {/* Heading with drop-shadow so text stays 100% readable when circles glide behind */}
            <h2 className="text-[clamp(28px,3.8vw,40px)] font-light tracking-[-0.04em] leading-[1.1] my-[22px] mb-[26px] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.98)] select-none">
              Ready to get started?
            </h2>

            {/* CTA Buttons */}
            <div className="flex gap-[10px] justify-center flex-wrap relative z-20">
              <Button href="/signup" variant="solid">
                Get started free <Icon name="arrow" className="w-[14px] h-[14px] transition-transform group-hover:translate-x-1" />
              </Button>
              <Button onClick={handleCopy}>
                {copied ? "Copied" : "Copy init command"}
              </Button>
            </div>
          </div>

          {/* Visual Showcase: Breathing Center Orb and Corner Crosshair Boxes */}
          <div className="relative h-[170px] md:h-[210px] mt-[26px] flex items-center justify-center z-15 pointer-events-none">
            {/* Box Left */}
            <div
              className="hidden md:block absolute w-[110px] h-[110px] border border-white/[0.08] top-1/2 -mt-[55px] left-[calc(12%+60px)] animate-[pulse_6s_ease-in-out_infinite]"
            >
              <span className="absolute -left-[3px] -top-[6px] text-[#666] text-[12px] leading-none select-none">
                +
              </span>
              <span className="absolute -right-[3px] -bottom-[6px] text-[#666] text-[12px] leading-none select-none">
                +
              </span>
            </div>

            {/* Box Right */}
            <div
              className="hidden md:block absolute w-[110px] h-[110px] border border-white/[0.08] top-1/2 -mt-[55px] right-[calc(12%+60px)] animate-[pulse_6s_ease-in-out_infinite]"
            >
              <span className="absolute -left-[3px] -top-[6px] text-[#666] text-[12px] leading-none select-none">
                +
              </span>
              <span className="absolute -right-[3px] -bottom-[6px] text-[#666] text-[12px] leading-none select-none">
                +
              </span>
            </div>

            {/* Breathing Center Orb */}
            <div className="relative pointer-events-auto">
              <div className="absolute -inset-[46px] rounded-full border border-white/[0.08] pointer-events-none animate-[breathe_4s_ease-in-out_infinite]" />
              <Orb size={96} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

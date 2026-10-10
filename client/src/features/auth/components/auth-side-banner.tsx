"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/features/marketing/components/icons";
import { Orb, Avatar } from "@/features/marketing/components/ui";

export function AuthSideBanner() {
  return (
    <div className="relative hidden lg:flex lg:w-[48%] xl:w-[50%] h-full rounded-[24px] border border-white/[0.1] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.08),transparent_70%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_24px_50px_-24px_#000] p-6 xl:p-8 flex-col justify-between overflow-hidden backdrop-blur-xl select-none">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000, transparent)",
        }}
      />

      {/* Ambient Top Light Beam */}
      <div
        className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[380px] h-[240px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255,255,255,0.15), transparent 70%)",
        }}
      />

      {/* Top Header: Brand & Back Link */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-[9px] text-white font-normal text-[13px] group"
        >
          <span className="w-[24px] h-[24px] rounded-full bg-[radial-gradient(circle_at_32%_26%,#555,#0a0a0a)] border border-[#3a3a3a] inline-grid place-items-center flex-none shadow-[0_0_12px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform">
            <Icon name="logo" className="w-[11px] h-[11px] text-white" />
          </span>
          <span className="font-medium tracking-tight text-[14px]">Salenova</span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-[#8c8c8c] hover:text-white text-[11px] transition-all backdrop-blur-md"
        >
          <span>←</span> Back to website
        </Link>
      </div>

      {/* Centerpiece Visual Showcase: 3D Orb & Floating Live Cards */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center">
        {/* Orbital System */}
        <div className="relative w-[220px] h-[220px] xl:w-[250px] xl:h-[250px] flex items-center justify-center">
          {/* Outer Dashed Orbit Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-white/[0.08] animate-[spin_120s_linear_infinite]">
            <div className="absolute top-1/2 -left-[13px] -mt-[13px] w-[26px] h-[26px] animate-[spin_120s_linear_infinite_reverse]">
              <div className="w-[26px] h-[26px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_4px_rgba(0,0,0,0.6)] text-white">
                <Icon name="hook" className="w-[12px] h-[12px]" />
              </div>
            </div>
          </div>

          {/* Middle Solid Orbit Ring */}
          <div className="absolute inset-[30px] rounded-full border border-white/[0.14] animate-[spin_80s_linear_infinite]">
            <div className="absolute left-1/2 -top-[13px] -ml-[13px] w-[26px] h-[26px] animate-[spin_80s_linear_infinite_reverse]">
              <div className="w-[26px] h-[26px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_4px_rgba(0,0,0,0.6)] text-white">
                <Icon name="bolt" className="w-[12px] h-[12px]" />
              </div>
            </div>
            <div className="absolute left-1/2 -bottom-[13px] -ml-[13px] w-[26px] h-[26px] animate-[spin_80s_linear_infinite_reverse]">
              <div className="w-[26px] h-[26px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_4px_rgba(0,0,0,0.6)] text-white">
                <Icon name="lock" className="w-[12px] h-[12px]" />
              </div>
            </div>
          </div>

          {/* Central 3D Glowing Orb */}
          <div className="relative z-20">
            <Orb size={74} />
          </div>
        </div>

        {/* Floating Intake Card (Top Left) */}
        <div
          className="absolute -left-2 top-2 p-[8px_12px] w-[170px] text-left border border-white/[0.12] rounded-[13px] bg-[linear-gradient(150deg,rgba(30,30,30,0.92),rgba(10,10,10,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_40px_-20px_#000] backdrop-blur-xl animate-[float_6s_ease-in-out_infinite]"
          style={{ transform: "rotate(-2deg)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#666] text-[9px]">Form endpoint</span>
            <span className="px-1.5 py-0.2 rounded-full text-[8.5px] font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              200 OK
            </span>
          </div>
          <div className="text-[11.5px] font-medium text-white mb-1.5">contact-form</div>
          <div className="flex items-center gap-1.5 text-[9.5px] text-[#8c8c8c] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="truncate">api.salenova.com/f/live</span>
          </div>
        </div>

        {/* Floating Shield Card (Bottom Right) */}
        <div
          className="absolute -right-2 bottom-4 p-[8px_12px] w-[170px] text-left border border-white/[0.12] rounded-[13px] bg-[linear-gradient(150deg,rgba(30,30,30,0.92),rgba(10,10,10,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_40px_-20px_#000] backdrop-blur-xl animate-[float_7s_-3s_ease-in-out_infinite]"
          style={{ transform: "rotate(2deg)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#666] text-[9px]">Spam Shield</span>
            <span className="text-[9px] text-blue-400 font-medium">Active</span>
          </div>
          <div className="text-[11.5px] font-medium text-white mb-1">Zero silent drops</div>
          <div className="flex items-center gap-1.5 text-[9px] text-[#8c8c8c]">
            <Icon name="shield" className="w-2.5 h-2.5 text-blue-400" />
            <span>Honeypot + Heuristics</span>
          </div>
        </div>
      </div>

      {/* Bottom Social Proof & Value Strip */}
      <div className="relative z-10 space-y-2.5">
        {/* Testimonial Quote */}
        <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.025] p-3 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-[11.5px] text-[#cfcfcf] leading-[1.55] font-light mb-2">
            &ldquo;Setup took one prompt in Cursor. The test lead hit my inbox before I had even switched tabs.&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <Avatar size={24} index={2} alt="Dev Patel" />
            <div>
              <div className="text-[11px] font-medium text-white leading-tight">Dev Patel</div>
              <div className="text-[9.5px] text-[#666]">Indie hacker & founder</div>
            </div>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-[8px] border border-white/[0.06] bg-white/[0.02] p-2 text-center">
            <b className="block text-[13.5px] font-light text-white tracking-tight">0</b>
            <span className="text-[9px] text-[#777]">Servers to run</span>
          </div>
          <div className="rounded-[8px] border border-white/[0.06] bg-white/[0.02] p-2 text-center">
            <b className="block text-[13.5px] font-light text-white tracking-tight">&lt;500ms</b>
            <span className="text-[9px] text-[#777]">To your inbox</span>
          </div>
          <div className="rounded-[8px] border border-white/[0.06] bg-white/[0.02] p-2 text-center">
            <b className="block text-[13.5px] font-light text-white tracking-tight">3 layers</b>
            <span className="text-[9px] text-[#777]">Spam defense</span>
          </div>
        </div>
      </div>
    </div>
  );
}

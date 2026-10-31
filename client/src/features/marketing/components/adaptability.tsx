"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GLOBE_GRAY_DOTS, GLOBE_BLUE_DOTS } from "./globe-data";
import { marketingData } from "../data";

export function AdaptabilitySection() {
  const [adminToggle, setAdminToggle] = useState(true);
  const [memberToggle, setMemberToggle] = useState(false);

  const { adaptability } = marketingData;

  return (
    <section className="py-20 sm:py-28 bg-white" id="features">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold text-slate-900 leading-[1.18] font-heading tracking-tight">
            {adaptability.headline}<br className="hidden sm:inline" />{" "}
            <span className="text-[#2563eb]">{adaptability.headlineHighlight}</span>
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {adaptability.subtitle}
          </p>
        </div>

        {/* 3-Column Unified Bordered Frame matching the reference design */}
        <div className="mt-14 sm:mt-16 bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/90">
          
          {/* Card 1: Incredibly easy to set up */}
          <div className="flex flex-col bg-white">
            {/* Visual Header */}
            <div className="h-72 sm:h-80 w-full flex items-center justify-center relative overflow-hidden bg-white p-4 select-none">
              {/* Subtle Square Grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-80"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)
                  `,
                  backgroundSize: "44px 44px",
                  backgroundPosition: "center center",
                }}
              />

              {/* Technical Blueprint Guide Hairlines & Crosshairs */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none text-slate-300"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Horizontal Center Guide Line with T-Ticks */}
                <line x1="8" y1="50%" x2="24" y2="50%" stroke="currentColor" strokeWidth="1" />
                <line x1="16" y1="calc(50% - 4px)" x2="16" y2="calc(50% + 4px)" stroke="currentColor" strokeWidth="1" />

                <line x1="calc(100% - 24px)" y1="50%" x2="calc(100% - 8px)" y2="50%" stroke="currentColor" strokeWidth="1" />
                <line x1="calc(100% - 16px)" y1="calc(50% - 4px)" x2="calc(100% - 16px)" y2="calc(50% + 4px)" stroke="currentColor" strokeWidth="1" />

                {/* Vertical Center Guide Line with T-Ticks */}
                <line x1="50%" y1="12" x2="50%" y2="28" stroke="currentColor" strokeWidth="1" />
                <line x1="calc(50% - 4px)" y1="20" x2="calc(50% + 4px)" y2="20" stroke="currentColor" strokeWidth="1" />

                <line x1="50%" y1="calc(100% - 48px)" x2="50%" y2="calc(100% - 14px)" stroke="currentColor" strokeWidth="1" />
                <line x1="calc(50% - 8px)" y1="calc(100% - 14px)" x2="calc(50% + 8px)" y2="calc(100% - 14px)" stroke="currentColor" strokeWidth="1" />
              </svg>

              {/* Smartwatch / Device Chassis Silhouette */}
              <div className="absolute flex flex-col items-center pointer-events-none">
                {/* Top Watch Strap */}
                <div className="w-20 sm:w-22 h-8 rounded-t-xl bg-slate-100/70 border-t border-x border-slate-200/60" />
                {/* Watch Body Frame */}
                <div className="w-52 h-52 sm:w-56 sm:h-56 rounded-[34px] bg-slate-50/50 border border-slate-200/60 shadow-xs" />
                {/* Bottom Watch Strap */}
                <div className="w-20 sm:w-22 h-8 rounded-b-xl bg-slate-100/70 border-b border-x border-slate-200/60" />
              </div>

              {/* Central Elevated White Toggle Card with Cyan-Blue Gradient Border */}
              <div className="relative z-10 p-[1.5px] rounded-[28px] bg-gradient-to-br from-slate-200/90 via-blue-400 to-[#2563eb] shadow-[0_16px_36px_-6px_rgba(37,99,235,0.18),0_4px_12px_rgba(0,0,0,0.03)]">
                <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-[26.5px] bg-white p-4 sm:p-5 flex flex-col justify-center items-center gap-3">
                  
                  {/* Switch Row 1: Admin */}
                  <button
                    type="button"
                    onClick={() => setAdminToggle((prev) => !prev)}
                    className="w-full max-w-[152px] h-[46px] rounded-full border border-slate-200/90 bg-white px-3 flex items-center gap-3 transition-all hover:border-blue-300 cursor-pointer shadow-2xs"
                    aria-label="Toggle Admin"
                  >
                    <span
                      className={`w-9 h-5 rounded-full p-0.5 relative transition-colors duration-200 ease-in-out shrink-0 flex items-center ${
                        adminToggle ? "bg-[#2563eb]" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-xs ${
                          adminToggle ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </span>
                    <span className="text-[13px] font-semibold text-slate-800">
                      {adaptability.cards.setup.adminLabel}
                    </span>
                  </button>

                  {/* Switch Row 2: Member */}
                  <button
                    type="button"
                    onClick={() => setMemberToggle((prev) => !prev)}
                    className="w-full max-w-[152px] h-[46px] rounded-full border border-slate-200/90 bg-white px-3 flex items-center gap-3 transition-all hover:border-blue-300 cursor-pointer shadow-2xs"
                    aria-label="Toggle Member"
                  >
                    <span
                      className={`w-9 h-5 rounded-full p-0.5 relative transition-colors duration-200 ease-in-out shrink-0 flex items-center ${
                        memberToggle ? "bg-[#2563eb]" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-xs ${
                          memberToggle ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </span>
                    <span className="text-[13px] font-medium text-slate-500">
                      {adaptability.cards.setup.memberLabel}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 pt-4 pb-10 flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight font-heading">
                {adaptability.cards.setup.title}
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[280px]">
                {adaptability.cards.setup.description}
              </p>
            </div>
          </div>

          {/* Card 2: A unified global source / Edge pipeline */}
          <div className="flex flex-col bg-white">
            {/* Visual Header */}
            <div className="h-72 sm:h-80 w-full flex items-center justify-center relative overflow-hidden bg-white p-4 select-none">
              {/* Globe Visual Container */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Stipple/Dotted 3D World Globe */}
                <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                  {/* Subtle sphere perimeter outline */}
                  <circle
                    cx="100"
                    cy="100"
                    r="74"
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />

                  {/* Faint Parallel & Meridian Arcs */}
                  <ellipse
                    cx="100"
                    cy="100"
                    rx="74"
                    ry="28"
                    stroke="#f1f5f9"
                    strokeDasharray="2 3"
                    strokeWidth="0.8"
                  />
                  <ellipse
                    cx="100"
                    cy="100"
                    rx="32"
                    ry="74"
                    stroke="#f1f5f9"
                    strokeDasharray="2 3"
                    strokeWidth="0.8"
                  />

                  {/* Gray Continent Dots */}
                  <g fill="#94a3b8" opacity="0.65">
                    {GLOBE_GRAY_DOTS.map(([cx, cy], i) => (
                      <circle key={`gray-${i}`} cx={cx} cy={cy} r="1.2" />
                    ))}
                  </g>

                  {/* Vibrant Blue Coastal Highlight Dots */}
                  <g fill="#2563eb" opacity="0.95">
                    {GLOBE_BLUE_DOTS.map(([cx, cy], i) => (
                      <circle key={`blue-${i}`} cx={cx} cy={cy} r="1.4" />
                    ))}
                  </g>
                </svg>

                {/* Location Pin 1: Indonesia (Top-Center) */}
                <div className="absolute top-[34px] left-[102px] -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                  <div className="px-2.5 py-0.5 rounded-full bg-[#2563eb] text-white text-[10.5px] font-semibold shadow-sm leading-tight whitespace-nowrap">
                    {adaptability.cards.global.locations[0]}
                  </div>
                  <div className="mt-0.5 -translate-y-0.5 flex items-center justify-center">
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                      <path
                        d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z"
                        fill="#2563eb"
                      />
                      <circle cx="7" cy="7" r="2.2" fill="white" />
                    </svg>
                  </div>
                </div>

                {/* Location Pin 2: Japan (Middle-Left) */}
                <div className="absolute top-[96px] left-[46px] -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                  <div className="px-2.5 py-0.5 rounded-full bg-[#2563eb] text-white text-[10.5px] font-semibold shadow-sm leading-tight whitespace-nowrap">
                    {adaptability.cards.global.locations[1]}
                  </div>
                  <div className="mt-0.5 -translate-y-0.5 flex items-center justify-center">
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                      <path
                        d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z"
                        fill="#2563eb"
                      />
                      <circle cx="7" cy="7" r="2.2" fill="white" />
                    </svg>
                  </div>
                </div>

                {/* Location Pin 3: Korea (Middle-Right) */}
                <div className="absolute top-[120px] right-[24px] translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                  <div className="px-2.5 py-0.5 rounded-full bg-[#2563eb] text-white text-[10.5px] font-semibold shadow-sm leading-tight whitespace-nowrap">
                    {adaptability.cards.global.locations[2]}
                  </div>
                  <div className="mt-0.5 -translate-y-0.5 flex items-center justify-center">
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                      <path
                        d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z"
                        fill="#2563eb"
                      />
                      <circle cx="7" cy="7" r="2.2" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 pt-4 pb-10 flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight font-heading">
                {adaptability.cards.global.title}
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[280px]">
                {adaptability.cards.global.description}
              </p>
            </div>
          </div>

          {/* Card 3: Built for teamwork */}
          <div className="flex flex-col bg-white">
            {/* Visual Header */}
            <div className="h-72 sm:h-80 w-full flex items-center justify-center relative overflow-hidden bg-white p-4 select-none">
              {/* Horizontal Racetrack / Pill Track Lanes */}
              <div className="absolute -right-8 top-10 w-72 h-12 rounded-full border border-slate-200/70 pointer-events-none" />
              <div className="absolute -right-14 top-24 w-84 h-12 rounded-full border border-slate-200/70 pointer-events-none" />
              <div className="absolute -left-10 bottom-12 w-72 h-12 rounded-full border border-slate-200/60 pointer-events-none" />
              <div className="absolute left-4 top-28 w-60 h-12 rounded-full border border-slate-100/70 pointer-events-none" />

              {/* Floating Pill: Rayhan User Badge with Cyan-Blue Gradient Border */}
              <div className="absolute top-12 left-8 sm:left-12 z-10 p-[1.5px] rounded-full bg-gradient-to-br from-slate-200/90 via-blue-400 to-[#2563eb] shadow-[0_16px_36px_-6px_rgba(37,99,235,0.2),0_4px_12px_rgba(0,0,0,0.03)] transition-transform hover:scale-[1.03] duration-200">
                <div className="rounded-full bg-white pl-2 pr-4.5 py-1.5 flex items-center gap-2.5">
                  {/* Photo Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 shadow-2xs relative">
                    <Image
                      src="/testimonials/avatar-fox.png"
                      alt={adaptability.cards.teamwork.userBadge.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* User Info */}
                  <div className="flex flex-col text-left">
                    <span className="text-[13px] font-semibold text-slate-800 leading-tight">
                      {adaptability.cards.teamwork.userBadge.name}
                    </span>
                    <span className="text-[11px] text-slate-600 font-mono tracking-tight leading-none mt-0.5">
                      {adaptability.cards.teamwork.userBadge.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Circle: Blue User Icon with Cyan-Blue Gradient Border */}
              <div className="absolute top-32 right-10 sm:right-16 z-10 p-[1.5px] rounded-full bg-gradient-to-br from-slate-200/90 via-blue-400 to-[#2563eb] shadow-[0_16px_36px_-6px_rgba(37,99,235,0.2),0_4px_12px_rgba(0,0,0,0.03)] transition-transform hover:scale-[1.05] duration-200">
                <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-white flex items-center justify-center">
                  <div className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shadow-xs">
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-white">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 pt-4 pb-10 flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight font-heading">
                {adaptability.cards.teamwork.title}
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[280px]">
                {adaptability.cards.teamwork.description}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

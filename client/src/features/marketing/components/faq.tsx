"use client";

import React, { useState } from "react";
import { marketingData } from "../data";

export function Faq() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { faq } = marketingData;

  return (
    <section className="py-20 sm:py-28 bg-[#fafbfc] border-t border-slate-100" id="faq">
      {/* Container aligned with the exact max-width and horizontal padding of the Navbar content */}
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight text-slate-900 font-heading">
            {faq.headline} <span className="text-[#2563eb]">{faq.headlineHighlight}</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 font-normal">
            {faq.subtitle}
          </p>
        </div>

        {/* Asymmetric Staggered Grid of Cards (Row 1: 7-5, Row 2: 5-7) matching navbar container width */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {faq.items.map((item, idx) => {
            const isActive = activeIndex === idx;

            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                onClick={() => setActiveIndex(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIndex(idx);
                  }
                }}
                className={`col-span-12 ${item.colSpan} rounded-xl p-7 sm:p-8 md:p-9 transition-all duration-200 cursor-pointer flex flex-col justify-start select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? "bg-gradient-to-br from-[#eef4ff] via-[#f3f6ff] to-[#f5f2ff] border border-[#93c5fd] shadow-[0_2px_10px_rgba(37,99,235,0.06)]"
                    : "bg-white border border-[#e5e7eb] hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                <h3 className="text-lg sm:text-[20px] font-semibold text-slate-900 tracking-tight leading-snug font-heading">
                  {item.q}
                </h3>
                <p className="mt-4 text-xs sm:text-[14px] text-slate-500 leading-relaxed font-normal">
                  {item.a}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

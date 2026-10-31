import React from "react";
import { marketingData } from "../data";

export function Testimonials() {
  const { testimonials } = marketingData;

  return (
    <section className="py-20 sm:py-28 bg-[#fafbfc] border-t border-slate-100" id="testimonials">
      {/* Container aligned with the exact max-width and horizontal padding of the Navbar */}
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight text-slate-900 leading-[1.15] font-heading">
            {testimonials.headline}<br className="hidden sm:inline" />{" "}
            <span className="text-[#2563eb]">{testimonials.headlineHighlight}</span>
          </h2>
          <p className="mt-3.5 text-xs sm:text-[14px] text-slate-500 font-normal">
            {testimonials.subtitle}
          </p>
        </div>

        {/* 3-Column Contiguous Table Grid - Fully proportionate to Navbar container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 items-stretch">
          {/* Column 1: Featured Testimonial (Full Card with Blue Border) */}
          <div className="relative z-10 border border-[#60a5fa] p-7 sm:p-8 md:p-9 lg:p-10 flex flex-col justify-between bg-white/70 transition-colors duration-200 hover:bg-slate-50/60">
            <p className="text-slate-600 text-[13.5px] sm:text-[14px] lg:text-[14.5px] leading-[1.7] font-normal">
              &ldquo;{testimonials.featured.quote}&rdquo;
            </p>

            <div className="mt-8 sm:mt-10 pt-0 flex flex-col gap-5">
              <div className="flex items-center gap-3">

                <div>
                  <h3 className="text-[14px] sm:text-[14.5px] font-semibold text-slate-900 leading-tight">
                    {testimonials.featured.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-tight mt-1">
                    {testimonials.featured.role}
                  </p>
                </div>
              </div>

              {testimonials.featured.tag && (
                <p className="text-xs sm:text-[12.5px] text-slate-500 font-normal">
                  {testimonials.featured.tag}
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Stacked Two Cards */}
          <div className="flex flex-col border border-slate-200 lg:border-l-0 lg:border-y lg:border-r border-slate-200 bg-white/70">
            {/* Top Stacked Card */}
            <div className="p-7 sm:p-8 lg:p-9 flex flex-col justify-between flex-1 border-b border-slate-200 transition-colors duration-200 hover:bg-slate-50/60">
              <p className="text-slate-600 text-[13.5px] sm:text-[14px] lg:text-[14.5px] leading-[1.65] font-normal">
                &ldquo;{testimonials.stacked.top.quote}&rdquo;
              </p>

              <div className="mt-6 sm:mt-8 flex items-center gap-3">

                <div>
                  <h3 className="text-[14px] sm:text-[14.5px] font-semibold text-slate-900 leading-tight">
                    {testimonials.stacked.top.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-tight mt-1">
                    {testimonials.stacked.top.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Stacked Card */}
            <div className="p-7 sm:p-8 lg:p-9 flex flex-col justify-between flex-1 transition-colors duration-200 hover:bg-slate-50/60">
              <p className="text-slate-600 text-[13.5px] sm:text-[14px] lg:text-[14.5px] leading-[1.65] font-normal">
                &ldquo;{testimonials.stacked.bottom.quote}&rdquo;
              </p>

              <div className="mt-6 sm:mt-8 flex items-center gap-3">

                <div>
                  <h3 className="text-[14px] sm:text-[14.5px] font-semibold text-slate-900 leading-tight">
                    {testimonials.stacked.bottom.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-tight mt-1">
                    {testimonials.stacked.bottom.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Secondary Testimonial (Full Card Matching Column 1) */}
          <div className="p-7 sm:p-8 md:p-9 lg:p-10 flex flex-col justify-between border border-slate-200 lg:border-l-0 lg:border-y lg:border-r border-slate-200 bg-white/70 transition-colors duration-200 hover:bg-slate-50/60">
            <p className="text-slate-600 text-[13.5px] sm:text-[14px] lg:text-[14.5px] leading-[1.7] font-normal">
              &ldquo;{testimonials.secondary.quote}&rdquo;
            </p>

            <div className="mt-8 sm:mt-10 pt-0 flex flex-col gap-5">
              <div className="flex items-center gap-3">

                <div>
                  <h3 className="text-[14px] sm:text-[14.5px] font-semibold text-slate-900 leading-tight">
                    {testimonials.secondary.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-tight mt-1">
                    {testimonials.secondary.role}
                  </p>
                </div>
              </div>

              {testimonials.secondary.tag && (
                <p className="text-xs sm:text-[12.5px] text-slate-500 font-normal">
                  {testimonials.secondary.tag}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

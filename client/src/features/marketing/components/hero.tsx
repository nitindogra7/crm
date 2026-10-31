import React from "react";
import Link from "next/link";
import { marketingData } from "../data";

export function Hero() {
  const { hero } = marketingData;

  return (
    <section className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24 overflow-hidden bg-white selection:bg-blue-500/20">
      {/* Background Top Gradient & Masked Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Top Only: Left-to-Right Blue to Light Very Light Pink Gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-[360px] sm:h-[400px] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(186, 218, 255, 0.72) 0%, rgba(206, 227, 255, 0.45) 25%, rgba(242, 237, 254, 0.28) 50%, rgba(253, 230, 244, 0.48) 75%, rgba(252, 216, 236, 0.75) 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Fine Technical Grid (Masked to be completely invisible across the top gradient) */}
        <div
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(226, 232, 240, 0.75) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(226, 232, 240, 0.75) 1px, transparent 1px)
            `,
            backgroundSize: "68px 68px",
            backgroundPosition: "center top",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 260px, rgba(0,0,0,0.35) 340px, rgba(0,0,0,0.8) 420px, rgba(0,0,0,0.8) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 260px, rgba(0,0,0,0.35) 340px, rgba(0,0,0,0.8) 420px, rgba(0,0,0,0.8) 100%)",
          }}
        />
      </div>

      {/* Main Container aligned with Navbar */}
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8 relative z-10">
        {/* Tinted Grid Highlight Squares behind cards */}
        <div className="hidden md:block pointer-events-none select-none" aria-hidden="true">
          {/* Top-Left Grid Highlight (near HTML card) */}
          <div className="absolute top-[136px] lg:top-[156px] left-1 lg:left-5 xl:left-7 w-[72px] h-[72px] bg-indigo-100/40 rounded-sm" />
          {/* Bottom-Left Grid Highlight (near React card) */}
          <div className="absolute top-[276px] lg:top-[296px] left-13 lg:left-23 xl:left-31 w-[72px] h-[72px] bg-blue-100/45 rounded-sm" />
          {/* Top-Right Grid Highlight (near Next.js card) */}
          <div className="absolute top-[136px] lg:top-[156px] right-1 lg:right-5 xl:right-7 w-[72px] h-[72px] bg-blue-100/40 rounded-sm" />
          {/* Bottom-Right Grid Highlight (near Angular card) */}
          <div className="absolute top-[276px] lg:top-[296px] right-13 lg:right-23 xl:right-31 w-[72px] h-[72px] bg-indigo-100/45 rounded-sm" />
        </div>

        {/* 4 Technology Floating Cards */}

        {/* Card 1: Top-Left -> HTML5 */}
        <div className="hidden md:flex absolute top-[148px] lg:top-[168px] left-3 lg:left-7 xl:left-9 z-20 items-center justify-center w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-2xl bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03)] border border-slate-100/90 transition-transform duration-300 hover:scale-105 select-none">
          <svg viewBox="0 0 512 512" className="w-8 h-8 sm:w-9 sm:h-9" aria-label="HTML5">
            <path fill="#E34F26" d="M71,460 L30,0 481,0 440,460 255,512" />
            <path fill="#EF652A" d="M256,472 L407,430 443,62 256,62" />
            <path fill="#EBEBEB" d="M256,208 L181,208 176,150 256,150 256,94 255,94 114,94 128,264 256,264 z M256,356 L255,356 193,339 189,293 133,293 141,385 255,417 256,417 z" />
            <path fill="#FFFFFF" d="M255,208 L255,264 329,264 322,339 255,357 255,417 370,385 371,384 384,236 386,208 386,208 z M255,94 L255,122 255,150 391,150 396,94 z" />
          </svg>
        </div>

        {/* Card 2: Bottom-Left -> React */}
        <div className="hidden md:flex absolute top-[288px] lg:top-[308px] left-15 lg:left-25 xl:left-33 z-20 items-center justify-center w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-2xl bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03)] border border-slate-100/90 transition-transform duration-300 hover:scale-105 select-none">
          <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-8 h-8 sm:w-9 sm:h-9" aria-label="React">
            <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
            <g stroke="#00d8ff" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        </div>

        {/* Card 3: Top-Right -> Next.js */}
        <div className="hidden md:flex absolute top-[148px] lg:top-[168px] right-3 lg:right-7 xl:right-9 z-20 items-center justify-center w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-2xl bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03)] border border-slate-100/90 transition-transform duration-300 hover:scale-105 select-none">
          <svg viewBox="0 0 180 180" className="w-8 h-8 sm:w-9 sm:h-9" fill="none" aria-label="Next.js">
            <circle cx="90" cy="90" r="90" fill="#000000" />
            <path
              d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.16 149.508 157.52Z"
              fill="url(#next-grad)"
            />
            <rect x="115" y="54" width="12" height="72" fill="#FFFFFF" />
            <defs>
              <linearGradient id="next-grad" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Card 4: Bottom-Right -> Angular */}
        <div className="hidden md:flex absolute top-[288px] lg:top-[308px] right-15 lg:right-25 xl:right-33 z-20 items-center justify-center w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-2xl bg-white shadow-[0_12px_28px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03)] border border-slate-100/90 transition-transform duration-300 hover:scale-105 select-none">
          <svg viewBox="0 0 250 250" className="w-8 h-8 sm:w-9 sm:h-9" aria-label="Angular">
            <polygon points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2" fill="#DD0031" />
            <polygon points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2" fill="#C3002F" />
            <path d="M125,52.1L66.8,182.6h21.7l11.7-29.2h49.4l11.7,29.2h21.7L125,52.1z M142,135.4H108l17-42.4L142,135.4z" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Center Hero Content */}
        <div className="max-w-3xl mx-auto text-center pt-2 sm:pt-6">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-slate-900 leading-[1.1] font-heading">
            {hero.headline}
            <br />
            <span className="text-[#2563eb]">{hero.headlineHighlight}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-[17px] text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[#2563eb] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95 inline-flex items-center justify-center"
            >
              {hero.primaryCta}
            </Link>
            <Link
              href="/docs"
              className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium border border-slate-200/90 shadow-sm transition-all hover:scale-[1.02] active:scale-95 inline-flex items-center justify-center"
            >
              {hero.secondaryCta}
            </Link>
          </div>

          {/* Ratings Badge */}
          <div className="mt-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200/70 text-xs sm:text-sm shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <span className="font-bold text-slate-900">{hero.rating.score}</span>
              <span className="text-amber-400 font-bold">★</span>
              <span className="text-slate-600 font-medium">{hero.rating.reviews}</span>
            </div>
          </div>
        </div>

        {/* Trusted By Strip */}
        <div className="mt-16 sm:mt-20 pt-8 relative">
          {/* Subtle light gradient divider */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-80 h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />

          <p className="text-xs sm:text-[13px] text-slate-600 font-normal tracking-wide text-center">
            {hero.trustedBy.title}{" "}
            <span className="text-slate-600 font-medium">{hero.trustedBy.highlight}</span>{" "}
            {hero.trustedBy.suffix}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {hero.trustedBy.items.map((item, idx) => {
              const renderIcon = (icon?: string) => {
                switch (icon) {
                  case "agency":
                    return (
                      <svg viewBox="0 0 20 20" className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="14" height="13" rx="2" />
                        <path d="M7 8h6M7 11h6M7 14h3" />
                      </svg>
                    );
                  case "code":
                    return (
                      <svg viewBox="0 0 20 20" className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 7L3 10L6 13" />
                        <path d="M14 7L17 10L14 13" />
                        <path d="M11 4L9 16" />
                      </svg>
                    );
                  case "studio":
                    return (
                      <svg viewBox="0 0 20 20" className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2.5" y="3" width="15" height="14" rx="2" />
                        <path d="M2.5 8h15M7.5 8v9" />
                      </svg>
                    );
                  case "rocket":
                    return (
                      <svg viewBox="0 0 20 20" className="w-4 h-4 text-slate-400 group-hover:text-sky-500 transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 16l4-1 6-6a2.828 2.828 0 10-4-4L4 11l-1 4 1 1z" />
                        <path d="M12 4l4 4" />
                      </svg>
                    );
                  case "chart":
                  default:
                    return (
                      <svg viewBox="0 0 20 20" className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 15l4-5 4 3 6-7" />
                        <path d="M13 6h4v4" />
                      </svg>
                    );
                }
              };

              return (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/40 hover:bg-white/80 border border-slate-200/40 hover:border-slate-300/70 shadow-[0_1px_2px_rgba(0,0,0,0.015)] hover:shadow-xs transition-all duration-200 group select-none backdrop-blur-[2px]"
                >
                  {renderIcon(item.icon)}
                  <div className="flex flex-col text-left">
                    <span className="text-[12px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors leading-tight">
                      {item.label}
                    </span>
                    {item.sublabel && (
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-500 font-normal leading-tight mt-0.5">
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

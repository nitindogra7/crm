"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "I've tried nearly every CRM and inbox tool; Infraly is the first one that felt designed to streamline our entire inbound lead operations.",
    author: "Esther Howard",
    role: "VP of Growth, SyncFlow",
    avatar: "EH",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "Our lead response times dropped from 4 hours down to under 3 minutes. The automated spam shield saved our sales reps dozens of wasted hours every week.",
    author: "Marcus Chen",
    role: "Head of Revenue, Vertex AI",
    avatar: "MC",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    quote:
      "Connecting our landing pages took 60 seconds with zero backend code. The real-time conversion graphs give our founders instant clarity on inbound pipeline.",
    author: "Elena Rostova",
    role: "Co-Founder & CEO, Novatech",
    avatar: "ER",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
];

const ORBIT_AVATARS = [
  { id: 1, pos: "top-10 left-[12%]", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80", name: "David" },
  { id: 2, pos: "bottom-14 left-[14%]", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80", name: "Sarah" },
  { id: 3, pos: "top-14 right-[12%]", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80", name: "Liam" },
  { id: 4, pos: "bottom-12 right-[14%]", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80", name: "Chloe" },
  { id: 5, pos: "top-1/2 -translate-y-1/2 left-[5%]", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&auto=format&fit=crop&q=80", name: "James" },
  { id: 6, pos: "top-1/2 -translate-y-1/2 right-[5%]", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&auto=format&fit=crop&q=80", name: "Amara" },
];

export function Teams() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = TESTIMONIALS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden text-[#f5f7f5]"
      id="testimonials"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(135, 80, 42, 0.16), transparent 60%), #121815",
      }}
    >
      {/* Background Star / Dot matrix */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.25) 0.8px, transparent 0.8px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="w-[min(1160px,calc(100%-36px))] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16 md:mb-20">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#f5f7f5] leading-[1.15]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Trusted by Growing Companies{" "}
            <span
              style={{
                background: "linear-gradient(100deg, #f1c7aa, #ff985b 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Worldwide
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#9cb0a6] leading-relaxed mt-4 max-w-[480px] mx-auto">
            Hundreds of high-growth sales teams and founders rely on our CRM to power their inbound pipeline.
          </p>
        </div>

        {/* Orbit Constellation & Featured Center Quote */}
        <div className="relative max-w-[840px] mx-auto min-h-[380px] flex flex-col items-center justify-center px-4 py-8">
          {/* Orbiting Avatar Pins (Desktop) */}
          {ORBIT_AVATARS.map((av) => (
            <div
              key={av.id}
              className={`hidden md:block absolute ${av.pos} w-10 h-10 rounded-full border-2 border-white/10 shadow-lg overflow-hidden opacity-75 hover:opacity-100 hover:scale-110 hover:border-[#ff995e]/60 transition-all duration-300 pointer-events-auto`}
            >
              <Image
                src={av.img}
                alt={av.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Featured Center Avatar with Gold Ring */}
          <div className="relative mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-[#ff995e] to-[#f59e0b] shadow-[0_0_24px_rgba(255,153,94,0.35)]">
              <Image
                src={current.img}
                alt={current.author}
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1e2823] border border-[#ff995e]/50 flex items-center justify-center text-[#ffab76]">
              <Quote className="w-3 h-3 fill-current" />
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="text-center max-w-[620px] mx-auto mb-6">
            <blockquote className="text-base sm:text-lg md:text-xl font-medium text-[#f5f7f5] leading-relaxed tracking-tight">
              &ldquo;{current.quote}&rdquo;
            </blockquote>
          </div>

          {/* Author & Role */}
          <div className="text-center mb-7">
            <div className="text-sm font-semibold text-[#f5f7f5]">
              {current.author}
            </div>
            <div className="text-xs text-[#ffab76] font-medium mt-0.5">
              {current.role}
            </div>
          </div>

          {/* Controls (< >) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-9 h-9 rounded-full bg-[#202c26] border border-white/10 hover:border-[#ff995e]/40 hover:bg-[#27362f] text-[#cdd8d2] flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pagination indicator dots */}
            <div className="flex items-center gap-1.5 px-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === idx
                      ? "w-6 bg-[#ff995e]"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-9 h-9 rounded-full bg-[#202c26] border border-white/10 hover:border-[#ff995e]/40 hover:bg-[#27362f] text-[#cdd8d2] flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

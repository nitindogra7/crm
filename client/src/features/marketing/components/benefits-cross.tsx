"use client";

import React from "react";
import { Icon, IconName } from "./icons";

interface BenefitItem {
  icon: IconName;
  title: string;
  desc: string;
  tag: string;
}

const BENEFITS: BenefitItem[] = [
  {
    icon: "shield",
    title: "Invisible Spam Defense",
    desc: "No one likes clicking fuzzy fire hydrants or solving math puzzles. infraly filters out bots and junk submissions quietly behind the scenes so real customers can reach you with zero friction.",
    tag: "Zero Captchas",
  },
  {
    icon: "cpu",
    title: "Connect in Under 2 Minutes",
    desc: "Works with any contact form on WordPress, Webflow, Squarespace, Wix, or custom sites. Just paste your link and you are ready—no plugins to slow your site down and no servers to maintain.",
    tag: "No Coding Needed",
  },
  {
    icon: "layers",
    title: "Collect Any Information You Need",
    desc: "Ask for whatever your business requires—budget, project timeline, phone number, team size, or custom questions. infraly neatly organizes every detail directly into the customer's profile.",
    tag: "Custom Fields",
  },
  {
    icon: "db",
    title: "Clean, Organized CRM Inbox",
    desc: "Every inquiry arrives instantly in your unified dashboard. View contact info, track follow-ups from New to Contacted, write notes, and export your list to Excel or CSV anytime.",
    tag: "Lead Tracking",
  },
];

export function BenefitsCross() {
  return (
    <section className="py-14 md:py-20 relative z-10" id="benefits">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-900/60 bg-[#0E1411] text-[11px] font-medium text-emerald-400 mb-3">
            <span>[ WHY infraly ]</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-medium tracking-tight text-white leading-tight mb-3">
            Built for busy businesses. <br />
            <span className="text-zinc-400">Zero technical headaches.</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            Stop losing valuable customer inquiries in buried email inboxes or messy spreadsheets. infraly gives you a simple, reliable way to capture and convert every lead.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {BENEFITS.map((item, idx) => (
            <div
              key={idx}
              className="group relative p-5 sm:p-6 rounded-xl border border-zinc-800/80 hover:border-emerald-500/40 bg-[#0E1411] hover:bg-[#121915] transition-all duration-200 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 grid place-items-center group-hover:border-emerald-500/40 transition-colors">
                    <Icon name={item.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-[10.5px] font-medium px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-heading font-medium text-white mb-2 group-hover:text-emerald-100 transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-400 font-p text-xs sm:text-[13px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

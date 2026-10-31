import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { marketingData } from "../data";

export function Pricing() {
  const { pricing } = marketingData;

  return (
    <section className="py-20 sm:py-28 bg-[#fafbfc] border-t border-slate-100" id="pricing">
      {/* Container matching Navbar max-width */}
      <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight text-slate-900 font-heading">
            {pricing.headline}{" "}
            <span className="text-[#2563eb]">{pricing.headlineHighlight}</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 font-normal">
            {pricing.subtitle}
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {pricing.plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-7 sm:p-8 md:p-9 flex flex-col justify-between transition-all duration-200 ${
                plan.isPopular
                  ? "bg-gradient-to-b from-[#eef4ff] via-[#f1f6ff] to-[#e5f0fe] border border-[#93c5fd] shadow-[0_4px_20px_rgba(37,99,235,0.08)]"
                  : "bg-white border border-[#e5e7eb] hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div>
                {/* Card Header (Title & Badge) */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-slate-900 font-heading">
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#0369a1] text-white shadow-2xs">
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Subtitle */}
                <p className="mt-2 text-xs sm:text-sm text-slate-500 min-h-[38px] leading-relaxed font-normal">
                  {plan.sub}
                </p>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-slate-900 font-heading tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs sm:text-sm font-normal text-slate-500">
                    {plan.period}
                  </span>
                </div>

                {/* Features Section */}
                <div className="mt-6 pt-2">
                  <p className="text-xs sm:text-[13px] font-medium text-slate-600 mb-3.5">
                    What&apos;s you get:
                  </p>
                  <ul className="space-y-3.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <div className="w-[18px] h-[18px] rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                        </div>
                        <span className="text-xs sm:text-[13.5px] text-slate-600 leading-snug font-normal">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-2">
                <Link
                  href="/dashboard"
                  className={`w-full py-2.5 sm:py-3 px-4 rounded-full text-sm font-medium transition-all inline-flex items-center justify-center ${
                    plan.btnVariant === "gradient"
                      ? "bg-gradient-to-r from-[#2b66f6] to-[#0091ff] hover:opacity-95 text-white shadow-md shadow-blue-500/20 active:scale-98"
                      : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 hover:border-slate-300 shadow-2xs active:scale-98"
                  }`}
                >
                  Choose Plan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

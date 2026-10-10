import React from "react";
import { Card } from "./ui";

export function StatsStrip() {
  const stats = [
    { value: "0", label: "servers to maintain" },
    { value: "<500ms", label: "to your inbox" },
    { value: "3", label: "layers of spam defense" },
    { value: "0", label: "missed inquiries" },
  ];

  return (
    <section className="pt-[40px] md:pt-[64px] pb-[48px] md:pb-0">
      <div className="max-w-[1040px] mx-auto px-[16px] sm:px-[24px]">
        <Card className="grid grid-cols-2 md:grid-cols-4 overflow-hidden">
          {stats.map((stat, i) => {
            const isSecondColMobile = i % 2 === 1;
            const isTopRowMobile = i < 2;
            const isLastDesktop = i === 3;

            return (
              <div
                key={i}
                className={`py-[22px] sm:py-[26px] md:py-[32px] px-[8px] sm:px-[14px] md:px-[20px] text-center ${
                  !isLastDesktop ? "md:border-r md:border-white/[0.08]" : ""
                } ${
                  isTopRowMobile ? "border-b md:border-b-0 border-white/[0.08]" : ""
                } ${!isSecondColMobile ? "border-r md:border-r-0 border-white/[0.08]" : ""}`}
              >
                <b className="block text-[22px] sm:text-[28px] md:text-[34px] font-thin tracking-tight leading-[1.1] text-white tabular-nums">
                  {stat.value}
                </b>
                <span className="text-[#8c8c8c] text-[10.5px] sm:text-[11.5px] block mt-[3px] md:mt-[4px] leading-tight">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </Card>
      </div>
    </section>
  );
}

import React from "react";
import { Pill, Card } from "./ui";

interface StepItem {
  num: string;
  command: string;
  title: string;
  desc: string;
}

const STEPS: StepItem[] = [
  {
    num: "Step 1",
    command: "$ npx salenova init",
    title: "Create your endpoint",
    desc: "Generate your secure endpoint in seconds. No servers, credentials, or setup required.",
  },
  {
    num: "Step 2",
    command: "POST /f/abc123",
    title: "Point your form at it",
    desc: "Add the URL directly to your form's action attribute or submit via a simple fetch call.",
  },
  {
    num: "Step 3",
    command: "lead.created ✓",
    title: "Receive verified inquiries",
    desc: "We filter out spam, store the record safely, and send formatted alerts straight to your inbox.",
  },
];

export function HowItWorks() {
  return (
    <section className="pt-0 pb-[80px] md:pb-[96px]">
      <div className="max-w-[1040px] mx-auto px-[16px] sm:px-[24px]">
        {/* Head */}
        <div className="text-center mb-[52px]">
          <Pill icon="bolt">How it works</Pill>
          <h2 className="text-[clamp(26px,3.4vw,38px)] font-extralight tracking-[-0.04em] leading-[1.1] mt-[20px] text-white">
            Live in three simple steps
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
          {STEPS.map((step, i) => (
            <Card key={i} className="p-[26px] overflow-hidden">
              <div className="text-[10.5px] text-[#565656] mb-[18px] md:mb-[34px] flex justify-between">
                <span>{step.num}</span>
              </div>

              {/* Mini Terminal with sweep animation */}
              <div className="h-[54px] mb-[22px] border border-white/[0.08] rounded-[10px] bg-black/40 relative overflow-hidden font-mono font-light text-[10px] leading-[54px] text-[#8c8c8c] px-[12px] whitespace-nowrap">
                <div
                  className="absolute top-0 bottom-0 w-[60px] pointer-events-none animate-[sweep_3s_infinite]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)",
                  }}
                />
                {step.command}
              </div>

              <h3 className="text-[16px] font-light mb-[8px] tracking-[-0.03em] text-white">
                {step.title}
              </h3>
              <p className="text-[#8c8c8c] text-[11.5px] leading-[1.7]">
                {step.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

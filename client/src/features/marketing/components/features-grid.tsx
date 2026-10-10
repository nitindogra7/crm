"use client";

import React, { useState } from "react";
import { Pill, Button, Avatar } from "./ui";

export function FeaturesGrid() {
  const [hoveredScene1, setHoveredScene1] = useState(false);
  const [hoveredScene2, setHoveredScene2] = useState(false);
  const [hoveredScene3, setHoveredScene3] = useState(false);

  return (
    <section id="features" className="pt-[20px] pb-[80px] md:py-[40px]">
      <div className="max-w-[1040px] mx-auto px-[16px] sm:px-[24px]">
        {/* Feature Row 1: Zero Backend Boilerplate */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[30px] items-center py-[20px] md:py-[40px]">
          {/* 3D Scene 1 */}
          <div
            onMouseEnter={() => setHoveredScene1(true)}
            onMouseLeave={() => setHoveredScene1(false)}
            className="h-[270px] md:h-[320px] grid place-items-center [perspective:1100px] cursor-pointer"
            style={{
              maskImage: "radial-gradient(ellipse at center, #000 45%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, #000 45%, transparent 78%)",
            }}
          >
            <div
              className="relative w-[250px] h-[170px] [transform-style:preserve-3d] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                transform: hoveredScene1
                  ? "rotateX(50deg) rotateZ(-26deg)"
                  : "rotateX(56deg) rotateZ(-34deg)",
              }}
            >
              {/* Layer 1 */}
              <div className="absolute inset-0 p-[14px] border border-white/[0.17] rounded-[12px] bg-[linear-gradient(150deg,rgba(40,40,40,0.95),rgba(8,8,8,0.95))] shadow-[-18px_22px_36px_rgba(0,0,0,0.7)] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                <div className="text-[9px] text-[#565656] mb-[6px]">Setup</div>
                <div className="text-[22px] font-extralight tracking-[-0.04em] mb-[8px] text-white">
                  1 endpoint
                </div>
                {/* Bar 1 */}
                <div className="h-[7px] rounded-[4px] bg-white/10 mb-[6px] relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-[4px] bg-[linear-gradient(90deg,rgba(255,255,255,0.25),rgba(255,255,255,0.6))] animate-[grow_3s_infinite_alternate_ease-in-out]"
                    style={{ width: "90%" }}
                  />
                </div>
                {/* Bar 2 */}
                <div className="h-[7px] rounded-[4px] bg-white/10 mb-[6px] relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-[4px] bg-[linear-gradient(90deg,rgba(255,255,255,0.25),rgba(255,255,255,0.6))] animate-[grow_3s_infinite_alternate_ease-in-out]"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>

              {/* Layer 2 */}
              <div
                className="absolute inset-0 p-[14px] border border-white/[0.17] rounded-[12px] bg-[linear-gradient(150deg,rgba(40,40,40,0.95),rgba(8,8,8,0.95))] shadow-[-18px_22px_36px_rgba(0,0,0,0.7)] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{
                  transform: hoveredScene1 ? "translateZ(60px)" : "translateZ(34px)",
                }}
              >
                <div className="text-[9px] text-[#565656] mb-[6px]">Submissions</div>
                <div className="text-[22px] font-extralight tracking-[-0.04em] mb-[8px] text-white">
                  2,000 / mo
                </div>
                <div className="h-[7px] rounded-[4px] bg-white/10 mb-[6px] relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-[4px] bg-[linear-gradient(90deg,rgba(255,255,255,0.25),rgba(255,255,255,0.6))] animate-[grow_3s_infinite_alternate_ease-in-out]"
                    style={{ width: "75%" }}
                  />
                </div>
                <div className="h-[7px] rounded-[4px] bg-white/10 mb-[6px] relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-[4px] bg-[linear-gradient(90deg,rgba(255,255,255,0.25),rgba(255,255,255,0.6))] animate-[grow_3s_infinite_alternate_ease-in-out]"
                    style={{ width: "45%" }}
                  />
                </div>
                <div className="h-[7px] rounded-[4px] bg-white/10 mb-[6px] relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-[4px] bg-[linear-gradient(90deg,rgba(255,255,255,0.25),rgba(255,255,255,0.6))] animate-[grow_3s_infinite_alternate_ease-in-out]"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>

              {/* Layer 3 */}
              <div
                className="absolute inset-0 p-[14px] border border-white/[0.17] rounded-[12px] bg-[linear-gradient(150deg,rgba(40,40,40,0.95),rgba(8,8,8,0.95))] shadow-[-18px_22px_36px_rgba(0,0,0,0.7)] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{
                  transform: hoveredScene1 ? "translateZ(120px)" : "translateZ(68px)",
                }}
              >
                <div className="text-[9px] text-[#565656] mb-[6px]">Form API</div>
                <div className="flex items-center gap-[8px] text-[9.5px] mb-[7px] text-[#cfcfcf] whitespace-nowrap">
                  <i className="w-[16px] h-[16px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#777,#222)] flex-none inline-block" />
                  POST /f/abc123
                  <em className="ml-auto not-italic text-[#565656] pl-[8px]">200</em>
                </div>
                <div className="flex items-center gap-[8px] text-[9.5px] mb-[7px] text-[#cfcfcf] whitespace-nowrap">
                  <i className="w-[16px] h-[16px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#777,#222)] flex-none inline-block" />
                  Honeypot clean
                  <em className="ml-auto not-italic text-[#565656] pl-[8px]">verified</em>
                </div>
                <div className="flex items-center gap-[8px] text-[9.5px] mb-[7px] text-[#cfcfcf] whitespace-nowrap">
                  <i className="w-[16px] h-[16px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#777,#222)] flex-none inline-block" />
                  Delivered to inbox
                  <em className="ml-auto not-italic text-[#565656] pl-[8px]">0.3s</em>
                </div>
              </div>
            </div>
          </div>

          {/* Text 1 */}
          <div className="md:pl-[26px] text-center md:text-left order-first md:order-last">
            <Pill icon="term">Zero backend</Pill>
            <h3 className="text-[clamp(24px,3vw,34px)] font-extralight tracking-[-0.04em] leading-[1.1] my-[22px] mb-[14px] text-white">
              Stop wasting hours on<br />
              <span className="text-[#6e6e6e]">backend boilerplate</span>
            </h3>
            <p className="text-[#8c8c8c] max-w-[380px] mx-auto md:mx-0 mb-[26px] text-[12.5px] leading-[1.7]">
              You built your landing page in an afternoon. Don&apos;t waste the next three days provisioning server routes, connecting databases, configuring SMTP, and debugging CORS headers just to handle a contact form.
            </p>
            <div className="flex gap-[8px] flex-wrap justify-center md:justify-start">
              <Button href="/signup" variant="solid" size="sm">
                Get started
              </Button>
              <Button href="#try" size="sm">
                Learn more
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Row 2: Real Leads Only */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[30px] items-center py-[20px] md:py-[40px]">
          {/* 3D Scene 2 */}
          <div
            onMouseEnter={() => setHoveredScene2(true)}
            onMouseLeave={() => setHoveredScene2(false)}
            className="h-[270px] md:h-[320px] grid place-items-center [perspective:1100px] cursor-pointer"
            style={{
              maskImage: "radial-gradient(ellipse at center, #000 45%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, #000 45%, transparent 78%)",
            }}
          >
            <div
              className="relative w-[250px] h-[170px] [transform-style:preserve-3d] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                transform: hoveredScene2
                  ? "rotateX(46deg) rotateZ(-14deg)"
                  : "rotateX(52deg) rotateZ(-20deg)",
              }}
            >
              {/* Layer 1 */}
              <div className="absolute inset-0 p-[14px] border border-white/[0.17] rounded-[12px] bg-[linear-gradient(150deg,rgba(40,40,40,0.95),rgba(8,8,8,0.95))] shadow-[-18px_22px_36px_rgba(0,0,0,0.7)] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                <div className="text-[9px] text-[#565656] mb-[6px]">Spam quarantine</div>
                <div className="flex items-center gap-[8px] text-[9.5px] mb-[7px] text-[#cfcfcf] whitespace-nowrap">
                  <i className="w-[16px] h-[16px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#777,#222)] flex-none inline-block" />
                  bot.crawler@test.com
                  <em className="ml-auto not-italic text-[#565656] pl-[8px]">rate limit</em>
                </div>
                <div className="flex items-center gap-[8px] text-[9.5px] mb-[7px] text-[#cfcfcf] whitespace-nowrap">
                  <i className="w-[16px] h-[16px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#777,#222)] flex-none inline-block" />
                  fake@disposable.com
                  <em className="ml-auto not-italic text-[#565656] pl-[8px]">disposable</em>
                </div>
              </div>

              {/* Layer 2 */}
              <div
                className="absolute inset-0 p-[14px] border border-white/[0.17] rounded-[12px] bg-[linear-gradient(150deg,rgba(40,40,40,0.95),rgba(8,8,8,0.95))] shadow-[-18px_22px_36px_rgba(0,0,0,0.7)] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{
                  transform: hoveredScene2
                    ? "translate3d(-44px, 40px, 48px)"
                    : "translate3d(-26px, 24px, 28px)",
                }}
              >
                <div className="text-[9px] text-[#565656] mb-[6px]">Shield stats</div>
                <div className="grid grid-cols-2 gap-[6px]">
                  <div className="border border-white/[0.08] rounded-[8px] p-[6px_8px] text-[9px] text-[#565656]">
                    <b className="block text-[17px] font-extralight text-white tracking-[-0.04em]">
                      +100
                    </b>
                    Blocked
                  </div>
                  <div className="border border-white/[0.08] rounded-[8px] p-[6px_8px] text-[9px] text-[#565656]">
                    <b className="block text-[17px] font-extralight text-white tracking-[-0.04em]">
                      20%
                    </b>
                    Spam rate
                  </div>
                </div>
              </div>

              {/* Layer 3 */}
              <div
                className="absolute inset-0 p-[14px] border border-white/[0.17] rounded-[12px] bg-[linear-gradient(150deg,rgba(40,40,40,0.95),rgba(8,8,8,0.95))] shadow-[-18px_22px_36px_rgba(0,0,0,0.7)] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{
                  transform: hoveredScene2
                    ? "translate3d(-88px, 80px, 96px)"
                    : "translate3d(-52px, 48px, 56px)",
                }}
              >
                <div className="text-[9px] text-[#565656] mb-[6px]">Verified leads</div>
                <div className="flex -space-x-[7px] my-[6px] mb-[10px]">
                  <Avatar size={24} index={4} alt="Team member 1" />
                  <Avatar size={24} index={5} alt="Team member 2" />
                  <Avatar size={24} index={6} alt="Team member 3" />
                </div>
                <div className="grid grid-cols-2 gap-[6px]">
                  <div className="border border-white/[0.08] rounded-[8px] p-[6px_8px] text-[9px] text-[#565656]">
                    <b className="block text-[17px] font-extralight text-white tracking-[-0.04em]">
                      0
                    </b>
                    Lost leads
                  </div>
                  <div className="border border-white/[0.08] rounded-[8px] p-[6px_8px] text-[9px] text-[#565656]">
                    <b className="block text-[17px] font-extralight text-white tracking-[-0.04em]">
                      1 click
                    </b>
                    Rescue
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text 2 */}
          <div className="md:pl-[26px] text-center md:text-left order-first md:order-last">
            <Pill icon="shield">Smart protection</Pill>
            <h3 className="text-[clamp(24px,3vw,34px)] font-extralight tracking-[-0.04em] leading-[1.1] my-[22px] mb-[14px] text-white">
              Spam protection that<br />
              <span className="text-[#6e6e6e]">never annoys users</span>
            </h3>
            <p className="text-[#8c8c8c] max-w-[380px] mx-auto md:mx-0 mb-[26px] text-[12.5px] leading-[1.7]">
              No ugly captcha puzzles turning prospective customers away. Silent honeypots, rate limiting, and domain verification filter out bot crawlers while letting every real inquiry land safely.
            </p>
            <div className="flex gap-[8px] flex-wrap justify-center md:justify-start">
              <Button href="/signup" variant="solid" size="sm">
                Get started
              </Button>
              <Button href="#try" size="sm">
                Learn more
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Row 3: API and webhooks */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[30px] items-center py-[20px] md:py-[40px]">
          {/* 3D Scene 3 */}
          <div
            onMouseEnter={() => setHoveredScene3(true)}
            onMouseLeave={() => setHoveredScene3(false)}
            className="h-[270px] md:h-[320px] grid place-items-center [perspective:1100px] cursor-pointer"
            style={{
              maskImage: "radial-gradient(ellipse at center, #000 45%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, #000 45%, transparent 78%)",
            }}
          >
            <div
              className="relative w-[250px] h-[170px] [transform-style:preserve-3d] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                transform: hoveredScene3
                  ? "rotateX(46deg) rotateZ(-14deg)"
                  : "rotateX(52deg) rotateZ(-20deg)",
              }}
            >
              {/* Layer 1 */}
              <div className="absolute inset-0 p-[14px] border border-white/[0.17] rounded-[12px] bg-[linear-gradient(150deg,rgba(40,40,40,0.95),rgba(8,8,8,0.95))] shadow-[-18px_22px_36px_rgba(0,0,0,0.7)] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                <div className="text-[9px] text-[#565656] mb-[6px]">REST API</div>
                <div className="flex items-center gap-[8px] text-[9.5px] mb-[7px] text-[#cfcfcf] whitespace-nowrap">
                  <i className="w-[16px] h-[16px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#777,#222)] flex-none inline-block" />
                  GET /v1/leads
                  <em className="ml-auto not-italic text-[#565656] pl-[8px]">Bearer</em>
                </div>
                <div className="flex items-center gap-[8px] text-[9.5px] mb-[7px] text-[#cfcfcf] whitespace-nowrap">
                  <i className="w-[16px] h-[16px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#777,#222)] flex-none inline-block" />
                  GET /v1/leads/lead_8f2k1
                  <em className="ml-auto not-italic text-[#565656] pl-[8px]">200</em>
                </div>
              </div>

              {/* Layer 2 */}
              <div
                className="absolute inset-0 p-[14px] border border-white/[0.17] rounded-[12px] bg-[linear-gradient(150deg,rgba(40,40,40,0.95),rgba(8,8,8,0.95))] shadow-[-18px_22px_36px_rgba(0,0,0,0.7)] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{
                  transform: hoveredScene3
                    ? "translate3d(-44px, 40px, 48px)"
                    : "translate3d(-26px, 24px, 28px)",
                }}
              >
                <div className="text-[9px] text-[#565656] mb-[6px]">Webhook</div>
                <div className="flex items-center gap-[8px] text-[9.5px] mb-[7px] text-[#cfcfcf] whitespace-nowrap">
                  <i className="w-[16px] h-[16px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#777,#222)] flex-none inline-block" />
                  lead.created
                  <em className="ml-auto not-italic text-[#565656] pl-[8px]">signed</em>
                </div>
                <div className="flex items-center gap-[8px] text-[9.5px] mb-[7px] text-[#cfcfcf] whitespace-nowrap">
                  <i className="w-[16px] h-[16px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#777,#222)] flex-none inline-block" />
                  Retry with backoff
                  <em className="ml-auto not-italic text-[#565656] pl-[8px]">3/5</em>
                </div>
              </div>

              {/* Layer 3 */}
              <div
                className="absolute inset-0 p-[14px] border border-white/[0.17] rounded-[12px] bg-[linear-gradient(150deg,rgba(40,40,40,0.95),rgba(8,8,8,0.95))] shadow-[-18px_22px_36px_rgba(0,0,0,0.7)] transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                style={{
                  transform: hoveredScene3
                    ? "translate3d(-88px, 80px, 96px)"
                    : "translate3d(-52px, 48px, 56px)",
                }}
              >
                <div className="text-[9px] text-[#565656] mb-[6px]">Inquiry event</div>
                <div className="flex items-center gap-[8px] text-[9.5px] mb-[7px] text-[#cfcfcf] whitespace-nowrap">
                  <i className="w-[16px] h-[16px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#777,#222)] flex-none inline-block" />
                  john@acme.com
                  <em className="ml-auto not-italic text-[#565656] pl-[8px]">accepted</em>
                </div>
                <div className="flex items-center gap-[8px] text-[9.5px] mb-[7px] text-[#cfcfcf] whitespace-nowrap">
                  <i className="w-[16px] h-[16px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#777,#222)] flex-none inline-block" />
                  sarah@startup.io
                  <em className="ml-auto not-italic text-[#565656] pl-[8px]">accepted</em>
                </div>
              </div>
            </div>
          </div>

          {/* Text 3 */}
          <div className="md:pl-[26px] text-center md:text-left order-first md:order-last">
            <Pill icon="hook">Integrations & webhooks</Pill>
            <h3 className="text-[clamp(24px,3vw,34px)] font-extralight tracking-[-0.04em] leading-[1.1] my-[22px] mb-[14px] text-white">
              Your submissions,<br />
              <span className="text-[#6e6e6e]">delivered anywhere you want</span>
            </h3>
            <p className="text-[#8c8c8c] max-w-[380px] mx-auto md:mx-0 mb-[26px] text-[12.5px] leading-[1.7]">
              Keep full control over your submissions. Route leads directly into your email, forward them to your CRM via signed webhooks with exponential backoff, or query them using our REST API.
            </p>
            <div className="flex gap-[8px] flex-wrap justify-center md:justify-start">
              <Button href="/signup" variant="solid" size="sm">
                Get started
              </Button>
              <Button href="#try" size="sm">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

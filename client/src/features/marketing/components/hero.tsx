"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Icon } from "./icons";
import { Pill, Button, Orb, Avatar } from "./ui";

interface HeroProps {
  kept: number;
  blocked: number;
  onIncrementKept: () => void;
  onIncrementBlocked: () => void;
}

export function Hero({
  kept,
  blocked,
  onIncrementKept,
  onIncrementBlocked,
}: HeroProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Command string
  const commandText = "npx salenova init --form contact";
  const displayCommand = "npx salenova init --form contact";

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(commandText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Generate 28 stars with random positions and delays
  const stars = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${(i * 37) % 100}%`,
      top: `${(i * 59) % 100}%`,
      delay: `${((i * 1.3) % 4).toFixed(1)}s`,
      opacity: 0.2 + ((i * 0.23) % 0.6),
    }));
  }, []);

  // Natural human marketing headline
  const line1 = "Capture every lead";
  const line2 = "without building a backend.";

  // Dynamic font-weight on mouse proximity
  useEffect(() => {
    const chars = headlineRef.current?.querySelectorAll<HTMLSpanElement>(".ch");
    if (!chars || chars.length === 0) return;

    let rafId: number = 0;
    const handlePointerMove = (e: PointerEvent) => {
      const mx = e.clientX;
      const my = e.clientY;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        chars.forEach((c) => {
          const r = c.getBoundingClientRect();
          const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
          const weight = Math.round(100 + 300 * Math.max(0, 1 - d / 120));
          c.style.fontWeight = `${weight}`;
        });
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Orbit Particle Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const orbit = orbitRef.current;
    if (!canvas || !stage || !orbit) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let K = 1;
    let animId: number = 0;

    interface Particle {
      a: number;
      r: number;
      s: number;
      spam: boolean;
      b: number;
      life: number;
      why: string;
      tr: [number, number][];
    }

    const whyList = ["honeypot", "rate limit", "disposable", "bot spam"];
    const particles: Particle[] = [];
    let t = 0;

    const handleResize = () => {
      K = Math.min(1, stage.clientWidth / 520);
      orbit.style.setProperty("--k", `${K}`);
      stage.style.height = `${430 * K}px`;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = () => {
      t++;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;
      const RS = 158 * K;
      const RC = 50 * K;

      if (t % 16 === 0 && particles.length < 40) {
        particles.push({
          a: Math.random() * 6.283,
          r: Math.max(W, H) * 0.5,
          s: 0.6 + Math.random() * 0.5,
          spam: Math.random() < 0.45,
          b: 0,
          life: 1,
          why: whyList[Math.floor(Math.random() * 4)],
          tr: [],
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.b) {
          p.r += p.b;
          p.b *= 0.94;
          p.life -= 0.012;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          p.r -= p.s * K * (p.r > RS + 30 ? 2.4 : 1.3);
          p.a += 0.0015 / p.s;
          if (p.spam && p.r <= RS) {
            p.b = 2.2 * K;
            p.r = RS;
            onIncrementBlocked();
          } else if (!p.spam && p.r <= RC) {
            onIncrementKept();
            particles.splice(i, 1);
            continue;
          }
        }

        const px = cx + Math.cos(p.a) * p.r;
        const py = cy + Math.sin(p.a) * p.r;
        p.tr.push([px, py]);
        if (p.tr.length > 16) p.tr.shift();

        const al = p.spam ? 0.5 * p.life : 1;
        ctx.beginPath();
        p.tr.forEach((q, j) => (j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
        ctx.strokeStyle = `rgba(255,255,255,${al * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, (p.spam ? 1.8 : 2.2) * Math.max(0.8, K), 0, 6.283);
        ctx.fillStyle = p.spam ? `rgba(130,130,130,${al})` : "#fff";
        if (!p.spam) {
          ctx.shadowColor = "#fff";
          ctx.shadowBlur = 9;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.b && p.life > 0.5 && K > 0.6) {
          ctx.font = "300 9px Inter, sans-serif";
          ctx.fillStyle = `rgba(160,160,160,${(p.life - 0.5) * 2})`;
          ctx.fillText(p.why, px + 7, py + 3);
        }
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(frame);
      }
    };

    frame();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [onIncrementBlocked, onIncrementKept]);

  let charIndex = 0;

  return (
    <header className="relative pt-[128px] pb-[64px] md:pb-[40px] text-center overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, #000, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, #000, transparent)",
        }}
      />

      {/* Top Subtle Radial Light Source */}
      <div
        className="absolute left-1/2 -top-[120px] w-[560px] h-[360px] -ml-[280px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255,255,255,0.13), transparent 65%)",
        }}
      />

      {/* Twinkling Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <i
            key={star.id}
            className="absolute w-[2px] h-[2px] rounded-full bg-white animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              animationDuration: "4s",
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div className="max-w-[1040px] mx-auto px-[24px] relative z-10">
        {/* Pill Badge */}
        <div className="inline-block mb-[26px] animate-[fadeIn_1s_0.5s_both]">
          <Pill icon="bolt">The zero-backend form solution</Pill>
        </div>

        {/* Hero Interactive Headline */}
        <h1
          ref={headlineRef}
          aria-label="Capture every lead without building a backend."
          className="relative text-[clamp(32px,5vw,54px)] font-thin max-w-[620px] mx-auto mb-[18px] tracking-[-0.04em] leading-[1.1] text-balance"
        >
          {/* Floating Multiplayer Cursor Badges */}
          <span
            className="hidden sm:inline-flex absolute z-20 items-center gap-2 px-3 py-1.5 rounded-[7px] bg-[#141416]/95 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] sm:-top-5 sm:left-2 md:top-1 md:-left-12 lg:-left-20 xl:-left-26 select-none whitespace-nowrap animate-[float_6s_ease-in-out_infinite] pointer-events-none"
          >
            {/* Pointer cursor arrow */}
            <svg
              viewBox="0 0 24 24"
              className="absolute -left-2 -top-2 w-3.5 h-3.5 fill-white stroke-black stroke-[1.5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] pointer-events-none"
              aria-hidden="true"
            >
              <path d="m4 3 7 17 2.5-7.5L21 10z" />
            </svg>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] flex-none" />
            <span className="text-white font-medium text-xs leading-none tracking-normal">
              Static Sites
            </span>
          </span>

          <span
            className="hidden sm:inline-flex absolute z-20 items-center gap-2 px-3 py-1.5 rounded-[7px] bg-[#141416]/95 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] sm:-top-5 sm:right-2 md:top-8 md:-right-12 lg:-right-20 xl:-right-26 select-none whitespace-nowrap animate-[float_6s_ease-in-out_infinite] pointer-events-none"
            style={{ animationDelay: "-2s" }}
          >
            {/* Pointer cursor arrow */}
            <svg
              viewBox="0 0 24 24"
              className="absolute -left-2 -top-2 w-3.5 h-3.5 fill-white stroke-black stroke-[1.5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] pointer-events-none"
              aria-hidden="true"
            >
              <path d="m4 3 7 17 2.5-7.5L21 10z" />
            </svg>
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)] flex-none" />
            <span className="text-white font-medium text-xs leading-none tracking-normal">
              Landing Pages
            </span>
          </span>

          {/* Line 1 */}
          <span className="block">
            {line1.split(" ").map((word, wordIdx, words) => (
              <React.Fragment key={wordIdx}>
                <span className="inline-block whitespace-nowrap">
                  {word.split("").map((c, i) => {
                    const delay = 0.3 + charIndex++ * 0.025;
                    return (
                      <span
                        key={i}
                        className="ch inline-block transition-[font-weight] duration-250 opacity-100 font-extralight text-[#f2f2f2]"
                        style={{
                          animation: `fadeInChar 0.9s cubic-bezier(0.2,0.8,0.2,1) ${delay}s both`,
                        }}
                      >
                        {c}
                      </span>
                    );
                  })}
                </span>
                {wordIdx < words.length - 1 && " "}
              </React.Fragment>
            ))}
          </span>

          {/* Line 2 */}
          <span className="block text-[#7a7a7a]">
            {line2.split(" ").map((word, wordIdx, words) => (
              <React.Fragment key={wordIdx}>
                <span className="inline-block whitespace-nowrap">
                  {word.split("").map((c, i) => {
                    const delay = 0.3 + charIndex++ * 0.025;
                    return (
                      <span
                        key={i}
                        className="ch inline-block transition-[font-weight] duration-250 opacity-100 font-extralight text-[#7a7a7a]"
                        style={{
                          animation: `fadeInChar 0.9s cubic-bezier(0.2,0.8,0.2,1) ${delay}s both`,
                        }}
                      >
                        {c}
                      </span>
                    );
                  })}
                </span>
                {wordIdx < words.length - 1 && " "}
              </React.Fragment>
            ))}
          </span>
        </h1>

        {/* Human Marketing Subtitle */}
        <p className="text-[#8c8c8c] text-[13.5px] max-w-[460px] mx-auto mb-[28px] leading-[1.7] text-pretty font-normal">
          You shouldn&apos;t need a database, mail server, and spam filter just to handle a contact form. Plug in one endpoint and receive verified leads in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-[10px] justify-center flex-wrap">
          <Button href="/signup" variant="solid">
            Get started free <Icon name="arrow" className="w-[14px] h-[14px] transition-transform group-hover:translate-x-1" />
          </Button>
          <Button href="#try">See it in action</Button>
        </div>

        {/* One-Click Command Box */}
        <div className="inline-flex items-center gap-[10px] mt-[22px] max-w-full py-[6px] pr-[6px] pl-[16px] border border-white/[0.08] rounded-full bg-white/[0.03] font-mono font-light text-[11px] text-[#8c8c8c]">
          <span className="truncate">
            <b className="text-white font-normal mr-1.5">$</b>
            {displayCommand}
          </span>
          <button
            type="button"
            aria-label="Copy command"
            onClick={handleCopy}
            className="w-[26px] h-[26px] rounded-full border border-white/[0.17] bg-white/[0.05] text-white cursor-pointer grid place-items-center flex-none transition-all duration-300 hover:bg-white hover:text-black"
          >
            {copied ? (
              <Icon name="chk" className="w-[12px] h-[12px]" />
            ) : (
              <Icon name="copy" className="w-[12px] h-[12px]" />
            )}
          </button>
        </div>
      </div>

      {/* Orbit Visualization Stage */}
      <div
        ref={stageRef}
        id="stage"
        className="max-w-[1040px] mx-auto px-[24px] relative h-[430px] mt-[32px]"
      >
        <canvas
          ref={canvasRef}
          id="cv"
          className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        />

        {/* Orbit System */}
        <div
          ref={orbitRef}
          id="orbit"
          className="absolute left-1/2 top-0 w-[520px] h-[430px] -ml-[260px] origin-top"
          style={{ transform: "scale(var(--k, 1))" }}
        >
          {/* Ring 3 (Outer - Dashed) */}
          <div
            className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-white/[0.06] w-[460px] h-[460px] -m-[230px] animate-[spin_140s_linear_infinite]"
          >
            <div className="absolute top-1/2 -left-[14px] -mt-[14px] w-[28px] h-[28px] animate-[spin_140s_linear_infinite_reverse]">
              <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_4px_rgba(0,0,0,0.6)] text-white">
                <Icon name="hook" className="w-[14px] h-[14px]" />
              </div>
            </div>
          </div>

          {/* Ring 2 (Middle - Solid) */}
          <div
            className="absolute left-1/2 top-1/2 rounded-full border border-white/[0.14] w-[316px] h-[316px] -m-[158px] animate-[spin_90s_linear_infinite]"
          >
            {/* Top Node */}
            <div className="absolute left-1/2 -top-[14px] -ml-[14px] w-[28px] h-[28px] animate-[spin_90s_linear_infinite_reverse]">
              <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_4px_rgba(0,0,0,0.6)] text-white">
                <Icon name="code" className="w-[14px] h-[14px]" />
              </div>
            </div>
            {/* Bottom Node */}
            <div className="absolute left-1/2 -bottom-[14px] -ml-[14px] w-[28px] h-[28px] animate-[spin_90s_linear_infinite_reverse]">
              <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_4px_rgba(0,0,0,0.6)] text-white">
                <Icon name="mail" className="w-[14px] h-[14px]" />
              </div>
            </div>
          </div>

          {/* Ring 1 (Inner) */}
          <div
            className="absolute left-1/2 top-1/2 rounded-full border border-white/[0.08] w-[192px] h-[192px] -m-[96px] animate-[spin_60s_linear_infinite] bg-[radial-gradient(circle,transparent_55%,rgba(255,255,255,0.035))]"
          >
            <div className="absolute left-1/2 -top-[14px] -ml-[14px] w-[28px] h-[28px] animate-[spin_60s_linear_infinite_reverse]">
              <div className="w-[28px] h-[28px] rounded-full grid place-items-center bg-[radial-gradient(circle_at_32%_26%,#4a4a4a,#0c0c0c_70%)] border border-[#333] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2),0_0_0_4px_rgba(0,0,0,0.6)] text-white">
                <Icon name="lock" className="w-[14px] h-[14px]" />
              </div>
            </div>
          </div>

          {/* Central 3D Orb */}
          <div className="absolute left-1/2 top-1/2 -m-[48px] z-20">
            <Orb size={96} />
          </div>
        </div>

        {/* Floating Card Left: Form Info */}
        <div
          className="hidden lg:block absolute left-[1%] top-[50px] z-30 p-[12px_14px] w-[168px] text-left border border-white/[0.08] rounded-[16px] bg-[linear-gradient(150deg,rgba(255,255,255,0.07),rgba(255,255,255,0.012)_38%,rgba(255,255,255,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_50px_-24px_#000] animate-[float_7s_ease-in-out_infinite]"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          <small className="block text-[#565656] text-[9.5px] mb-[3px]">Form endpoint</small>
          <div className="text-[13px] mb-[18px] text-[#f2f2f2]">contact-form</div>
          <div className="flex items-center gap-[8px] text-[9.5px] text-[#8c8c8c]">
            <Avatar size={24} index={0} alt="Contact API" />
            <span className="truncate">api.salenova.com/f/abc123</span>
          </div>
        </div>

        {/* Floating Card Right: Verified Intake Stats */}
        <div
          className="hidden lg:block absolute right-[1%] top-[84px] z-30 p-[12px_14px] w-[168px] text-left border border-white/[0.08] rounded-[16px] bg-[linear-gradient(150deg,rgba(255,255,255,0.07),rgba(255,255,255,0.012)_38%,rgba(255,255,255,0.025))] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_50px_-24px_#000] animate-[float_8s_-3s_ease-in-out_infinite]"
          style={{ transform: "rotate(1.5deg)" }}
        >
          <small className="block text-[#565656] text-[9.5px] mb-[3px]">Verified intake</small>
          <div className="flex -space-x-[7px] my-[6px]">
            <Avatar size={26} index={1} alt="Lead Maya" />
            <Avatar size={26} index={2} alt="Lead Alex" />
            <Avatar size={26} index={3} alt="Lead Sarah" />
            <Avatar size={26} index={4} alt="Lead Dev" />
          </div>
          <div className="grid grid-cols-2 gap-[6px] mt-[8px]">
            <div className="border border-white/[0.08] rounded-[8px] p-[6px_8px] text-[9px] text-[#565656]">
              <b className="block font-light text-[15px] text-white tracking-[-0.03em] tabular-nums">
                {kept}
              </b>
              Delivered
            </div>
            <div className="border border-white/[0.08] rounded-[8px] p-[6px_8px] text-[9px] text-[#565656]">
              <b className="block font-light text-[15px] text-white tracking-[-0.03em] tabular-nums">
                {blocked}
              </b>
              Spam blocked
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Live Counter Bar */}
      <div className="flex lg:hidden justify-center gap-[10px] mt-[10px] px-4">
        <div className="border border-white/[0.08] rounded-full py-[5px] px-[14px] text-[10.5px] text-[#8c8c8c] bg-white/[0.03]">
          <b className="text-white font-normal mr-[5px] tabular-nums">{kept}</b> delivered
        </div>
        <div className="border border-white/[0.08] rounded-full py-[5px] px-[14px] text-[10.5px] text-[#8c8c8c] bg-white/[0.03]">
          <b className="text-white font-normal mr-[5px] tabular-nums">{blocked}</b> spam blocked
        </div>
      </div>
    </header>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import { Icon } from "./icons";

interface Point {
  x: number;
  y: number;
}

interface BezierStream {
  id: string;
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
  t: number;
  speed: number;
  color: string;
  glowColor: string;
  label: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  pulsePhase: number;
}

interface ImpactRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface HeroBackgroundProps {
  showBadges?: boolean;
}

export function HeroBackground({ showBadges = true }: HeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mouse tracking with smooth lerp
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Particles list
    let particles: Particle[] = [];
    // Expanding rings from comets reaching destination
    const impactRings: ImpactRing[] = [];
    // Streams
    let streams: BezierStream[] = [];

    // Cubic bezier evaluation
    const getCubicPoint = (p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      return {
        x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
        y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
      };
    };

    const setupStreams = (w: number, h: number) => {
      // 4 graceful bezier data pipelines converging into the central showcase
      streams = [
        {
          id: "top-left",
          p0: { x: w * 0.04, y: Math.min(130, h * 0.16) },
          p1: { x: w * 0.22, y: Math.min(150, h * 0.2) },
          p2: { x: w * 0.36, y: h * 0.45 },
          p3: { x: w * 0.48, y: h * 0.58 },
          t: 0.15,
          speed: 0.0032,
          color: "rgba(52, 211, 153, 0.95)",
          glowColor: "rgba(52, 211, 153, 0.45)",
          label: "POST /v1/leads",
        },
        {
          id: "bottom-left",
          p0: { x: w * 0.02, y: h * 0.48 },
          p1: { x: w * 0.16, y: h * 0.52 },
          p2: { x: w * 0.28, y: h * 0.65 },
          p3: { x: w * 0.44, y: h * 0.72 },
          t: 0.65,
          speed: 0.0028,
          color: "rgba(16, 185, 129, 0.95)",
          glowColor: "rgba(16, 185, 129, 0.4)",
          label: "POST /contact",
        },
        {
          id: "top-right",
          p0: { x: w * 0.96, y: Math.min(130, h * 0.16) },
          p1: { x: w * 0.78, y: Math.min(150, h * 0.2) },
          p2: { x: w * 0.64, y: h * 0.45 },
          p3: { x: w * 0.52, y: h * 0.58 },
          t: 0.4,
          speed: 0.0035,
          color: "rgba(255, 255, 255, 0.95)",
          glowColor: "rgba(255, 255, 255, 0.35)",
          label: "POST /demo",
        },
        {
          id: "bottom-right",
          p0: { x: w * 0.98, y: h * 0.48 },
          p1: { x: w * 0.84, y: h * 0.52 },
          p2: { x: w * 0.72, y: h * 0.65 },
          p3: { x: w * 0.56, y: h * 0.72 },
          t: 0.85,
          speed: 0.0026,
          color: "rgba(52, 211, 153, 0.95)",
          glowColor: "rgba(52, 211, 153, 0.4)",
          label: "POST /pricing",
        },
      ];
    };

    const setupParticles = (w: number, h: number) => {
      const isMobile = w < 768;
      const count = isMobile ? 24 : 52;
      const palette = [
        "rgba(255, 255, 255, ",
        "rgba(52, 211, 153, ",
        "rgba(16, 185, 129, ",
        "rgba(110, 231, 183, ",
      ];

      particles = [];
      for (let i = 0; i < count; i++) {
        const baseRadius = 0.9 + Math.random() * 1.5;
        const colorPrefix = palette[Math.floor(Math.random() * palette.length)];
        const baseAlpha = 0.25 + Math.random() * 0.45;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          baseRadius,
          radius: baseRadius,
          baseAlpha,
          alpha: baseAlpha,
          color: colorPrefix,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      setupStreams(width, height);
      setupParticles(width, height);
    };

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    // Pointer listeners
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    // Main 60fps render loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // 1. Draw static trajectory curves with subtle dashed glow
      streams.forEach((stream) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(stream.p0.x, stream.p0.y);
        ctx.bezierCurveTo(
          stream.p1.x,
          stream.p1.y,
          stream.p2.x,
          stream.p2.y,
          stream.p3.x,
          stream.p3.y
        );
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 7]);
        ctx.stroke();
        ctx.restore();
      });

      // 2. Animate and draw streaming comets along bezier trajectories
      streams.forEach((stream) => {
        stream.t += stream.speed * (dt / 0.016);
        if (stream.t >= 1) {
          stream.t = 0;
          // Spawn impact ring at destination
          impactRings.push({
            x: stream.p3.x,
            y: stream.p3.y,
            radius: 2,
            maxRadius: 26,
            alpha: 0.8,
            color: stream.color,
          });
        }

        const head = getCubicPoint(
          stream.p0,
          stream.p1,
          stream.p2,
          stream.p3,
          stream.t
        );

        // Draw comet tail (6 interpolated trailing sparks)
        const tailSegments = 6;
        for (let i = 1; i <= tailSegments; i++) {
          const tailT = Math.max(0, stream.t - i * 0.016);
          const spark = getCubicPoint(
            stream.p0,
            stream.p1,
            stream.p2,
            stream.p3,
            tailT
          );
          const sparkAlpha = (1 - i / (tailSegments + 1)) * 0.6;
          const sparkRadius = Math.max(0.6, 2.4 - i * 0.35);

          ctx.beginPath();
          ctx.arc(spark.x, spark.y, sparkRadius, 0, Math.PI * 2);
          ctx.fillStyle = stream.color.replace("0.95", `${sparkAlpha}`);
          ctx.fill();
        }

        // Draw comet head with radial glow
        const headGrad = ctx.createRadialGradient(
          head.x,
          head.y,
          0,
          head.x,
          head.y,
          10
        );
        headGrad.addColorStop(0, stream.color);
        headGrad.addColorStop(0.3, stream.glowColor);
        headGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(head.x, head.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();

        // Bright white specular core
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });

      // 3. Animate expanding impact rings
      for (let i = impactRings.length - 1; i >= 0; i--) {
        const ring = impactRings[i];
        ring.radius += 28 * dt;
        ring.alpha -= 0.85 * dt;

        if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
          impactRings.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color.replace("0.95", `${ring.alpha}`);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // 4. Update and render Constellation Particles & Mesh Connections
      const maxDist = 95;
      const maxDistSq = maxDist * maxDist;
      const mouseRadius = 150;
      const mouseRadiusSq = mouseRadius * mouseRadius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift
        p.x += p.vx * (dt / 0.016);
        p.y += p.vy * (dt / 0.016);

        // Pulse alpha
        p.pulsePhase += 0.03;
        const pulse = Math.sin(p.pulsePhase) * 0.15;
        p.alpha = Math.max(0.1, Math.min(0.9, p.baseAlpha + pulse));

        // Screen boundary wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Mouse interaction
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouseRadius) * 0.8;
            // Gentle magnetic attraction towards cursor
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;

            // Brighten particle near mouse
            p.alpha = Math.min(1, p.alpha + 0.4);

            // Draw laser connection to cursor
            const laserAlpha = (1 - dist / mouseRadius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(52, 211, 153, ${laserAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Draw constellation lines to nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDist) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // 5. Draw subtle cursor spotlight in canvas
      if (mouse.active) {
        const mouseGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          110
        );
        mouseGrad.addColorStop(0, "rgba(52, 211, 153, 0.14)");
        mouseGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.05)");
        mouseGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 110, 0, Math.PI * 2);
        ctx.fillStyle = mouseGrad;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    // Pause on visibility change for energy efficiency
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* 1. Volumetric Celestial Aurora Orbs (Smooth GPU-composited radial mesh) */}
      {/* Top Horizon Corona Lens Flare */}
      <div
        className="absolute -top-[160px] left-1/2 -translate-x-1/2 w-[850px] sm:w-[1100px] md:w-[1400px] h-[440px] pointer-events-none opacity-80 animate-[horizonFlare_10s_easeInOut_infinite]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255, 255, 255, 0.15) 0%, rgba(52, 211, 153, 0.14) 30%, rgba(16, 185, 129, 0.06) 55%, transparent 75%)",
        }}
      />

      {/* Floating Emerald Nebula Orb (Left) */}
      <div
        className="absolute top-[80px] left-[-8%] sm:left-[5%] w-[420px] sm:w-[540px] h-[380px] sm:h-[480px] rounded-full blur-[90px] sm:blur-[120px] pointer-events-none animate-[auroraFloat1_16s_easeInOut_infinite]"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.06) 50%, transparent 75%)",
        }}
      />

      {/* Floating Emerald & Mint Nebula Orb (Right) */}
      <div
        className="absolute top-[100px] right-[-8%] sm:right-[5%] w-[440px] sm:w-[560px] h-[400px] sm:h-[500px] rounded-full blur-[95px] sm:blur-[130px] pointer-events-none animate-[auroraFloat2_19s_easeInOut_infinite]"
        style={{
          background:
            "radial-gradient(circle, rgba(52, 211, 153, 0.14) 0%, rgba(16, 185, 129, 0.06) 45%, transparent 75%)",
        }}
      />

      {/* Center Deep SaaS Pillar Beacon (Illuminating the central dashboard) */}
      <div
        className="absolute top-[280px] left-1/2 -translate-x-1/2 w-[600px] sm:w-[840px] h-[340px] rounded-full blur-[85px] pointer-events-none animate-[pulseBeacon_9s_easeInOut_infinite]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.08) 0%, rgba(52, 211, 153, 0.08) 40%, transparent 70%)",
        }}
      />

      {/* 2. Cybernetic 3D Perspective Grid with Infinite Horizon */}
      <div
        className="absolute top-[160px] sm:top-[190px] left-1/2 -translate-x-1/2 w-[120%] sm:w-[110%] max-w-[1400px] h-[580px] pointer-events-none overflow-hidden"
        style={{
          perspective: "850px",
          maskImage:
            "radial-gradient(ellipse 65% 55% at 50% 50%, black 15%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 55% at 50% 50%, black 15%, transparent 80%)",
        }}
      >
        <div
          className="w-full h-full animate-[gridFlow_14s_linear_infinite]"
          style={{
            transform: "rotateX(62deg) translateZ(0)",
            transformOrigin: "50% 100%",
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: "46px 46px",
          }}
        />
      </div>

      {/* 3. Interactive HTML5 Canvas: Dynamic Particle Mesh & Spline Comets */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* 4. Precision Optic Horizon Glint Beam */}
      <div className="absolute top-[210px] sm:top-[250px] left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] h-px overflow-hidden pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.22] to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[35%] bg-gradient-to-r from-transparent via-emerald-400/[0.6] to-transparent animate-[horizonShimmer_6.5s_easeInOut_infinite] blur-[0.5px]" />
      </div>

      {/* 5. Floating Holographic SaaS Telemetry Badges (Desktop Glassmorphic Cards) */}
      {showBadges && (
        <div className="hidden xl:block">
          {/* Badge 1: Top Left - API Intake */}
          <div className="absolute top-[110px] left-[3.5%] animate-[floatBadge1_6.5s_easeInOut_infinite]">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/[0.12] bg-[#181818]/90 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] group hover:border-emerald-500/40 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,1)]" />
              </span>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-semibold text-white">POST /v1/leads</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">200 OK</span>
                </div>
                <span className="text-[9px] text-neutral-400 font-sans">Edge response: 14ms</span>
              </div>
            </div>
          </div>

          {/* Badge 2: Mid-Low Left - Spam Shield AI */}
          <div className="absolute top-[370px] left-[2%] animate-[floatBadge2_7.5s_easeInOut_infinite]">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/[0.12] bg-[#181818]/90 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] group hover:border-emerald-500/40 transition-colors">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 grid place-items-center flex-none">
                <Icon name="shield" className="w-2.5 h-2.5 text-emerald-400" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] font-medium text-white">Spam Shield AI</span>
                  <span className="text-[9px] text-emerald-400 font-sans">99.8%</span>
                </div>
                <span className="text-[9px] text-neutral-400 font-sans">0.01 clean • Zero CAPTCHA</span>
              </div>
            </div>
          </div>

          {/* Badge 3: Top Right - Webhook Dispatch */}
          <div className="absolute top-[110px] right-[3.5%] animate-[floatBadge3_7s_easeInOut_infinite]">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/[0.12] bg-[#181818]/90 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] group hover:border-emerald-500/40 transition-colors">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 grid place-items-center flex-none">
                <Icon name="bolt" className="w-2.5 h-2.5 text-emerald-400" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] font-medium text-white">Instant Sync</span>
                  <span className="text-[9px] text-emerald-400 font-sans">Real-time</span>
                </div>
                <span className="text-[9px] text-neutral-400 font-sans">Slack • HubSpot • Webhooks</span>
              </div>
            </div>
          </div>

          {/* Badge 4: Mid-Low Right - Security & Zero Backend */}
          <div className="absolute top-[370px] right-[2%] animate-[floatBadge4_8s_easeInOut_infinite]">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/[0.12] bg-[#181818]/90 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] group hover:border-emerald-500/40 transition-colors">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 grid place-items-center flex-none">
                <Icon name="lock" className="w-2.5 h-2.5 text-emerald-400" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] font-medium text-white">Zero-Backend Pipeline</span>
                </div>
                <span className="text-[9px] text-neutral-400 font-sans">TLS 1.3 • AES-256</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

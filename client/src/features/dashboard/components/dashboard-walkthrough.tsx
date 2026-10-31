"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useDashboard } from "../context/dashboard-context";
import {
  BarChart3,
  FileCode2,
  Zap,
  Inbox,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  X,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  targetSelector: string;
  description: string;
  tip: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "overview-metrics",
    title: "Inbound Metrics",
    subtitle: "Overview",
    targetSelector: '[data-tour="stats-overview"]',
    description:
      "Monitor verified leads, daily submission velocity, rolling trends, and quarantined spam entries across your workspace.",
    tip: "Click any metric card to view filtered submissions.",
    icon: BarChart3,
  },
  {
    id: "create-form",
    title: "Form Endpoints",
    subtitle: "Capture",
    targetSelector: '[data-tour="create-form-btn"]',
    description:
      "Generate headless endpoints in seconds. Connect React, Next.js, HTML, or Webflow forms with zero backend infrastructure.",
    tip: "Each endpoint supports custom redirects, schemas, and notifications.",
    icon: FileCode2,
  },
  {
    id: "simulate-lead",
    title: "Lead Simulator",
    subtitle: "Sandbox",
    targetSelector: '[data-tour="simulate-lead-btn"]',
    description:
      "Simulate inbound submissions locally to verify endpoint handling, spam checks, and live updates with zero risk.",
    tip: "Send test payloads anytime to inspect pipeline latency.",
    icon: Zap,
  },
  {
    id: "lead-inbox",
    title: "Lead Inbox",
    subtitle: "Submissions",
    targetSelector: '[data-tour="recent-leads-table"]',
    description:
      "Submissions arrive with complete field payloads, marketing attribution, and lifecycle status tracking.",
    tip: "Click any contact row to open the full inspection drawer.",
    icon: Inbox,
  },
  {
    id: "spam-and-automations",
    title: "Spam Defense & Webhooks",
    subtitle: "Pipelines",
    targetSelector: '[data-tour="sidebar-nav"]',
    description:
      "Automated edge defense quarantines malicious bots, while verified inquiries forward seamlessly to your webhooks.",
    tip: "Configure webhooks and API credentials in Settings.",
    icon: ShieldAlert,
  },
];

export function DashboardWalkthrough() {
  const {
    isTourOpen,
    tourStep,
    closeTour,
    setTourStep,
    nextTourStep,
    prevTourStep,
    addToast,
  } = useDashboard(["isTourOpen","tourStep","closeTour","setTourStep","nextTourStep","prevTourStep","addToast"]);

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [popoverPos, setPopoverPos] = useState<{
    top: number;
    left: number;
    placement: "bottom" | "top" | "center";
  }>({
    top: 0,
    left: 0,
    placement: "center",
  });

  const popoverRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR_STEPS[tourStep] || TOUR_STEPS[0];
  const StepIcon = currentStep.icon;

  // Calculate position and scroll target element into view
  const updateTargetPosition = useCallback(() => {
    if (!isTourOpen) return;

    const selector = currentStep.targetSelector;
    const element = document.querySelector(selector);

    if (element) {
      // Smoothly bring element into comfortable view
      element.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });

      const rect = element.getBoundingClientRect();
      setTargetRect(rect);

      // Measure popover dimensions or estimate
      const cardWidth = Math.min(420, window.innerWidth - 32);
      const cardHeight = 340;

      // Check vertical clearance
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top = 0;
      let placement: "bottom" | "top" | "center" = "bottom";

      if (spaceBelow >= cardHeight + 20) {
        top = rect.bottom + 14;
        placement = "bottom";
      } else if (spaceAbove >= cardHeight + 20) {
        top = Math.max(16, rect.top - cardHeight - 14);
        placement = "top";
      } else {
        top = Math.max(16, (window.innerHeight - cardHeight) / 2);
        placement = "center";
      }

      // Horizontal alignment: Align with target left, clamp within window bounds
      let left = rect.left;
      if (left + cardWidth > window.innerWidth - 16) {
        left = window.innerWidth - cardWidth - 16;
      }
      if (left < 16) {
        left = 16;
      }

      setPopoverPos({ top, left, placement });
    } else {
      // Element not currently in DOM (e.g. mobile hidden sidebar item)
      setTargetRect(null);
      setPopoverPos({
        top: Math.max(20, (window.innerHeight - 340) / 2),
        left: Math.max(16, (window.innerWidth - Math.min(420, window.innerWidth - 32)) / 2),
        placement: "center",
      });
    }
  }, [isTourOpen, currentStep]);

  useEffect(() => {
    if (!isTourOpen) return;

    // Small delay to allow any layout transitions
    const timer = setTimeout(updateTargetPosition, 100);

    const handleResizeOrScroll = () => {
      updateTargetPosition();
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
    };
  }, [isTourOpen, tourStep, updateTargetPosition]);

  const handleFinish = useCallback(async () => {
    closeTour();
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd"],
      });
    } catch {
      // Safe fallback
    }

    addToast(
      "Walkthrough Completed!",
      "You're all set! Explore your dashboard and start capturing leads.",
      "success"
    );
  }, [addToast, closeTour]);

  // Keyboard navigation support
  useEffect(() => {
    if (!isTourOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeTour();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        if (tourStep < TOUR_STEPS.length - 1) {
          nextTourStep();
        } else {
          handleFinish();
        }
      } else if (e.key === "ArrowLeft") {
        if (tourStep > 0) {
          prevTourStep();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTourOpen, tourStep, nextTourStep, prevTourStep, closeTour, handleFinish]);

  if (!isTourOpen) return null;

  const isLastStep = tourStep === TOUR_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 select-none overflow-hidden font-sans">
      {/* SVG Dimming Overlay with Transparent Cutout for Targeted Element */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-300"
        aria-hidden="true"
      >
        <defs>
          <mask id="infraly-tour-mask">
            {/* White covers entire viewport */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black hole cuts out target element */}
            {targetRect && (
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx="14"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.45)"
          mask="url(#infraly-tour-mask)"
          className="pointer-events-auto cursor-default"
          onClick={closeTour}
        />
      </svg>

      {/* Target Element Glowing Spotlight Ring */}
      {targetRect && (
        <div
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
          className="fixed pointer-events-none rounded-xl border-2 border-blue-600 ring-4 ring-blue-500/25 shadow-[0_0_35px_rgba(37,99,235,0.35)] transition-all duration-300 z-50 animate-pulse"
        />
      )}

      {/* Popover Step Card */}
      <div
        ref={popoverRef}
        style={{
          top: popoverPos.top,
          left: popoverPos.left,
          width: Math.min(420, typeof window !== "undefined" ? window.innerWidth - 32 : 400),
        }}
        className="fixed z-50 p-5 sm:p-6 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] text-slate-900 transition-all duration-200 animate-in fade-in zoom-in-95"
      >
        {/* Top Header: Step Indicator & Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="Infraly"
              width={18}
              height={18}
              unoptimized
              className="w-4 h-4 object-contain"
            />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-mono font-medium text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
              <span>Step {tourStep + 1} of {TOUR_STEPS.length}</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              · {currentStep.subtitle}
            </span>
          </div>

          <button
            type="button"
            onClick={closeTour}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            title="Skip tour (Esc)"
            aria-label="Skip walkthrough"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5-Step Segmented Progress Bar */}
        <div className="grid grid-cols-5 gap-1.5 py-3">
          {TOUR_STEPS.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setTourStep(idx)}
              className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor:
                  idx <= tourStep
                    ? "#2563eb"
                    : "#e2e8f0",
                boxShadow:
                  idx === tourStep
                    ? "0 0 10px rgba(37, 99, 235, 0.4)"
                    : "none",
              }}
              title={`Jump to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-none text-blue-600 shadow-sm">
              <StepIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-heading font-bold tracking-tight text-slate-900 leading-snug">
                {currentStep.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Pro Tip Box */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11.5px] text-amber-900">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-none mt-0.5" />
            <p className="leading-snug">
              <strong className="text-amber-800 font-semibold">Pro Tip: </strong>
              {currentStep.tip}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={closeTour}
            className="text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            Skip walkthrough
          </button>

          <div className="flex items-center gap-2">
            {tourStep > 0 && (
              <button
                type="button"
                onClick={prevTourStep}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {isLastStep ? (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Get Started</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={nextTourStep}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Keyboard Helper Footer */}
        <div className="mt-2.5 text-center">
          <span className="text-[10px] font-mono text-slate-400">
            Use <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">←</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">→</kbd> to navigate · <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600">Esc</kbd> to exit
          </span>
        </div>
      </div>
    </div>
  );
}

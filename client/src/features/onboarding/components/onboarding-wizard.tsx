"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useOnboardingForm } from "../hooks/use-onboarding-form";
import { OnboardingForm } from "./onboarding-form";
import { OnboardingSuccess } from "./onboarding-success";
import onboardingShowcase from "../../../../public/onboarding-showcase.jpg";

export function OnboardingWizard() {
  const {
    name,
    suggestedName,
    activeName,
    activeSlug,
    useCase,
    teamSize,
    isSubmitting,
    isSuccess,
    submitError,
    handleNameChange,
    setUseCase,
    setTeamSize,
    handleSubmit,
    redirectToDashboard,
  } = useOnboardingForm();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div className="fixed inset-0 h-screen h-[100dvh] w-screen overflow-hidden overscroll-none bg-white text-slate-900 flex flex-col md:flex-row selection:bg-blue-500/20 selection:text-blue-900">
      {/* Left Column (50% Width, 100vh Height): Full Screen Photo matching Sign-up / Sign-in */}
      <div className="hidden md:block md:w-1/2 h-full relative overflow-hidden select-none shrink-0 bg-slate-100">
        <Image
          src={onboardingShowcase}
          alt="Infraly Workspace Setup"
          fill
          className="object-cover object-center"
          priority
          sizes="50vw"
        />
      </div>

      {/* Right Column (50% Width, 100vh Height): Clean Light Centered Setup Panel */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-between items-center px-6 sm:px-10 lg:px-12 xl:px-14 overflow-y-auto bg-white relative auth-scroll-panel selection:bg-blue-500/20 py-6 sm:py-8">
        {/* Background Top Gradient matching Hero & Auth Section */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden select-none"
          aria-hidden="true"
        >
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
        </div>

        {/* Top Header Navigation */}
        <div className="relative z-10 w-full max-w-[460px] sm:max-w-[480px] mx-auto flex items-center justify-between pb-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <Image
                src="/favicon.ico"
                alt="Infraly"
                width={32}
                height={32}
                unoptimized
                className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <span className="font-heading font-bold tracking-tight text-[18px] text-slate-900">
              infraly
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isMounted ? (
              <UserButton />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse" />
            )}
          </div>
        </div>

        {/* Center Main Form Area */}
        <div className="relative z-10 w-full max-w-[460px] sm:max-w-[480px] mx-auto my-auto py-4">
          {isSuccess ? (
            <OnboardingSuccess
              activeName={activeName}
              onEnterDashboard={redirectToDashboard}
            />
          ) : (
            <div className="space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[11px] font-sans font-medium text-blue-700 mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  <span>Quick Setup · Step 1 of 1</span>
                </div>
                <h1 className="text-2xl sm:text-[26px] font-heading font-bold text-slate-900 tracking-tight leading-tight">
                  Welcome! Let&apos;s set up your workspace
                </h1>
                <p className="text-[13px] text-slate-500 font-sans mt-1 leading-normal">
                  Give your workspace a name and choose what you&apos;re building.
                  You can change this anytime.
                </p>
              </div>

              <OnboardingForm
                name={name}
                suggestedName={suggestedName}
                activeName={activeName}
                activeSlug={activeSlug}
                useCase={useCase}
                teamSize={teamSize}
                submitError={submitError}
                isSubmitting={isSubmitting}
                onNameChange={handleNameChange}
                onSelectUseCase={setUseCase}
                onSelectTeamSize={setTeamSize}
                onSubmit={handleSubmit}
              />
            </div>
          )}
        </div>

        {/* Bottom Footnote */}
        <div className="relative z-10 w-full max-w-[460px] sm:max-w-[480px] mx-auto pt-2">
          <p className="text-center text-[11px] text-slate-400 font-sans leading-relaxed">
            Protected by 256-bit encryption · Free tier included · Upgrade anytime
          </p>
        </div>
      </div>
    </div>
  );
}

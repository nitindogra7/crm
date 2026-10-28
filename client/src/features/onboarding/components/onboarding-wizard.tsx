"use client";

import React from "react";
import { useOnboardingForm } from "../hooks/use-onboarding-form";
import { OnboardingHeader } from "./onboarding-header";
import { OnboardingFooter } from "./onboarding-footer";
import { OnboardingSuccess } from "./onboarding-success";
import { OnboardingForm } from "./onboarding-form";
import { EndpointPreview } from "./endpoint-preview";

export function OnboardingWizard() {
  const {
    user,
    isCheckingStatus,
    name,
    suggestedName,
    activeName,
    activeSlug,
    endpointUrl,
    initial,
    selectedTone,
    avatarTone,
    teamSize,
    useCase,
    activeCodeTab,
    copied,
    isSendingPing,
    pingResult,
    isSubmitting,
    isSuccess,
    submitError,
    slugStatus,
    slugMessage,
    handleNameChange,
    handleSlugChange,
    setAvatarTone,
    setTeamSize,
    setUseCase,
    setActiveCodeTab,
    handleCopyEndpoint,
    handleSendPing,
    handleSubmit,
    redirectToDashboard,
  } = useOnboardingForm();

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen w-full bg-[#121212] text-[#f4f4f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3.5">
          <div className="w-7 h-7 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <p className="text-[13px] font-sans text-zinc-400">Verifying workspace status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#121212] text-[#f4f4f5] flex flex-col justify-between selection:bg-white selection:text-black">
      <OnboardingHeader
        userEmail={user?.primaryEmailAddress?.emailAddress}
        userName={user?.fullName}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col justify-center">
        {isSuccess ? (
          <OnboardingSuccess
            activeName={activeName}
            activeSlug={activeSlug}
            teamSize={teamSize}
            useCase={useCase}
            onEnterDashboard={redirectToDashboard}
          />
        ) : (
          <div className="w-full space-y-7">
            {/* Header Section */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Quick Setup · 1 Step to Launch</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white font-heading">
                Create your workspace
              </h1>
              <p className="text-[13.5px] text-zinc-400 font-sans max-w-2xl leading-relaxed">
                Workspaces manage form endpoints, team permissions, and submission routing. You can customize settings anytime.
              </p>
            </div>

            {/* Expansive Full-Width 2-Column SaaS Grid */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <OnboardingForm
                name={name}
                suggestedName={suggestedName}
                activeName={activeName}
                activeSlug={activeSlug}
                initial={initial}
                selectedTone={selectedTone}
                avatarTone={avatarTone}
                teamSize={teamSize}
                useCase={useCase}
                slugStatus={slugStatus}
                slugMessage={slugMessage}
                submitError={submitError}
                isSubmitting={isSubmitting}
                onNameChange={handleNameChange}
                onSlugChange={handleSlugChange}
                onSelectTone={setAvatarTone}
                onSelectTeamSize={setTeamSize}
                onSelectUseCase={setUseCase}
                onSubmit={handleSubmit}
              />

              <EndpointPreview
                activeSlug={activeSlug}
                endpointUrl={endpointUrl}
                activeCodeTab={activeCodeTab}
                copied={copied}
                isSendingPing={isSendingPing}
                pingResult={pingResult}
                onCopyEndpoint={handleCopyEndpoint}
                onSelectCodeTab={setActiveCodeTab}
                onSendPing={handleSendPing}
              />
            </div>
          </div>
        )}
      </main>

      <OnboardingFooter />
    </div>
  );
}

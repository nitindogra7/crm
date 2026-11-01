"use client";

import React, { useSyncExternalStore } from "react";
import { AuthFrame } from "@/shared/components/auth-frame";
import { UserButton } from "@clerk/nextjs";
import { useOnboardingForm } from "../hooks/use-onboarding-form";
import styles from "./onboarding.module.css";
import { OnboardingForm } from "./onboarding-form";
import { OnboardingSuccess } from "./onboarding-success";

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

  return <AuthFrame mode="onboarding" account={isMounted ? <UserButton /> : <div className="w-7 h-7 rounded-full bg-slate-200 animate-pulse" />}>
          {isSuccess ? (
            <OnboardingSuccess
              activeName={activeName}
              onEnterDashboard={redirectToDashboard}
            />
          ) : (
            <div className={styles.layout}>
              <div className={styles.intro}>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[11px] font-sans font-medium text-blue-700 mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ui-action)] animate-pulse" />
                  <span>Quick Setup · Step 1 of 1</span>
                </div>
                <h1 className="text-2xl sm:text-[26px] font-heading font-bold text-slate-900 tracking-tight leading-tight">
                  Set up your workspace
                </h1>
                <p className="text-[13px] text-slate-500 font-sans mt-1 leading-normal">
                  Tell us a little about what you&apos;re building.
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
  </AuthFrame>;
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { useAppStore } from "@/shared/store";
import { TeamSize } from "../types";
import { slugify } from "../constants";

export function useOnboardingForm() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const initWorkspace = useAppStore((state) => state.initWorkspace);

  const suggestedName = user?.firstName
    ? `${user.firstName}'s Workspace`
    : "Acme Studio";

  // Form Fields
  const [name, setName] = useState("");
  const [useCase, setUseCase] = useState("company");
  const [teamSize, setTeamSize] = useState<TeamSize>("solo");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const redirectToDashboard = useCallback(() => {
    // Start a fresh request after setup instead of reusing a prefetched redirect.
    window.location.replace("/dashboard");
  }, []);

  useEffect(() => {
    if (!isSuccess) return;
    const timer = window.setTimeout(redirectToDashboard, 1200);
    return () => window.clearTimeout(timer);
  }, [isSuccess, redirectToDashboard]);

  // Redirect if user signs out while on onboarding
  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Derived Values
  const activeName = name.trim() || suggestedName;
  const activeSlug = slugify(activeName) || "workspace";

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError(null);
    setName(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setSubmitError(null);

      const trimmedName = activeName.trim();
      if (!trimmedName || isSubmitting || isSuccess) return;

      setIsSubmitting(true);

      const formData = {
        userId: user?.id,
        name: trimmedName,
        slug: activeSlug,
        ownerEmail:
          user?.primaryEmailAddress?.emailAddress || "user@infraly.app",
        teamSize,
        useCase,
        avatarTone: "blue",
        submittedAt: new Date().toISOString(),
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      try {
        const token = await getToken();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${apiUrl}/api/onboarding`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(
            errorData?.error || "Failed to complete onboarding. Please try again."
          );
        }

        const data = await res.json();
        const serverRecord = data?.data;
        const finalSlug = serverRecord?.slug || activeSlug;
        const finalName = serverRecord?.name || trimmedName;
        const finalEmail = serverRecord?.ownerEmail || formData.ownerEmail;
        const finalTeamSize = serverRecord?.teamSize || teamSize;

        // Centrally update global store
        initWorkspace({
          name: finalName,
          slug: finalSlug,
          ownerEmail: finalEmail,
          teamSize: finalTeamSize === "solo" ? "solo" : "team",
          avatarTone: "blue",
        });

        setIsSubmitting(false);
        setIsSuccess(true);

        // Celebration is optional and must never delay navigation.
        void import("canvas-confetti").then(({ default: confetti }) => {
          confetti({
            particleCount: 65,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#2563eb", "#38bdf8", "#6366f1", "#10b981", "#ffffff"],
          });
        }).catch(() => { /* Continue without confetti. */ });

      } catch (err: unknown) {
        console.error("❌ [Onboarding] Submission failed:", err);
        setIsSubmitting(false);
        const msg =
          err instanceof Error ? err.message : "Failed to create workspace";
        setSubmitError(msg);
      }
    },
    [
      activeName,
      activeSlug,
      getToken,
      initWorkspace,
      isSubmitting,
      isSuccess,
      teamSize,
      useCase,
      user,
    ]
  );


  return {
    user,
    isLoaded,
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
  };
}

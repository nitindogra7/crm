"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { useAppStore } from "@/shared/store";
import { TeamSize, CodeTab, SlugAvailabilityStatus } from "../types";
import { slugify, AVATAR_TONES } from "../constants";

export function useOnboardingForm() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const initWorkspace = useAppStore((state) => state.initWorkspace);

  const suggestedName = user?.firstName
    ? `${user.firstName}'s Team`
    : "Acme Studio";

  // Form Fields
  const [name, setName] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false);
  const [avatarTone, setAvatarTone] = useState("zinc");
  const [useCase, setUseCase] = useState("saas");
  const [teamSize, setTeamSize] = useState<TeamSize>("team");

  // Slug Availability State
  const [slugStatus, setSlugStatus] = useState<SlugAvailabilityStatus>("idle");
  const [slugMessage, setSlugMessage] = useState<string>("");

  // Code Tab & Copy State
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>("html");
  const [copied, setCopied] = useState(false);

  // Live Ping Simulator State
  const [isSendingPing, setIsSendingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{
    status: number;
    latency: number;
  } | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Status check state: page.tsx verifies status before rendering
  const [isCheckingStatus] = useState(false);

  // Redirect if user signs out while on onboarding
  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Derived Values
  const activeName = name.trim() || suggestedName;
  const activeSlug = hasManuallyEditedSlug ? customSlug : slugify(activeName);
  const endpointUrl = `https://api.salenova.com/v1/f/${activeSlug}`;
  const initial = (activeName.charAt(0) || "W").toUpperCase();
  const selectedTone =
    AVATAR_TONES.find((t) => t.id === avatarTone) || AVATAR_TONES[0];

  // Debounced Slug Availability Checking Effect
  useEffect(() => {
    const slugCandidate = activeSlug?.trim().toLowerCase();

    // 1. Empty or missing slug
    if (!slugCandidate) {
      const timer = setTimeout(() => {
        setSlugStatus("idle");
        setSlugMessage("");
      }, 0);
      return () => clearTimeout(timer);
    }

    // 2. Validate format client-side (lowercase alphanumeric, single hyphens, 1-60 chars)
    const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!SLUG_REGEX.test(slugCandidate) || slugCandidate.length > 60) {
      const timer = setTimeout(() => {
        setSlugStatus("invalid");
        if (slugCandidate.startsWith("-") || slugCandidate.endsWith("-")) {
          setSlugMessage("Cannot start or end with a hyphen");
        } else if (slugCandidate.includes("--")) {
          setSlugMessage("Cannot contain consecutive hyphens");
        } else {
          setSlugMessage("Use lowercase letters, numbers, and hyphens");
        }
      }, 0);
      return () => clearTimeout(timer);
    }

    const abortController = new AbortController();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const timer = setTimeout(async () => {
      setSlugStatus("checking");
      setSlugMessage("Checking availability...");

      try {
        const token = await getToken();
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const userParam = user?.id ? `&userId=${encodeURIComponent(user.id)}` : "";
        const res = await fetch(
          `${apiUrl}/api/onboarding/check-slug?slug=${encodeURIComponent(slugCandidate)}${userParam}`,
          {
            signal: abortController.signal,
            headers,
            cache: "no-store",
          }
        );

        if (abortController.signal.aborted) return;

        if (res.ok) {
          const data = await res.json();
          if (data.available === true) {
            setSlugStatus("available");
            setSlugMessage("Available");
          } else {
            setSlugStatus("taken");
            setSlugMessage(data.message || "Already taken");
          }
        } else {
          const data = await res.json().catch(() => null);
          if (data && data.available === false) {
            setSlugStatus("taken");
            setSlugMessage(data.message || "Already taken");
          } else {
            setSlugStatus("invalid");
            setSlugMessage("Invalid format");
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.warn("Could not check slug availability:", err);
        setSlugStatus("idle");
        setSlugMessage("");
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [activeSlug, user?.id, getToken]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError(null);
    const val = e.target.value;
    setName(val);
    if (!hasManuallyEditedSlug) {
      setCustomSlug(slugify(val || suggestedName));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubmitError(null);
    setHasManuallyEditedSlug(true);
    // Allow typing hyphens cleanly without stripping trailing hyphens on keystroke
    const val = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 48);
    setCustomSlug(val);
  };

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(endpointUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendPing = () => {
    setIsSendingPing(true);
    setTimeout(() => {
      setIsSendingPing(false);
      setPingResult({
        status: 200,
        latency: Math.floor(Math.random() * 6) + 11, // 11-16ms
      });
    }, 500);
  };

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setSubmitError(null);

      const trimmedName = activeName.trim();
      const trimmedSlug = activeSlug?.trim().toLowerCase();

      // Guard: Do not allow submission if name or slug is empty, or already submitting
      if (!trimmedName || !trimmedSlug || isSubmitting) return;

      // Guard: Do not allow submission if slug is taken, invalid, or currently checking
      if (
        slugStatus === "taken" ||
        slugStatus === "invalid" ||
        slugStatus === "checking"
      ) {
        return;
      }

      setIsSubmitting(true);

      const formData = {
        userId: user?.id,
        name: trimmedName,
        slug: trimmedSlug,
        ownerEmail:
          user?.primaryEmailAddress?.emailAddress || "user@salenova.app",
        teamSize,
        useCase,
        avatarTone,
        endpointUrl,
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
        console.log("📡 [Onboarding] Server Response:", data);

        const serverRecord = data?.data;
        const finalSlug = serverRecord?.slug || trimmedSlug;
        const finalName = serverRecord?.name || trimmedName;
        const finalEmail = serverRecord?.ownerEmail || formData.ownerEmail;
        const finalTeamSize = serverRecord?.teamSize || teamSize;
        const finalTone = serverRecord?.avatarTone || avatarTone;

        try {
          const confetti = (await import("canvas-confetti")).default;
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#ffffff", "#e4e4e7", "#10b981", "#71717a"],
          });
        } catch {
          // Safe fallback
        }

        await new Promise((resolve) => setTimeout(resolve, 750));
        setIsSubmitting(false);
        setIsSuccess(true);

        // Centrally update global store & persisted state with server-authoritative data
        initWorkspace({
          name: finalName,
          slug: finalSlug,
          ownerEmail: finalEmail,
          teamSize: finalTeamSize,
          avatarTone: finalTone,
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } catch (err: unknown) {
        console.error("❌ [Onboarding] Submission failed:", err);
        setIsSubmitting(false);
        const msg =
          err instanceof Error ? err.message : "Failed to create workspace";
        setSubmitError(msg);
        if (msg.toLowerCase().includes("slug")) {
          setSlugStatus("taken");
          setSlugMessage(msg);
        }
      }
    },
    [
      activeName,
      activeSlug,
      avatarTone,
      endpointUrl,
      getToken,
      initWorkspace,
      isSubmitting,
      router,
      slugStatus,
      teamSize,
      useCase,
      user,
    ]
  );

  // Keyboard shortcut: Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccess || isSubmitting) return;
      if (e.key === "Enter" && !e.shiftKey) {
        if ((e.target as HTMLElement)?.tagName === "TEXTAREA") return;
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSuccess, isSubmitting, handleSubmit]);

  return {
    user,
    isLoaded,
    isCheckingStatus,
    // Fields
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
    // Code tabs & Ping
    activeCodeTab,
    copied,
    isSendingPing,
    pingResult,
    // Status
    isSubmitting,
    isSuccess,
    submitError,
    slugStatus,
    slugMessage,
    isSlugAvailable: slugStatus === "available",
    // Handlers
    handleNameChange,
    handleSlugChange,
    setAvatarTone,
    setTeamSize,
    setUseCase,
    setActiveCodeTab,
    handleCopyEndpoint,
    handleSendPing,
    handleSubmit,
    redirectToDashboard: () => router.push("/dashboard"),
  };
}

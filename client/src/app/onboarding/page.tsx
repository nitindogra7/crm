import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { OnboardingWizard } from "@/features/onboarding";

export const metadata: Metadata = {
  title: "Setup Your Workspace | infraly",
  description: "Configure your new infraly workspace, team roles, and form inbound destinations.",
};

export default async function OnboardingPage() {
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:4000";

  let isOnboarded = false;

  try {
    const token = await getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(
      `${apiUrl}/api/onboarding/status?userId=${encodeURIComponent(userId)}`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (res.ok) {
      const data = await res.json();
      isOnboarded = data.isOnboarded === true;
    }
  } catch (error) {
    console.error("Failed to fetch onboarding status in OnboardingPage:", error);
  }

  // If user is already onboarded in DB, redirect to dashboard
  if (isOnboarded) {
    redirect("/dashboard");
  }

  // If not onboarded, keep user on onboarding and return the wizard
  return <OnboardingWizard />;
}

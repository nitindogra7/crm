import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ClerkAuthProvider } from "@/shared/components/clerk-auth-provider";
import { DashboardProvider, DashboardShell } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Dashboard | Infraly",
  description:
    "Manage your incoming leads, protect form endpoints from spam, and inspect submission webhooks.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, getToken } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:4000";

  let isOnboarded = false;
  let onboardingData = null;

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
      onboardingData = data.onboarding || null;
    }
  } catch (error) {
    console.error("Failed to check onboarding status in DashboardLayout:", error);
    // If backend is unreachable, don't crash, grant safe continuation
    isOnboarded = true;
  }

  // If user is not yet onboarded, redirect to onboarding
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  return (
    <ClerkAuthProvider>
      <DashboardProvider initialWorkspace={onboardingData}>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
    </ClerkAuthProvider>
  );
}

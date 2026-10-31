import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { DashboardProvider } from "@/features/dashboard/context/dashboard-context";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

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

  let isOnboarded = true;
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
        next: { revalidate: 120 },
        signal: AbortSignal.timeout(1200),
      }
    );

    if (res.ok) {
      const data = await res.json();
      isOnboarded = data.isOnboarded === true;
      onboardingData = data.onboarding || null;
    }
  } catch {
    // If backend is unreachable or timed out, gracefully continue to dashboard
    isOnboarded = true;
  }

  // If user is explicitly confirmed not yet onboarded, redirect to onboarding
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  return (
    <DashboardProvider initialWorkspace={onboardingData}>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}

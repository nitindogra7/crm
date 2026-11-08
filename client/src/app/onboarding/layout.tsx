import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
import React from "react";
import { ClerkAuthProvider } from "@/shared/components/clerk-auth-provider";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
}


import type { Metadata } from "next";
import { OnboardingWizard } from "@/features/onboarding";

export const metadata: Metadata = {
  title: "Setup Your Workspace | Salenova",
  description: "Configure your new Salenova workspace, team roles, and form inbound destinations.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}

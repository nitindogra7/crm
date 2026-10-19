import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import { AuthShell, clerkAuthAppearance } from "@/shared/components/auth-shell";

export const metadata: Metadata = {
  title: "Sign in | Salenova",
  description: "Sign in to access your Salenova form endpoints and workspace.",
};

export default function SignInPage() {
  return (
    <AuthShell mode="sign-in">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/onboarding"
        appearance={clerkAuthAppearance}
      />
    </AuthShell>
  );
}

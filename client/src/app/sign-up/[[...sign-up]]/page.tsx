import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import { AuthShell, clerkAuthAppearance } from "@/shared/components/auth-shell";

export const metadata: Metadata = {
  title: "Sign up | Infraly",
  description: "Create your Infraly developer account and generate form endpoints.",
};

export default function SignUpPage() {
  return (
    <AuthShell mode="sign-up">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/onboarding"
        appearance={clerkAuthAppearance}
      />
    </AuthShell>
  );
}

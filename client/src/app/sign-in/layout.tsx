import React from "react";
import { ClerkAuthProvider } from "@/shared/components/clerk-auth-provider";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
}


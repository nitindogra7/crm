import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ui } from "@clerk/ui";

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ui={ui as any}
      appearance={{
        theme: dark,
      }}
    >
      {children}
    </ClerkProvider>
  );
}


import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuthSideBanner, SignupForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Sign up | Salenova",
  description:
    "Create your Salenova account in seconds. Collect, protect, and manage website form submissions without building a backend.",
};

export default function SignupPage() {
  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden overflow-y-auto bg-black text-[#f2f2f2] font-sans antialiased flex items-center justify-center p-3 sm:p-4 lg:p-4 xl:p-6">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000, transparent)",
        }}
      />

      {/* Top Subtle Light Glow */}
      <div
        className="fixed left-1/2 -top-[160px] w-[640px] h-[360px] -ml-[320px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255,255,255,0.12), transparent 70%)",
        }}
      />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-[1180px] h-full lg:h-[calc(100vh-2rem)] xl:h-[calc(100vh-3rem)] lg:max-h-[720px] flex flex-col lg:flex-row gap-4 xl:gap-6 items-stretch justify-center">
        <AuthSideBanner />
        <div className="flex-1 flex items-center justify-center rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] backdrop-blur-xl h-full overflow-hidden">
          <Suspense
            fallback={
              <div className="w-full h-[400px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            }
          >
            <SignupForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
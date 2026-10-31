"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DocsHeader } from "./docs-header";
import { DocsHubView } from "./docs-hub-view";
import { DocsGuideView } from "./docs-guide-view";
import { DETAILED_GUIDES } from "../data/docs-data";

export function DocsView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const guideParam = searchParams.get("guide");
  const [localGuideId, setLocalGuideId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Determine active guide from URL search params or fallback to local state
  const activeGuideId =
    guideParam && DETAILED_GUIDES[guideParam]
      ? guideParam
      : localGuideId && DETAILED_GUIDES[localGuideId]
      ? localGuideId
      : null;

  const handleSelectGuide = (guideId: string) => {
    setLocalGuideId(guideId);
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(`/docs?guide=${guideId}`, { scroll: false });
  };

  const handleBackToHub = () => {
    setLocalGuideId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push("/docs", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#0f1412] text-[#f5f7f5] antialiased font-sans selection:bg-[#ff995e]/25 selection:text-[#30220e] relative overflow-x-hidden">
      {/* Design-engineered ambient light & subtle grid matching Infraly Theme */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(183, 204, 200, 0.12) 0.7px, transparent 0.7px)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(black, transparent 92%)",
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[480px] bg-gradient-to-b from-[#ff995e]/[0.06] via-transparent to-transparent blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Top Header */}
        <DocsHeader
          currentMode={activeGuideId ? "guide" : "hub"}
          onGoToHub={handleBackToHub}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Main Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
          {activeGuideId ? (
            <DocsGuideView
              guideId={activeGuideId}
              onSelectGuide={handleSelectGuide}
              onBackToHub={handleBackToHub}
            />
          ) : (
            <DocsHubView
              onSelectGuide={handleSelectGuide}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery("")}
            />
          )}
        </main>
      </div>
    </div>
  );
}

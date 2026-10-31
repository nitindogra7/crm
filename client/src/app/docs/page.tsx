import type { Metadata } from "next";
import { Suspense } from "react";
import { DocsView } from "@/features/docs";

export const metadata: Metadata = {
  title: "Documentation & Integration Guides | infraly",
  description:
    "Complete developer guide, recipes, and API reference for capturing inbound leads with infraly. Supports HTML, React, Next.js, Vue, Svelte, Angular, Webflow, and cURL.",
  keywords: [
    "form backend",
    "lead capture documentation",
    "html form action",
    "react form integration",
    "honeypot spam protection",
    "CRM lead API",
  ],
};

export default function DocsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0c0c0f] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DocsView />
    </Suspense>
  );
}

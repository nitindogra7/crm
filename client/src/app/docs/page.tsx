import type { Metadata } from "next";
import { Suspense } from "react";
import { DocsView } from "@/features/docs";
import { DocsSkeleton } from "@/features/docs/components/docs-skeleton";

export const metadata: Metadata = {
  title: "Documentation | Infraly",
  description: "Set up Infraly form submissions. Guides for HTML, React, server API keys, environments, spam review, and response handling.",
};

export default function DocsPage() {
  return <Suspense fallback={<DocsSkeleton />}><DocsView /></Suspense>;
}

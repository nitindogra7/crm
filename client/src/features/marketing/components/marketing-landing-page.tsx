import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "./navbar";
import { Hero } from "./hero";

const AdaptabilitySection = dynamic(
  () => import("./adaptability").then((mod) => mod.AdaptabilitySection),
  { ssr: true }
);
const IntegrationsDark = dynamic(
  () => import("./integrations-dark").then((mod) => mod.IntegrationsDark),
  { ssr: true }
);
const MonitorDark = dynamic(
  () => import("./monitor-dark").then((mod) => mod.MonitorDark),
  { ssr: true }
);
const Faq = dynamic(
  () => import("./faq").then((mod) => mod.Faq),
  { ssr: true }
);
const Pricing = dynamic(
  () => import("./pricing").then((mod) => mod.Pricing),
  { ssr: true }
);
const Testimonials = dynamic(
  () => import("./testimonials").then((mod) => mod.Testimonials),
  { ssr: true }
);
const Footer = dynamic(
  () => import("./footer").then((mod) => mod.Footer),
  { ssr: true }
);

export function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-500/20 selection:text-blue-900">
      {/* Top Floating / Sticky Navigation */}
      <Navbar />

      {/* Main Page Flow */}
      <main>
        {/* Section 1: Hero with floating badges, title, CTA, rating, and trusted logos */}
        <Hero />

        {/* Section 2: Adaptability Section with 3 cards */}
        <AdaptabilitySection />

        {/* Section 3: Dark Section 1 - Easily connects with apps */}
        <IntegrationsDark />

        {/* Section 4: Dark Section 2 - Monitor and analyze real-time engagement */}
        <MonitorDark />

        {/* Section 5: Frequently Asked Questions (2x2 Grid) */}
        <Faq />

        {/* Section 6: Flexible Plans / Pricing (3 Cards) */}
        <Pricing />

        {/* Section 7: Hear Directly from Businesses / Testimonials (3 Columns) */}
        <Testimonials />
      </main>

      {/* Section 8: Dark CTA Banner & Footer */}
      <Footer />
    </div>
  );
}

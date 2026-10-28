import type { Metadata } from "next";
import { AnalyticsView } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Analytics | Salenova",
  description:
    "Interactive graphs and performance analytics for inbound leads, spam mitigation, and form volume.",
};

export default function DashboardAnalyticsPage() {
  return <AnalyticsView />;
}

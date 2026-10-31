import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { AnalyticsSkeleton } from "@/features/dashboard/components/dashboard-skeleton";

export const metadata: Metadata = {
  title: "Analytics | infraly",
  description:
    "Interactive graphs and performance analytics for inbound leads, spam mitigation, and form volume.",
};

const AnalyticsView = dynamic(
  () =>
    import("@/features/dashboard/components/analytics-view").then(
      (m) => m.AnalyticsView
    ),
  {
    loading: () => <AnalyticsSkeleton />,
  }
);

export default function DashboardAnalyticsPage() {
  return <AnalyticsView />;
}

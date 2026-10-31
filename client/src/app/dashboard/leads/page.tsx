import React, { Suspense } from "react";
import { LeadsView } from "@/features/dashboard/components/leads-view";
import { LeadsSkeleton } from "@/features/dashboard/components/dashboard-skeleton";

export default function DashboardLeadsPage() {
  return (
    <Suspense fallback={<LeadsSkeleton />}>
      <LeadsView />
    </Suspense>
  );
}

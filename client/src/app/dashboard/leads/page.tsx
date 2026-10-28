import React, { Suspense } from "react";
import { LeadsView } from "@/features/dashboard";

export default function DashboardLeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-500 font-mono">
          Loading leads inbox...
        </div>
      }
    >
      <LeadsView />
    </Suspense>
  );
}
